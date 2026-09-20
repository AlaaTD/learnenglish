import { db } from "@/lib/db";
import { VocabularyState } from "@/lib/states";

// All state changes are explicit user decisions — the system never promotes or
// demotes a word on its own. Every transition is recorded in VocabularyHistory.

export type UserVocabularyView = {
  id: string;
  state: VocabularyState;
  usedInConversation: boolean;
  learnedAt: Date | null;
  reviewAddedAt: Date | null;
  reviewDueAt: Date | null;
  masteredAt: Date | null;
  usedAt: Date | null;
};

function toView(row: {
  id: string;
  state: string;
  usedInConversation: boolean;
  learnedAt: Date | null;
  reviewAddedAt: Date | null;
  reviewDueAt: Date | null;
  masteredAt: Date | null;
  usedAt: Date | null;
}): UserVocabularyView {
  return {
    id: row.id,
    state: row.state as VocabularyState,
    usedInConversation: row.usedInConversation,
    learnedAt: row.learnedAt,
    reviewAddedAt: row.reviewAddedAt,
    reviewDueAt: row.reviewDueAt,
    masteredAt: row.masteredAt,
    usedAt: row.usedAt,
  };
}

async function ensureRow(userId: string, vocabularyId: string) {
  const existing = await db.userVocabulary.findUnique({
    where: { userId_vocabularyId: { userId, vocabularyId } },
  });
  if (existing) return existing;
  return db.userVocabulary.create({ data: { userId, vocabularyId } });
}

async function recordHistory(
  userId: string,
  vocabularyId: string,
  event: string,
  dayNumber: number | null,
  detail?: string,
  userVocabularyId?: string,
) {
  await db.vocabularyHistory.create({
    data: {
      userId,
      vocabularyId,
      event,
      dayNumber,
      detail: detail ?? null,
      userVocabularyId: userVocabularyId ?? null,
    },
  });
}

export async function getUserVocabularyView(
  userId: string,
  vocabularyId: string,
): Promise<UserVocabularyView> {
  const row = await db.userVocabulary.findUnique({
    where: { userId_vocabularyId: { userId, vocabularyId } },
  });
  if (!row) {
    return {
      id: "",
      state: VocabularyState.UNLEARNED,
      usedInConversation: false,
      learnedAt: null,
      reviewAddedAt: null,
      reviewDueAt: null,
      masteredAt: null,
      usedAt: null,
    };
  }
  return toView(row);
}

export async function markLearned(userId: string, vocabularyId: string, dayNumber: number | null) {
  const row = await ensureRow(userId, vocabularyId);
  if (row.state === VocabularyState.MASTERED || row.state === VocabularyState.REVIEW) {
    return toView(row); // already learned — review/mastered imply learned
  }
  const updated = await db.userVocabulary.update({
    where: { id: row.id },
    data: { state: VocabularyState.LEARNING, learnedAt: row.learnedAt ?? new Date() },
  });
  if (!row.learnedAt) {
    await recordHistory(userId, vocabularyId, "LEARNED", dayNumber, undefined, updated.id);
  }
  return toView(updated);
}

export async function addToReview(userId: string, vocabularyId: string, dayNumber: number | null) {
  const row = await ensureRow(userId, vocabularyId);
  const due = new Date();
  due.setDate(due.getDate() + 3);
  const updated = await db.userVocabulary.update({
    where: { id: row.id },
    data: {
      state: VocabularyState.REVIEW,
      reviewAddedAt: new Date(),
      reviewDueAt: due,
      learnedAt: row.learnedAt ?? new Date(),
    },
  });
  if (row.state !== VocabularyState.REVIEW) {
    await recordHistory(userId, vocabularyId, "REVIEW_ADDED", dayNumber, undefined, updated.id);
  }
  return toView(updated);
}

export async function removeFromReview(
  userId: string,
  vocabularyId: string,
  dayNumber: number | null,
) {
  const row = await db.userVocabulary.findUnique({
    where: { userId_vocabularyId: { userId, vocabularyId } },
  });
  if (!row || row.state !== VocabularyState.REVIEW) {
    return row ? toView(row) : getUserVocabularyView(userId, vocabularyId);
  }
  const nextState = row.learnedAt ? VocabularyState.LEARNING : VocabularyState.UNLEARNED;
  const updated = await db.userVocabulary.update({
    where: { id: row.id },
    data: { state: nextState, reviewAddedAt: null, reviewDueAt: null },
  });
  await recordHistory(userId, vocabularyId, "REVIEW_REMOVED", dayNumber, undefined, updated.id);
  return toView(updated);
}

export async function markMastered(userId: string, vocabularyId: string, dayNumber: number | null) {
  const row = await ensureRow(userId, vocabularyId);
  if (row.state === VocabularyState.MASTERED) return toView(row);
  const updated = await db.userVocabulary.update({
    where: { id: row.id },
    data: {
      state: VocabularyState.MASTERED,
      masteredAt: new Date(),
      reviewAddedAt: null,
      reviewDueAt: null,
      learnedAt: row.learnedAt ?? new Date(),
    },
  });
  await recordHistory(userId, vocabularyId, "MASTERED", dayNumber, undefined, updated.id);
  return toView(updated);
}

export async function moveToLearning(
  userId: string,
  vocabularyId: string,
  dayNumber: number | null,
) {
  const row = await db.userVocabulary.findUnique({
    where: { userId_vocabularyId: { userId, vocabularyId } },
  });
  if (!row || row.state !== VocabularyState.MASTERED) {
    return row ? toView(row) : getUserVocabularyView(userId, vocabularyId);
  }
  const updated = await db.userVocabulary.update({
    where: { id: row.id },
    data: { state: VocabularyState.LEARNING, masteredAt: null },
  });
  await recordHistory(userId, vocabularyId, "UNMASTERED", dayNumber, undefined, updated.id);
  return toView(updated);
}

export async function setUsedInConversation(
  userId: string,
  vocabularyId: string,
  dayNumber: number | null,
  used: boolean,
) {
  const row = await ensureRow(userId, vocabularyId);
  if (row.usedInConversation === used) return toView(row);
  const updated = await db.userVocabulary.update({
    where: { id: row.id },
    data: { usedInConversation: used, usedAt: used ? new Date() : null },
  });
  await recordHistory(
    userId,
    vocabularyId,
    used ? "USED_IN_CONVERSATION" : "CONVERSATION_USE_CLEARED",
    dayNumber,
    undefined,
    updated.id,
  );
  return toView(updated);
}

export async function recordViewed(
  userId: string,
  vocabularyId: string,
  dayNumber: number | null,
  detail?: string,
) {
  const row = await ensureRow(userId, vocabularyId);
  if (row.firstViewedAt) return toView(row);
  const updated = await db.userVocabulary.update({
    where: { id: row.id },
    data: { firstViewedAt: new Date() },
  });
  await recordHistory(userId, vocabularyId, "VIEWED", dayNumber, detail, updated.id);
  return toView(updated);
}
