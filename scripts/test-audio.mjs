// Regression tests for the listening engine (src/lib/audio.ts).
//
// Run:  npm run test:audio
//
// There is no real speech engine in Node, so a fake SpeechSynthesis reproduces the
// failures that happen on phones (lost `end` events, late events after cancel(),
// dropped speak() after cancel(), wedged engines, dead voices, a lying `speaking` flag…)
// and a virtual clock lets the watchdog timings run instantly and deterministically.

import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// ─── Browser fakes (must exist before the engine is imported) ────────────────

const windowListeners = {};
const documentListeners = {};
const fakeNavigator = {
  userAgent: "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
  maxTouchPoints: 5,
};

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

const engineModule = await import("../src/lib/audio.ts");
const { audio, splitIntoChunks, normalizeForSpeech, rankVoices, clampRate } = engineModule;

// ─── Fake speech engine ──────────────────────────────────────────────────────

function createSynth({
  voices = [],
  plan = () => ({}),
  cancelEvent = "none", // what cancel() emits for the utterance being spoken: "end" | "interrupted" | "none"
  dropSpeakWithinMsOfCancel = 0, // engine swallows a speak() issued too soon after cancel()
  swallowFirst = false, // engine silently swallows the very first speak()
  lieSpeaking = false, // `speaking` always reads false, even while talking
  paused = false,
} = {}) {
  const synth = {
    speaking: false,
    pending: false,
    paused,
    spoken: [],
    speakCalls: [],
    cancelCalls: 0,
    pauseCalls: 0,
    resumeCalls: 0,
    overlapViolations: 0,
    queue: [],
    current: null,
    activeId: -1,
    playId: 0,
    lastCancelAt: -Infinity,
    getVoices: () => voices,
    addEventListener: () => {},
    pause() {
      synth.pauseCalls += 1;
      synth.paused = true;
    },
    resume() {
      synth.resumeCalls += 1;
      synth.paused = false;
      pump();
    },
    cancel() {
      synth.cancelCalls += 1;
      synth.lastCancelAt = Date.now();
      const running = synth.current;
      synth.queue = [];
      synth.pending = false;
      synth.current = null;
      synth.speaking = false;
      synth.activeId = -1;
      if (running && cancelEvent === "end") setTimeout(() => running.onend?.({}), 5);
      if (running && cancelEvent === "interrupted") setTimeout(() => running.onerror?.({ error: "interrupted" }), 5);
    },
    speak(utterance) {
      synth.speakCalls.push({
        text: utterance.text,
        voice: utterance.voice ? utterance.voice.name : null,
        lang: utterance.lang,
        rate: utterance.rate,
        at: Date.now(),
      });
      if (synth.current) synth.overlapViolations += 1; // engine was still busy: caller did not wait
      if (swallowFirst && synth.speakCalls.length === 1) return;
      if (Date.now() - synth.lastCancelAt < dropSpeakWithinMsOfCancel) return;
      synth.queue.push(utterance);
      synth.pending = true;
      pump();
    },
  };

  if (lieSpeaking) Object.defineProperty(synth, "speaking", { get: () => false, set: () => {} });

  function finish(utterance, id, emit) {
    if (synth.activeId !== id) return;
    synth.current = null;
    synth.speaking = false;
    synth.activeId = -1;
    emit?.();
    pump();
  }

  function pump() {
    if (synth.current || synth.paused || synth.queue.length === 0) return;
    const utterance = synth.queue.shift();
    synth.current = utterance;
    synth.speaking = true;
    synth.pending = synth.queue.length > 0;
    const p = { startAfter: 30, duration: Math.max(200, (utterance.text.length * 60) / utterance.rate), ...plan(utterance) };
    const id = (synth.playId += 1);
    synth.activeId = id;

    if (p.error) {
      setTimeout(() => finish(utterance, id, () => utterance.onerror?.({ error: p.error })), p.errorAfter ?? 20);
      return;
    }
    if (p.neverStart) return; // wedged: stays "speaking" forever, no events
    if (p.silentEnd) {
      setTimeout(() => finish(utterance, id, () => utterance.onend?.({})), 10);
      return;
    }
    setTimeout(() => {
      if (synth.activeId === id) utterance.onstart?.({});
    }, p.startAfter);
    setTimeout(
      () =>
        finish(utterance, id, () => {
          synth.spoken.push(utterance.text);
          if (!p.dropEnd) utterance.onend?.({});
        }),
      p.startAfter + p.duration,
    );
  }

  return synth;
}

let uriCounter = 0;
const voice = (name, lang = "en-US", localService = true) => ({
  name,
  lang,
  localService,
  voiceURI: `${name}#${(uriCounter += 1)}`,
  default: false,
});

function advance(ms) {
  for (let elapsed = 0; elapsed < ms; elapsed += 25) mock.timers.tick(25);
}

function setMobile(isMobile) {
  fakeNavigator.userAgent = isMobile
    ? "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36"
    : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
  fakeNavigator.maxTouchPoints = isMobile ? 5 : 0;
}

/** One isolated scenario: fresh fake engine, virtual clock, clean shutdown. */
function scenario(name, options, body) {
  test(name, async () => {
    mock.timers.enable({ apis: ["setTimeout", "setInterval", "Date"], now: 1_000_000 });
    setMobile(true);
    const synth = createSynth(options);
    globalThis.speechSynthesis = synth;
    try {
      await body(synth);
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
const LONGEST_SENTENCE =
  "My father is a tall man with a friendly smile, and my mother is a kind woman who cares for everyone.";

const assertIdle = () => {
  const state = audio.getState();
  assert.equal(state.isPlaying, false);
  assert.equal(state.activeId, null);
  assert.equal(state.activeText, null);
};

// ─── 1. Static guarantees ────────────────────────────────────────────────────

test("engine source has no pause() keep-alive and no regex look-behind (breaks old iOS)", () => {
  const source = readFileSync(new URL("../src/lib/audio.ts", import.meta.url), "utf8");
  assert.equal(/\.pause\(/.test(source), false, "pause() must never be called");
  assert.equal(/\(\?<[=!]/.test(source), false, "look-behind is a syntax error on iOS < 16.4");
});

// ─── 2. Text preparation ─────────────────────────────────────────────────────

test("normalizeForSpeech removes what engines read aloud or stumble on", () => {
  assert.equal(normalizeForSpeech("“Hello” — she said (softly)…"), "Hello, she said, softly.");
  assert.equal(normalizeForSpeech("I’m fine   ,  thanks !"), "I'm fine, thanks!");
  assert.equal(normalizeForSpeech("am/is/are"), "am, is, are");
  assert.equal(normalizeForSpeech("Wait... what?"), "Wait. what?");
  assert.equal(normalizeForSpeech("**bold** and `code` 😀"), "bold and code");
  assert.equal(normalizeForSpeech("   \n\t "), "");
});

test("splitIntoChunks: abbreviations and decimals do not cut a sentence in half", () => {
  assert.deepEqual(splitIntoChunks("Dr. Adam lives at 3.5 Main St. He works hard."), [
    "Dr. Adam lives at 3.5 Main St. He works hard.",
  ]);
});

test("splitIntoChunks: real sentences stay separate, tiny ones are glued to a neighbour", () => {
  assert.deepEqual(splitIntoChunks("I like tea. You like coffee!"), ["I like tea. You like coffee!"]);
  assert.equal(splitIntoChunks(PARAGRAPH).length, 5);
  assert.deepEqual(splitIntoChunks("OK!"), ["OK!"]);
  assert.deepEqual(splitIntoChunks("son"), ["son"]);
  assert.deepEqual(splitIntoChunks("..."), []);
});

test("splitIntoChunks: over-long text is cut under the limit without losing a word", () => {
  const clauses = Array.from({ length: 12 }, (_, i) => `this is clause number ${i + 1} of a very long sentence`);
  const long = `${clauses.join(", ")}.`;
  const unbroken = "x".repeat(400);
  for (const text of [long, unbroken, `${long} ${long}`]) {
    const chunks = splitIntoChunks(text);
    assert.ok(chunks.every((chunk) => chunk.length <= 110), "every chunk fits the engine limit");
    assert.equal(chunks.join("").replace(/\s+/g, ""), normalizeForSpeech(text).replace(/\s+/g, ""));
  }
});

test("splitIntoChunks keeps every word, in order, for all real lesson content", () => {
  const spoken = [];
  const collect = (value, key) => {
    if (Array.isArray(value)) value.forEach((item) => collect(item, key));
    else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) collect(v, k);
      if (Array.isArray(value.lines)) spoken.push(value.lines.map((l) => `${l.speaker}. ${l.text}`).join(" "));
    } else if (typeof value === "string" && ["sentence", "example", "text", "headword"].includes(key)) {
      spoken.push(value);
    }
  };
  for (const file of ["day-01.json", "day-02.json"]) {
    collect(JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), "utf8")), "");
  }
  assert.ok(spoken.length > 200, `expected the real content to be scanned, got ${spoken.length} texts`);

  for (const text of spoken) {
    const chunks = splitIntoChunks(text);
    assert.ok(chunks.length > 0, `nothing to speak for: ${text}`);
    assert.ok(chunks.every((chunk) => chunk.length <= 110), `chunk too long in: ${text}`);
    assert.deepEqual(chunks.join(" ").split(/\s+/), normalizeForSpeech(text).split(/\s+/), `words changed in: ${text}`);
  }
});

test("clampRate keeps the rate inside what phone engines accept", () => {
  assert.equal(clampRate(0.8), 0.8);
  assert.equal(clampRate(Number.NaN), 1);
  assert.equal(clampRate(undefined), 1);
  assert.equal(clampRate("fast"), 1);
  assert.equal(clampRate(0.1), 0.5);
  assert.equal(clampRate(9), 2);
});

// ─── 3. Voice choice ─────────────────────────────────────────────────────────

test("rankVoices: English only, local first on phones, novelty voices excluded", () => {
  const list = [
    voice("Arabic Voice", "ar-EG"),
    voice("Albert", "en-US"),
    voice("Google US English", "en-US", false),
    voice("English UK", "en_GB"),
    voice("English US local", "en_US", true),
  ];
  const mobile = rankVoices(list, true).map((v) => v.name);
  assert.deepEqual(mobile, ["English US local", "English UK", "Google US English"]);
  assert.equal(mobile.includes("Arabic Voice"), false);
  assert.equal(mobile.includes("Albert"), false);
});

scenario("the narrator is an explicit English voice, never the Arabic system default", { voices: [voice("Laila", "ar-EG"), voice("Android EN", "en_US")] }, (synth) => {
  audio.speakWord("Good morning.", { id: "voice" });
  assert.equal(synth.speakCalls[0].voice, "Android EN");
  assert.equal(synth.speakCalls[0].lang, "en-US");
});

// ─── 4. Engine behaviour ─────────────────────────────────────────────────────

scenario("plays every sentence, in order, then reports the end exactly once", { voices: [voice("Samantha")] }, (synth) => {
  let ended = 0;
  audio.speakWord(PARAGRAPH, { id: "p", onEnd: () => (ended += 1) });
  assert.equal(audio.getState().isPlaying, true);
  advance(60_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(PARAGRAPH));
  assert.equal(ended, 1);
  assertIdle();
  assert.equal(synth.pauseCalls, 0, "no pause()/resume() keep-alive");
  assert.equal(synth.overlapViolations, 0);
});

scenario("speaks synchronously inside the tap when the engine is idle (iOS requirement)", {}, (synth) => {
  audio.speakWord("Hello there.", { id: "tap" });
  assert.equal(synth.speakCalls.length, 1, "speak() must be called before the tap handler returns");
});

scenario("a long passage never touches pause()/resume()", { voices: [voice("Samantha")] }, (synth) => {
  // Different lengths on purpose: equal-length sentences can hide a keep-alive timer by luck,
  // when its tick happens to land in the gap between two sentences.
  const long = Array.from({ length: 24 }, (_, i) => `Sentence number ${i + 1} ${"really ".repeat(i % 5)}is spoken by the engine.`).join(" ");
  audio.speakWord(long, { id: "long" });
  advance(300_000);
  assert.equal(synth.spoken.length, splitIntoChunks(long).length);
  assert.equal(synth.pauseCalls, 0);
  assert.equal(synth.resumeCalls, 0);
});

for (const cancelEvent of ["end", "interrupted"]) {
  scenario(`late "${cancelEvent}" event after cancel() never skips or replays the new sentences`, { voices: [voice("Samantha")], cancelEvent }, (synth) => {
    audio.speakWord(PARAGRAPH, { id: "A" });
    advance(300); // first sentence of A is still being spoken
    audio.speakWord(OTHER, { id: "B" });
    advance(60_000);
    assert.deepEqual(synth.spoken, splitIntoChunks(OTHER), "B is complete, in order, exactly once");
    assert.equal(synth.overlapViolations, 0);
    assertIdle();
  });
}

scenario("an engine that swallows speak() right after cancel() still plays the new text", { voices: [voice("Samantha")], dropSpeakWithinMsOfCancel: 60 }, (synth) => {
  audio.speakWord(PARAGRAPH, { id: "A" });
  advance(300);
  audio.speakWord(OTHER, { id: "B" });
  advance(60_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(OTHER));
  assertIdle();
});

scenario("rapid re-taps on different buttons always end with the last one, complete", { voices: [voice("Samantha")], cancelEvent: "end" }, (synth) => {
  audio.speakWord(PARAGRAPH, { id: "1" });
  advance(80);
  audio.speakWord(OTHER, { id: "2" });
  advance(40);
  audio.speakWord(PARAGRAPH, { id: "3" });
  advance(90_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(PARAGRAPH));
  assert.equal(synth.overlapViolations, 0);
  assertIdle();
});

scenario("tapping the playing button stops it and nothing more is spoken", { voices: [voice("Samantha")] }, (synth) => {
  let ended = 0;
  audio.speakWord(PARAGRAPH, { id: "A", onEnd: () => (ended += 1) });
  advance(500);
  audio.speakWord(PARAGRAPH, { id: "A" });
  assertIdle();
  advance(60_000);
  assert.deepEqual(synth.spoken, []);
  assert.equal(ended, 0, "onEnd is for natural completion only");
  assert.ok(synth.cancelCalls >= 1);
});

scenario("when `end` is never delivered the chain still advances to the last sentence", { voices: [voice("Samantha")], plan: () => ({ dropEnd: true }) }, (synth) => {
  let ended = 0;
  audio.speakWord(PARAGRAPH, { id: "p", onEnd: () => (ended += 1) });
  advance(300_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(PARAGRAPH));
  assert.equal(synth.speakCalls.length, 5, "no sentence is replayed");
  assert.equal(ended, 1);
  assertIdle();
});

scenario("a slow sentence is not cut when the engine misreports speaking=false", { voices: [voice("Samantha")], lieSpeaking: true }, (synth) => {
  audio.speakWord(LONGEST_SENTENCE, { id: "slow", rate: 0.8 });
  advance(60_000);
  assert.deepEqual(synth.spoken, [LONGEST_SENTENCE]);
  assert.equal(synth.speakCalls.length, 1, "the watchdog must not restart or skip a sentence that is still being spoken");
});

scenario("a wedged engine (never starts) is recovered with another voice", {
  voices: [voice("Wedged Voice", "en-US"), voice("Good Voice", "en-GB")],
  plan: (u) => (u.voice?.name === "Wedged Voice" ? { neverStart: true } : {}),
}, (synth) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(200_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(PARAGRAPH));
  // One more try with the same voice (could be a transient engine hiccup), then the next voice.
  assert.deepEqual(synth.speakCalls.slice(0, 2).map((call) => call.voice), ["Wedged Voice", "Wedged Voice"]);
  assert.ok(synth.speakCalls.slice(2).every((call) => call.voice === "Good Voice"), "the working voice is kept for the whole passage");
  assert.equal(synth.overlapViolations, 0);
  assertIdle();
});

scenario("an idle engine that swallowed speak() is retried after 5 s, keeping the same narrator", { voices: [voice("Samantha"), voice("Daniel", "en-GB")], swallowFirst: true }, (synth) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(120_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(PARAGRAPH));
  const gap = synth.speakCalls[1].at - synth.speakCalls[0].at;
  assert.ok(gap >= 5000 && gap <= 6000, `retry after ${gap} ms`);
  assert.ok(synth.speakCalls.every((call) => call.voice === "Samantha"), "a transient hiccup must not change the narrator");
});

scenario("a voice that fails is replaced, and remembered as bad for the next run", {
  voices: [voice("Broken Voice", "en-US"), voice("Fine Voice", "en-GB")],
  plan: (u) => (u.voice?.name === "Broken Voice" ? { error: "synthesis-failed" } : {}),
}, (synth) => {
  audio.speakWord(PARAGRAPH, { id: "1" });
  advance(60_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(PARAGRAPH));
  assertIdle();

  const callsBefore = synth.speakCalls.length;
  audio.speakWord(OTHER, { id: "2" });
  assert.equal(synth.speakCalls[callsBefore].voice, "Fine Voice", "the broken voice is not chosen again");
  advance(60_000);
  assert.deepEqual(synth.spoken.slice(-3), splitIntoChunks(OTHER));
});

scenario("a voice that ends instantly without sound is treated as dead", {
  voices: [voice("Mute Voice", "en-US"), voice("Talking Voice", "en-GB")],
  plan: (u) => (u.voice?.name === "Mute Voice" ? { silentEnd: true } : {}),
}, (synth) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(60_000);
  assert.deepEqual(synth.spoken, splitIntoChunks(PARAGRAPH), "the sentences are really spoken, not silently skipped");
  assert.equal(synth.speakCalls[0].voice, "Mute Voice");
  assert.equal(synth.speakCalls[1].voice, "Talking Voice");
});

scenario("when nothing works the error appears on that button only, then clears", {
  voices: [voice("V1", "en-US"), voice("V2", "en-GB")],
  plan: () => ({ error: "synthesis-failed" }),
}, (synth) => {
  const errors = [];
  audio.speakWord("Good morning everyone.", { id: "broken-button", onError: (m) => errors.push(m) });
  advance(2_000); // all three attempts are over; the message is now visible for 7 s
  const state = audio.getState();
  assert.equal(state.isPlaying, false);
  assert.equal(state.errorId, "broken-button");
  assert.ok(typeof state.error === "string" && state.error.length > 0);
  assert.equal(errors.length, 1);
  assert.equal(synth.speakCalls.length, 3, "best voice → other voice → engine default");
  advance(8_000);
  assert.equal(audio.getState().error, null);
  assert.equal(audio.getState().errorId, null);
});

scenario("a device with no English voice gets a message that says so", {
  voices: [voice("Laila", "ar-EG")],
  plan: () => ({ error: "synthesis-failed" }),
}, () => {
  audio.speakWord("Good morning.", { id: "no-english" });
  advance(2_000);
  assert.ok(audio.getState().error?.includes("إنجليزي"));
});

scenario("'not-allowed' is reported at once, without pointless retries", {
  voices: [voice("Samantha")],
  plan: () => ({ error: "not-allowed" }),
}, (synth) => {
  audio.speakWord("Good morning.", { id: "blocked" });
  advance(2_000);
  assert.equal(synth.speakCalls.length, 1);
  assert.ok(audio.getState().error?.includes("منع المتصفح"));
});

scenario("a paused engine is resumed, otherwise it queues speech and never plays it", { voices: [voice("Samantha")], paused: true }, (synth) => {
  audio.speakWord("Good morning everyone.", { id: "paused" });
  advance(10_000);
  assert.ok(synth.resumeCalls >= 1);
  assert.deepEqual(synth.spoken, ["Good morning everyone."]);
});

scenario("the rate is passed through, clamped to what phones accept", { voices: [voice("Samantha")] }, (synth) => {
  audio.speakWord("Slow one.", { id: "r1", rate: 0.8 });
  advance(5_000);
  audio.speakWord("Broken rate one.", { id: "r2", rate: Number.NaN });
  advance(5_000);
  audio.speakWord("Crazy rate one.", { id: "r3", rate: 9 });
  advance(5_000);
  assert.deepEqual(synth.speakCalls.map((c) => c.rate), [0.8, 1, 2]);
});

// ─── 5. Page lifecycle ───────────────────────────────────────────────────────

scenario("leaving the page (pagehide) stops the speech and clears the button", { voices: [voice("Samantha")] }, (synth) => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(500);
  windowListeners.pagehide();
  assertIdle();
  advance(60_000);
  assert.deepEqual(synth.spoken, []);
});

scenario("sending the tab to the background stops speech on a phone", { voices: [voice("Samantha")] }, () => {
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(500);
  document.visibilityState = "hidden";
  documentListeners.visibilitychange();
  document.visibilityState = "visible";
  assertIdle();
});

scenario("...but a desktop tab keeps talking in the background", { voices: [voice("Samantha")] }, () => {
  setMobile(false);
  audio.speakWord(PARAGRAPH, { id: "p" });
  advance(500);
  document.visibilityState = "hidden";
  documentListeners.visibilitychange();
  document.visibilityState = "visible";
  assert.equal(audio.getState().isPlaying, true);
});
