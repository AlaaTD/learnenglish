"use client";

import { useState, useTransition } from "react";
import { markAllDayVocabularyLearnedAction, resetAllDayVocabularyAction } from "@/actions/day";

export function MasterVocabularyButton({
  dayNumber,
  totalWords,
  learnedCount,
}: {
  dayNumber: number;
  totalWords: number;
  learnedCount: number;
}) {
  const [pending, start] = useTransition();
  const allLearned = learnedCount >= totalWords && totalWords > 0;
  const [isAllLearned, setIsAllLearned] = useState(allLearned);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Day {dayNumber} Vocabulary
          </h2>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {totalWords} Words
          </span>
        </div>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {isAllLearned
            ? "All words are saved as learned in your personal profile."
            : "Review the words below, then mark all as learned when you are ready."}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {isAllLearned ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs">
              ✓ All {totalWords} Words Learned
            </span>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                start(async () => {
                  await resetAllDayVocabularyAction(dayNumber);
                  setIsAllLearned(false);
                });
              }}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              {pending ? "Updating…" : "Reset"}
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              start(async () => {
                await markAllDayVocabularyLearnedAction(dayNumber);
                setIsAllLearned(true);
              });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <span>{pending ? "Saving Words…" : `Mark All ${totalWords} Words as Learned ✓`}</span>
          </button>
        )}
      </div>
    </div>
  );
}
