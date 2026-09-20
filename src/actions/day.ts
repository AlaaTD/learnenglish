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
