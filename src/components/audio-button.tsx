"use client";

import { useEffect, useSyncExternalStore } from "react";
import { audio } from "@/lib/audio";
import { buttonClass } from "./ui";

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
  // Match by id only: two buttons with identical text must not both light up.
  const isPlaying = audioState.isPlaying && audioState.activeId === targetId;
  const errorMessage = audioState.errorId === targetId ? audioState.error : null;

  // Warm the voice list up before the first tap (phones load it lazily).
  useEffect(() => {
    audio.init();
  }, []);

  // Leaving the page (or this button going away) must not leave speech running.
  useEffect(() => {
    return () => {
      const state = audio.getState();
      if (state.isPlaying && state.activeId === targetId) audio.stop();
    };
  }, [targetId]);

  function handleClick(e: React.MouseEvent) {
    // Cards are clickable; playing audio must not toggle them
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

  const className = small
    ? `inline-flex h-9 w-9 touch-manipulation items-center justify-center rounded-xl transition-colors ${
        isPlaying
          ? "bg-brand-600 text-white hover:bg-brand-700"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-brand-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-brand-300"
      }`
    : buttonClass(isPlaying ? "primary" : "secondary", "md", "px-3.5 touch-manipulation");

  return (
    <span className="inline-flex shrink-0 flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        title={isPlaying ? "اضغط للإيقاف الفوري · Click to stop" : ariaLabel}
        className={className}
      >
        {isPlaying ? (
          <>
            {/* Gentle "playing" indicator */}
            <span aria-hidden="true" className="flex h-3.5 items-center gap-0.5 px-0.5">
              <span className="h-3 w-0.5 animate-pulse rounded-full bg-current [animation-delay:0ms]" />
              <span className="h-2 w-0.5 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
              <span className="h-3.5 w-0.5 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
            </span>
            {!small && (
              <span className="flex items-center gap-1.5">
                <span>Stop</span>
                <span className="text-xs font-normal opacity-80">إيقاف</span>
              </span>
            )}
          </>
        ) : (
          <>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M9.383 3.076A1 1 0 0 1 10 4v12a1 1 0 0 1-1.707.707L4.586 13H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.586l3.707-3.707a1 1 0 0 1 1.09-.217Z" />
              <path d="M13.293 6.293a1 1 0 0 1 1.414 0 5 5 0 0 1 0 7.071 1 1 0 1 1-1.414-1.414 3 3 0 0 0 0-4.243 1 1 0 0 1 0-1.414Z" />
            </svg>
            {!small && (
              <span className="flex items-center gap-1.5">
                <span>Listen</span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">استمع</span>
              </span>
            )}
          </>
        )}
      </button>
      {/* Shown only on the button that failed, and only for a few seconds */}
      {errorMessage ? (
        <span
          role="alert"
          dir="rtl"
          lang="ar"
          className="max-w-[14rem] text-xs leading-snug text-rose-700 dark:text-rose-300"
        >
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
