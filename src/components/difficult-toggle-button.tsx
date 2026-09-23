"use client";

import { useEffect, useState, useTransition } from "react";
import { setDifficultWordAction } from "@/actions/vocabulary";

const SAVE_FAILED = "لم تُحفظ الكلمة. تأكد من الاتصال ثم حاول مرة أخرى.";

/**
 * The star that saves a word to the learner's difficult words.
 *
 * - The star changes the moment it is tapped, and the request carries the state that was asked for
 *   ("save" / "remove"), never "flip whatever is stored", so it cannot end up inverted.
 * - If the save fails the star goes back to what is really stored and the button says so. Nothing is
 *   swallowed silently: a word that looks saved but is not was the original problem.
 * - When the server sends fresh data for this word (after a revalidation, or because another button
 *   for the same word on the page was tapped) the star follows it.
 */
export function DifficultToggleButton({
  vocabularyId,
  dayNumber,
  initialIsDifficult = false,
  showLabel = false,
  className = "",
}: {
  vocabularyId: string;
  dayNumber?: number | null;
  initialIsDifficult?: boolean;
  showLabel?: boolean;
  className?: string;
}) {
  // What the learner sees right now.
  const [isDifficult, setIsDifficult] = useState(initialIsDifficult);
  // The value the server last rendered into this component; used to notice when it sends a new one.
  const [serverValue, setServerValue] = useState(initialIsDifficult);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (initialIsDifficult !== serverValue) {
    setServerValue(initialIsDifficult);
    setIsDifficult(initialIsDifficult);
  }

  // The failure message is a hint, not a permanent state: it fades after a few seconds.
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  function toggle(e: React.MouseEvent) {
    // The star sits inside a card that expands when clicked: tapping it must not also do that.
    e.stopPropagation();
    e.preventDefault();
    if (pending) return;

    const wanted = !isDifficult;
    setIsDifficult(wanted);
    setError(null);

    startTransition(async () => {
      try {
        const saved = await setDifficultWordAction(vocabularyId, dayNumber ?? null, wanted);
        setIsDifficult(saved.isDifficult);
      } catch (err) {
        setIsDifficult(!wanted);
        // Only ever show a specific, developer-authored message (marked "STALE_VOCAB:"); any other
        // error — including raw server/network failures — still falls back to the generic message.
        const marker = "STALE_VOCAB:";
        const specific =
          err instanceof Error && err.message.startsWith(marker)
            ? err.message.slice(marker.length).trim()
            : null;
        setError(specific ?? SAVE_FAILED);
      }
    });
  }

  const tone = error
    ? "border border-rose-500/50 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
    : isDifficult
      ? "border border-amber-500/40 bg-amber-500/15 text-amber-600 shadow-sm hover:border-amber-500/60 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400"
      : "border border-zinc-200 bg-zinc-50/80 text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:border-amber-700/60 dark:hover:bg-amber-950/30 dark:hover:text-amber-300";

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        // aria-disabled (not `disabled`) so a tap while saving is still swallowed here instead of
        // falling through to the card underneath.
        aria-disabled={pending}
        aria-busy={pending}
        aria-pressed={isDifficult}
        aria-label={isDifficult ? "إزالة من الكلمات الصعبة" : "حفظ في الكلمات الصعبة"}
        title={error ?? (isDifficult ? "كلمة صعبة (اضغط للإزالة)" : "حفظ ككلمة صعبة")}
        className={`group/btn relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 aria-disabled:opacity-60 ${tone} ${className}`.trim()}
      >
        <svg
          className={`h-4 w-4 transition-transform duration-150 group-hover/btn:scale-110 ${
            isDifficult ? "fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" : "fill-none"
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        {error ? (
          <span className="text-[11px] font-semibold">لم تُحفظ</span>
        ) : showLabel ? (
          <span>{isDifficult ? "كلمة صعبة" : "حفظ كصعبة"}</span>
        ) : (
          isDifficult && <span className="text-[11px] font-semibold">صعبة</span>
        )}
      </button>
      {/* Read out by screen readers when a save fails; takes no room in the layout. */}
      <span role="status" aria-live="polite" className="sr-only">
        {error ?? ""}
      </span>
    </>
  );
}
