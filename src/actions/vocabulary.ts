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
  setUsedInConversation,
} from "@/services/vocabulary-state";

function revalidateAll() {
  revalidatePath("/", "layout");
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
