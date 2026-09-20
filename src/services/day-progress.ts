import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { DayStatus, WORDS_PER_DAY } from "@/lib/states";
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
  const view = await getDayProgressView(userId, dayNumber);
  const sectionsReady =
    view.grammarViewed && view.allConversationsViewed && view.allParagraphsViewed;
  if (!sectionsReady) {
    throw new Error("Finish the grammar, conversation and paragraph sections before completing the day.");
  }
  await db.dayProgress.update({
    where: { userId_dayNumber: { userId, dayNumber } },
    data: { status: DayStatus.COMPLETED, completedAt: new Date() },
  });
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
