import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserStats } from "@/services/stats";
import { ProgressBar } from "@/components/ui";

export const metadata = { title: "Curriculum Progress" };

export default async function ProgressPage() {
  const user = await requireUser();
  const stats = await getUserStats(user.id);
  const daysPercent = Math.min(100, Math.round((stats.daysCompleted / 90) * 100));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Learning Progress
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Track your personal milestones across the 90-day English curriculum.
        </p>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Current Day
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            Day {stats.currentDay}
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">of 90 days</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Days Completed
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.daysCompleted}
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {90 - stats.daysCompleted} remaining
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Words Learned
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {stats.learned}
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">of 4,500 total words</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Current Streak
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.streak} {stats.streak === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {stats.streak > 0 ? "Great consistency!" : "Start today"}
          </p>
        </div>
      </div>

      {/* Main Progress Overview Card */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Curriculum Progress
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Continuous learning without stress or exams.
            </p>
          </div>
          <Link
            href={`/day/${stats.currentDay}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all self-start sm:self-auto"
          >
            Continue Day {stats.currentDay} →
          </Link>
        </div>

        <div className="space-y-4 pt-2">
          {/* Days bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-zinc-700 dark:text-zinc-300">Days Finished</span>
              <span className="tabular-nums text-zinc-500">
                {stats.daysCompleted} / 90 days ({daysPercent}%)
              </span>
            </div>
            <ProgressBar value={stats.daysCompleted} max={90} label="Days completed" />
          </div>

          {/* Words bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-zinc-700 dark:text-zinc-300">Vocabulary Mastered</span>
              <span className="tabular-nums text-zinc-500">
                {stats.learned} / 4,500 words ({stats.overallPercent}%)
              </span>
            </div>
            <ProgressBar value={stats.learned} max={4500} label="Vocabulary mastered" />
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-3">
          <Link
            href="/journey"
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Explore 90-Day Journey →
          </Link>
          <Link
            href="/vocabulary"
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Browse Vocabulary (50 words) →
          </Link>
        </div>
      </div>
    </div>
  );
}
