"use client";

import { useState, useTransition } from "react";
import { completeDayAction } from "@/actions/day";

const btn =
  "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold tracking-wide transition-all shadow-xs disabled:opacity-60";
const btnDone = `${btn} border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`;

export function CompleteDayButton({
  dayNumber,
  ready: _ready,
  completed,
  nextDay,
}: {
  dayNumber: number;
  ready: boolean;
  completed: boolean;
  nextDay: number | null;
}) {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (isCompleted) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className={btnDone}>Day {dayNumber} completed ✓</span>
        {nextDay && nextDay <= 90 ? (
          <a href={`/day/${nextDay}`} className={`${btn} border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700`}>
            Continue to Day {nextDay} →
          </a>
        ) : (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            You finished the 90-day journey. Celebrate — and keep reviewing.
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        className={`${btn} border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700`}
        onClick={() =>
          start(async () => {
            setError(null);
            try {
              await completeDayAction(dayNumber);
              setIsCompleted(true);
            } catch {
              setError("Could not complete the day. Please try again.");
            }
          })
        }
      >
        {pending ? "Saving…" : "Complete Day ✓"}
      </button>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Click to complete Day {dayNumber}. You can return and review everything anytime.
      </span>
      {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
