import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserStats } from "@/services/stats";
import { getDaySummaries } from "@/lib/queries";
import { db } from "@/lib/db";
import {
  Card,
  Eyebrow,
  ProgressBar,
  SectionHeading,
  StatTile,
  Tag,
  buttonClass,
  textLinkClass,
} from "@/components/ui";
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
    <div className="grid items-start gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Where to go next. The one featured surface on this screen (dark in both themes),
            so the eye lands here first, with a single clear primary action. */}
        <Card tone="featured" className="space-y-7">
          <div className="space-y-4">
            {/* Only the eyebrow + title share a row with the numeral, so the copy below keeps the full
                width (on a phone a narrow column would wrap the description into ~20-character lines). */}
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0 space-y-3">
                <Eyebrow tone="onDark">
                  <span className="sr-only">Day {dayNumber} of 90. </span>
                  {completed ? "Journey complete" : "Today's lesson"}
                  {today?.stage ? ` · ${today.stage}` : ""}
                </Eyebrow>
                <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl">
                  {today?.title ?? `Day ${dayNumber}`}
                </h1>
              </div>

              {/* Decorative day numeral: the eyebrow already tells screen readers which day this is */}
              <div aria-hidden="true" className="shrink-0 text-end">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Day</p>
                <p className="mt-1 text-5xl font-semibold leading-none tracking-tighter tabular-nums text-brand-300 sm:text-7xl">
                  {String(dayNumber).padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs text-zinc-400">of 90</p>
              </div>
            </div>

            {today?.description ? (
              <p className="max-w-2xl text-base leading-relaxed text-zinc-300">{today.description}</p>
            ) : null}
            {today?.focus ? (
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">{today.focus}</p>
            ) : null}
          </div>

          <div>
            <div className="mb-3 flex items-baseline justify-between gap-3 text-sm">
              <span className="text-zinc-300">Words learned today</span>
              <span className="font-semibold tabular-nums text-zinc-50">
                {learnedValue}
                <span className="font-normal text-zinc-400"> / 50</span>
              </span>
            </div>
            <ProgressBar
              value={learnedValue}
              max={50}
              label={`Day ${dayNumber} vocabulary learned`}
              tone={completed ? "inverseSuccess" : "inverse"}
            />
            <p className="mt-2.5 text-xs text-zinc-400">{usedToday} used in conversation</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/day/${dayNumber}`} className={buttonClass("inverse", "md", "group px-5")}>
              {completed
                ? `Revisit Day ${dayNumber}`
                : learnedToday > 0
                  ? `Continue Day ${dayNumber}`
                  : `Start Day ${dayNumber}`}
              <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            {dayNumber > 1 ? (
              <Link href={`/day/${dayNumber - 1}`} className={buttonClass("inverseGhost")}>
                Revisit Day {dayNumber - 1}
              </Link>
            ) : null}
          </div>
        </Card>

        {/* Four numbers that matter today. Full breakdown lives on the Progress page. */}
        <section aria-label="Your progress at a glance" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            label="Days completed"
            value={
              <>
                {stats.daysCompleted}
                <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400"> / 90</span>
              </>
            }
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

      {/* Path overview: overall progress + where you are now. Its top edge lines up with the hero. */}
      <aside aria-label="90-day path">
        <Card className="space-y-6">
          <SectionHeading title="90-day path">
            <Link href="/progress" className={textLinkClass}>
              Details →
            </Link>
          </SectionHeading>

          <div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Vocabulary</p>
                <p className="mt-1.5 text-3xl font-semibold leading-none tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                  {stats.overallPercent}
                  <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">%</span>
                </p>
              </div>
              <p className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                {stats.learned.toLocaleString()} / {stats.totalVocabulary.toLocaleString()} words
              </p>
            </div>
            <ProgressBar
              className="mt-3"
              value={stats.learned}
              max={stats.totalVocabulary}
              label="Overall vocabulary progress"
            />
          </div>

          <ul className="-mt-1 divide-y divide-zinc-100 border-t border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
            {pathStages.map(({ stage, index }) => {
              const isCurrent = index === currentStageIndex;
              return (
                <li key={stage.label}>
                  <Link
                    href={`/journey#day-${stage.from}`}
                    className="-mx-2 block rounded-xl px-2 py-3.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{stage.label}</p>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          Days {stage.from}–{stage.to}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {isCurrent ? <Tag tone="accent">Current stage</Tag> : <Tag>Up next</Tag>}
                        <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                          {stage.learned} / {stage.total}
                        </span>
                      </div>
                    </div>
                    <ProgressBar
                      size="sm"
                      className="mt-3"
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
