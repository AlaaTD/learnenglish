"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  addToReview,
  markLearned,
  markMastered,
  moveToLearning,
  recordViewed,
  removeFromReview,
  setDifficultWord,
  setUsedInConversation,
  toggleDifficultWord,
} from "@/services/vocabulary-state";

function revalidateAll() {
  revalidatePath("/", "layout");
}

/**
 * Saves (or removes) a word in the learner's difficult words.
 *
 * The screen sends the state it wants instead of "flip whatever is stored", so tapping twice quickly,
 * retrying after a network error, or tapping on a screen that shows old data always ends in the
 * state the learner asked for. Server actions are public endpoints, hence the input checks.
 */
export async function setDifficultWordAction(
  vocabularyId: string,
  dayNumber: number | null | undefined,
  isDifficult: boolean,
) {
  if (typeof vocabularyId !== "string" || vocabularyId.length === 0 || vocabularyId.length > 64) {
    throw new Error("Invalid word id");
  }
  if (typeof isDifficult !== "boolean") {
    throw new Error("Invalid difficult-word state");
  }
  const day = typeof dayNumber === "number" && Number.isInteger(dayNumber) ? dayNumber : null;
  const user = await requireUser();
  const state = await setDifficultWord(user.id, vocabularyId, isDifficult, day);
  revalidateAll();
  return state;
}

/** Kept for older callers. New code should call `setDifficultWordAction`. */
export async function toggleDifficultWordAction(vocabularyId: string, dayNumber?: number | null) {
  const user = await requireUser();
  const state = await toggleDifficultWord(user.id, vocabularyId, dayNumber ?? null);
  revalidateAll();
  return state;
}

export async function markWordLearnedAction(vocabularyId: string, dayNumber: number | null) {
  const user = await requireUser();
  const state = await markLearned(user.id, vocabularyId, dayNumber);
  revalidateAll();
  return state;
}

export async function addWordToReviewAction(vocabularyId: string, dayNumber: number | null) {
  const user = await requireUser();
  const state = await addToReview(user.id, vocabularyId, dayNumber);
  revalidateAll();
  return state;
}

export async function removeWordFromReviewAction(vocabularyId: string, dayNumber: number | null) {
  const user = await requireUser();
  const state = await removeFromReview(user.id, vocabularyId, dayNumber);
  revalidateAll();
  return state;
}

export async function markWordMasteredAction(vocabularyId: string, dayNumber: number | null) {
  const user = await requireUser();
  const state = await markMastered(user.id, vocabularyId, dayNumber);
  revalidateAll();
  return state;
}

export async function moveWordToLearningAction(vocabularyId: string, dayNumber: number | null) {
  const user = await requireUser();
  const state = await moveToLearning(user.id, vocabularyId, dayNumber);
  revalidateAll();
  return state;
}

export async function setWordUsedAction(
  vocabularyId: string,
  dayNumber: number | null,
  used: boolean,
) {
  const user = await requireUser();
  const state = await setUsedInConversation(user.id, vocabularyId, dayNumber, used);
  revalidateAll();
  return state;
}

export async function markWordViewedAction(vocabularyId: string, dayNumber: number | null) {
  const user = await requireUser();
  const state = await recordViewed(user.id, vocabularyId, dayNumber);
  return state;
}
