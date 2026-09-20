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
  const [stats, days] = await Promise.all([getUserStats(user.id), getDaySummaries()]);
  const currentDayNumber = await getCurrentDayNumber(user.id);
  const today = days.find((d) => d.dayNumber === currentDayNumber) ?? days[0];

  if (!today) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome to English90
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Your 90-day structured English learning journey.
          </p>
        </header>
        <EmptyState title="Curriculum Ready to Start" action={{ href: "/journey", label: "View 90-Day Journey" }}>
          Begin Day 1 to start your learning journey.
        </EmptyState>
      </div>
    );
  }

  const learnedToday = await db.userVocabulary.count({
    where: {
      userId: user.id,
      state: { in: [VocabularyState.LEARNING, VocabularyState.REVIEW, VocabularyState.MASTERED] },
      vocabulary: { dayNumber: currentDayNumber },
    },
  });

  const usedToday = await db.userVocabulary.count({
    where: {
      userId: user.id,
      usedInConversation: true,
      vocabulary: { dayNumber: currentDayNumber },
    },
  });

  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Day {today.dayNumber} of 90 · {today.stage}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {today.title}
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-300">{today.description}</p>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">{today.focus}</p>

        <div className="mt-5 max-w-xl">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-300">Today&apos;s vocabulary</span>
            <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
              {learnedToday} / 50 learned · {usedToday} used
            </span>
          </div>
          <ProgressBar value={learnedToday} max={50} label="Today's vocabulary learned" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/day/${today.dayNumber}`}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Continue Today&apos;s Lesson
          </Link>
          <Link
            href="/review"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Review My Words
          </Link>
          <Link
            href="/vocabulary"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Browse Vocabulary
          </Link>
        </div>
      </section>

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
