"use client";

import { useState, useTransition } from "react";
import {
  completeDayAction,
  finishVocabularySectionAction,
  markConversationViewedAction,
  markGrammarViewedAction,
  markParagraphViewedAction,
} from "@/actions/day";

const btn =
  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60";
const btnIdle = `${btn} border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800`;
const btnDone = `${btn} border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`;

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
      {isViewed ? "Grammar viewed ✓" : "Mark Grammar as Viewed"}
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
  const label = kind === "conversation" ? "conversation" : "paragraph";
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
      {isViewed ? `${label} read ✓` : `Mark ${label} as read`}
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
  ready,
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
        disabled={!ready || pending}
        title={ready ? "Complete this day" : "View every section first — no test needed"}
        className={`${btn} ${
          ready
            ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
        }`}
        onClick={() =>
          start(async () => {
            setError(null);
            try {
              await completeDayAction(dayNumber);
              setIsCompleted(true);
            } catch {
              setError("Could not complete the day. Make sure every section is viewed, then try again.");
            }
          })
        }
      >
        {pending ? "Saving…" : "Complete Day"}
      </button>
      {!ready && (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          View the vocabulary, grammar, conversations and paragraphs to unlock completion — no test needed.
        </span>
      )}
      {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
