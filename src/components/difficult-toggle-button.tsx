"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleDifficultWordAction } from "@/actions/vocabulary";

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
  const [isDifficult, setIsDifficult] = useState(initialIsDifficult);
  const [pending, startTransition] = useTransition();
  const [optimisticDifficult, setOptimisticDifficult] = useOptimistic(
    isDifficult,
    (_current, next: boolean) => next,
  );

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    const next = !optimisticDifficult;
    startTransition(async () => {
      setOptimisticDifficult(next);
      try {
        const res = await toggleDifficultWordAction(vocabularyId, dayNumber);
        setIsDifficult(res.isDifficult);
      } catch {
        setOptimisticDifficult(isDifficult);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={optimisticDifficult}
      aria-label={optimisticDifficult ? "إزالة من الكلمات الصعبة" : "حفظ في الكلمات الصعبة"}
      title={optimisticDifficult ? "كلمة صعبة (اضغط للإزالة)" : "حفظ ككلمة صعبة"}
      className={`group/btn relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-60 ${
        optimisticDifficult
          ? "border border-amber-500/40 bg-amber-500/15 text-amber-600 shadow-sm hover:border-amber-500/60 hover:bg-amber-500/25 dark:bg-amber-500/20 dark:text-amber-400"
          : "border border-zinc-200 bg-zinc-50/80 text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400 dark:hover:border-amber-700/60 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
      } ${className}`.trim()}
    >
      <svg
        className={`h-4 w-4 transition-transform duration-150 group-hover/btn:scale-110 ${
          optimisticDifficult ? "fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" : "fill-none"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {showLabel ? (
        <span>{optimisticDifficult ? "كلمة صعبة" : "حفظ كصعبة"}</span>
      ) : (
        optimisticDifficult && <span className="text-[11px] font-semibold">صعبة</span>
      )}
    </button>
  );
}
