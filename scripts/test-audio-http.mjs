// Tests for src/lib/audio-http.ts: byte-range parsing and the 200/206/416 responses it builds.
//
//   npm run test:audio-http
//
// Pure functions on the standard Request/Response objects (no Next.js, no network), so this runs
// in plain Node. The case iOS Safari always sends first — `Range: bytes=0-1` — gets its own test,
// since that is the exact probe that decides whether Safari will play the file at all.

import test from "node:test";
import assert from "node:assert/strict";
import { parseRange, audioResponse } from "../src/lib/audio-http.ts";

// ─── parseRange ──────────────────────────────────────────────────────────────

test("parseRange: no header serves the whole file", () => {
  assert.deepEqual(parseRange(null, 1000), { kind: "full" });
});

test("parseRange: Safari's opening probe, bytes=0-1", () => {
  assert.deepEqual(parseRange("bytes=0-1", 1000), { kind: "partial", range: { start: 0, end: 1 } });
});

test("parseRange: an open-ended range serves to the end of the file", () => {
  assert.deepEqual(parseRange("bytes=500-", 1000), { kind: "partial", range: { start: 500, end: 999 } });
});

test("parseRange: a closed range in the middle", () => {
  assert.deepEqual(parseRange("bytes=100-199", 1000), { kind: "partial", range: { start: 100, end: 199 } });
});

test("parseRange: an end past the file is clamped to the last byte", () => {
  assert.deepEqual(parseRange("bytes=900-999999", 1000), { kind: "partial", range: { start: 900, end: 999 } });
});

test("parseRange: a start past the file is unsatisfiable", () => {
  assert.deepEqual(parseRange("bytes=1000-2000", 1000), { kind: "unsatisfiable" });
  assert.deepEqual(parseRange("bytes=1000-", 1000), { kind: "unsatisfiable" });
});

test("parseRange: a suffix range (\"last N bytes\")", () => {
  assert.deepEqual(parseRange("bytes=-500", 1000), { kind: "partial", range: { start: 500, end: 999 } });
});

test("parseRange: a suffix longer than the file is clamped to the whole file", () => {
  assert.deepEqual(parseRange("bytes=-5000", 1000), { kind: "partial", range: { start: 0, end: 999 } });
});

test("parseRange: a suffix of zero, or on an empty body, is unsatisfiable", () => {
  assert.deepEqual(parseRange("bytes=-0", 1000), { kind: "unsatisfiable" });
  assert.deepEqual(parseRange("bytes=-500", 0), { kind: "unsatisfiable" });
});

test("parseRange: whitespace around the numbers is tolerated, the unit is case-insensitive", () => {
  assert.deepEqual(parseRange("BYTES = 0 - 1", 1000), { kind: "partial", range: { start: 0, end: 1 } });
});

test("parseRange: an inverted range (end before start) is treated as no range at all", () => {
  assert.deepEqual(parseRange("bytes=50-10", 1000), { kind: "full" });
});

test("parseRange: an empty header value serves the whole file", () => {
  assert.deepEqual(parseRange("bytes=-", 1000), { kind: "full" });
});

test("parseRange: another unit, a multi-range request, or garbage all fall back to the whole file", () => {
  assert.deepEqual(parseRange("items=0-1", 1000), { kind: "full" });
  assert.deepEqual(parseRange("bytes=0-10,20-30", 1000), { kind: "full" });
  assert.deepEqual(parseRange("not a range", 1000), { kind: "full" });
  assert.deepEqual(parseRange("bytes=abc-def", 1000), { kind: "full" });
});

// ─── audioResponse ───────────────────────────────────────────────────────────

const OPTIONS = { contentType: "audio/mpeg", cacheControl: "public, max-age=604800" };

function bytesOf(length) {
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) out[i] = i % 256;
  return out;
}

function req(headers = {}, method = "GET") {
  return new Request("http://localhost/api/tts", { method, headers });
}

test("audioResponse: no Range header → 200 with the whole body and Accept-Ranges", async () => {
  const bytes = bytesOf(500);
  const res = audioResponse(req(), bytes, OPTIONS);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("Accept-Ranges"), "bytes");
  assert.equal(res.headers.get("Content-Length"), "500");
  assert.equal(res.headers.get("Cache-Control"), OPTIONS.cacheControl);
  assert.equal(res.headers.get("X-Content-Type-Options"), "nosniff");
  const body = new Uint8Array(await res.arrayBuffer());
  assert.deepEqual(body, bytes);
});

test("audioResponse: Safari's bytes=0-1 probe gets a proper 206 with exactly 2 bytes", async () => {
  const bytes = bytesOf(500);
  const res = audioResponse(req({ range: "bytes=0-1" }), bytes, OPTIONS);
  assert.equal(res.status, 206);
  assert.equal(res.headers.get("Content-Range"), "bytes 0-1/500");
  assert.equal(res.headers.get("Content-Length"), "2");
  const body = new Uint8Array(await res.arrayBuffer());
  assert.deepEqual(body, bytes.subarray(0, 2));
});

test("audioResponse: a mid-file range returns exactly those bytes, not the whole file", async () => {
  const bytes = bytesOf(1000);
  const res = audioResponse(req({ range: "bytes=200-299" }), bytes, OPTIONS);
  assert.equal(res.status, 206);
  assert.equal(res.headers.get("Content-Range"), "bytes 200-299/1000");
  const body = new Uint8Array(await res.arrayBuffer());
  assert.deepEqual(body, bytes.subarray(200, 300));
});

test("audioResponse: a range past the end of the file is 416, with Content-Range giving the real size", async () => {
  const bytes = bytesOf(100);
  const res = audioResponse(req({ range: "bytes=500-600" }), bytes, OPTIONS);
  assert.equal(res.status, 416);
  assert.equal(res.headers.get("Content-Range"), "bytes */100");
  assert.equal(res.headers.get("Cache-Control"), "no-store", "an error must never be cached");
  assert.equal(await res.arrayBuffer().then((b) => b.byteLength), 0);
});

test("audioResponse: HEAD returns the same headers as the matching GET, with no body", async () => {
  const bytes = bytesOf(500);

  const full = audioResponse(req({}, "HEAD"), bytes, OPTIONS);
  assert.equal(full.status, 200);
  assert.equal(full.headers.get("Content-Length"), "500");
  assert.equal(await full.arrayBuffer().then((b) => b.byteLength), 0);

  const partial = audioResponse(req({ range: "bytes=0-1" }, "HEAD"), bytes, OPTIONS);
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get("Content-Range"), "bytes 0-1/500");
  assert.equal(await partial.arrayBuffer().then((b) => b.byteLength), 0);
});

test("audioResponse: a partial response never shares memory with the cached bytes", async () => {
  const bytes = bytesOf(10);
  const res = audioResponse(req({ range: "bytes=0-4" }), bytes, OPTIONS);
  const body = new Uint8Array(await res.arrayBuffer());
  body[0] = 255;
  assert.equal(bytes[0], 0, "mutating the response body must not corrupt the cache entry");
});

test("audioResponse: an unrecognised Range header is ignored and the whole file is served", async () => {
  const bytes = bytesOf(50);
  const res = audioResponse(req({ range: "pages=1-2" }), bytes, OPTIONS);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("Content-Length"), "50");
});
