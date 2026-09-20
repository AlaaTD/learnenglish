import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserStats } from "@/services/stats";
import { ProgressBar } from "@/components/ui";

export const metadata = { title: "Curriculum Progress" };

export default async function ProgressPage() {
  const user = await requireUser();
  const stats = await getUserStats(user.id);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Curriculum Progress
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Track your journey across all 90 days and 4,500 vocabulary items. No scoring or exams.
        </p>
      </header>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Current Day</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            Day {stats.currentDay} <span className="text-xs font-normal text-zinc-400">/ 90</span>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Days Completed</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.daysCompleted} <span className="text-xs font-normal text-zinc-400">/ 90</span>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Words Learned</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.learned} <span className="text-xs font-normal text-zinc-400">/ 4,500</span>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Consecutive Days</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.streak} {stats.streak === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      {/* 90-Day Journey Progress Bar */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Overall 90-Day Journey
            </h2>
            <p className="text-xs text-zinc-500">
              {stats.learned} of 4,500 words learned ({stats.overallPercent}%)
            </p>
          </div>
          <Link
            href={`/day/${stats.currentDay}`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Continue Day {stats.currentDay} →
          </Link>
        </div>
        <div className="mt-4">
          <ProgressBar value={stats.learned} max={4500} label="Curriculum progress" />
        </div>
      </div>

      {/* Vocabulary Breakdown Grid */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Vocabulary State Distribution
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg bg-zinc-50 p-3.5 dark:bg-zinc-800/50">
            <span className="text-xs text-zinc-500">Unlearned</span>
            <p className="mt-1 text-xl font-bold text-zinc-800 dark:text-zinc-200">{stats.unlearned}</p>
          </div>
          <div className="rounded-lg bg-sky-50 p-3.5 dark:bg-sky-950/40">
            <span className="text-xs text-sky-700 dark:text-sky-300">Learning</span>
            <p className="mt-1 text-xl font-bold text-sky-700 dark:text-sky-300">{stats.learning}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3.5 dark:bg-amber-950/40">
            <span className="text-xs text-amber-700 dark:text-amber-300">In Review</span>
            <p className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-300">{stats.inReview}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3.5 dark:bg-emerald-950/40">
            <span className="text-xs text-emerald-700 dark:text-emerald-300">Mastered</span>
            <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">{stats.mastered}</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3.5 dark:bg-purple-950/40">
            <span className="text-xs text-purple-700 dark:text-purple-300">Used in Conversation</span>
            <p className="mt-1 text-xl font-bold text-purple-700 dark:text-purple-300">{stats.usedInConversation}</p>
          </div>
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Progression by Stage
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          The 9 progressive stages of your 90-day learning curriculum.
        </p>

        <div className="mt-6 space-y-5">
          {stats.stageProgress.map((stage) => {
            const percent = Math.round((stage.learned / stage.total) * 100);
            return (
              <div key={stage.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{stage.label}</span>
                    <span className="ml-2 text-zinc-400">
                      (Days {stage.from}–{stage.to})
                    </span>
                  </div>
                  <span className="tabular-nums text-zinc-500">
                    {stage.learned} / {stage.total} words ({percent}%)
                  </span>
                </div>
                <ProgressBar value={stage.learned} max={stage.total} label={stage.label} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
