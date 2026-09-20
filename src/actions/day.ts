"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  completeDay,
  finishVocabularySection,
  markConversationViewed,
  markGrammarViewed,
  markParagraphViewed,
  markVocabularyViewed,
  reopenDay,
} from "@/services/day-progress";

export async function markVocabularyViewedAction(dayNumber: number, vocabularyId: string) {
  const user = await requireUser();
  await markVocabularyViewed(user.id, dayNumber, vocabularyId);
}

export async function finishVocabularySectionAction(dayNumber: number) {
  const user = await requireUser();
  await finishVocabularySection(user.id, dayNumber);
  revalidatePath("/", "layout");
}

export async function markGrammarViewedAction(dayNumber: number) {
  const user = await requireUser();
  await markGrammarViewed(user.id, dayNumber);
  revalidatePath("/", "layout");
}

export async function markConversationViewedAction(dayNumber: number, conversationId: string) {
  const user = await requireUser();
  await markConversationViewed(user.id, dayNumber, conversationId);
  revalidatePath("/", "layout");
}

export async function markParagraphViewedAction(dayNumber: number, paragraphId: string) {
  const user = await requireUser();
  await markParagraphViewed(user.id, dayNumber, paragraphId);
  revalidatePath("/", "layout");
}

export async function completeDayAction(dayNumber: number) {
  const user = await requireUser();
  await completeDay(user.id, dayNumber);
  revalidatePath("/", "layout");
}

export async function reopenDayAction(dayNumber: number) {
  const user = await requireUser();
  await reopenDay(user.id, dayNumber);
  revalidatePath("/", "layout");
}

export async function resetDayAction(dayNumber: number) {
  const user = await requireUser();
  const { resetDay } = await import("@/services/day-progress");
  await resetDay(user.id, dayNumber);
  revalidatePath("/", "layout");
}

export async function markAllDayVocabularyLearnedAction(dayNumber: number) {
  const user = await requireUser();
  const { markAllDayVocabularyLearned } = await import("@/services/vocabulary-state");
  await markAllDayVocabularyLearned(user.id, dayNumber);
  revalidatePath("/", "layout");
}

export async function resetAllDayVocabularyAction(dayNumber: number) {
  const user = await requireUser();
  const { resetAllDayVocabulary } = await import("@/services/vocabulary-state");
  await resetAllDayVocabulary(user.id, dayNumber);
  revalidatePath("/", "layout");
}
