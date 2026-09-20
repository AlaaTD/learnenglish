import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserStats } from "@/services/stats";
import { getDaySummaries } from "@/lib/queries";
import { getCurrentDayNumber } from "@/services/day-progress";
import { db } from "@/lib/db";
import { EmptyState, ProgressBar, StatTile } from "@/components/ui";
import { VocabularyState } from "@/lib/states";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const user = await requireUser();
  const [stats, days, day1Progress] = await Promise.all([
    getUserStats(user.id),
    getDaySummaries(),
    db.dayProgress.findUnique({
      where: { userId_dayNumber: { userId: user.id, dayNumber: 1 } },
    }),
  ]);
  const day1Completed = day1Progress?.status === "COMPLETED";

  const learnedDay1 = await db.userVocabulary.count({
    where: {
      userId: user.id,
      state: { in: [VocabularyState.LEARNING, VocabularyState.REVIEW, VocabularyState.MASTERED] },
      vocabulary: { dayNumber: 1 },
    },
  });

  const usedDay1 = await db.userVocabulary.count({
    where: {
      userId: user.id,
      usedInConversation: true,
      vocabulary: { dayNumber: 1 },
    },
  });

  const day1 = days.find((d) => d.dayNumber === 1);

  return (
    <div className="space-y-10">
      {day1Completed ? (
        <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-6 shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-teal-950/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              Day 1 Completed & Saved
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Always Open · Revisit Anytime
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Day 1: My Daily Routine
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
            You have finished Day 1. Your learning progress is permanently saved. You can freely return to review all 50 vocabulary items, grammar explanations, natural dialogues, and reading passages.
          </p>

          <div className="mt-4 max-w-xl">
            <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Day 1 vocabulary saved</span>
              <span className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                {learnedDay1} / 50 learned · {usedDay1} used in conversation
              </span>
            </div>
            <ProgressBar value={learnedDay1 > 0 ? learnedDay1 : 50} max={50} label="Day 1 vocabulary" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/day/1"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              ← Revisit Day 1 Lessons
            </Link>
            <Link
              href="/vocabulary"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Browse Day 1 Words (50)
            </Link>
            <Link
              href="/review"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Review Spaced Repetition
            </Link>
            <Link
              href="/journey"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              90-Day Journey Map →
            </Link>
          </div>
        </section>
      ) : (
        <section>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Day 1 of 90 · Foundation — Daily Life
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {day1?.title ?? "My Daily Routine"}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">
            {day1?.description ?? "Talk about what you do every day from morning to night."}
          </p>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            {day1?.focus ?? "Master 50 core everyday verbs and time expressions, present simple structure, 3 natural conversations, and 3 reading paragraphs."}
          </p>

          <div className="mt-5 max-w-xl">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Day 1 vocabulary progress</span>
              <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                {learnedDay1} / 50 learned · {usedDay1} used
              </span>
            </div>
            <ProgressBar value={learnedDay1} max={50} label="Day 1 vocabulary learned" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/day/1"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {learnedDay1 > 0 ? "Continue Day 1 Lesson →" : "Start Day 1 Lesson →"}
            </Link>
            <Link
              href="/journey"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              90-Day Journey
            </Link>
            <Link
              href="/vocabulary"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Browse Vocabulary
            </Link>
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Current Day" value={`${stats.currentDay} / 90`} hint={`${stats.daysCompleted} days completed`} />
        <StatTile label="Words Learned" value={stats.learned.toLocaleString()} hint={`of ${stats.totalVocabulary.toLocaleString()}`} />
        <StatTile label="Mastered" value={stats.mastered.toLocaleString()} />
        <StatTile label="Used in Conversation" value={stats.usedInConversation.toLocaleString()} />
        <StatTile label="In Review" value={stats.inReview.toLocaleString()} />
        <StatTile label="Day Streak" value={stats.streak} hint="days in a row" />
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">90-Day Progress</h2>
          <Link href="/journey" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            View the full journey →
          </Link>
        </div>
        <ProgressBar value={stats.learned} max={stats.totalVocabulary} label="Overall vocabulary progress" />
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          {stats.learned.toLocaleString()} / {stats.totalVocabulary.toLocaleString()} words learned ·{" "}
          {stats.overallPercent}% of the journey
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {stats.stageProgress.map((stage) => (
            <Link
              key={stage.label}
              href={`/journey#day-${stage.from}`}
              className="rounded-xl border border-zinc-200 bg-white p-3.5 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
            >
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Days {stage.from}–{stage.to}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{stage.label}</p>
              <div className="mt-2">
                <ProgressBar value={stage.learned} max={stage.total} label={`${stage.label} progress`} />
              </div>
              <p className="mt-1 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                {stage.learned} / {stage.total} words
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
