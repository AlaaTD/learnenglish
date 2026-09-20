import React from "react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDaySummaries } from "@/lib/queries";
import { DayStatus, DayStatusLabel } from "@/lib/states";
import { Badge, ProgressBar } from "@/components/ui";

export const metadata = { title: "90-Day Journey" };

const statusStyle: Record<string, string> = {
  NOT_STARTED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  IN_PROGRESS: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          The 90-Day Journey
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Every day is a complete learning unit: 50 new words, grammar, conversations and paragraphs.
          Completed days stay open forever — revisit them any time.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Day</th>
              <th scope="col" className="px-4 py-3 font-medium">Title</th>
              <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">Topic</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell">Vocabulary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map(({ day, status, viewed }, index) => {
              const isNewStage = index === 0 || rows[index - 1].day.stage !== day.stage;
              return (
                <React.Fragment key={day.dayNumber}>
                  {isNewStage && (
                    <tr className="bg-zinc-50 dark:bg-zinc-900/60">
                      <td colSpan={5} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        {day.stage}
                      </td>
                    </tr>
                  )}
                  <tr id={`day-${day.dayNumber}`} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
                      {String(day.dayNumber).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/day/${day.dayNumber}`} className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400">
                        {day.title}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-zinc-500 md:table-cell dark:text-zinc-400">{day.topic}</td>
                    <td className="px-4 py-3">
                      <Badge className={statusStyle[status]}>{DayStatusLabel[status]}</Badge>
                    </td>
                    <td className="hidden w-40 px-4 py-3 sm:table-cell">
                      <ProgressBar value={viewed} max={50} label={`Day ${day.dayNumber} vocabulary viewed`} />
                      <span className="mt-1 block text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
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
