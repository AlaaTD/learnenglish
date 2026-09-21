"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Listening engine — Web Speech API, hardened for phones.
//
// Every rule below exists because of a real cause of cut-off / frozen audio:
//
//  1. NO pause()/resume() "keep-alive". That hack only helps desktop Chrome with
//     utterances longer than ~15 s. On Android and iOS it ends or restarts the
//     sentence. Instead every utterance is short (MAX_CHUNK_CHARS), so it never
//     gets anywhere near that limit.
//  2. Every run owns a token. cancel() makes engines fire late `end` / `error`
//     events (Safari → `end`, Chrome → `interrupted`). Without the token those
//     stale events advanced the *new* queue and skipped or replayed sentences.
//  3. cancel() followed immediately by speak() is silently dropped by several
//     mobile engines, so when the engine is busy it is given time to settle.
//     When it is idle we speak synchronously — iOS only allows speech that is
//     started inside the tap handler.
//  4. `end` is not guaranteed on phones. A watchdog detects "never started" and
//     "finished but no end event", so the chain can never hang.
//  5. An English voice is picked explicitly (local voices first). Without it a
//     phone whose system language is Arabic can read English with the wrong voice.
//  6. Text is cleaned and split without regex look-behind (it is a syntax error
//     on iOS < 16.4 and would break the whole module).
// ─────────────────────────────────────────────────────────────────────────────

// Two voices share this engine (the learner picks one in Settings, see audio-provider.ts):
//
//  - "microsoft" (default): audio-edge.ts streams neural speech from /api/tts into ONE <audio>
//    element. Reliable on phones (no mute-switch problem, no voice-list problem) but needs internet.
//  - "google": the rules above. The voice built into the device: Google's on Android, Apple's on
//    iPhone. Works offline.
//
// If Microsoft cannot be reached, the same tap carries on with the device voice from the sentence
// that failed, and for a minute after that the device voice is used directly. (A fresh tap can then
// speak synchronously, which iOS requires; speech started later from a network callback may be
// refused there.) The device voice is also used at once when the phone reports it is offline.

import { DEFAULT_AUDIO_PROVIDER, normalizeAudioProvider, type AudioProvider } from "./audio-provider.ts";
import { edgePlayer, type EdgeFailureReason } from "./audio-edge.ts";

export interface SpeakOptions {
  rate?: number;
  id?: string;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface AudioState {
  activeText: string | null;
  activeId: string | null;
  isPlaying: boolean;
  error: string | null;
  /** The button (id) the error belongs to, so only that button shows it. */
  errorId: string | null;
}

// ─── Tunables ────────────────────────────────────────────────────────────────

/** Longest single utterance. ~11 s at rate 0.8 — safely under the 15 s engine limit. */
const MAX_CHUNK_CHARS = 110;
/** Fragments shorter than this are glued to a neighbour (tiny utterances get dropped). */
const MIN_CHUNK_CHARS = 12;
const CHUNK_GAP_MS = 120;
const ENGINE_SETTLE_MS = 120;
const RETRY_DELAY_MS = 250;
const START_TIMEOUT_MS = 5000;
const POLL_INTERVAL_MS = 250;
/** Deliberately slow assumption so the watchdog never cuts a slow voice short. */
const ASSUMED_CHARS_PER_SECOND = 10;
const MAX_ATTEMPTS_PER_CHUNK = 3;
const ERROR_VISIBLE_MS = 7000;
const MIN_RATE = 0.5;
const MAX_RATE = 2;
/** After Microsoft fails, the device voice is used directly (inside the tap) for this long. */
const MICROSOFT_COOLDOWN_MS = 60_000;

const MESSAGES = {
  unsupported: "هذا المتصفح لا يدعم تشغيل الصوت. جرّب Chrome أو Safari.",
  blocked: "منع المتصفح تشغيل الصوت. اضغط زر الاستماع مرة أخرى.",
  noVoice: "لا يوجد صوت إنجليزي على هذا الجهاز. فعّل صوتًا إنجليزيًا من إعدادات تحويل النص إلى كلام.",
  failed: "تعذّر تشغيل الصوت. تأكد أن الهاتف ليس على الوضع الصامت وأن الصوت مرتفع، ثم حاول مرة أخرى.",
  offline: "تعذر الاتصال بالصوت. تأكد من اتصال الإنترنت أو اختر صوت الجهاز من صفحة الإعدادات.",
} as const;

// ─── Text preparation ────────────────────────────────────────────────────────

/** Removes everything a speech engine would read aloud or stumble on. */
export function normalizeForSpeech(raw: string): string {
  return raw
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, " ")
    .replace(/[\u2018\u2019\u201B\u02BC]/g, "'")
    .replace(/["\u201C\u201D\u201E\u201F]/g, "")
    .replace(/\s*[\u2013\u2014]\s*/g, ", ")
    .replace(/\u2026/g, ".")
    .replace(/\.{2,}/g, ".")
    .replace(/[()[\]{}]/g, ", ")
    .replace(/([A-Za-z])\/([A-Za-z])/g, "$1, $2")
    .replace(/[*_`#~^|<>\\]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,;:])(\s*[,;:])+/g, "$1")
    .replace(/[,;:]+\s*([.!?])/g, "$1")
    .replace(/^[\s,;:]+/, "")
    .replace(/[\s,;:]+$/, "")
    .trim();
}

// A period after these does not end a sentence ("Dr. Adam", "Mr. Sam").
const NON_TERMINAL_ABBREVIATIONS = new Set([
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "sr",
  "jr",
  "st",
  "vs",
  "mt",
  "a.m",
  "p.m",
  "e.g",
  "i.e",
]);

function splitSentences(text: string): string[] {
  const sentences: string[] = [];
  // A boundary needs whitespace (or the end) after it, so "3.5" and "U.S.A" stay whole.
  const boundary = /[.!?]+["')\]]*(?=\s|$)/g;
  let start = 0;
  let match: RegExpExecArray | null;

  while ((match = boundary.exec(text)) !== null) {
    const end = match.index + match[0].length;
    if (end >= text.length) break;

    if (match[0].charAt(0) === "." && match[0].length === 1) {
      const wordBefore = /([A-Za-z][A-Za-z.]*)$/.exec(text.slice(start, match.index));
      if (wordBefore && NON_TERMINAL_ABBREVIATIONS.has(wordBefore[1].toLowerCase())) continue;
    }

    sentences.push(text.slice(start, end).trim());
    start = end;
  }

  const rest = text.slice(start).trim();
  if (rest) sentences.push(rest);
  return sentences.filter((sentence) => sentence.length > 0);
}

function splitByWords(text: string): string[] {
  const out: string[] = [];
  let line = "";

  for (const word of text.trim().split(/\s+/)) {
    if (word.length > MAX_CHUNK_CHARS) {
      // One unbroken string longer than the limit: hard cut, nothing else is possible.
      if (line) {
        out.push(line);
        line = "";
      }
      for (let i = 0; i < word.length; i += MAX_CHUNK_CHARS) {
        out.push(word.slice(i, i + MAX_CHUNK_CHARS));
      }
      continue;
    }

    const next = line ? `${line} ${word}` : word;
    if (next.length > MAX_CHUNK_CHARS) {
      out.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) out.push(line);
  return out;
}

/** Sentences over the limit are cut at clause punctuation first, then at word boundaries. */
function splitLongSentence(sentence: string): string[] {
  if (sentence.length <= MAX_CHUNK_CHARS) return [sentence];

  const pieces = sentence.match(/[^,;:]+[,;:]?\s*/g) ?? [sentence];
  const chunks: string[] = [];
  let buffer = "";

  const flush = () => {
    const trimmed = buffer.trim();
    if (trimmed) chunks.push(trimmed);
    buffer = "";
  };

  for (const piece of pieces) {
    if (piece.trim().length > MAX_CHUNK_CHARS) {
      flush();
      chunks.push(...splitByWords(piece));
      continue;
    }
    if (buffer && (buffer + piece).trim().length > MAX_CHUNK_CHARS) flush();
    buffer += piece;
  }
  flush();

  return chunks;
}

function mergeTinyChunks(chunks: string[]): string[] {
  const merged: string[] = [];

  for (const chunk of chunks) {
    const previous = merged[merged.length - 1];
    if (
      previous !== undefined &&
      previous.length < MIN_CHUNK_CHARS &&
      previous.length + 1 + chunk.length <= MAX_CHUNK_CHARS
    ) {
      merged[merged.length - 1] = `${previous} ${chunk}`;
    } else {
      merged.push(chunk);
    }
  }

  if (merged.length > 1) {
    const last = merged[merged.length - 1];
    const before = merged[merged.length - 2];
    if (last.length < MIN_CHUNK_CHARS && before.length + 1 + last.length <= MAX_CHUNK_CHARS) {
      merged.splice(merged.length - 2, 2, `${before} ${last}`);
    }
  }

  return merged;
}

/** Text → short, clean, speakable utterances. Never drops or reorders a word. */
export function splitIntoChunks(raw: string): string[] {
  const text = normalizeForSpeech(raw);
  if (!text) return [];

  const chunks: string[] = [];
  for (const sentence of splitSentences(text)) {
    chunks.push(...splitLongSentence(sentence));
  }

  // Drop fragments that are only punctuation.
  return mergeTinyChunks(chunks.filter((chunk) => /[^\s.,;:!?'-]/.test(chunk)));
}

function splitChunkInHalf(text: string): [string, string] | null {
  const middle = Math.floor(text.length / 2);
  let cut = text.lastIndexOf(" ", middle);
  if (cut <= 0) cut = text.indexOf(" ", middle);
  if (cut <= 0) return null;

  const left = text.slice(0, cut).trim();
  const right = text.slice(cut).trim();
  return left && right ? [left, right] : null;
}

export function clampRate(rate: unknown): number {
  const value = typeof rate === "number" && Number.isFinite(rate) ? rate : 1;
  return Math.min(MAX_RATE, Math.max(MIN_RATE, value));
}

function estimateMs(text: string, rate: number): number {
  return Math.max(1500, (text.length / (ASSUMED_CHARS_PER_SECOND * rate)) * 1000);
}

// ─── Voices ──────────────────────────────────────────────────────────────────

type VoiceLike = Pick<SpeechSynthesisVoice, "name" | "lang" | "voiceURI" | "localService" | "default">;

// macOS/iOS novelty voices — English, but not something to learn pronunciation from.
const NOVELTY_VOICES =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|fred|good news|hysterical|jester|junior|kathy|organ|princess|ralph|superstar|trinoids|whisper|wobble|zarvox)\b/i;

const PREFERRED_VOICES =
  /(samantha|ava|allison|susan|karen|moira|tessa|serena|daniel|alex|aria|jenny|guy|zira|david|mark|google (us|uk) english|english \(?united states)/i;

function normalizeLang(lang: string): string {
  return (lang || "").replace(/_/g, "-").toLowerCase();
}

function scoreVoice(voice: VoiceLike, mobile: boolean): number {
  const lang = normalizeLang(voice.lang);
  if (lang !== "en" && lang.indexOf("en-") !== 0) return -1;
  if (NOVELTY_VOICES.test(voice.name)) return -1;

  let score = 10;
  if (lang === "en-us") score += 40;
  else if (lang === "en-gb") score += 25;
  else if (lang === "en") score += 20;
  else score += 10;

  // Local voices work offline and do not hit the network-voice length limits.
  if (voice.localService) score += mobile ? 40 : 10;
  if (/(premium|enhanced|natural|neural)/i.test(voice.name)) score += 12;
  if (PREFERRED_VOICES.test(voice.name)) score += 8;
  if (voice.default) score += 3;
  return score;
}

/** English voices, best first. Stable for equal scores. */
export function rankVoices<T extends VoiceLike>(voices: readonly T[], mobile: boolean): T[] {
  return voices
    .map((voice, index) => ({ voice, index, score: scoreVoice(voice, mobile) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.voice);
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true;
  // iPadOS 13+ reports itself as a Mac.
  return /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1;
}

let allVoices: SpeechSynthesisVoice[] = [];
let rankedVoices: SpeechSynthesisVoice[] = [];
const failedVoiceURIs = new Set<string>();

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  try {
    return "speechSynthesis" in window && window.speechSynthesis ? window.speechSynthesis : null;
  } catch {
    return null;
  }
}

function supportsUtterance(): boolean {
  return typeof SpeechSynthesisUtterance !== "undefined";
}

function refreshVoices() {
  const synth = getSynth();
  if (!synth) return;
  try {
    allVoices = synth.getVoices();
  } catch {
    allVoices = [];
  }
  rankedVoices = rankVoices(allVoices, isMobileDevice());
}

/**
 * Voices to try for one run, in order: best → a different local one → the engine default.
 * Fixed for the whole run so the narrator never changes mid-passage.
 */
function buildVoiceLadder(): (SpeechSynthesisVoice | null)[] {
  const usable = rankedVoices.filter((voice) => !failedVoiceURIs.has(voice.voiceURI));
  const first = usable[0] ?? null;
  const second = usable.find((voice) => voice !== first && voice.localService) ?? usable.find((voice) => voice !== first) ?? null;
  const ladder = [first, second, null];
  return ladder.filter((voice, index) => ladder.indexOf(voice) === index);
}

function applyVoice(utterance: SpeechSynthesisUtterance, voice: SpeechSynthesisVoice | null) {
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang ? voice.lang.replace(/_/g, "-") : "en-US";
  } else {
    utterance.lang = "en-US";
  }
}

// ─── Observable state (works with useSyncExternalStore) ──────────────────────

const IDLE_STATE: AudioState = {
  activeText: null,
  activeId: null,
  isPlaying: false,
  error: null,
  errorId: null,
};

let currentState: AudioState = IDLE_STATE;
const listeners = new Set<(state: AudioState) => void>();

function notify() {
  for (const listener of listeners) {
    listener(currentState);
  }
}

function updateState(partial: Partial<AudioState>) {
  currentState = { ...currentState, ...partial };
  notify();
}

// ─── Playback runs ───────────────────────────────────────────────────────────

interface Run {
  id: string;
  chunks: string[];
  index: number;
  /** Failed attempts on the current chunk. */
  attempt: number;
  rate: number;
  voices: (SpeechSynthesisVoice | null)[];
  /** Position in the voice ladder; kept across chunks so the narrator never changes needlessly. */
  voiceIndex: number;
  options: SpeakOptions;
}

interface LiveUtterance {
  utterance: SpeechSynthesisUtterance;
  text: string;
  requestedAt: number;
  startedAt: number;
  started: boolean;
  sawSpeaking: boolean;
  estimatedMs: number;
}

/** Bumped on every stop/finish: any callback holding an older token is ignored. */
let runToken = 0;
let run: Run | null = null;

/** A Microsoft run (audio-edge.ts plays it). The device engine's `run` stays null meanwhile. */
interface EdgeRun {
  id: string;
  chunks: string[];
  rate: number;
  options: SpeakOptions;
}
let edgeRun: EdgeRun | null = null;

let provider: AudioProvider = DEFAULT_AUDIO_PROVIDER;
/** Until this time Microsoft is skipped because it just failed. */
let microsoftPausedUntil = 0;
/** Module-level reference also keeps the utterance from being garbage-collected mid-speech. */
let live: LiveUtterance | null = null;

let pollTimer: ReturnType<typeof setInterval> | null = null;
let pendingTimer: ReturnType<typeof setTimeout> | null = null;
let errorTimer: ReturnType<typeof setTimeout> | null = null;

function stopPoll() {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function clearPending() {
  if (pendingTimer !== null) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
}

function clearErrorTimer() {
  if (errorTimer !== null) {
    clearTimeout(errorTimer);
    errorTimer = null;
  }
}

function scheduleAfter(ms: number, token: number, action: () => void) {
  clearPending();
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    if (token === runToken) action();
  }, ms);
}

function readFlag(synth: SpeechSynthesis, key: "speaking" | "pending" | "paused"): boolean {
  try {
    return Boolean(synth[key]);
  } catch {
    return false;
  }
}

function isEngineBusy(synth: SpeechSynthesis): boolean {
  return readFlag(synth, "speaking") || readFlag(synth, "pending") || readFlag(synth, "paused");
}

function cancelEngine() {
  const synth = getSynth();
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    // The engine may already be idle.
  }
}

function stopInternal(clearError = true) {
  const hadActivity = run !== null || live !== null || edgeRun !== null;

  // Invalidate first: the late events cancel() triggers must find nothing to act on.
  runToken += 1;
  run = null;
  live = null;
  stopPoll();
  clearPending();
  edgeRun = null;
  edgePlayer.stop();
  if (clearError) clearErrorTimer();

  const synth = getSynth();
  if (synth && (hadActivity || isEngineBusy(synth))) cancelEngine();

  if (
    currentState.isPlaying ||
    currentState.activeText !== null ||
    currentState.activeId !== null ||
    (clearError && currentState.error !== null)
  ) {
    updateState({
      isPlaying: false,
      activeText: null,
      activeId: null,
      ...(clearError ? { error: null, errorId: null } : {}),
    });
  }
}

function showError(message: string, id: string | null) {
  clearErrorTimer();
  updateState({ error: message, errorId: id });
  errorTimer = setTimeout(() => {
    errorTimer = null;
    updateState({ error: null, errorId: null });
  }, ERROR_VISIBLE_MS);
}

function failureMessage(): string {
  // Voices are loaded but none is English → tell the learner how to fix the device.
  return allVoices.length > 0 && rankedVoices.length === 0 ? MESSAGES.noVoice : MESSAGES.failed;
}

function fail(token: number, message: string) {
  if (token !== runToken) return;
  const failedId = currentState.activeId;
  const onError = (run ?? edgeRun)?.options.onError;
  stopInternal();
  showError(message, failedId);
  onError?.(message);
}

function finishRun(token: number) {
  if (token !== runToken || !run) return;
  const onEnd = run.options.onEnd;

  runToken += 1;
  run = null;
  live = null;
  stopPoll();
  clearPending();
  updateState({ isPlaying: false, activeText: null, activeId: null });
  onEnd?.();
}

function currentVoice(current: Run): SpeechSynthesisVoice | null {
  return current.voices[Math.min(current.voiceIndex, current.voices.length - 1)] ?? null;
}

function chunkDone(token: number) {
  if (token !== runToken || !run) return;
  const current = run;
  stopPoll();
  live = null;

  current.index += 1;
  current.attempt = 0;

  if (current.index >= current.chunks.length) {
    finishRun(token);
    return;
  }
  scheduleAfter(CHUNK_GAP_MS, token, () => playChunk(token));
}

const VOICE_FAILURE_CODES = new Set([
  "synthesis-failed",
  "synthesis-unavailable",
  "voice-unavailable",
  "language-unavailable",
  "network",
  "silent-end",
]);

function chunkFailed(token: number, code: string, record: LiveUtterance) {
  if (token !== runToken || live !== record || !run) return;
  const current = run;
  stopPoll();
  live = null;

  if (code === "not-allowed") {
    fail(token, MESSAGES.blocked);
    return;
  }

  const voiceSpecific = VOICE_FAILURE_CODES.has(code);
  const voice = currentVoice(current);
  if (voice && voiceSpecific) failedVoiceURIs.add(voice.voiceURI);

  if (code === "text-too-long") {
    const halves = splitChunkInHalf(current.chunks[current.index]);
    if (halves) {
      current.chunks.splice(current.index, 1, halves[0], halves[1]);
      current.attempt = 0;
      cancelEngine();
      scheduleAfter(RETRY_DELAY_MS, token, () => playChunk(token));
      return;
    }
  }

  current.attempt += 1;
  if (current.attempt >= MAX_ATTEMPTS_PER_CHUNK) {
    fail(token, failureMessage());
    return;
  }

  // A dead voice is replaced at once. Anything else (wedged engine, lost start) gets one more
  // try with the same voice, so a transient hiccup does not swap the narrator — on an Arabic
  // phone the fallback could be the Arabic system voice reading English.
  if (voiceSpecific || current.attempt >= 2) {
    current.voiceIndex = Math.min(current.voiceIndex + 1, current.voices.length - 1);
  }

  cancelEngine();
  scheduleAfter(RETRY_DELAY_MS, token, () => playChunk(token));
}

/** Watchdog for the utterance being spoken. */
function inspectLive(token: number, record: LiveUtterance) {
  if (token !== runToken || live !== record) {
    stopPoll();
    return;
  }
  const synth = getSynth();
  if (!synth) return;

  const now = Date.now();
  const speaking = readFlag(synth, "speaking");
  const pending = readFlag(synth, "pending");
  if (speaking) record.sawSpeaking = true;

  // A: no sign of life at all → the engine is wedged (or the voice is dead).
  if (!record.started) {
    const limit = speaking || pending ? START_TIMEOUT_MS * 1.5 : START_TIMEOUT_MS;
    if (now - record.requestedAt > limit) {
      chunkFailed(token, "start-timeout", record);
      return;
    }
  }

  const alive = record.started || record.sawSpeaking;
  const elapsed = now - (record.startedAt || record.requestedAt);

  // B: the engine is idle and the sentence should be long finished, but `end` never came.
  if (alive && !speaking && !pending && elapsed > record.estimatedMs * 1.15 + 1500) {
    chunkDone(token);
    return;
  }

  // C: far beyond any plausible duration → stuck. Move on (or retry if it never started).
  if (elapsed > record.estimatedMs * 2.5 + 5000) {
    if (alive) {
      cancelEngine();
      chunkDone(token);
    } else {
      chunkFailed(token, "stalled", record);
    }
  }
}

function playChunk(token: number) {
  if (token !== runToken || !run) return;
  const current = run;

  if (current.index >= current.chunks.length) {
    finishRun(token);
    return;
  }

  const synth = getSynth();
  if (!synth || !supportsUtterance()) {
    fail(token, MESSAGES.unsupported);
    return;
  }

  const text = current.chunks[current.index];
  let utterance: SpeechSynthesisUtterance;
  try {
    utterance = new SpeechSynthesisUtterance(text);
  } catch {
    fail(token, MESSAGES.failed);
    return;
  }

  applyVoice(utterance, currentVoice(current));
  utterance.rate = current.rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  const record: LiveUtterance = {
    utterance,
    text,
    requestedAt: Date.now(),
    startedAt: 0,
    started: false,
    sawSpeaking: false,
    estimatedMs: estimateMs(text, current.rate),
  };
  live = record;

  const markStarted = () => {
    if (live !== record || record.started) return;
    record.started = true;
    record.startedAt = Date.now();
  };

  utterance.onstart = markStarted;
  utterance.onboundary = markStarted;
  utterance.onend = () => {
    if (live !== record) return;
    // An `end` with no `start` within a blink means the voice produced nothing.
    const silent = !record.started && Date.now() - record.requestedAt < 120 && text.length > 3;
    if (silent) chunkFailed(token, "silent-end", record);
    else chunkDone(token);
  };
  utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
    if (live !== record) return;
    chunkFailed(token, event.error || "synthesis-failed", record);
  };

  stopPoll();
  pollTimer = setInterval(() => inspectLive(token, record), POLL_INTERVAL_MS);

  try {
    // A paused engine queues speech but never plays it.
    if (readFlag(synth, "paused")) synth.resume();
    synth.speak(utterance);
  } catch {
    chunkFailed(token, "synthesis-failed", record);
  }
}

/** After cancel() phones need a moment; retry the cancel a couple of times, then just speak. */
function settleEngineThenPlay(token: number, triesLeft: number) {
  if (token !== runToken || !run) return;
  const synth = getSynth();
  if (!synth) {
    fail(token, MESSAGES.unsupported);
    return;
  }

  if (triesLeft > 0 && (readFlag(synth, "speaking") || readFlag(synth, "pending"))) {
    cancelEngine();
    scheduleAfter(ENGINE_SETTLE_MS, token, () => settleEngineThenPlay(token, triesLeft - 1));
    return;
  }
  playChunk(token);
}

// ─── Page lifecycle ──────────────────────────────────────────────────────────

function handlePageHide() {
  stopInternal();
}

function handleVisibilityChange() {
  // Phones suspend speech in the background and leave the UI stuck on "playing".
  if (typeof document !== "undefined" && document.visibilityState === "hidden" && isMobileDevice()) {
    stopInternal();
  }
}

let initialised = false;

/** Idempotent. Warms up the voice list and installs the lifecycle guards. */
function init() {
  // The lifecycle guards protect both voices, so they do not depend on speechSynthesis existing.
  if (!initialised && typeof window !== "undefined" && typeof document !== "undefined") {
    initialised = true;
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
  warmVoices();
}

let voicesWarmed = false;

/** The device voice list: loaded now, and again whenever the browser says it changed. */
function warmVoices() {
  if (voicesWarmed) return;
  const synth = getSynth();
  if (!synth) return;
  voicesWarmed = true;

  refreshVoices();

  const onVoicesChanged = () => {
    failedVoiceURIs.clear();
    refreshVoices();
  };
  try {
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", onVoicesChanged);
    else synth.onvoiceschanged = onVoicesChanged;
  } catch {
    // Some engines expose neither; polling below covers them.
  }

  // Some phones never fire "voiceschanged" — poll a few times until the list is filled.
  [300, 1200, 3000].forEach((delay) => {
    setTimeout(() => {
      if (allVoices.length === 0) refreshVoices();
    }, delay);
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

function isSupported(): boolean {
  return chooseEngine() !== "none";
}

type Engine = "microsoft" | "device" | "none";

function deviceVoiceAvailable(): boolean {
  return getSynth() !== null && supportsUtterance();
}

/** Microsoft is worth trying unless it failed a moment ago or the phone says it is offline. */
function microsoftHealthy(): boolean {
  if (Date.now() < microsoftPausedUntil) return false;
  return typeof navigator === "undefined" || navigator.onLine !== false;
}

/**
 * Which voice speaks this tap. The device voice is the safe answer whenever Microsoft cannot work,
 * and Microsoft is used even against the setting when the device has no voice at all.
 */
function chooseEngine(): Engine {
  const microsoft = edgePlayer.isSupported();
  const device = deviceVoiceAvailable();
  if (!microsoft) return device ? "device" : "none";
  if (!device) return "microsoft";
  return provider === "microsoft" && microsoftHealthy() ? "microsoft" : "device";
}

/** Called with the learner's saved choice. Switching while something plays stops it. */
function setProvider(value: unknown) {
  const next = normalizeAudioProvider(value);
  if (next === provider) return;
  provider = next;
  microsoftPausedUntil = 0;
  stopInternal();
}

function finishEdgeRun(token: number) {
  if (token !== runToken || !edgeRun) return;
  const onEnd = edgeRun.options.onEnd;

  runToken += 1;
  edgeRun = null;
  updateState({ isPlaying: false, activeText: null, activeId: null });
  onEnd?.();
}

/** Microsoft could not play (offline, refused, timed out, server error): carry on with the device voice. */
function edgeFailed(token: number, reason: EdgeFailureReason, index: number) {
  if (token !== runToken || !edgeRun) return;
  const current = edgeRun;

  if (reason === "blocked") {
    fail(token, MESSAGES.blocked);
    return;
  }

  microsoftPausedUntil = Date.now() + MICROSOFT_COOLDOWN_MS;

  const synth = getSynth();
  if (!synth || !supportsUtterance()) {
    fail(token, MESSAGES.offline);
    return;
  }

  // Same tap, same button: it stays on "playing" and continues from the sentence that failed.
  edgeRun = null;
  init();
  refreshVoices();
  run = {
    id: current.id,
    chunks: current.chunks.slice(index),
    index: 0,
    attempt: 0,
    rate: current.rate,
    voices: buildVoiceLadder(),
    voiceIndex: 0,
    options: current.options,
  };

  if (isEngineBusy(synth)) scheduleAfter(ENGINE_SETTLE_MS, token, () => settleEngineThenPlay(token, 3));
  else playChunk(token);
}

function speakWithMicrosoft(text: string, targetId: string, chunks: string[], options: SpeakOptions) {
  stopInternal();
  const token = runToken;
  const rate = clampRate(options.rate);
  edgeRun = { id: targetId, chunks, rate, options };
  updateState({ isPlaying: true, activeText: text, activeId: targetId, error: null, errorId: null });

  // play() starts the first sentence right here, inside the user's tap.
  edgePlayer.play(chunks, rate, {
    onStart: () => {
      if (token === runToken) microsoftPausedUntil = 0;
    },
    onEnd: () => finishEdgeRun(token),
    onInterrupted: () => {
      if (token === runToken) stopInternal();
    },
    onFail: (reason, index) => edgeFailed(token, reason, index),
  });
}

function speakOnDevice(text: string, targetId: string, chunks: string[], options: SpeakOptions) {
  const synth = getSynth();
  if (!synth) return;

  const engineWasBusy = run !== null || live !== null || isEngineBusy(synth);
  stopInternal();
  refreshVoices();

  const token = runToken;
  run = {
    id: targetId,
    chunks,
    index: 0,
    attempt: 0,
    rate: clampRate(options.rate),
    voices: buildVoiceLadder(),
    voiceIndex: 0,
    options,
  };
  updateState({ isPlaying: true, activeText: text, activeId: targetId, error: null, errorId: null });

  if (engineWasBusy) {
    scheduleAfter(ENGINE_SETTLE_MS, token, () => settleEngineThenPlay(token, 3));
  } else {
    // Idle engine: speak right now, inside the user's tap (required by iOS).
    playChunk(token);
  }
}

function speakWord(text: string, options: SpeakOptions = {}) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const targetId = options.id ?? trimmed;

  const engine = chooseEngine();
  if (engine === "none") {
    showError(MESSAGES.unsupported, targetId);
    options.onError?.(MESSAGES.unsupported);
    return;
  }

  // Tapping the button of what is playing stops it.
  if (currentState.isPlaying && currentState.activeId === targetId) {
    stopInternal();
    return;
  }

  init();
  const chunks = splitIntoChunks(trimmed);
  if (chunks.length === 0) return;

  if (engine === "microsoft") speakWithMicrosoft(trimmed, targetId, chunks, options);
  else speakOnDevice(trimmed, targetId, chunks, options);
}

export const audio = {
  isSupported,
  init,

  getState(): AudioState {
    return currentState;
  },

  getServerState(): AudioState {
    return IDLE_STATE;
  },

  subscribe(listener: (state: AudioState) => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  speakWord,

  /** Applies the learner's saved voice choice ("microsoft" | "google"). Unknown values mean the default. */
  setProvider,

  getProvider(): AudioProvider {
    return provider;
  },

  cancel() {
    stopInternal();
  },

  stop() {
    stopInternal();
  },
};
