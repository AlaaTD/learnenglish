// Serves an audio file that is already in memory the way phones need it.
//
// iOS Safari will not play an <audio> source unless the server understands byte-range requests:
// it first asks for `Range: bytes=0-1`, then for the rest, and refuses the file if the answer is
// not a proper `206 Partial Content` with `Content-Range`. Android Chrome also uses ranges to
// seek and to resume a stalled download. A plain `200` with no `Accept-Ranges` works on desktop
// and silently fails on iPhone, which is exactly the kind of bug that never shows up in testing.
//
// Pure functions on Request/Response — no Next.js imports — so they can be tested in Node.

export interface ByteRange {
  /** First byte, inclusive. */
  start: number;
  /** Last byte, inclusive. */
  end: number;
}

export type RangeResult =
  | { kind: "full" }
  | { kind: "partial"; range: ByteRange }
  | { kind: "unsatisfiable" };

/**
 * Reads a `Range` header for a body of `size` bytes (RFC 9110 §14).
 * Anything malformed, in another unit, or asking for several ranges is ignored (served in full):
 * that is what the RFC says a server may do, and no phone sends multi-range requests.
 */
export function parseRange(header: string | null, size: number): RangeResult {
  if (!header) return { kind: "full" };

  const match = /^\s*bytes\s*=\s*(\d*)\s*-\s*(\d*)\s*$/i.exec(header);
  if (!match) return { kind: "full" };

  const [, first, last] = match;
  if (first === "" && last === "") return { kind: "full" };

  if (first === "") {
    // "bytes=-500": the last 500 bytes.
    const suffix = Number(last);
    if (!Number.isSafeInteger(suffix) || suffix <= 0 || size === 0) return { kind: "unsatisfiable" };
    return { kind: "partial", range: { start: Math.max(0, size - suffix), end: size - 1 } };
  }

  const start = Number(first);
  if (!Number.isSafeInteger(start)) return { kind: "full" };

  let end = size - 1;
  if (last !== "") {
    const requestedEnd = Number(last);
    if (!Number.isSafeInteger(requestedEnd) || requestedEnd < start) return { kind: "full" };
    end = Math.min(requestedEnd, size - 1);
  }

  if (start >= size) return { kind: "unsatisfiable" };
  return { kind: "partial", range: { start, end } };
}

export interface AudioResponseOptions {
  contentType: string;
  /** Sent with successful (200/206) responses only; errors are never cacheable. */
  cacheControl: string;
}

/** 200 / 206 / 416 for GET, and the same headers without a body for HEAD. */
export function audioResponse(request: Request, bytes: Uint8Array, options: AudioResponseOptions): Response {
  const size = bytes.byteLength;
  const isHead = request.method === "HEAD";
  const result = parseRange(request.headers.get("range"), size);

  const baseHeaders: Record<string, string> = {
    "Content-Type": options.contentType,
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
  };

  if (result.kind === "unsatisfiable") {
    return new Response(null, {
      status: 416,
      headers: { ...baseHeaders, "Content-Range": `bytes */${size}`, "Cache-Control": "no-store" },
    });
  }

  if (result.kind === "partial") {
    const { start, end } = result.range;
    const length = end - start + 1;
    return new Response(isHead ? null : toBody(bytes.subarray(start, end + 1)), {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Length": String(length),
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Cache-Control": options.cacheControl,
      },
    });
  }

  return new Response(isHead ? null : toBody(bytes), {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(size), "Cache-Control": options.cacheControl },
  });
}

/** Copies into a plain ArrayBuffer-backed view: always a valid `BodyInit`, never shares memory with the cache. */
function toBody(view: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(view.byteLength);
  copy.set(view);
  return copy;
}
