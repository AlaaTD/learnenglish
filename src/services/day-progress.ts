import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { DayStatus, WORDS_PER_DAY, VocabularyState } from "@/lib/states";
import { parseStringArray } from "@/lib/json";
import { recordViewed } from "./vocabulary-state";

// Day completion is based on the learning workflow (sections viewed) — never on
// tests or scores. The user decides when the day is finished.

export async function getOrCreateDayProgress(userId: string, dayNumber: number) {
  const existing = await db.dayProgress.findUnique({
    where: { userId_dayNumber: { userId, dayNumber } },
  });
  if (existing) return existing;
  return db.dayProgress.create({
    data: { userId, dayNumber, status: DayStatus.IN_PROGRESS, startedAt: new Date() },
  });
}

async function touch(userId: string, dayNumber: number, data: Prisma.DayProgressUpdateInput) {
  const progress = await getOrCreateDayProgress(userId, dayNumber);
  return db.dayProgress.update({ where: { id: progress.id }, data });
}

export async function getDayProgressView(userId: string, dayNumber: number) {
  const progress = await getOrCreateDayProgress(userId, dayNumber);
  const [conversationIds, paragraphIds, vocabularyIds] = await Promise.all([
    db.conversation.findMany({ where: { dayNumber }, select: { id: true }, orderBy: { order: "asc" } }),
    db.paragraph.findMany({ where: { dayNumber }, select: { id: true }, orderBy: { order: "asc" } }),
    db.vocabularyItem.findMany({ where: { dayNumber }, select: { id: true }, orderBy: { order: "asc" } }),
  ]);
  const viewedVocabulary = parseStringArray(progress.viewedVocabulary);
  const conversationsViewed = parseStringArray(progress.conversationsViewed);
  const paragraphsViewed = parseStringArray(progress.paragraphsViewed);
  return {
    status: progress.status as DayStatus,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
    grammarViewed: progress.grammarViewed,
    conversationsViewedIds: new Set(conversationsViewed),
    paragraphsViewedIds: new Set(paragraphsViewed),
    vocabularyViewedCount: vocabularyIds.filter((v) => viewedVocabulary.includes(v.id)).length,
    vocabularyTotal: Math.min(vocabularyIds.length, WORDS_PER_DAY),
    vocabularyViewedIds: new Set(viewedVocabulary),
    allConversationsViewed:
      conversationIds.length > 0 && conversationIds.every((c) => conversationsViewed.includes(c.id)),
    allParagraphsViewed:
      paragraphIds.length > 0 && paragraphIds.every((p) => paragraphsViewed.includes(p.id)),
  };
}

export async function markVocabularyViewed(
  userId: string,
  dayNumber: number,
  vocabularyId: string,
) {
  const progress = await getOrCreateDayProgress(userId, dayNumber);
  const viewed = parseStringArray(progress.viewedVocabulary);
  if (viewed.includes(vocabularyId)) return;
  viewed.push(vocabularyId);
  await db.dayProgress.update({
    where: { id: progress.id },
    data: { viewedVocabulary: JSON.stringify(viewed) },
  });
  await recordViewed(userId, vocabularyId, dayNumber);
}

export async function finishVocabularySection(userId: string, dayNumber: number) {
  const items = await db.vocabularyItem.findMany({
    where: { dayNumber },
    select: { id: true },
    orderBy: { order: "asc" },
  });
  const progress = await getOrCreateDayProgress(userId, dayNumber);
  const viewed = new Set(parseStringArray(progress.viewedVocabulary));
  for (const item of items) {
    if (!viewed.has(item.id)) {
      viewed.add(item.id);
      await recordViewed(userId, item.id, dayNumber, "Vocabulary section finished manually");
    }
  }
  await db.dayProgress.update({
    where: { id: progress.id },
    data: { viewedVocabulary: JSON.stringify([...viewed]) },
  });
}

export async function markGrammarViewed(userId: string, dayNumber: number) {
  await touch(userId, dayNumber, { grammarViewed: true });
}

export async function markConversationViewed(
  userId: string,
  dayNumber: number,
  conversationId: string,
) {
  const progress = await getOrCreateDayProgress(userId, dayNumber);
  const viewed = parseStringArray(progress.conversationsViewed);
  if (viewed.includes(conversationId)) return;
  viewed.push(conversationId);
  await db.dayProgress.update({
    where: { id: progress.id },
    data: { conversationsViewed: JSON.stringify(viewed) },
  });
}

export async function markParagraphViewed(
  userId: string,
  dayNumber: number,
  paragraphId: string,
) {
  const progress = await getOrCreateDayProgress(userId, dayNumber);
  const viewed = parseStringArray(progress.paragraphsViewed);
  if (viewed.includes(paragraphId)) return;
  viewed.push(paragraphId);
  await db.dayProgress.update({
    where: { id: progress.id },
    data: { paragraphsViewed: JSON.stringify(viewed) },
  });
}

export async function completeDay(userId: string, dayNumber: number) {
  const [conversationIds, paragraphIds, vocabulary] = await Promise.all([
    db.conversation.findMany({ where: { dayNumber }, select: { id: true } }),
    db.paragraph.findMany({ where: { dayNumber }, select: { id: true } }),
    db.vocabularyItem.findMany({ where: { dayNumber }, select: { id: true } }),
  ]);

  const progress = await getOrCreateDayProgress(userId, dayNumber);
  const vocabularyIds = vocabulary.map((v) => v.id);
  const now = new Date();

  // Mark all vocabulary items for this day as MASTERED for this user
  for (const item of vocabulary) {
    await db.userVocabulary.upsert({
      where: { userId_vocabularyId: { userId, vocabularyId: item.id } },
      create: {
        userId,
        vocabularyId: item.id,
        state: VocabularyState.MASTERED,
        learnedAt: now,
        masteredAt: now,
      },
      update: {
        state: VocabularyState.MASTERED,
        masteredAt: now,
      },
    });
  }

  await db.dayProgress.update({
    where: { id: progress.id },
    data: {
      status: DayStatus.COMPLETED,
      completedAt: now,
      grammarViewed: true,
      conversationsViewed: JSON.stringify(conversationIds.map((c) => c.id)),
      paragraphsViewed: JSON.stringify(paragraphIds.map((p) => p.id)),
      viewedVocabulary: JSON.stringify(vocabularyIds),
    },
  });
}

export async function resetDay(userId: string, dayNumber: number) {
  const items = await db.vocabularyItem.findMany({
    where: { dayNumber },
    select: { id: true },
  });
  const ids = items.map((i) => i.id);

  // 1. Reset all vocabulary states for this day back to UNLEARNED
  await db.userVocabulary.updateMany({
    where: {
      userId,
      vocabularyId: { in: ids },
    },
    data: {
      state: VocabularyState.UNLEARNED,
      learnedAt: null,
      masteredAt: null,
      usedInConversation: false,
    },
  });

  // 2. Reset the day progress record
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

  // 3. Remove any future day progress rows (e.g. Day 2) created during navigation
  await db.dayProgress.deleteMany({
    where: {
      userId,
      dayNumber: { gt: dayNumber },
    },
  });
}

export async function reopenDay(userId: string, dayNumber: number) {
  return resetDay(userId, dayNumber);
}

export async function getCurrentDayNumber(userId: string): Promise<number> {
  const completed = await db.dayProgress.findMany({
    where: { userId, status: DayStatus.COMPLETED },
    select: { dayNumber: true },
    orderBy: { dayNumber: "asc" },
  });
  const completedSet = new Set(completed.map((c) => c.dayNumber));
  for (let d = 1; d <= 90; d++) {
    if (!completedSet.has(d)) return d;
  }
  return 90; // journey finished — the last day remains the resting point
}
