// Plays Microsoft neural speech (made by our own /api/tts route) in a normal <audio> element.
//
// This file only decides HOW the MP3 is played. Every rule below exists because of a real way a
// phone stays silent:
//
//  1. ONE element for the whole life of the page. iOS lets an element play only after a tap started
//     it, and once a tap has started it, it may change source and play again without another tap.
//     A fresh `new Audio()` for every sentence would need a fresh tap each time and go silent from
//     the second sentence on.
//  2. `src` is set and `play()` is called synchronously, before the tap handler returns. iOS and
//     Chrome refuse a `play()` that comes after an `await`, so this file never downloads the audio
//     itself: the browser streams it from the URL. The sentences that come next are only *warmed*
//     with fetch(); the server keeps what it made, so the element's own request answers at once.
//  3. The route answers byte-range requests with 206 (audio-http.ts). iOS Safari refuses the file
//     otherwise.
//  4. A watchdog covers "no sound ever started", "started, then the network died" and "paused by
//     the system" (a phone call, unplugged headphones), so the button can never stay on "playing"
//     forever.
//  5. A run is identified by object identity: an event that arrives late from a source we already
//     replaced finds a different (or no) run and does nothing.
//
// No imports: it loads in plain Node, so the engine tests can drive it with a fake <audio>.

export type EdgeFailureReason = "blocked" | "unavailable";

export interface EdgeRunCallbacks {
  /** The first sound of the run is playing. */
  onStart: () => void;
  /** Every sentence was played to its end. */
  onEnd: () => void;
  /** The system paused the audio (a call, unplugged headphones). Nothing is wrong; the run is over. */
  onInterrupted: () => void;
  /** Playback could not start or continue. `index` is the sentence to resume from on another voice. */
  onFail: (reason: EdgeFailureReason, index: number) => void;
}

const ENDPOINT = "/api/tts";
/** A healthy answer takes 1–3 s. Past this the voice is treated as down. */
const START_TIMEOUT_MS = 12_000;
/** Playing, but the clock has not moved for this long: the connection died mid-sentence. */
const STALL_TIMEOUT_MS = 8_000;
/** Paused (not by us) for this long: the system took the audio away. */
const PAUSED_TIMEOUT_MS = 2_500;
const POLL_INTERVAL_MS = 500;
/** How many sentences ahead are warmed on the server while the current one plays. */
const PREFETCH_AHEAD = 2;

interface Run {
  chunks: readonly string[];
  rate: number;
  callbacks: EdgeRunCallbacks;
  index: number;
  /** Some sound of this run has played (`onStart` fires once). */
  started: boolean;
  /** The current sentence is audible. */
  chunkStarted: boolean;
  chunkRequestedAt: number;
  lastTime: number;
  lastProgressAt: number;
  /** When the element was first seen paused; 0 = it is not paused. */
  pausedSince: number;
  prefetched: Set<number>;
}

let element: HTMLAudioElement | null = null;
let run: Run | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function getElement(): HTMLAudioElement | null {
  if (element) return element;
  if (typeof Audio === "undefined") return null;
  try {
    element = new Audio();
    element.preload = "auto";
  } catch {
    element = null;
  }
  return element;
}

function isSupported(): boolean {
  const el = getElement();
  if (!el) return false;
  try {
    return el.canPlayType("audio/mpeg") !== "";
  } catch {
    return false;
  }
}

/** The same 5 % steps the server rounds to, so 0.8 and 0.82 share one URL (and one cache entry). */
function rateParam(rate: number): string {
  const safe = Number.isFinite(rate) ? Math.min(2, Math.max(0.5, rate)) : 1;
  return String(Math.round(safe * 20) / 20);
}

function urlFor(text: string, rate: number): string {
  return `${ENDPOINT}?text=${encodeURIComponent(text)}&rate=${rateParam(rate)}`;
}

function clearPoll() {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

/** Ends the run and silences the element. Safe to call at any time. */
function halt() {
  run = null;
  clearPoll();
  if (!element) return;
  element.onplaying = null;
  element.onended = null;
  element.onerror = null;
  try {
    element.pause();
  } catch {
    // Nothing was playing.
  }
}

/** Best effort: asks the server to have a later sentence ready. Never affects playback. */
function warm(current: Run, index: number) {
  if (index >= current.chunks.length || current.prefetched.has(index)) return;
  current.prefetched.add(index);
  if (typeof fetch !== "function") return;
  try {
    fetch(urlFor(current.chunks[index], current.rate), { credentials: "same-origin" })
      .then((response) => (response.ok ? response.arrayBuffer() : undefined))
      .catch(() => undefined);
  } catch {
    // Warming is optional.
  }
}

function fail(current: Run, reason: EdgeFailureReason) {
  if (run !== current) return;
  const index = current.index;
  halt();
  current.callbacks.onFail(reason, index);
}

function startChunk(el: HTMLAudioElement, current: Run, index: number) {
  current.index = index;
  current.chunkStarted = false;
  current.chunkRequestedAt = Date.now();
  current.lastTime = 0;
  current.lastProgressAt = current.chunkRequestedAt;
  current.pausedSince = 0;

  warm(current, index + 1);

  el.src = urlFor(current.chunks[index], current.rate);
  let pending: Promise<void> | undefined;
  try {
    pending = el.play();
  } catch {
    fail(current, "unavailable");
    return;
  }
  pending?.catch((error: unknown) => {
    // Changing the source or stopping interrupts a pending play(): that is us, not a failure.
    if (run !== current || current.index !== index) return;
    const name = typeof error === "object" && error !== null ? String((error as { name?: unknown }).name) : "";
    if (name === "AbortError") return;
    fail(current, name === "NotAllowedError" ? "blocked" : "unavailable");
  });
}

function onPlaying(current: Run) {
  if (current.chunkStarted) return; // "playing" also fires again when buffering ends
  current.chunkStarted = true;
  current.lastProgressAt = Date.now();
  warm(current, current.index + PREFETCH_AHEAD);
  if (!current.started) {
    current.started = true;
    current.callbacks.onStart();
  }
}

function onEnded(el: HTMLAudioElement, current: Run) {
  const next = current.index + 1;
  if (next >= current.chunks.length) {
    halt();
    current.callbacks.onEnd();
    return;
  }
  startChunk(el, current, next);
}

/** Runs every POLL_INTERVAL_MS: the events alone cannot tell "slow" from "dead". */
function inspect(current: Run) {
  const el = element;
  if (run !== current || !el) return;
  const now = Date.now();

  if (!current.chunkStarted) {
    if (now - current.chunkRequestedAt > START_TIMEOUT_MS) fail(current, "unavailable");
    return;
  }
  if (el.ended) return;

  if (el.paused) {
    if (current.pausedSince === 0) {
      current.pausedSince = now;
    } else if (now - current.pausedSince > PAUSED_TIMEOUT_MS) {
      halt();
      current.callbacks.onInterrupted();
    }
    return;
  }
  current.pausedSince = 0;

  if (el.currentTime > current.lastTime + 0.01) {
    current.lastTime = el.currentTime;
    current.lastProgressAt = now;
  } else if (now - current.lastProgressAt > STALL_TIMEOUT_MS) {
    fail(current, "unavailable");
  }
}

/**
 * Plays `chunks` one after another. Call it synchronously from a tap: the first sentence is
 * started before this function returns. `onFail` may be called before it returns, too.
 */
function play(chunks: readonly string[], rate: number, callbacks: EdgeRunCallbacks) {
  halt();
  const el = getElement();
  if (!el || chunks.length === 0) {
    callbacks.onFail("unavailable", 0);
    return;
  }

  const current: Run = {
    chunks,
    rate,
    callbacks,
    index: 0,
    started: false,
    chunkStarted: false,
    chunkRequestedAt: 0,
    lastTime: 0,
    lastProgressAt: 0,
    pausedSince: 0,
    prefetched: new Set(),
  };
  run = current;

  el.onplaying = () => {
    if (run === current) onPlaying(current);
  };
  el.onended = () => {
    if (run === current) onEnded(el, current);
  };
  el.onerror = () => {
    if (run === current) fail(current, "unavailable");
  };

  // Before the first chunk: starting it can already fail, and fail() must find the timer to clear.
  pollTimer = setInterval(() => inspect(current), POLL_INTERVAL_MS);
  startChunk(el, current, 0);
}

export const edgePlayer = {
  isSupported,
  play,
  /** Stops whatever is playing. Harmless when nothing is. */
  stop: halt,
};
