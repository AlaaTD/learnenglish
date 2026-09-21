import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserStats } from "@/services/stats";
import { getDaySummaries } from "@/lib/queries";
import { db } from "@/lib/db";
import { Card, ProgressBar, SectionHeading, StatTile, buttonClass } from "@/components/ui";
import { VocabularyState } from "@/lib/states";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const user = await requireUser();
  const stats = await getUserStats(user.id);
  const dayNumber = stats.currentDay;

  const [days, progress, learnedToday, usedToday] = await Promise.all([
    getDaySummaries(),
    db.dayProgress.findUnique({
      where: { userId_dayNumber: { userId: user.id, dayNumber } },
    }),
    db.userVocabulary.count({
      where: {
        userId: user.id,
        state: { in: [VocabularyState.LEARNING, VocabularyState.REVIEW, VocabularyState.MASTERED] },
        vocabulary: { dayNumber },
      },
    }),
    db.userVocabulary.count({
      where: {
        userId: user.id,
        usedInConversation: true,
        vocabulary: { dayNumber },
      },
    }),
  ]);

  const today = days.find((d) => d.dayNumber === dayNumber);
  const completed = progress?.status === "COMPLETED";
  // A completed day has all of its words saved as learned
  const learnedValue = completed && learnedToday === 0 ? 50 : learnedToday;

  const currentStageIndex = stats.stageProgress.findIndex((s) => dayNumber >= s.from && dayNumber <= s.to);
  const pathStages = stats.stageProgress
    .map((stage, index) => ({ stage, index }))
    .filter(({ index }) => index === currentStageIndex || index === currentStageIndex + 1);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Where to go next: one clear primary action */}
        <Card className="space-y-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              {completed ? "Journey complete" : `Day ${dayNumber} of 90`}
              {today?.stage ? ` · ${today.stage}` : ""}
            </p>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {today?.title ?? `Day ${dayNumber}`}
            </h1>
            {today?.description ? (
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                {today.description}
              </p>
            ) : null}
            {today?.focus ? (
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {today.focus}
              </p>
            ) : null}
          </div>

          <div className="max-w-xl">
            <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Words learned today</span>
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {learnedValue} / 50
                <span className="ms-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  {usedToday} used in conversation
                </span>
              </span>
            </div>
            <ProgressBar
              value={learnedValue}
              max={50}
              label={`Day ${dayNumber} vocabulary learned`}
              tone={completed ? "success" : "accent"}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/day/${dayNumber}`} className={buttonClass("primary", "md", "px-5")}>
              {completed
                ? `Revisit Day ${dayNumber}`
                : learnedToday > 0
                  ? `Continue Day ${dayNumber}`
                  : `Start Day ${dayNumber}`}
              <span aria-hidden="true">→</span>
            </Link>
            {dayNumber > 1 ? (
              <Link href={`/day/${dayNumber - 1}`} className={buttonClass("ghost")}>
                Revisit Day {dayNumber - 1}
              </Link>
            ) : null}
          </div>
        </Card>

        {/* Four numbers that matter today. Full breakdown lives on the Progress page. */}
        <section aria-label="Your progress at a glance" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Days completed"
            value={`${stats.daysCompleted} / 90`}
            hint={`${90 - stats.daysCompleted} to go`}
            href="/journey"
          />
          <StatTile
            label="Words learned"
            value={stats.learned.toLocaleString()}
            hint={`of ${stats.totalVocabulary.toLocaleString()}`}
            href="/vocabulary"
          />
          <StatTile label="In review" value={stats.inReview.toLocaleString()} hint="words to revisit" href="/review" />
          <StatTile label="Day streak" value={stats.streak} hint="days in a row" href="/progress" />
        </section>
      </div>

      {/* Path overview: overall progress + where you are now */}
      <aside aria-label="90-day path" className="space-y-3">
        <SectionHeading title="90-day path">
          <Link
            href="/progress"
            className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300"
          >
            Details →
          </Link>
        </SectionHeading>

        <Card className="space-y-5">
          <div>
            <div className="mb-2 flex items-baseline justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Vocabulary</span>
              <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {stats.overallPercent}%
              </span>
            </div>
            <ProgressBar value={stats.learned} max={stats.totalVocabulary} label="Overall vocabulary progress" />
            <p className="mt-1.5 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
              {stats.learned.toLocaleString()} / {stats.totalVocabulary.toLocaleString()} words
            </p>
          </div>

          <ul className="divide-y divide-zinc-100 border-t border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
            {pathStages.map(({ stage, index }) => {
              const isCurrent = index === currentStageIndex;
              return (
                <li key={stage.label}>
                  <Link
                    href={`/journey#day-${stage.from}`}
                    className="-mx-2 block rounded-xl px-2 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{stage.label}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Days {stage.from}–{stage.to} · {isCurrent ? "Current stage" : "Up next"}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                        {stage.learned} / {stage.total}
                      </span>
                    </div>
                    <ProgressBar
                      className="mt-2"
                      value={stage.learned}
                      max={stage.total}
                      label={`${stage.label} progress`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link href="/journey" className={buttonClass("secondary", "md", "w-full")}>
            Open the full journey
          </Link>
        </Card>
      </aside>
    </div>
  );
}
