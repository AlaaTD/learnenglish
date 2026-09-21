// Microsoft Edge text-to-speech, generated on our server.
//
// Why on the server: the Edge "Read Aloud" service is reached over a WebSocket that a browser is
// not allowed to open (it needs headers and a signed token a page cannot send). So the phone asks
// our /api/tts route for an MP3 and plays it in a normal <audio> element.
//
// Facts this file is built around:
//  - It is an unofficial use of the service the Edge browser itself uses: no API key, no SLA.
//    Microsoft can (and sometimes does) answer 401/403 or nothing at all. Every failure is
//    reported as a TtsUpstreamError so the client can fall back to the device voice.
//  - The library puts the text into an SSML template WITHOUT escaping it, so the text is
//    XML-escaped here. The client is never trusted.
//  - Output is MP3 on purpose: iOS Safari cannot be relied on for WebM/Opus.
//  - Lesson text is fixed and repeated, so results are cached (memory, then the OS temp dir,
//    which is also the only writable place on serverless hosts) and identical requests that
//    arrive together share one call to Microsoft.
//  - Concurrency is capped: hammering the service from one IP is what gets it blocked.
//
// Written without runtime dependencies on Next.js so it can be tested in plain Node.

import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ─── Tunables ────────────────────────────────────────────────────────────────

/** A clear, neutral American voice — the flagship Edge voice, stable for years. */
export const VOICE_NAME = "en-US-AriaNeural";
/** Longest text accepted in one request. The longest lesson dialogue today is 723 characters. */
export const MAX_TEXT_CHARS = 1500;
export const MIN_RATE = 0.5;
export const MAX_RATE = 2;

const MEMORY_CACHE_BYTES = 24 * 1024 * 1024;
/** Stops the temp dir from growing without limit if someone requests endless different texts. */
const DISK_BUDGET_BYTES = 256 * 1024 * 1024;
const MAX_CONCURRENT_SYNTHESES = 3;
const MIN_MP3_BYTES = 256;
/** Everything (both attempts) must finish inside the route's maxDuration of 30 s. */
const TOTAL_BUDGET_MS = 27_000;
const RETRY_ONLY_IF_FASTER_THAN_MS = 10_000;

// ─── Errors ──────────────────────────────────────────────────────────────────

/** The request itself is wrong (empty / too long). Maps to HTTP 400. */
export class TtsInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TtsInputError";
  }
}

/** Microsoft did not give us usable audio. Maps to HTTP 502. */
export class TtsUpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TtsUpstreamError";
  }
}

// ─── Text and rate ───────────────────────────────────────────────────────────

/** Drops control characters (invalid in XML, so Microsoft would reject the whole request). */
export function sanitizeText(raw: string): string {
  return raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFE\uFFFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 0.8 → "-20%", 1 → "+0%", 1.25 → "+25%". Rounded to 5 % so nearly-equal rates share a cache entry. */
export function ratePercent(rate: unknown): string {
  const value = typeof rate === "number" && Number.isFinite(rate) ? rate : 1;
  const clamped = Math.min(MAX_RATE, Math.max(MIN_RATE, value));
  const percent = Math.round(((clamped - 1) * 100) / 5) * 5;
  return `${percent >= 0 ? "+" : ""}${percent}%`;
}

/** MP3 starts with an ID3 tag or a frame-sync (0xFFEx). Guards against caching an error page as audio. */
export function looksLikeMp3(bytes: Uint8Array): boolean {
  if (bytes.byteLength < MIN_MP3_BYTES) return false;
  const isId3 = bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33;
  const isFrameSync = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
  return isId3 || isFrameSync;
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function createLimiter(max: number) {
  let active = 0;
  const waiters: Array<() => void> = [];

  return async function run<T>(task: () => Promise<T>): Promise<T> {
    if (active < max) active += 1;
    else await new Promise<void>((resolve) => waiters.push(resolve)); // the slot is handed over below

    try {
      return await task();
    } finally {
      const next = waiters.shift();
      if (next) next();
      else active -= 1;
    }
  };
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string, onTimeout?: () => void): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      try {
        onTimeout?.();
      } catch {
        // Closing an already-dead socket is fine.
      }
      reject(new TtsUpstreamError(message));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

// ─── The Microsoft call ──────────────────────────────────────────────────────

export interface SynthesizeInput {
  /** Already sanitized, NOT yet XML-escaped. */
  text: string;
  /** SSML rate, e.g. "-20%". */
  rate: string;
  timeoutMs: number;
}

export type SynthesizeFn = (input: SynthesizeInput) => Promise<Uint8Array>;

/** One fresh connection per call: a reused socket is what goes stale and returns silence. */
export const synthesizeWithEdge: SynthesizeFn = async ({ text, rate, timeoutMs }) => {
  // Loaded lazily so tests (and any code path that never speaks) do not pull in the WebSocket stack.
  const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");
  const tts = new MsEdgeTTS();
  const close = () => {
    try {
      tts.close();
    } catch {
      // Already closed.
    }
  };

  try {
    const work = (async () => {
      await tts.setMetadata(VOICE_NAME, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(escapeXml(text), { rate });

      return await new Promise<Uint8Array>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        let settled = false;
        const settle = (action: () => void) => {
          if (settled) return;
          settled = true;
          action();
        };

        audioStream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
        audioStream.on("error", (error: Error) => settle(() => reject(error)));
        const finish = () =>
          settle(() => {
            const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
            const merged = new Uint8Array(total);
            let offset = 0;
            for (const chunk of chunks) {
              merged.set(chunk, offset);
              offset += chunk.byteLength;
            }
            resolve(merged);
          });
        audioStream.on("end", finish);
        audioStream.on("close", finish);
      });
    })();

    return await withTimeout(work, timeoutMs, "Microsoft TTS timed out", close);
  } finally {
    close();
  }
};

// ─── The service (cache + dedupe + limits) ───────────────────────────────────

export interface TtsServiceOptions {
  synthesize?: SynthesizeFn;
  /** Folder for the disk cache; `null` turns the disk cache off. Defaults to a folder in the OS temp dir. */
  cacheDir?: string | null;
  memoryBytes?: number;
  diskBudgetBytes?: number;
  maxConcurrent?: number;
}

export interface TtsService {
  /** MP3 bytes for `text` at `rate` (a multiplier: 1 = normal, 0.8 = slow). */
  getAudio(text: string, rate: number): Promise<Uint8Array>;
  stats(): { memoryEntries: number; memoryBytes: number; inFlight: number; upstreamCalls: number };
}

export function createTtsService(options: TtsServiceOptions = {}): TtsService {
  const synthesize = options.synthesize ?? synthesizeWithEdge;
  const cacheDir = options.cacheDir === undefined ? join(tmpdir(), "english90-tts") : options.cacheDir;
  const memoryLimit = options.memoryBytes ?? MEMORY_CACHE_BYTES;
  const diskBudget = options.diskBudgetBytes ?? DISK_BUDGET_BYTES;
  const limit = createLimiter(options.maxConcurrent ?? MAX_CONCURRENT_SYNTHESES);

  // Map keeps insertion order; re-inserting on a hit makes it an LRU.
  const memory = new Map<string, Uint8Array>();
  let memoryBytes = 0;
  const inFlight = new Map<string, Promise<Uint8Array>>();
  let diskBytesWritten = 0;
  let upstreamCalls = 0;

  function remember(key: string, bytes: Uint8Array) {
    const previous = memory.get(key);
    if (previous) memoryBytes -= previous.byteLength;
    memory.delete(key);
    memory.set(key, bytes);
    memoryBytes += bytes.byteLength;

    for (const [oldKey, oldBytes] of memory) {
      if (memoryBytes <= memoryLimit || oldKey === key) break;
      memory.delete(oldKey);
      memoryBytes -= oldBytes.byteLength;
    }
  }

  function diskPath(key: string): string | null {
    return cacheDir ? join(cacheDir, `${key}.mp3`) : null;
  }

  async function readFromDisk(key: string): Promise<Uint8Array | null> {
    const file = diskPath(key);
    if (!file) return null;
    try {
      const bytes = new Uint8Array(await readFile(file));
      return looksLikeMp3(bytes) ? bytes : null;
    } catch {
      return null;
    }
  }

  async function writeToDisk(key: string, bytes: Uint8Array) {
    const file = diskPath(key);
    if (!file || !cacheDir || diskBytesWritten + bytes.byteLength > diskBudget) return;
    try {
      await mkdir(cacheDir, { recursive: true });
      // Write then rename: a reader never sees a half-written file.
      const temporary = `${file}.${process.pid}.${randomBytes(4).toString("hex")}.tmp`;
      await writeFile(temporary, bytes);
      await rename(temporary, file);
      diskBytesWritten += bytes.byteLength;
    } catch {
      // The cache is an optimisation; a read-only or full disk must never fail a request.
    }
  }

  async function fetchFromMicrosoft(text: string, rate: string): Promise<Uint8Array> {
    const started = Date.now();
    let lastMessage = "unknown error";

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const remaining = TOTAL_BUDGET_MS - (Date.now() - started);
      if (remaining < 3000) break;
      const timeoutMs = Math.min(remaining, 20_000, 7000 + text.length * 10);

      try {
        upstreamCalls += 1;
        const bytes = await synthesize({ text, rate, timeoutMs });
        if (!looksLikeMp3(bytes)) throw new TtsUpstreamError("Microsoft TTS returned no usable audio");
        return bytes;
      } catch (error) {
        lastMessage = error instanceof Error ? error.message : String(error);
        // A second try only makes sense if the first failed quickly (a dropped socket, a 401 blip).
        if (Date.now() - started > RETRY_ONLY_IF_FASTER_THAN_MS) break;
      }
    }

    throw new TtsUpstreamError(`Microsoft TTS failed: ${lastMessage}`);
  }

  async function getAudio(rawText: string, rate: number): Promise<Uint8Array> {
    const text = sanitizeText(typeof rawText === "string" ? rawText : "");
    if (!text) throw new TtsInputError("Text is empty");
    if (text.length > MAX_TEXT_CHARS) throw new TtsInputError(`Text is longer than ${MAX_TEXT_CHARS} characters`);

    const ssmlRate = ratePercent(rate);
    const key = createHash("sha1").update(`${VOICE_NAME}\n${ssmlRate}\n${text}`).digest("hex");

    const cached = memory.get(key);
    if (cached) {
      remember(key, cached);
      return cached;
    }

    const pending = inFlight.get(key);
    if (pending) return pending;

    const job = (async () => {
      const onDisk = await readFromDisk(key);
      if (onDisk) {
        remember(key, onDisk);
        return onDisk;
      }
      const bytes = await limit(() => fetchFromMicrosoft(text, ssmlRate));
      remember(key, bytes);
      void writeToDisk(key, bytes);
      return bytes;
    })();

    inFlight.set(key, job);
    try {
      return await job;
    } finally {
      inFlight.delete(key);
    }
  }

  return {
    getAudio,
    stats: () => ({ memoryEntries: memory.size, memoryBytes, inFlight: inFlight.size, upstreamCalls }),
  };
}

/** The instance the route uses. Kept on globalThis so dev hot-reloads do not throw the cache away. */
const globalForTts = globalThis as unknown as { english90Tts?: TtsService };

export function getTtsService(): TtsService {
  if (!globalForTts.english90Tts) globalForTts.english90Tts = createTtsService();
  return globalForTts.english90Tts;
}
