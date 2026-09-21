"use client";

import { useEffect } from "react";
import { audio } from "@/lib/audio";
import type { AudioProvider } from "@/lib/audio-provider";

/**
 * Hands the learner's saved voice choice (Settings → Voice) to the listening engine.
 * Renders nothing. Saving the settings re-renders the layout, so a change applies at once.
 */
export function AudioConfig({ provider }: { provider: AudioProvider }) {
  useEffect(() => {
    audio.setProvider(provider);
  }, [provider]);

  return null;
}
