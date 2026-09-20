"use client";

import { useSyncExternalStore } from "react";
import { audio } from "@/lib/audio";

export function AudioButton({
  text,
  id,
  rate = 1,
  small = false,
  label,
}: {
  text: string;
  id?: string;
  rate?: number;
  small?: boolean;
  label?: string;
}) {
  const audioState = useSyncExternalStore(
    audio.subscribe,
    audio.getState,
    audio.getServerState,
  );

  const targetId = id ?? text.trim();
  const isPlaying =
    audioState.isPlaying &&
    (audioState.activeId === targetId || audioState.activeText === text.trim());

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isPlaying) {
      audio.stop();
    } else {
      audio.speakWord(text, {
        id: targetId,
        rate,
      });
    }
  }

  const defaultLabel = isPlaying ? "إيقاف الاستماع (Stop)" : "استمع للنطق (Listen)";
  const ariaLabel = label ?? defaultLabel;

  return (
    <span className="inline-flex flex-col items-start gap-0.5 shrink-0">
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        title={isPlaying ? "اضغط للإيقاف الفوري · Click to stop" : ariaLabel}
        className={
          small
            ? `relative inline-flex h-8 w-8 items-center justify-center rounded-xl transition-all cursor-pointer ${
                isPlaying
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105 ring-2 ring-rose-400/60"
                  : "text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105 dark:text-zinc-400 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
              }`
            : `relative inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                isPlaying
                  ? "border-rose-500/80 bg-rose-50 text-rose-700 shadow-sm ring-2 ring-rose-400/30 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
              }`
        }
      >
        {isPlaying ? (
          <>
            {/* Animated Equalizer Wave */}
            <span className="flex items-center gap-0.5 h-3.5 px-0.5">
              <span className="w-0.5 bg-current rounded-full animate-bounce [animation-delay:0ms] h-3" />
              <span className="w-0.5 bg-current rounded-full animate-bounce [animation-delay:150ms] h-2" />
              <span className="w-0.5 bg-current rounded-full animate-bounce [animation-delay:300ms] h-3.5" />
            </span>
            {!small && (
              <span className="font-bold flex items-center gap-1">
                <span>Stop</span>
                <span className="text-[10px] opacity-75 font-normal">إيقاف</span>
              </span>
            )}
          </>
        ) : (
          <>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={small ? "h-4 w-4" : "h-4 w-4"}
            >
              <path d="M9.383 3.076A1 1 0 0 1 10 4v12a1 1 0 0 1-1.707.707L4.586 13H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.586l3.707-3.707a1 1 0 0 1 1.09-.217Z" />
              <path d="M13.293 6.293a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.071 1 1 0 1 1-1.414-1.414 3 3 0 0 0 0-4.243 1 1 0 0 1 0-1.414Z" />
            </svg>
            {!small && (
              <span className="flex items-center gap-1">
                <span>Listen</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">استمع</span>
              </span>
            )}
          </>
        )}
      </button>
      {isPlaying && audioState.error ? (
        <span className="text-[11px] text-red-600 dark:text-red-400">{audioState.error}</span>
      ) : null}
    </span>
  );
}
