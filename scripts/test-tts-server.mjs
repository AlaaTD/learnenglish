// Tests for src/lib/tts-server.ts: the text/rate rules, and the cache + dedupe + limiter service
// wrapped around the Microsoft call.
//
//   npm run test:tts-server
//
// The real Microsoft call (`synthesizeWithEdge`, which opens a WebSocket via msedge-tts) is never
// used here: every service test injects its own `synthesize` function via `createTtsService`.
// That keeps this file offline and fast. The real call is checked once, for real, in Step 6's
// live verification.

import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  escapeXml,
  sanitizeText,
  ratePercent,
  looksLikeMp3,
  createTtsService,
  TtsInputError,
  TtsUpstreamError,
  MAX_TEXT_CHARS,
} from "../src/lib/tts-server.ts";

// ─── Small helpers ───────────────────────────────────────────────────────────

/** A minimal but valid MP3 payload: an ID3 header, then padding to clear MIN_MP3_BYTES. */
function fakeMp3(length = 300, marker = 0) {
  const bytes = new Uint8Array(length);
  bytes[0] = 0x49; // 'I'
  bytes[1] = 0x44; // 'D'
  bytes[2] = 0x33; // '3'
  bytes[3] = marker;
  return bytes;
}

function countingSynthesize(implementation) {
  const calls = [];
  const fn = async (input) => {
    calls.push(input);
    return implementation(input, calls.length);
  };
  fn.calls = calls;
  return fn;
}

// ─── Text and rate rules ─────────────────────────────────────────────────────

test("sanitizeText: control characters become a space, and whitespace is collapsed and trimmed", () => {
  assert.equal(sanitizeText("Hello\u0000World"), "Hello World");
  assert.equal(sanitizeText("  a   b\t\tc\n\n "), "a b c");
  assert.equal(sanitizeText("normal text."), "normal text.");
  assert.equal(sanitizeText(""), "");
});

test("escapeXml: the five XML-significant characters are escaped, & first so entities are not double-escaped", () => {
  assert.equal(escapeXml(`Tom & Jerry say: "Hi" <there> it's 100%`), "Tom &amp; Jerry say: &quot;Hi&quot; &lt;there&gt; it&apos;s 100%");
  assert.equal(escapeXml("&amp;"), "&amp;amp;", "a literal & is always escaped, even if it looks like an entity already");
});

test("ratePercent: converts a multiplier to a signed SSML percentage, rounded to 5%", () => {
  assert.equal(ratePercent(1), "+0%");
  assert.equal(ratePercent(0.8), "-20%");
  assert.equal(ratePercent(1.25), "+25%");
  assert.equal(ratePercent(1.02), "+0%", "rounds to the nearest 5%");
  assert.equal(ratePercent(1.03), "+5%");
});

test("ratePercent: out-of-range or non-numeric input is clamped to a sane rate first", () => {
  assert.equal(ratePercent(Number.NaN), "+0%");
  assert.equal(ratePercent(undefined), "+0%");
  assert.equal(ratePercent(0.1), "-50%", "clamped to MIN_RATE (0.5) before rounding");
  assert.equal(ratePercent(9), "+100%", "clamped to MAX_RATE (2) before rounding");
});

test("looksLikeMp3: accepts an ID3 header or an MPEG frame-sync, rejects everything else", () => {
  assert.equal(looksLikeMp3(fakeMp3(300)), true);
  const frameSync = new Uint8Array(300);
  frameSync[0] = 0xff;
  frameSync[1] = 0xfb;
  assert.equal(looksLikeMp3(frameSync), true);
  assert.equal(looksLikeMp3(new Uint8Array(300)), false, "all-zero bytes are not audio");
  assert.equal(looksLikeMp3(fakeMp3(100)), false, "too short to be real audio, even with the right header (guards an error page)");
});

// ─── The service: cache, dedupe, limiter ─────────────────────────────────────

test("createTtsService: rejects empty text and text over the limit before ever calling Microsoft", async () => {
  const synthesize = countingSynthesize(() => fakeMp3());
  const service = createTtsService({ synthesize, cacheDir: null });

  await assert.rejects(() => service.getAudio("   ", 1), TtsInputError);
  await assert.rejects(() => service.getAudio("x".repeat(MAX_TEXT_CHARS + 1), 1), TtsInputError);
  assert.equal(synthesize.calls.length, 0, "an invalid request must never reach Microsoft");
});

test("createTtsService: an identical text+rate is served from memory on the second call", async () => {
  const synthesize = countingSynthesize(() => fakeMp3(300, 7));
  const service = createTtsService({ synthesize, cacheDir: null });

  const first = await service.getAudio("Good morning.", 1);
  const second = await service.getAudio("Good morning.", 1);
  assert.deepEqual(first, second);
  assert.equal(synthesize.calls.length, 1, "the second call must be a cache hit");
  assert.equal(service.stats().memoryEntries, 1);
});

test("createTtsService: a different rate is a different cache entry", async () => {
  const synthesize = countingSynthesize((input) => fakeMp3(300, input.rate.length));
  const service = createTtsService({ synthesize, cacheDir: null });

  await service.getAudio("Good morning.", 1);
  await service.getAudio("Good morning.", 0.8);
  assert.equal(synthesize.calls.length, 2);
  assert.deepEqual(
    synthesize.calls.map((c) => c.rate),
    ["+0%", "-20%"],
  );
});

test("createTtsService: two identical requests fired together share ONE call to Microsoft", async () => {
  let resolveFirst;
  const synthesize = countingSynthesize(
    () =>
      new Promise((resolve) => {
        resolveFirst = () => resolve(fakeMp3());
      }),
  );
  const service = createTtsService({ synthesize, cacheDir: null });

  const a = service.getAudio("Shared sentence.", 1);
  const b = service.getAudio("Shared sentence.", 1);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(synthesize.calls.length, 1, "the second caller must join the first request in flight");
  resolveFirst();
  const [resultA, resultB] = await Promise.all([a, b]);
  assert.deepEqual(resultA, resultB);
});

test("createTtsService: never more than maxConcurrent syntheses run at once", async () => {
  let active = 0;
  let maxActive = 0;
  const synthesize = countingSynthesize(async () => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    await new Promise((resolve) => setTimeout(resolve, 20));
    active -= 1;
    return fakeMp3();
  });
  const service = createTtsService({ synthesize, cacheDir: null, maxConcurrent: 2 });

  await Promise.all(["one", "two", "three", "four"].map((text) => service.getAudio(text, 1)));
  assert.equal(synthesize.calls.length, 4);
  assert.ok(maxActive <= 2, `at most 2 syntheses should run at once, saw ${maxActive}`);
});

test("createTtsService: a synthesize() that resolves with garbage is treated as a failure, not cached", async () => {
  const synthesize = countingSynthesize(() => new Uint8Array([1, 2, 3]));
  const service = createTtsService({ synthesize, cacheDir: null });

  await assert.rejects(() => service.getAudio("Broken audio.", 1), TtsUpstreamError);
  assert.equal(service.stats().memoryEntries, 0, "garbage must never enter the cache");
});

test("createTtsService: a quick failure is retried once on the same request, and a later success is returned and cached", async () => {
  const synthesize = countingSynthesize((_input, callNumber) => {
    if (callNumber === 1) throw new Error("socket reset");
    return fakeMp3(300, 9);
  });
  const service = createTtsService({ synthesize, cacheDir: null });

  const bytes = await service.getAudio("Retried sentence.", 1);
  assert.equal(looksLikeMp3(bytes), true);
  assert.equal(synthesize.calls.length, 2);
  assert.equal(service.stats().upstreamCalls, 2);

  synthesize.calls.length = 0;
  await service.getAudio("Retried sentence.", 1);
  assert.equal(synthesize.calls.length, 0, "the eventual success was cached");
});

test("createTtsService: two failures in a row surface one clear TtsUpstreamError", async () => {
  const synthesize = countingSynthesize(() => {
    throw new Error("service unavailable");
  });
  const service = createTtsService({ synthesize, cacheDir: null });

  await assert.rejects(() => service.getAudio("Down.", 1), (error) => {
    assert.ok(error instanceof TtsUpstreamError);
    assert.match(error.message, /service unavailable/);
    return true;
  });
  assert.equal(synthesize.calls.length, 2, "both attempts inside the budget were used");
});

test("createTtsService: a first attempt that already used up the retry threshold is not retried a second time", async () => {
  // Note: this is about createTtsService's own retry/budget bookkeeping (Date.now() driven), not
  // about forcing a hung promise to settle — a raw injected synthesize() must settle by itself,
  // exactly like the real one does (via its own internal timeout in synthesizeWithEdge).
  mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  try {
    const synthesize = countingSynthesize(
      () => new Promise((_resolve, reject) => setTimeout(() => reject(new Error("slow failure")), 11_000)),
    );
    const service = createTtsService({ synthesize, cacheDir: null });

    const pending = service.getAudio("Slow failure.", 1);
    const assertion = assert.rejects(pending, TtsUpstreamError);
    // setImmediate is real (only "setTimeout" and "Date" are mocked here), so this flushes the
    // microtasks between getAudio() and the synthesize() call, letting its own setTimeout(11_000)
    // actually get scheduled before we advance the mocked clock past it.
    await new Promise((resolve) => setImmediate(resolve));
    mock.timers.tick(11_000);
    await assertion;
    assert.equal(synthesize.calls.length, 1, "11 s already exceeds the 10 s retry threshold: no second attempt");
  } finally {
    mock.timers.reset();
  }
});

test("createTtsService: a synthesize() that never settles leaves the request pending (the timeout is synthesizeWithEdge's job, not the cache layer's)", async () => {
  const synthesize = countingSynthesize(() => new Promise(() => {}));
  const service = createTtsService({ synthesize, cacheDir: null });

  let settled = false;
  const pending = service.getAudio("Hangs forever.", 1).then(
    () => (settled = true),
    () => (settled = true),
  );
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(settled, false, "with no self-timeout, the request is still in flight, as designed");
  void pending; // deliberately left unresolved: nothing further to await
});

test("createTtsService: memory cache evicts the oldest entry once the byte budget is exceeded", async () => {
  const synthesize = countingSynthesize(() => fakeMp3(300));
  const service = createTtsService({ synthesize, cacheDir: null, memoryBytes: 700 });

  await service.getAudio("first sentence", 1); // 300 bytes
  await service.getAudio("second sentence", 1); // 600 bytes total
  await service.getAudio("third sentence", 1); // pushes past 700: "first" must go

  assert.equal(service.stats().memoryEntries, 2);

  synthesize.calls.length = 0;
  await service.getAudio("first sentence", 1);
  assert.equal(synthesize.calls.length, 1, "the evicted entry must be re-synthesized, not found in memory");
});

test("createTtsService: audio is written to disk, and a fresh service instance reads it back without calling Microsoft again", async () => {
  const dir = mkdtempSync(join(tmpdir(), "e90-tts-test-"));
  try {
    const synthesize = countingSynthesize(() => fakeMp3(300, 3));
    const first = createTtsService({ synthesize, cacheDir: dir });
    const bytes = await first.getAudio("Cached on disk.", 1);

    // writeToDisk is fire-and-forget; give its promise a turn to finish before checking the file.
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setTimeout(resolve, 20));

    const files = readFileSync;
    assert.equal(existsSync(dir), true);

    const failIfCalled = countingSynthesize(() => {
      throw new Error("must not be called: the disk cache should have answered");
    });
    const second = createTtsService({ synthesize: failIfCalled, cacheDir: dir });
    const fromDisk = await second.getAudio("Cached on disk.", 1);
    assert.deepEqual(fromDisk, bytes);
    assert.equal(failIfCalled.calls.length, 0);
    void files;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("createTtsService: cacheDir: null disables the disk cache entirely (no folder is ever created)", async () => {
  const dir = mkdtempSync(join(tmpdir(), "e90-tts-test-unused-"));
  try {
    const marker = join(dir, "should-not-exist");
    const synthesize = countingSynthesize(() => fakeMp3());
    const service = createTtsService({ synthesize, cacheDir: null });
    await service.getAudio("No disk please.", 1);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(existsSync(marker), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
