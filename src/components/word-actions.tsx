"use client";

import { useOptimistic, useState, useTransition } from "react";
import {
  addWordToReviewAction,
  markWordLearnedAction,
  markWordMasteredAction,
  moveWordToLearningAction,
  removeWordFromReviewAction,
  setWordUsedAction,
} from "@/actions/vocabulary";
import type { VocabularyState } from "@/lib/states";

export type WordStateInfo = {
  state: VocabularyState;
  usedInConversation: boolean;
};

const btn =
  "inline-flex items-center rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50";
const btnDefault =
  "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";
const btnPrimary =
  "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500";
const btnActive =
  "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";

export function WordActions({
  vocabularyId,
  dayNumber,
  initialState,
  compact = false,
}: {
  vocabularyId: string;
  dayNumber: number | null;
  initialState: WordStateInfo;
  compact?: boolean;
}) {
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();
  const [stateInfo, setStateInfo] = useOptimistic(
    state,
    (_current: WordStateInfo, next: WordStateInfo) => next,
  );
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<WordStateInfo>, optimistic: WordStateInfo) {
    setError(null);
    startTransition(async () => {
      setStateInfo(optimistic);
      try {
        const next = await action();
        setState(next);
        setStateInfo(next);
      } catch {
        setError("Something went wrong. Please try again.");
        setStateInfo(state);
      }
    });
  }

  const s = stateInfo.state;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {s === "UNLEARNED" && (
        <button
          type="button"
          disabled={pending}
          className={`${btn} ${btnPrimary}`}
          onClick={() =>
            run(
              () => markWordLearnedAction(vocabularyId, dayNumber),
              { ...stateInfo, state: "LEARNING" },
            )
          }
        >
          Mark as Learned
        </button>
      )}
      {s === "LEARNING" && (
        <button
          type="button"
          disabled={pending}
          className={`${btn} ${btnDefault}`}
          onClick={() =>
            run(() => addWordToReviewAction(vocabularyId, dayNumber), {
              ...stateInfo,
              state: "REVIEW",
            })
          }
        >
          Add to Review
        </button>
      )}
      {s === "REVIEW" && (
        <button
          type="button"
          disabled={pending}
          className={`${btn} ${btnDefault}`}
          onClick={() =>
            run(() => removeWordFromReviewAction(vocabularyId, dayNumber), {
              ...stateInfo,
              state: "LEARNING",
            })
          }
        >
          Remove from Review
        </button>
      )}
      {s !== "MASTERED" && (
        <button
          type="button"
          disabled={pending}
          className={`${btn} ${btnDefault}`}
          onClick={() =>
            run(() => markWordMasteredAction(vocabularyId, dayNumber), {
              ...stateInfo,
              state: "MASTERED",
            })
          }
        >
          Mark as Mastered
        </button>
      )}
      {s === "MASTERED" && !compact && (
        <button
          type="button"
          disabled={pending}
          className={`${btn} ${btnDefault}`}
          onClick={() =>
            run(() => moveWordToLearningAction(vocabularyId, dayNumber), {
              ...stateInfo,
              state: "LEARNING",
            })
          }
        >
          Move to Learning
        </button>
      )}
      {s === "MASTERED" && compact && (
        <button
          type="button"
          disabled={pending}
          className={`${btn} ${btnDefault}`}
          onClick={() =>
            run(() => addWordToReviewAction(vocabularyId, dayNumber), {
              ...stateInfo,
              state: "REVIEW",
            })
          }
        >
          Add to Review
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        aria-pressed={stateInfo.usedInConversation}
        className={`${btn} ${stateInfo.usedInConversation ? btnActive : btnDefault}`}
        title="Track that you used this word in your own conversation practice"
        onClick={() =>
          run(
            () => setWordUsedAction(vocabularyId, dayNumber, !stateInfo.usedInConversation),
            { ...stateInfo, usedInConversation: !stateInfo.usedInConversation },
          )
        }
      >
        {stateInfo.usedInConversation ? "Used ✓" : "Mark as Used"}
      </button>
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
