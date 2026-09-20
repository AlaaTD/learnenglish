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

  function play() {
    setError(null);
    audio.speakWord(text, {
      rate,
      onError: (message) => setError(message),
    });
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
            ? "inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-indigo-400"
            : "inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={small ? "h-4 w-4" : "h-4 w-4"}>
          <path d="M9.383 3.076A1 1 0 0 1 10 4v12a1 1 0 0 1-1.707.707L4.586 13H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.586l3.707-3.707a1 1 0 0 1 1.09-.217Z" />
          <path d="M13.293 6.293a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.071 1 1 0 1 1-1.414-1.414 3 3 0 0 0 0-4.243 1 1 0 0 1 0-1.414Z" />
        </svg>
        {!small && <span>Listen</span>}
      </button>
      {error ? <span className="text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </span>
  );
}
