import type { NextRequest } from "next/server";
import { audioResponse } from "@/lib/audio-http";
import { MAX_TEXT_CHARS, TtsInputError, TtsUpstreamError, getTtsService } from "@/lib/tts-server";

// GET /api/tts?text=Hello&rate=0.8  →  an MP3 of Microsoft's Edge voice.
//
// It is a GET on purpose: the browser's <audio> element can then load it directly, so the
// `play()` call stays inside the user's tap — iOS refuses audio that starts after an `await`.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Room for two Microsoft attempts (see TOTAL_BUDGET_MS in tts-server). */
export const maxDuration = 30;

/** The URL fully decides the audio, so browsers may keep it. Errors are never cached. */
const AUDIO_CACHE_CONTROL = "public, max-age=604800";

function errorResponse(status: number, message: string): Response {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

async function handle(request: NextRequest): Promise<Response> {
  // Light guard for a public endpoint that spends someone else's service: every page visit
  // already sets this cookie (see proxy.ts), so a real learner always has it.
  const session = request.cookies.get("e90_user_id")?.value;
  if (!session || session.length > 64) return errorResponse(401, "Open the app first.");

  const params = request.nextUrl.searchParams;
  const text = params.get("text") ?? "";
  if (text.length > MAX_TEXT_CHARS * 2) return errorResponse(400, "Text is too long.");

  const rateParam = params.get("rate");
  const rate = rateParam === null ? 1 : Number(rateParam);

  try {
    const bytes = await getTtsService().getAudio(text, rate);
    return audioResponse(request, bytes, { contentType: "audio/mpeg", cacheControl: AUDIO_CACHE_CONTROL });
  } catch (error) {
    if (error instanceof TtsInputError) return errorResponse(400, error.message);

    // Never log the text itself, only what is needed to see why Microsoft said no.
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[tts] failed (${text.length} chars): ${reason}`);
    return errorResponse(error instanceof TtsUpstreamError ? 502 : 500, "The voice service is unavailable right now.");
  }
}

export const GET = handle;
export const HEAD = handle;
