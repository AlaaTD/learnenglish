import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDaySummaries } from "@/lib/queries";
import { getCurrentDay } from "@/services/stats";
import { DayStatus, DayStatusLabel } from "@/lib/states";
import { Badge, Card, PageHeader, ProgressBar, Tag, buttonClass } from "@/components/ui";

export const metadata = { title: "90-Day Journey" };

const statusStyle: Record<string, string> = {
  NOT_STARTED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  IN_PROGRESS: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  COMPLETED: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
};

export default async function JourneyPage() {
  const user = await requireUser();
  const [days, progressRows, currentDay] = await Promise.all([
    getDaySummaries(),
    db.dayProgress.findMany({
      where: { userId: user.id },
      select: { dayNumber: true, status: true, viewedVocabulary: true },
    }),
    getCurrentDay(user.id),
  ]);
  const progressMap = new Map(progressRows.map((p) => [p.dayNumber, p]));

  const rows = days.map((day) => {
    const progress = progressMap.get(day.dayNumber);
    const status = (progress?.status as DayStatus) ?? DayStatus.NOT_STARTED;
    const viewed = progress ? JSON.parse(progress.viewedVocabulary || "[]").length : 0;
    return { day, status, viewed };
  });

  const completedCount = rows.filter((r) => r.status === "COMPLETED").length;

  // Group consecutive days that share a stage (the curriculum has 9 stages of 10 days)
  const stages: { label: string; from: number; to: number; rows: typeof rows }[] = [];
  for (const row of rows) {
    const last = stages[stages.length - 1];
    if (last && last.label === row.day.stage) {
      last.rows.push(row);
      last.to = row.day.dayNumber;
    } else {
      stages.push({ label: row.day.stage, from: row.day.dayNumber, to: row.day.dayNumber, rows: [row] });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header: Journey title & Continue Button */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-mist-500">
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              90-Day Roadmap
            </span>
            <span className="text-zinc-600 dark:text-mist-400">· Full Curriculum</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            The 90-Day Learning Journey
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-mist-400 max-w-2xl">
            Every day is a complete unit: 50 new words, grammar rules, dialogues, and reading passages.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href={`/day/${currentDay}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-500 active:scale-95"
          >
            <span>Continue Day {currentDay}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Overall progress + stage jump track */}
      <Card className="space-y-4 border-zinc-200 bg-white dark:border-night-700/80 dark:bg-night-900/60">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-zinc-600 dark:text-mist-400">Journey completed</span>
            <span className="font-semibold tabular-nums text-zinc-900 dark:text-mist-100">
              {completedCount} / 90 days
              <span className="ms-1.5 text-xs font-normal text-zinc-600 dark:text-mist-400">({Math.round((completedCount / 90) * 100)}%)</span>
            </span>
          </div>
          <ProgressBar value={completedCount} max={90} label="Days completed" tone="success" />
        </div>

        {/* Stage quick jumps: horizontal segmented capsule */}
        <nav aria-label="Jump to stage" className="pt-1">
          <ul className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1.5 scrollbar-none">
            {stages.map((stage) => {
              const isCurrent = currentDay >= stage.from && currentDay <= stage.to;
              return (
                <li key={stage.from} className="shrink-0">
                  <a
                    href={`#day-${stage.from}`}
                    className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-medium transition-all duration-150 ${
                      isCurrent
                        ? "bg-brand-600 text-white font-semibold shadow-sm"
                        : "border border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-brand-600/60 hover:text-zinc-900 dark:border-night-700 dark:bg-night-950/70 dark:text-mist-300 dark:hover:text-white"
                    }`}
                  >
                    Days {stage.from}–{stage.to}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Card>

      {stages.map((stage) => {
        const stageCompleted = stage.rows.filter((r) => r.status === "COMPLETED").length;
        return (
          <section key={stage.from} aria-label={stage.label} className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1 px-1">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  Days {stage.from}–{stage.to}
                </p>
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                  {stage.label}
                </h2>
              </div>
              <span className="text-xs tabular-nums text-zinc-600 dark:text-mist-400">
                {stageCompleted} / {stage.rows.length} days completed
              </span>
            </div>

            <Card padded={false} className="overflow-hidden border-zinc-200 bg-white dark:border-night-700/80 dark:bg-night-900/60">
              <ul className="divide-y divide-zinc-200 dark:divide-night-800/80">
                {stage.rows.map(({ day, status, viewed }) => {
                  const isCurrent = day.dayNumber === currentDay;
                  const done = status === "COMPLETED";
                  return (
                    <li key={day.dayNumber} id={`day-${day.dayNumber}`}>
                      <Link
                        href={`/day/${day.dayNumber}`}
                        aria-current={isCurrent ? "step" : undefined}
                        className={`flex items-center gap-3 px-3.5 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-night-800/70 sm:gap-4 sm:px-4 ${
                          isCurrent ? "border-s-2 border-brand-500 bg-brand-50 dark:bg-brand-950/40" : ""
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold tabular-nums ${
                            isCurrent
                              ? "bg-brand-600 text-white shadow-sm"
                              : done
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : "border border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-night-700 dark:bg-night-800 dark:text-mist-300"
                          }`}
                        >
                          {String(day.dayNumber).padStart(2, "0")}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                              {day.title}
                            </span>
                            {isCurrent ? (
                              <Tag tone="accent" className="shrink-0 text-[10px] py-0.5">
                                Current
                              </Tag>
                            ) : null}
                          </div>
                          
                          {/* Topic visible on mobile and desktop */}
                          <p className="truncate text-xs text-zinc-600 dark:text-mist-400 mt-0.5">
                            {day.topic || day.description}
                          </p>

                          {/* Phones: compact progress bar */}
                          <div className="mt-1.5 flex items-center gap-2 sm:hidden">
                            <ProgressBar
                              className="w-24"
                              value={viewed}
                              max={50}
                              label={`Day ${day.dayNumber} vocabulary viewed`}
                              tone={done ? "success" : "accent"}
                            />
                            <span className="text-[11px] tabular-nums text-zinc-600 dark:text-mist-400">{viewed}/50 words</span>
                          </div>
                        </div>

                        {/* Desktop: topic column */}
                        <p className="hidden w-40 shrink-0 truncate text-xs text-zinc-600 dark:text-mist-400 lg:block">
                          {day.topic}
                        </p>

                        {/* Tablet & Desktop: progress column */}
                        <div className="hidden w-36 shrink-0 sm:block">
                          <ProgressBar
                            value={viewed}
                            max={50}
                            label={`Day ${day.dayNumber} vocabulary viewed`}
                            tone={done ? "success" : "accent"}
                          />
                          <span className="mt-1 block text-xs tabular-nums text-zinc-600 dark:text-mist-400">
                            {viewed} / 50 viewed
                          </span>
                        </div>

                        {/* Status badge: visible on both mobile and desktop */}
                        <div className="shrink-0">
                          {done ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                              <span aria-hidden="true">✓</span>
                              <span className="hidden sm:inline">Completed</span>
                            </span>
                          ) : status === "IN_PROGRESS" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/80 dark:text-sky-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />
                              <span className="hidden sm:inline">In Progress</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:border-night-700 dark:bg-night-800/80 dark:text-mist-400">
                              <span className="hidden sm:inline">Not Started</span>
                              <span className="sm:hidden">Start</span>
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        );
      })}
    </div>
  );
}
