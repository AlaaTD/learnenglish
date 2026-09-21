// Tests for the Microsoft voice of the listening engine (src/lib/audio.ts + src/lib/audio-edge.ts).
//
//   npm run test:audio-edge
//
// The browser is replaced by fakes: an <audio> element whose behaviour every test scripts (plays,
// errors, never starts, freezes, is paused by the system, refuses to autoplay), a fetch(), and a
// speechSynthesis for the device voice the engine falls back to. Time is mocked, so a "12 second
// timeout" costs nothing. The device voice's own rules are tested in test-audio.mjs.

import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// ─── Fake browser ────────────────────────────────────────────────────────────

const windowListeners = {};
const documentListeners = {};
const ANDROID_UA = "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36";
const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
const fakeNavigator = { userAgent: ANDROID_UA, maxTouchPoints: 5, onLine: true };

globalThis.window = globalThis;
globalThis.addEventListener = (type, fn) => {
  windowListeners[type] = fn;
};
globalThis.document = {
  visibilityState: "visible",
  addEventListener: (type, fn) => {
    documentListeners[type] = fn;
  },
};
Object.defineProperty(globalThis, "navigator", { value: fakeNavigator, configurable: true, writable: true });

/** How many times the engine asked for a new <audio>. The rule is: exactly once, ever. */
let constructCalls = 0;
let audioEl = null;

/**
 * One scripted <audio>. `plan(src)` decides what happens when a sentence is played:
 *   {}                          plays 500 ms after 40 ms of loading, then `ended`
 *   { error: true }             `error` event (what a 502 answer does), no sound
 *   { rejectWith: "Name" }      play() rejects (NotAllowedError = autoplay refused)
 *   { throwSync: true }         play() throws (very old browsers)
 *   { never: true }             loads forever, no event at all
 *   { stallAfter: ms }          starts, then the clock freezes (the network died)
 *   { interruptAfter: ms }      starts, then the system pauses it (a phone call)
 * Setting `src` cancels whatever played before, like the real load algorithm.
 */
class FakeAudio {
  constructor() {
    constructCalls += 1;
    if (audioEl) return audioEl;
    // Intentional: the engine must reuse ONE <audio> element (see the file banner above), so the
    // constructor hands back the existing instance instead of a fresh one.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    audioEl = this;
    this.playToken = 0;
    this.reset();
  }

  reset() {
    this.playToken += 1;
    this._src = "";
    this.paused = true;
    this.ended = false;
    this.onplaying = null;
    this.onended = null;
    this.onerror = null;
    this.playCalls = [];
    this.pauseCalls = 0;
    this.plan = () => ({});
    this.canPlay = "probably";
    this.playingSince = 0;
    this.frozenAt = null;
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this._src = value;
    this.playToken += 1;
    this.paused = true;
    this.ended = false;
    this.playingSince = 0;
    this.frozenAt = null;
  }

  get currentTime() {
    if (this.frozenAt !== null) return this.frozenAt;
    return this.playingSince ? (Date.now() - this.playingSince) / 1000 : 0;
  }

  canPlayType() {
    return this.canPlay;
  }

  pause() {
    this.pauseCalls += 1;
    this.paused = true;
    this.playToken += 1;
  }

  play() {
    const src = this._src;
    this.playCalls.push({ src, at: Date.now() });
    const p = { startAfter: 40, duration: 500, ...this.plan(src) };

    if (p.throwSync) throw new Error("play() is not supported here");
    if (p.rejectWith) return Promise.reject(Object.assign(new Error(p.rejectWith), { name: p.rejectWith }));

    this.paused = false;
    this.ended = false;
    const token = this.playToken;
    const alive = () => this.playToken === token;

    if (p.error) {
      setTimeout(() => {
        if (!alive()) return;
        this.paused = true;
        this.onerror?.({});
      }, p.errorAfter ?? 20);
      return new Promise(() => {});
    }
    if (p.never) return new Promise(() => {});

    setTimeout(() => {
      if (!alive()) return;
      this.playingSince = Date.now();
      this.onplaying?.({});
      if (p.stallAfter !== undefined) {
        setTimeout(() => {
          if (alive()) this.frozenAt = this.currentTime;
        }, p.stallAfter);
      }
      if (p.interruptAfter !== undefined) {
        setTimeout(() => {
          if (alive()) this.paused = true;
        }, p.interruptAfter);
      }
    }, p.startAfter);

    if (p.stallAfter === undefined && p.interruptAfter === undefined) {
      setTimeout(() => {
        if (!alive()) return;
        this.paused = true;
        this.ended = true;
        this.onended?.({});
      }, p.startAfter + p.duration);
    }
    return Promise.resolve();
  }
}
globalThis.Audio = FakeAudio;

const fetchCalls = [];
let fetchBehavior = () => ({ ok: true });
globalThis.fetch = (url) => {
  fetchCalls.push(String(url));
  const result = fetchBehavior(url);
  if (result instanceof Error) return Promise.reject(result);
  return Promise.resolve({ ok: result.ok, arrayBuffer: async () => new ArrayBuffer(8) });
};

class FakeUtterance {
  constructor(text) {
    this.text = text;
    this.voice = null;
    this.lang = "";
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onboundary = null;
  }
}
globalThis.SpeechSynthesisUtterance = FakeUtterance;

let uriCounter = 0;
const voice = (name, lang = "en-US", localService = true) => ({
  name,
  lang,
  localService,
  voiceURI: `${name}#${(uriCounter += 1)}`,
  default: false,
});

/** A lean device voice: speaks each utterance in order, or fails it when `plan` says so. */
function createSynth({ voices = [voice("Samantha")], plan = () => ({}) } = {}) {
  const synth = {
    speaking: false,
    pending: false,
    paused: false,
    spoken: [],
    speakCalls: [],
    cancelCalls: 0,
    overlapViolations: 0,
    current: null,
    activeId: -1,
    playId: 0,
    getVoices: () => voices,
    addEventListener: () => {},
    cancel() {
      synth.cancelCalls += 1;
      synth.current = null;
      synth.speaking = false;
      synth.pending = false;
      synth.activeId = -1;
    },
    speak(utterance) {
      synth.speakCalls.push({ text: utterance.text, voice: utterance.voice ? utterance.voice.name : null, rate: utterance.rate, at: Date.now() });
      if (synth.current) synth.overlapViolations += 1;
      synth.current = utterance;
      synth.speaking = true;
      const id = (synth.playId += 1);
      synth.activeId = id;
      const p = { startAfter: 30, duration: Math.max(200, (utterance.text.length * 60) / utterance.rate), ...plan(utterance) };

      if (p.error) {
        setTimeout(() => {
          if (synth.activeId !== id) return;
          synth.current = null;
          synth.speaking = false;
          synth.activeId = -1;
          utterance.onerror?.({ error: p.error });
        }, p.errorAfter ?? 20);
        return;
      }
      setTimeout(() => {
        if (synth.activeId === id) utterance.onstart?.({});
      }, p.startAfter);
      setTimeout(() => {
        if (synth.activeId !== id) return;
        synth.current = null;
        synth.speaking = false;
        synth.activeId = -1;
        synth.spoken.push(utterance.text);
        utterance.onend?.({});
      }, p.startAfter + p.duration);
    },
  };
  return synth;
}

const { audio, splitIntoChunks } = await import("../src/lib/audio.ts");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function advance(ms) {
  for (let elapsed = 0; elapsed < ms; elapsed += 25) mock.timers.tick(25);
}

/** Lets promise callbacks run (mocked timers do not touch setImmediate). */
const flush = () => new Promise((resolve) => setImmediate(resolve));

function setMobile(isMobile) {
  fakeNavigator.userAgent = isMobile ? ANDROID_UA : DESKTOP_UA;
  fakeNavigator.maxTouchPoints = isMobile ? 5 : 0;
}

const decode = (src) => {
  const url = new URL(src, "http://localhost");
  return { path: url.pathname, texts: url.searchParams.getAll("text"), rates: url.searchParams.getAll("rate") };
};
const playedTexts = (el) => el.playCalls.map((call) => decode(call.src).texts[0]);
const fetchedTexts = () => fetchCalls.map((url) => decode(url).texts[0]);

const assertIdle = () => {
  const state = audio.getState();
  assert.equal(state.isPlaying, false, "the button must not stay on 'playing'");
  assert.equal(state.activeId, null);
  assert.equal(state.activeText, null);
};

/** `synth: null` = a browser with no speechSynthesis at all. */
function scenario(name, options, body) {
  test(name, async () => {
    mock.timers.enable({ apis: ["setTimeout", "setInterval", "Date"], now: 1_000_000 });
    setMobile(true);
    fakeNavigator.onLine = true;
    fetchCalls.length = 0;
    fetchBehavior = () => ({ ok: true });

    const synth = options.synth === null ? null : createSynth(options.synth ?? {});
    if (synth) globalThis.speechSynthesis = synth;
    else delete globalThis.speechSynthesis;

    // Fresh provider state: switching away and back also clears the cool-down after a failure.
    audio.setProvider("google");
    audio.setProvider("microsoft");
    audio.isSupported(); // makes the engine create its <audio> element (the first time only)
    const el = audioEl;
    el.reset();
    el.plan = options.plan ?? (() => ({}));
    el.canPlay = options.canPlay ?? "probably";

    try {
      await body({ synth, el });
    } finally {
      audio.stop();
      mock.timers.reset();
    }
  });
}

const PARAGRAPH =
  "I wake up at six thirty every day. First, I brush my teeth and take a quick shower. Then I get dressed and make breakfast. I usually eat cereal with milk. After that I go to work by bus.";
const OTHER =
  "My father is a tall man with a friendly smile. My mother is a kind woman who cares for everyone. They love their children very much.";
const PARAGRAPH_CHUNKS = splitIntoChunks(PARAGRAPH);
const OTHER_CHUNKS = splitIntoChunks(OTHER);

// ─── The happy path ──────────────────────────────────────────────────────────

scenario("Microsoft is the default: every sentence is requested from /api/tts, in order, and the device voice stays silent", {}, async ({ synth, el }) => {
  let ended = 0;
  audio.speakWord(PARAGRAPH, { id: "p", onEnd: () => (ended += 1) });

  assert.equal(el.playCalls.length, 1, "the first sentence must be started before the tap handler returns (iOS)");
  assert.equal(audio.getState().isPlaying, true);

  advance(30_000);
  await flush();

  assert.deepEqual(playedTexts(el), PARAGRAPH_CHUNKS);
  assert.ok(el.playCalls.every((call) => decode(call.src).path === "/api/tts"));
  assert.equal(ended, 1, "onEnd fires exactly once");
  assertIdle();
  assert.equal(synth.speakCalls.length, 0, "the device voice is not used at all");
});

scenario("the rate is sent to the server, clamped like the device voice", {}, (_ctx) => {
  const { el } = _ctx;
  audio.speakWord("Slow one.", { id: "r1", rate: 0.8 });
  advance(2_000);
  audio.speakWord("Broken rate one.", { id: "r2", rate: Number.NaN });
  advance(2_000);
  audio.speakWord("Crazy rate one.", { id: "r3", rate: 9 });
  advance(2_000);
  assert.deepEqual(
    el.playCalls.map((call) => decode(call.src).rates[0]),
    ["0.8", "1", "2"],
  );
});

scenario("text with & ? % and quotes travels as ONE properly encoded query value", {}, ({ el }) => {
  const text = "Tom & Jerry say: is it 50% ready? Yes, it's fine.";
  audio.speakWord(text, { id: "special" });
  advance(2_000);
  for (const call of el.playCalls) {
    const decoded = decode(call.src);
    assert.equal(decoded.texts.length, 1, "an ampersand must not start a second parameter");
    assert.equal(decoded.rates.length, 1);
  }
  assert.equal(playedTexts(el).join(" ").includes("Tom & Jerry"), true);
});

scenario("the next sentences are warmed on the server: each later sentence exactly once, none too early", {}, async ({ el }) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  assert.deepEqual(fetchedTexts(), [PARAGRAPH_CHUNKS[1]], "the next sentence is requested at once");

  advance(100); // the first sentence is audible now
  assert.deepEqual(fetchedTexts(), [PARAGRAPH_CHUNKS[1], PARAGRAPH_CHUNKS[2]]);

  advance(30_000);
  await flush();
  assert.deepEqual(fetchedTexts(), PARAGRAPH_CHUNKS.slice(1), "sentence 1 is played, never fetched; the rest exactly once");
  assert.equal(el.playCalls.length, PARAGRAPH_CHUNKS.length);
});

scenario("a failing warm-up request never affects playback", {}, async ({ el }) => {
  fetchBehavior = () => new Error("offline");
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(30_000);
  await flush();
  assert.deepEqual(playedTexts(el), PARAGRAPH_CHUNKS);
  assertIdle();
});

// ─── Stopping and re-tapping ─────────────────────────────────────────────────

scenario("tapping the playing button stops it, silences the element and nothing more is played", {}, ({ el }) => {
  let ended = 0;
  audio.speakWord(PARAGRAPH, { id: "A", onEnd: () => (ended += 1) });
  advance(300);
  audio.speakWord(PARAGRAPH, { id: "A" });
  assertIdle();
  assert.equal(el.paused, true);
  const calls = el.playCalls.length;
  advance(30_000);
  assert.equal(el.playCalls.length, calls);
  assert.equal(ended, 0, "onEnd is for natural completion only");
});

scenario("a late `ended` from the old run cannot advance the new one", {}, ({ el }) => {
  audio.speakWord(PARAGRAPH, { id: "A" });
  advance(100);
  const staleEnded = el.onended;

  audio.speakWord(OTHER, { id: "B" });
  const before = el.playCalls.length;
  staleEnded({});
  assert.equal(el.playCalls.length, before, "the stale event must find nothing to do");

  advance(30_000);
  assert.deepEqual(playedTexts(el), [PARAGRAPH_CHUNKS[0], ...OTHER_CHUNKS]);
  assertIdle();
});

scenario("switching the voice in Settings while something plays stops it", {}, ({ el }) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(100);
  audio.setProvider("google");
  assertIdle();
  assert.equal(el.paused, true);
  const calls = el.playCalls.length;
  advance(30_000);
  assert.equal(el.playCalls.length, calls);
});

scenario("leaving the page (pagehide) stops the Microsoft voice too", {}, ({ el }) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(100);
  windowListeners.pagehide();
  assertIdle();
  assert.equal(el.paused, true);
});

scenario("a phone sent to the background stops the voice; a desktop tab keeps talking", {}, () => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(100);
  document.visibilityState = "hidden";
  documentListeners.visibilitychange();
  document.visibilityState = "visible";
  assertIdle();

  setMobile(false);
  audio.speakWord(PARAGRAPH, { id: "q" });
  advance(100);
  document.visibilityState = "hidden";
  documentListeners.visibilitychange();
  document.visibilityState = "visible";
  assert.equal(audio.getState().isPlaying, true);
});

// ─── When Microsoft cannot deliver: the device voice takes over ──────────────

scenario("an error on the first sentence: the SAME tap continues on the device voice, no error shown, then a cool-down", {
  plan: () => ({ error: true }),
}, async ({ synth, el }) => {
  let ended = 0;
  const errors = [];
  audio.speakWord(PARAGRAPH, { id: "p", onEnd: () => (ended += 1), onError: (m) => errors.push(m) });
  advance(100);
  assert.equal(audio.getState().isPlaying, true, "the button stays on 'playing' during the hand-over");
  assert.equal(audio.getState().activeId, "p");

  advance(60_000 - 100);
  assert.deepEqual(synth.spoken, PARAGRAPH_CHUNKS, "the whole text is spoken on the device voice");
  assert.equal(el.playCalls.length, 1, "Microsoft was tried once");
  assert.equal(ended, 1);
  assert.deepEqual(errors, []);
  assert.equal(audio.getState().error, null);
  assertIdle();

  // Cool-down: the next tap goes straight to the device voice, synchronously inside the tap (iOS).
  const speakBefore = synth.speakCalls.length;
  audio.speakWord(OTHER, { id: "2" });
  assert.equal(synth.speakCalls.length, speakBefore + 1, "device voice starts inside the tap");
  assert.equal(el.playCalls.length, 1, "Microsoft is not retried during the cool-down");
  advance(5_000);

  // After the cool-down Microsoft is tried again.
  advance(60_000);
  audio.speakWord("Hello there.", { id: "3" });
  assert.equal(el.playCalls.length, 2);
});

scenario("an error in the MIDDLE resumes on the device voice from the failed sentence, not from the start", {
  plan: (src) => (decode(src).texts[0] === PARAGRAPH_CHUNKS[2] ? { error: true } : {}),
}, ({ synth, el }) => {
  let ended = 0;
  audio.speakWord(PARAGRAPH, { id: "p", onEnd: () => (ended += 1) });
  advance(60_000);
  assert.deepEqual(playedTexts(el), PARAGRAPH_CHUNKS.slice(0, 3), "Microsoft played 1, 2 and failed on 3");
  assert.deepEqual(synth.spoken, PARAGRAPH_CHUNKS.slice(2), "the device voice says 3, 4, 5 and does not repeat 1 and 2");
  assert.equal(ended, 1);
  assertIdle();
});

scenario("a source the browser cannot play (play() rejects) also falls back", {
  plan: () => ({ rejectWith: "NotSupportedError" }),
}, async ({ synth }) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  await flush();
  advance(60_000);
  assert.deepEqual(synth.spoken, PARAGRAPH_CHUNKS);
  assertIdle();
});

scenario("play() throwing synchronously falls back inside the same tap", {
  plan: () => ({ throwSync: true }),
}, ({ synth }) => {
  audio.speakWord("Good morning everyone.", { id: "sync" });
  assert.equal(synth.speakCalls.length, 1, "the device voice is already speaking when speakWord returns");
});

scenario("a sentence that never starts is given up after 12 s, then the device voice takes over", {
  plan: () => ({ never: true }),
}, ({ synth }) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(11_000);
  assert.equal(synth.speakCalls.length, 0, "still waiting for Microsoft");
  assert.equal(audio.getState().isPlaying, true);
  advance(2_000);
  assert.ok(synth.speakCalls.length >= 1, "gave up on Microsoft");
  advance(60_000);
  assert.deepEqual(synth.spoken, PARAGRAPH_CHUNKS);
  assertIdle();
});

scenario("audio that starts and then freezes (network died) is detected, and the device voice resumes from that sentence", {
  plan: (src) => (decode(src).texts[0] === PARAGRAPH_CHUNKS[1] ? { stallAfter: 100 } : {}),
}, ({ synth, el }) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(8_000);
  assert.equal(synth.speakCalls.length, 0, "not yet declared dead");
  advance(60_000);
  assert.deepEqual(playedTexts(el), PARAGRAPH_CHUNKS.slice(0, 2));
  assert.deepEqual(synth.spoken, PARAGRAPH_CHUNKS.slice(1));
  assertIdle();
});

scenario("the system pausing the audio (a call, unplugged headphones) ends the run quietly: no error, no device voice", {
  plan: () => ({ interruptAfter: 100 }),
}, ({ synth, el }) => {
  let ended = 0;
  const errors = [];
  audio.speakWord(PARAGRAPH, { id: "p", onEnd: () => (ended += 1), onError: (m) => errors.push(m) });
  advance(10_000);
  assertIdle();
  assert.equal(audio.getState().error, null);
  assert.equal(synth.speakCalls.length, 0);
  assert.equal(el.playCalls.length, 1);
  assert.equal(ended, 0);
  assert.deepEqual(errors, []);
});

scenario("autoplay refused (NotAllowedError) is reported at once on that button, without falling back", {
  plan: () => ({ rejectWith: "NotAllowedError" }),
}, async ({ synth }) => {
  const errors = [];
  audio.speakWord("Good morning.", { id: "blocked", onError: (m) => errors.push(m) });
  await flush();
  assert.equal(audio.getState().errorId, "blocked");
  assert.ok(audio.getState().error?.includes("منع المتصفح"));
  assert.equal(errors.length, 1);
  assert.equal(synth.speakCalls.length, 0);
  assertIdle();
});

scenario("Microsoft down AND the device voice failing: one clear error on that button, no endless loop", {
  plan: () => ({ error: true }),
  synth: { plan: () => ({ error: "synthesis-failed" }) },
}, ({ synth }) => {
  const errors = [];
  audio.speakWord("Good morning everyone.", { id: "both", onError: (m) => errors.push(m) });
  advance(5_000);
  assert.equal(errors.length, 1);
  assert.equal(audio.getState().errorId, "both");
  assert.ok(synth.speakCalls.length <= 3, "the device engine's own attempt limit applies");
  assertIdle();
});

// ─── Choosing the engine ─────────────────────────────────────────────────────

scenario("a phone that reports it is offline goes straight to the device voice, inside the tap", {}, ({ synth, el }) => {
  fakeNavigator.onLine = false;
  audio.speakWord("Good morning everyone.", { id: "offline" });
  assert.equal(el.playCalls.length, 0);
  assert.equal(synth.speakCalls.length, 1);
  advance(5_000);
  assertIdle();

  fakeNavigator.onLine = true;
  audio.speakWord("Good evening everyone.", { id: "online" });
  assert.equal(el.playCalls.length, 1, "back online: Microsoft again");
});

scenario("the 'google' (device) setting never touches Microsoft; unknown values mean the default", {}, ({ synth, el }) => {
  audio.setProvider("google");
  assert.equal(audio.getProvider(), "google");
  audio.speakWord("Good morning everyone.", { id: "g" });
  assert.equal(el.playCalls.length, 0);
  assert.equal(synth.speakCalls.length, 1);
  advance(5_000);

  for (const bad of ["apple", "", "MICROSOFT", null, undefined, 5]) {
    audio.setProvider("google");
    audio.setProvider(bad);
    assert.equal(audio.getProvider(), "microsoft", `${JSON.stringify(bad)} → default`);
  }
});

scenario("a device with no speech voice at all uses Microsoft even though the setting says 'google'", { synth: null }, ({ el }) => {
  audio.setProvider("google");
  assert.equal(audio.isSupported(), true);
  audio.speakWord("Good morning everyone.", { id: "only-ms" });
  assert.equal(el.playCalls.length, 1);
  advance(5_000);
  assertIdle();
});

scenario("no device voice and Microsoft unreachable: the error tells the learner what to do, on that button only, then clears", {
  synth: null,
  plan: () => ({ error: true }),
}, () => {
  const errors = [];
  audio.speakWord("Good morning everyone.", { id: "btn", onError: (m) => errors.push(m) });
  advance(200);
  assert.equal(audio.getState().errorId, "btn");
  assert.ok(audio.getState().error?.includes("الإنترنت"));
  assert.equal(errors.length, 1);
  assertIdle();
  advance(8_000);
  assert.equal(audio.getState().error, null);
  assert.equal(audio.getState().errorId, null);
});

scenario("nothing can play at all: 'unsupported' is shown on the tapped button", { synth: null, canPlay: "" }, () => {
  assert.equal(audio.isSupported(), false);
  audio.speakWord("Good morning.", { id: "none" });
  assert.equal(audio.getState().errorId, "none");
  assert.ok(audio.getState().error?.includes("لا يدعم"));
  assertIdle();
});

// ─── Guards ──────────────────────────────────────────────────────────────────

test("the new engine files have no regex look-behind (a syntax error on iOS < 16.4 that would break the whole module)", () => {
  for (const file of ["audio.ts", "audio-edge.ts", "audio-provider.ts"]) {
    const source = readFileSync(new URL(`../src/lib/${file}`, import.meta.url), "utf8");
    assert.equal(/\(\?<[=!]/.test(source), false, `${file} must not use look-behind`);
  }
});

test("audio-edge.ts and audio-provider.ts import nothing (they must load in plain Node and in the browser alike)", () => {
  for (const file of ["audio-edge.ts", "audio-provider.ts"]) {
    const source = readFileSync(new URL(`../src/lib/${file}`, import.meta.url), "utf8");
    assert.equal(/^\s*import\s/m.test(source), false, `${file} must stay import-free`);
  }
});

test("the engine created exactly ONE <audio> element for this whole run (iOS unlocks an element, not a page)", () => {
  assert.equal(constructCalls, 1);
});
