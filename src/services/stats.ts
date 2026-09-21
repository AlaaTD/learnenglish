import { db } from "@/lib/db";
import { DayStatus, VocabularyState, TOTAL_DAYS, TOTAL_VOCABULARY } from "@/lib/states";

// Aggregated progress statistics for the home and progress dashboards.
// All reads happen server-side; nothing aggregates on the client.

export type UserStats = {
  currentDay: number;
  daysCompleted: number;
  streak: number;
  learned: number;
  learning: number;
  inReview: number;
  mastered: number;
  unlearned: number;
  usedInConversation: number;
  totalVocabulary: number;
  overallPercent: number;
  stageProgress: { label: string; from: number; to: number; learned: number; total: number }[];
};

export const STAGES: { label: string; from: number; to: number }[] = [
  { label: "Foundation — Daily Life", from: 1, to: 10 },
  { label: "Everyday Communication", from: 11, to: 20 },
  { label: "Real-Life Situations", from: 21, to: 30 },
  { label: "Work, Career and Technology", from: 31, to: 40 },
  { label: "Relationships, Personality and Emotions", from: 41, to: 50 },
  { label: "Health, Education and Personal Development", from: 51, to: 60 },
  { label: "Problems, Decisions and Opinions", from: 61, to: 70 },
  { label: "Advanced Everyday English", from: 71, to: 80 },
  { label: "Integration — Real English", from: 81, to: 90 },
];

const LEARNED_STATES = [VocabularyState.LEARNING, VocabularyState.REVIEW, VocabularyState.MASTERED];

/**
 * Lightweight "which day should the learner open next" lookup for the
 * navigation. Same rule as `getUserStats().currentDay` (first day that is not
 * completed; day 90 once everything is done) without the heavier aggregates.
 */
export async function getCurrentDay(userId: string): Promise<number> {
  const completed = await db.dayProgress.findMany({
    where: { userId, status: DayStatus.COMPLETED },
    select: { dayNumber: true },
  });
  const completedSet = new Set(completed.map((c) => c.dayNumber));
  let currentDay = 1;
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    currentDay = d;
    if (!completedSet.has(d)) break;
  }
  return currentDay;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const [stateCounts, usedCount, completedDays, wordDays] = await Promise.all([
    db.userVocabulary.groupBy({
      by: ["state"],
      where: { userId },
      _count: { _all: true },
    }),
    db.userVocabulary.count({ where: { userId, usedInConversation: true } }),
    db.dayProgress.findMany({
      where: { userId, status: DayStatus.COMPLETED },
      select: { dayNumber: true },
      orderBy: { dayNumber: "asc" },
    }),
    db.userVocabulary.findMany({
      where: { userId, state: { in: LEARNED_STATES } },
      select: { vocabulary: { select: { dayNumber: true } } },
    }),
  ]);

  const byState = new Map(stateCounts.map((row) => [row.state, row._count._all]));
  const learning = byState.get(VocabularyState.LEARNING) ?? 0;
  const inReview = byState.get(VocabularyState.REVIEW) ?? 0;
  const mastered = byState.get(VocabularyState.MASTERED) ?? 0;
  const learned = learning + inReview + mastered;

  const completedSet = new Set(completedDays.map((c) => c.dayNumber));
  let streak = 0;
  for (let d = 1; d <= TOTAL_DAYS && completedSet.has(d); d++) streak++;

  let currentDay = 1;
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    if (!completedSet.has(d)) {
      currentDay = d;
      break;
    }
    currentDay = d;
  }

  const learnedByDay = new Map<number, number>();
  for (const row of wordDays) {
    const day = row.vocabulary.dayNumber;
    learnedByDay.set(day, (learnedByDay.get(day) ?? 0) + 1);
  }

  const stageProgress = STAGES.map((stage) => {
    let learnedInStage = 0;
    for (let d = stage.from; d <= stage.to; d++) {
      learnedInStage += learnedByDay.get(d) ?? 0;
    }
    return { ...stage, learned: learnedInStage, total: (stage.to - stage.from + 1) * 50 };
  });

  const daysCompleted = completedDays.length;
  return {
    currentDay,
    daysCompleted,
    streak,
    learned,
    learning,
    inReview,
    mastered,
    unlearned: TOTAL_VOCABULARY - learned,
    usedInConversation: usedCount,
    totalVocabulary: TOTAL_VOCABULARY,
    overallPercent: Math.round((learned / TOTAL_VOCABULARY) * 100),
    stageProgress,
  };
}
