"use client";

import { useState, useTransition } from "react";
import {
  completeDayAction,
  finishVocabularySectionAction,
  markConversationViewedAction,
  markGrammarViewedAction,
  markParagraphViewedAction,
  reopenDayAction,
} from "@/actions/day";

const btn =
  "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold tracking-wide transition-all shadow-xs disabled:opacity-60";
const btnIdle = `${btn} border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/30`;
const btnDone = `${btn} border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`;

export function GrammarViewedButton({
  dayNumber,
  viewed,
}: {
  dayNumber: number;
  viewed: boolean;
}) {
  const [isViewed, setIsViewed] = useState(viewed);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={isViewed ? btnDone : btnIdle}
      aria-pressed={isViewed}
      onClick={() => {
        setIsViewed(true);
        start(async () => {
          await markGrammarViewedAction(dayNumber);
        });
      }}
    >
      <span>{isViewed ? "✓ Grammar Mastered" : "Mark Grammar as Viewed"}</span>
    </button>
  );
}

export function MarkReadButton({
  kind,
  dayNumber,
  id,
  viewed,
}: {
  kind: "conversation" | "paragraph";
  dayNumber: number;
  id: string;
  viewed: boolean;
}) {
  const [isViewed, setIsViewed] = useState(viewed);
  const [pending, start] = useTransition();
  const label = kind === "conversation" ? "Dialogue" : "Passage";
  return (
    <button
      type="button"
      disabled={pending}
      className={isViewed ? btnDone : btnIdle}
      aria-pressed={isViewed}
      onClick={() => {
        setIsViewed(true);
        start(async () => {
          if (kind === "conversation") {
            await markConversationViewedAction(dayNumber, id);
          } else {
            await markParagraphViewedAction(dayNumber, id);
          }
        });
      }}
    >
      <span>{isViewed ? `✓ ${label} Read` : `Mark ${label} as Read`}</span>
    </button>
  );
}

export function FinishVocabularyButton({
  dayNumber,
  remaining,
}: {
  dayNumber: number;
  remaining: number;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={btnIdle}
      onClick={() =>
        start(async () => {
          await finishVocabularySectionAction(dayNumber);
        })
      }
    >
      {pending
        ? "Saving…"
        : remaining > 0
          ? `Finish vocabulary section (${remaining} unopened)`
          : "Finish vocabulary section"}
    </button>
  );
}

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
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            start(async () => {
              try {
                await reopenDayAction(dayNumber);
                setIsCompleted(false);
              } catch {
                setError("Failed to reopen day.");
              }
            });
          }}
          className={`${btn} border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800`}
        >
          {pending ? "Updating…" : "Mark as In Progress (Reopen)"}
        </button>
        {nextDay && nextDay <= 90 ? (
          <a href={`/day/${nextDay}`} className={`${btn} border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700`}>
            Continue to Day {nextDay} →
          </a>
        ) : (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            You finished the 90-day journey. Celebrate — and keep reviewing.
          </span>
        )}
        <a href="/journey" className={`${btn} border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300`}>
          View 90-Day Journey
        </a>
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
