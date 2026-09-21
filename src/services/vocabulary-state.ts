import { db } from "@/lib/db";
import { VocabularyState, DayStatus } from "@/lib/states";

// All state changes are explicit user decisions — the system never promotes or
// demotes a word on its own. Every transition is recorded in VocabularyHistory.

export type UserVocabularyView = {
  id: string;
  state: VocabularyState;
  isDifficult: boolean;
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
  isDifficult?: boolean;
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
    isDifficult: row.isDifficult ?? false,
    usedInConversation: row.usedInConversation,
    learnedAt: row.learnedAt,
    reviewAddedAt: row.reviewAddedAt,
    reviewDueAt: row.reviewDueAt,
    masteredAt: row.masteredAt,
    usedAt: row.usedAt,
  };
}

/**
 * Returns the user's row for a word, creating it when it does not exist yet.
 * One upsert instead of "find, then create": two requests for the same new word (for example the
 * card being opened and the star being tapped at the same moment) can no longer collide on the
 * (userId, vocabularyId) unique index, which used to make one of the two actions throw.
 */
async function ensureRow(userId: string, vocabularyId: string) {
  return db.userVocabulary.upsert({
    where: { userId_vocabularyId: { userId, vocabularyId } },
    update: {},
    create: { userId, vocabularyId },
  });
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
      isDifficult: false,
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

/**
 * Sets (does not flip) the "difficult word" flag of one word for one user.
 *
 * - Idempotent: the caller says which state it wants, so a double tap, a retry or a screen showing
 *   old data can never invert the result.
 * - Works for a word that has no row yet, and cannot collide with another request creating that row.
 * - The history entry is bookkeeping. It is written exactly once per real change (the flip below is
 *   atomic, so identical requests racing each other cannot log it twice), and a failure to write it
 *   is logged but never turns an already-saved word into an error for the learner.
 */
export async function setDifficultWord(
  userId: string,
  vocabularyId: string,
  isDifficult: boolean,
  dayNumber?: number | null,
): Promise<UserVocabularyView> {
  const key = { userId_vocabularyId: { userId, vocabularyId } };
  const flag = { isDifficult, difficultAddedAt: isDifficult ? new Date() : null };

  // Flip an existing row. `count` is 1 only for the request that really changed the flag: a row that
  // already has the wanted value (or no row at all) matches nothing and is left untouched, so
  // re-saving a saved word does not move it to the top of the list again.
  const flipped = await db.userVocabulary.updateMany({
    where: { userId, vocabularyId, isDifficult: !isDifficult },
    data: flag,
  });
  let changed = flipped.count > 0;

  let row = await db.userVocabulary.findUnique({ where: key });
  if (!row) {
    // Nothing stored yet. Removing a word that was never saved is a no-op; saving it creates the row.
    if (!isDifficult) return getUserVocabularyView(userId, vocabularyId);
    try {
      row = await db.userVocabulary.create({ data: { userId, vocabularyId, ...flag } });
      changed = true;
    } catch (error) {
      if ((error as { code?: string } | null)?.code !== "P2002") throw error;
      // Another request created the row a moment ago: make sure the flag is set on it.
      const late = await db.userVocabulary.updateMany({
        where: { userId, vocabularyId, isDifficult: false },
        data: flag,
      });
      changed = late.count > 0;
      row = await db.userVocabulary.findUniqueOrThrow({ where: key });
    }
  }

  if (changed) {
    try {
      await recordHistory(
        userId,
        vocabularyId,
        isDifficult ? "DIFFICULT_ADDED" : "DIFFICULT_REMOVED",
        dayNumber ?? null,
        undefined,
        row.id,
      );
    } catch (error) {
      console.error("[difficult-words] the word was saved, but its history entry could not be written", error);
    }
  }
  return toView(row);
}

/** Flips the flag. Prefer `setDifficultWord`, which cannot be inverted by a stale screen. */
export async function toggleDifficultWord(
  userId: string,
  vocabularyId: string,
  dayNumber?: number | null,
): Promise<UserVocabularyView> {
  const current = await getUserVocabularyView(userId, vocabularyId);
  return setDifficultWord(userId, vocabularyId, !current.isDifficult, dayNumber);
}

export async function markAllDayVocabularyLearned(userId: string, dayNumber: number) {
  const items = await db.vocabularyItem.findMany({
    where: { dayNumber },
    select: { id: true },
  });

  const now = new Date();
  for (const item of items) {
    await db.userVocabulary.upsert({
      where: { userId_vocabularyId: { userId, vocabularyId: item.id } },
      update: {
        state: VocabularyState.LEARNING,
        learnedAt: now,
      },
      create: {
        userId,
        vocabularyId: item.id,
        state: VocabularyState.LEARNING,
        learnedAt: now,
      },
    });
  }

  // Also update day progress viewedVocabulary
  const progress = await db.dayProgress.findUnique({
    where: { userId_dayNumber: { userId, dayNumber } },
  });
  if (progress) {
    await db.dayProgress.update({
      where: { id: progress.id },
      data: {
        viewedVocabulary: JSON.stringify(items.map((i) => i.id)),
      },
    });
  }
}

export async function resetAllDayVocabulary(userId: string, dayNumber: number) {
  const items = await db.vocabularyItem.findMany({
    where: { dayNumber },
    select: { id: true },
  });
  const ids = items.map((i) => i.id);

  await db.userVocabulary.updateMany({
    where: {
      userId,
      vocabularyId: { in: ids },
    },
    data: {
      state: VocabularyState.UNLEARNED,
      learnedAt: null,
      masteredAt: null,
    },
  });

  const progress = await db.dayProgress.findUnique({
    where: { userId_dayNumber: { userId, dayNumber } },
  });
  if (progress) {
    await db.dayProgress.update({
      where: { id: progress.id },
      data: {
        status: DayStatus.NOT_STARTED,
        completedAt: null,
        startedAt: null,
        grammarViewed: false,
        conversationsViewed: "[]",
        paragraphsViewed: "[]",
        viewedVocabulary: "[]",
      },
    });
  }

  await db.dayProgress.deleteMany({
    where: {
      userId,
      dayNumber: { gt: dayNumber },
    },
  });
}
