"use client";

import { useState } from "react";
import { audio } from "@/lib/audio";

export function AudioButton({
  text,
  rate = 1,
  small = false,
  label,
}: {
  text: string;
  rate?: number;
  small?: boolean;
  label?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    setError(null);
    setPlaying(true);
    audio.speakWord(text, {
      rate,
      onError: (message) => {
        setError(message);
        setPlaying(false);
      },
    });
    setTimeout(() => setPlaying(false), Math.min(8000, Math.max(1200, text.length * 75)));
  }

  return (
    <span className="inline-flex flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={play}
        aria-label={label ?? `Listen to ${text}`}
        title={label ?? `Listen to ${text}`}
        className={
          small
            ? `inline-flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                playing
                  ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50 scale-105"
                  : "text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
              }`
            : `inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all ${
                playing
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
              }`
        }
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`${small ? "h-3.5 w-3.5" : "h-4 w-4"} ${playing ? "animate-pulse" : ""}`}
        >
          <path d="M9.383 3.076A1 1 0 0 1 10 4v12a1 1 0 0 1-1.707.707L4.586 13H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.586l3.707-3.707a1 1 0 0 1 1.09-.217Z" />
          <path d="M13.293 6.293a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.071 1 1 0 1 1-1.414-1.414 3 3 0 0 0 0-4.243 1 1 0 0 1 0-1.414Z" />
        </svg>
        {!small && <span>{playing ? "Playing…" : "Listen"}</span>}
      </button>
      {error ? <span className="text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </span>
  );
}
