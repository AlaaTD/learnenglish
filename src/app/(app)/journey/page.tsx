import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDaySummaries } from "@/lib/queries";
import { DayStatus, DayStatusLabel } from "@/lib/states";
import { Badge, ProgressBar } from "@/components/ui";

export const metadata = { title: "90-Day Journey" };

const statusStyle: Record<string, string> = {
  NOT_STARTED: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-400 dark:border-zinc-700",
  IN_PROGRESS: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800",
  COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800",
};

export default async function JourneyPage() {
  const user = await requireUser();
  const [days, progressRows] = await Promise.all([
    getDaySummaries(),
    db.dayProgress.findMany({
      where: { userId: user.id },
      select: { dayNumber: true, status: true, viewedVocabulary: true },
    }),
  ]);
  const progressMap = new Map(progressRows.map((p) => [p.dayNumber, p]));

  const rows = days.map((day) => {
    const progress = progressMap.get(day.dayNumber);
    const status = (progress?.status as DayStatus) ?? DayStatus.NOT_STARTED;
    const viewed = progress ? JSON.parse(progress.viewedVocabulary || "[]").length : 0;
    return { day, status, viewed };
  });

  const completedCount = rows.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            90-Day Roadmap
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            The 90-Day Curriculum Journey
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Every day is an autonomous, complete learning unit: 50 new words, grammar rules, native dialogues, and reading passages. Completed days remain permanently accessible.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Total Journey Completed
          </span>
          <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {completedCount} <span className="text-sm font-normal text-zinc-400">/ 90 Days</span>
          </p>
        </div>
      </header>

      {/* Mobile: compact card list */}
      <div className="space-y-2 md:hidden">
        {rows.map(({ day, status, viewed }, index) => {
          const isNewStage = index === 0 || rows[index - 1].day.stage !== day.stage;
          const isDay1 = day.dayNumber === 1;

          return (
            <React.Fragment key={day.dayNumber}>
              {isNewStage && (
                <p className="px-1 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {day.stage}
                </p>
              )}
              <Link
                id={`day-${day.dayNumber}`}
                href={`/day/${day.dayNumber}`}
                className={`flex items-center gap-3 rounded-xl border p-3 shadow-xs transition-all active:scale-[0.99] ${
                  isDay1
                    ? "border-indigo-200 bg-indigo-50/40 dark:border-indigo-800/60 dark:bg-indigo-950/20"
                    : "border-zinc-200 bg-white hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold tabular-nums ${
                    isDay1
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {String(day.dayNumber).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {day.title}
                    </span>
                    {isDay1 && (
                      <span className="shrink-0 rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {day.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${Math.min(100, Math.round((viewed / 50) * 100))}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium tabular-nums text-zinc-400 dark:text-zinc-500">
                      {viewed}/50
                    </span>
                  </div>
                </div>
                <Badge className={`${statusStyle[status]} shrink-0 !px-2 text-[10px]`}>
                  {status === "COMPLETED" ? "✓" : DayStatusLabel[status]}
                </Badge>
              </Link>
            </React.Fragment>
          );
        })}
      </div>

      {/* Desktop: full table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-xs md:block dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/70 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
            <tr>
              <th scope="col" className="px-5 py-3.5">Day</th>
              <th scope="col" className="px-5 py-3.5">Title & Focus</th>
              <th scope="col" className="hidden px-5 py-3.5 md:table-cell">Topic</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="hidden px-5 py-3.5 sm:table-cell">Vocabulary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {rows.map(({ day, status, viewed }, index) => {
              const isNewStage = index === 0 || rows[index - 1].day.stage !== day.stage;
              const isDay1 = day.dayNumber === 1;

              return (
                <React.Fragment key={day.dayNumber}>
                  {isNewStage && (
                    <tr className="bg-gradient-to-r from-zinc-50 via-zinc-50/50 to-transparent dark:from-zinc-900/90 dark:via-zinc-900/40">
                      <td colSpan={5} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {day.stage}
                      </td>
                    </tr>
                  )}
                  <tr
                    className={`group transition-all hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 ${
                      isDay1
                        ? "bg-indigo-50/20 dark:bg-indigo-950/20 font-medium"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-4 tabular-nums text-zinc-400 dark:text-zinc-500 font-semibold">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                        isDay1
                          ? "bg-indigo-600 text-white font-bold"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}>
                        {String(day.dayNumber).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/day/${day.dayNumber}`}
                          className="font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400 transition-colors"
                        >
                          {day.title}
                        </Link>
                        {isDay1 && (
                          <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {day.description}
                      </p>
                    </td>
                    <td className="hidden px-5 py-4 text-xs text-zinc-500 md:table-cell dark:text-zinc-400">
                      {day.topic}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge className={statusStyle[status]}>
                        {status === "COMPLETED" ? "✓ Completed" : DayStatusLabel[status]}
                      </Badge>
                    </td>
                    <td className="hidden w-44 px-5 py-4 sm:table-cell">
                      <ProgressBar value={viewed} max={50} label={`Day ${day.dayNumber} vocabulary viewed`} />
                      <span className="mt-1 block text-xs tabular-nums text-zinc-400 dark:text-zinc-500 font-medium">
                        {viewed} / 50 viewed
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
