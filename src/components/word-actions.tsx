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
import { buttonClass } from "./ui";

export type WordStateInfo = {
  state: VocabularyState;
  usedInConversation: boolean;
};

const btnDefault = buttonClass("secondary", "sm");
const btnPrimary = buttonClass("primary", "sm");
const btnActive = buttonClass("success", "sm");

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
          className={`${btnPrimary}`}
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
          className={`${btnDefault}`}
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
          className={`${btnDefault}`}
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
          className={`${btnDefault}`}
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
          className={`${btnDefault}`}
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
          className={`${btnDefault}`}
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
        className={`${stateInfo.usedInConversation ? btnActive : btnDefault}`}
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
      {error && <span role="alert" className="text-xs text-rose-700 dark:text-rose-300">{error}</span>}
    </div>
  );
}
