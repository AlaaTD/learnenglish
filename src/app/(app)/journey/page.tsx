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
      <PageHeader
        eyebrow="90-Day Roadmap"
        title="The 90-Day Curriculum Journey"
        description="Every day is a complete learning unit: 50 new words, grammar rules, native dialogues, and reading passages. Completed days remain permanently accessible."
        actions={
          <Link href={`/day/${currentDay}`} className={buttonClass("primary", "md", "px-5")}>
            Continue Day {currentDay} <span aria-hidden="true">→</span>
          </Link>
        }
      />

      {/* Overall progress + quick jump to a stage */}
      <Card className="space-y-4">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Journey completed</span>
            <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {completedCount} / 90 days
            </span>
          </div>
          <ProgressBar value={completedCount} max={90} label="Days completed" tone="success" />
        </div>
        <nav aria-label="Jump to stage">
          <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
            {stages.map((stage) => {
              const isCurrent = currentDay >= stage.from && currentDay <= stage.to;
              return (
                <li key={stage.from} className="shrink-0">
                  <a
                    href={`#day-${stage.from}`}
                    className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors ${
                      isCurrent
                        ? "border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-200"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                  Days {stage.from}–{stage.to}
                </p>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stage.label}
                </h2>
              </div>
              <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                {stageCompleted} / {stage.rows.length} days completed
              </span>
            </div>

            <Card padded={false} className="overflow-hidden">
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {stage.rows.map(({ day, status, viewed }) => {
                  const isCurrent = day.dayNumber === currentDay;
                  const done = status === "COMPLETED";
                  return (
                    <li key={day.dayNumber} id={`day-${day.dayNumber}`}>
                      <Link
                        href={`/day/${day.dayNumber}`}
                        aria-current={isCurrent ? "step" : undefined}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 sm:gap-4 dark:hover:bg-zinc-800/50 ${
                          isCurrent ? "bg-brand-50/60 dark:bg-brand-950/30" : ""
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold tabular-nums ${
                            isCurrent
                              ? "bg-brand-600 text-white"
                              : done
                                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {String(day.dayNumber).padStart(2, "0")}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {day.title}
                            </span>
                            {isCurrent ? (
                              <Tag tone="accent" className="shrink-0">
                                Current
                              </Tag>
                            ) : null}
                          </div>
                          <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">{day.description}</p>
                          {/* Phones: compact progress under the text */}
                          <div className="mt-1.5 flex items-center gap-2 sm:hidden">
                            <ProgressBar
                              className="w-24"
                              value={viewed}
                              max={50}
                              label={`Day ${day.dayNumber} vocabulary viewed`}
                            />
                            <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">{viewed}/50</span>
                          </div>
                        </div>

                        {/* Wider screens: topic + progress columns */}
                        <p className="hidden w-40 shrink-0 truncate text-xs text-zinc-600 lg:block dark:text-zinc-400">
                          {day.topic}
                        </p>
                        <div className="hidden w-36 shrink-0 sm:block">
                          <ProgressBar
                            value={viewed}
                            max={50}
                            label={`Day ${day.dayNumber} vocabulary viewed`}
                            tone={done ? "success" : "accent"}
                          />
                          <span className="mt-1 block text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                            {viewed} / 50 viewed
                          </span>
                        </div>

                        <Badge
                          className={`${statusStyle[status]} shrink-0 ${
                            status === "NOT_STARTED" ? "hidden sm:inline-flex" : ""
                          }`}
                        >
                          {done ? (
                            <>
                              <span aria-hidden="true">✓</span>
                              <span className="sr-only sm:not-sr-only">Completed</span>
                            </>
                          ) : (
                            DayStatusLabel[status]
                          )}
                        </Badge>
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
