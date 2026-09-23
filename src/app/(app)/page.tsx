import Link from "next/link";
import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { getUserStats } from "@/services/stats";
import { getDaySummaries } from "@/lib/queries";
import { db } from "@/lib/db";
import { VocabularyState } from "@/lib/states";
import { DayRing } from "@/components/dashboard/day-ring";
import { HeroArt } from "@/components/dashboard/hero-art";
import {
  IconArrowRight,
  IconBookOpen,
  IconCalendar,
  IconChatDots,
  IconChevronRight,
  IconFileText,
  IconFlame,
  IconLayers,
  IconPlay,
  IconRotateCcw,
  IconTargetArrow,
  IconBookMarked,
} from "@/components/dashboard/icons";

export const metadata = { title: "Home" };

/* Dashboard surfaces now follow the user's real theme (light / dark / system):
 * every colour below is a themed pair (light default, `dark:` override) so the
 * screen matches whatever the settings page has stored. No gradients. Hue is
 * chosen by role: indigo (brand) = actions / journey, sky = words,
 * amber = review, clay = streak. */
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

  // Fill widths: true percentages, with a small floor so a nonzero value always
  // shows a visible stub (the mock renders its 2% bars the same way).
  const overallPct = Math.min(100, (stats.learned / stats.totalVocabulary) * 100);
  const daysPct = Math.min(100, (stats.daysCompleted / 90) * 100);
  const wordsPct = overallPct;
  // Decorative scale for the streak bar (the mock shows ~20% at a 2-day streak)
  const streakPct = Math.min(100, stats.streak * 10);

  return (
    <div>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_476px]">
        {/* ----------------------------------------------------------- Hero */}
        {/* HeroArt renders its own light/dark pair internally (a lighter "day" hill
         * palette and the original "night" palette), but both stay dark enough for
         * the fixed light text/icons below to read clearly — so every element drawn
         * on top of it intentionally uses ONE constant light-toned colour set
         * instead of a light/dark pair. A light/dark pair here previously put
         * light-mode's dark text straight onto this art, which is why the whole
         * card read as blank/invisible in light mode.
         *
         * The frame around the art used to be a fixed dark border/bg (border-night-700
         * bg-night-850) in both themes, which made the card read as a stray dark
         * rectangle dropped onto an otherwise light page. border-black/10 is a soft
         * edge that sits naturally on art of any lightness, so light mode no longer
         * needs its own hard-coded dark ring. */}
        <section className="relative isolate overflow-hidden rounded-[20px] border border-black/10 bg-zinc-700 dark:border-night-700 dark:bg-night-850">
          <HeroArt />

          <div className="relative z-10 p-7 sm:p-8 lg:p-[34px]">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-brand-950 py-[9px] pe-5 ps-4">
                <IconTargetArrow className="h-[17px] w-[17px] text-brand-300" />
                <span className="sr-only">Day {dayNumber} of 90.</span>
                <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-mist-100">
                  {completed ? "Journey complete" : "Today's lesson"}
                </span>
              </span>
              {today?.stage ? (
                <span className="text-[12.5px] font-semibold uppercase tracking-[0.17em] text-zinc-400">
                  {today.stage}
                </span>
              ) : null}
            </div>

            <h1 className="mt-7 text-[42px] font-bold leading-[1.05] tracking-[-0.015em] text-zinc-50 sm:text-[54px]">
              {today?.title ?? `Day ${dayNumber}`}
            </h1>

            {today?.description ? (
              <p className="mt-7 text-[19px] leading-snug text-zinc-200">{today.description}</p>
            ) : null}
            {today?.focus ? (
              <p className="mt-5 max-w-[680px] text-[15px] leading-[1.65] text-zinc-400">{today.focus}</p>
            ) : null}

            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-sky-950">
                    <IconBookOpen className="h-4 w-4 text-sky-300" />
                  </span>
                  <span className="text-[15px] font-semibold text-zinc-100">Words learned today</span>
                </span>
                <span className="text-[15px] font-bold tabular-nums text-white">
                  {learnedValue}
                  <span className="font-medium text-zinc-500"> / 50</span>
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={learnedValue}
                aria-valuemin={0}
                aria-valuemax={50}
                aria-label={`Day ${dayNumber} vocabulary learned`}
                className="mt-4 h-2 w-full overflow-hidden rounded-full bg-night-600"
              >
                <div
                  className="h-full rounded-full bg-sky-400 transition-[width] duration-700 ease-out"
                  style={{ width: `${(learnedValue / 50) * 100}%` }}
                />
              </div>
              <p className="mt-4 flex items-center gap-2.5 text-[13px] text-zinc-400">
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-sky-300" />
                {usedToday} used in conversation
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href={`/day/${dayNumber}`}
                className="group inline-flex h-[52px] items-center gap-3.5 rounded-full bg-brand-600 px-9 text-[17px] font-semibold text-white transition hover:bg-brand-700 active:translate-y-px"
              >
                <IconPlay className="h-4 w-4" />
                {completed
                  ? `Revisit Day ${dayNumber}`
                  : learnedToday > 0
                    ? `Continue Day ${dayNumber}`
                    : `Start Day ${dayNumber}`}
                <IconArrowRight
                  className="h-[18px] w-[18px] transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </Link>
              {dayNumber > 1 ? (
                <Link
                  href={`/day/${dayNumber - 1}`}
                  className="inline-flex h-[52px] items-center gap-3 rounded-full border-[1.5px] border-zinc-600 px-9 text-[17px] font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-white/[0.04] active:translate-y-px"
                >
                  <IconRotateCcw className="h-[19px] w-[19px] text-zinc-200" />
                  Revisit Day {dayNumber - 1}
                </Link>
              ) : null}
              <Link
                href="/vocabulary"
                className="inline-flex h-[52px] items-center gap-3 rounded-full border-[1.5px] border-zinc-600 px-9 text-[17px] font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-white/[0.04] active:translate-y-px"
              >
                <IconBookOpen className="h-[19px] w-[19px] text-zinc-200" />
                Vocabulary
              </Link>
            </div>
          </div>

          {/* Day dial — hidden on phones, sits over the mountains like the mock */}
          <div aria-hidden="true" className="absolute end-[25px] top-5 hidden h-40 w-40 sm:block">
            <DayRing value={63} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-400">Day</span>
              <span className="mt-1 text-[42px] font-bold leading-none tracking-tight text-zinc-50">
                {String(dayNumber).padStart(2, "0")}
              </span>
              <span className="mt-1.5 text-[13px] text-zinc-400">of 90</span>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- 90-day path */}
        <aside
          aria-label="90-day path"
          className="flex flex-col rounded-[20px] border border-zinc-200 bg-white p-6 dark:border-night-700 dark:bg-night-900 sm:p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-brand-50 dark:bg-brand-950">
                <IconBookMarked className="h-[18px] w-[18px] text-brand-600 dark:text-brand-200" />
              </span>
              <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">90-day path</h2>
            </div>
            <Link
              href="/progress"
              className="group -mx-1 inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-[14.5px] font-semibold text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            >
              Details
              <IconArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Overall vocabulary */}
          <div className="mt-5 border-t border-zinc-200 pt-6 dark:border-night-700">
            <div className="flex items-center gap-4">
              <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950">
                <IconBookOpen className="h-[22px] w-[22px] text-sky-600 dark:text-sky-300" />
              </span>
              <div className="flex min-w-0 flex-1 items-end justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium text-zinc-600 dark:text-zinc-400">Vocabulary</p>
                  <p className="mt-1 text-[26px] font-bold leading-none tabular-nums text-zinc-900 dark:text-zinc-50">
                    {stats.overallPercent}%
                  </p>
                </div>
                <p className="pb-0.5 text-[13.5px] tabular-nums text-zinc-600 dark:text-zinc-400">
                  {stats.learned.toLocaleString()} / {stats.totalVocabulary.toLocaleString()} words
                </p>
              </div>
            </div>
            <div
              role="progressbar"
              aria-valuenow={stats.learned}
              aria-valuemin={0}
              aria-valuemax={stats.totalVocabulary}
              aria-label="Overall vocabulary progress"
              className="mt-4 h-[9px] w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-night-600"
            >
              <div
                className="h-full rounded-full bg-sky-600 transition-[width] duration-700 ease-out dark:bg-sky-400"
                style={{ width: `${overallPct}%`, minWidth: overallPct > 0 ? 30 : undefined }}
              />
            </div>
          </div>

          {/* Current + next stage */}
          <ul className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-night-700 dark:border-night-700">
            {pathStages.map(({ stage, index }) => {
              const isCurrent = index === currentStageIndex;
              const stagePct = Math.min(100, (stage.learned / stage.total) * 100);
              return (
                <li key={stage.label}>
                  <Link
                    href={`/journey#day-${stage.from}`}
                    className="group flex items-start gap-4 py-6"
                  >
                    <span
                      className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${
                        isCurrent ? "bg-brand-700" : "bg-zinc-100 dark:bg-zinc-800"
                      }`}
                    >
                      {isCurrent ? (
                        <IconLayers className="h-[22px] w-[22px] text-brand-200" />
                      ) : (
                        <IconChatDots className="h-[22px] w-[22px] text-zinc-600 dark:text-zinc-300" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[16px] font-semibold text-zinc-900 dark:text-zinc-50">{stage.label}</p>
                        {isCurrent ? (
                          <span className="shrink-0 rounded-full bg-brand-50 px-3.5 py-1.5 text-[13px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-200">
                            Current stage
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-zinc-100 px-3.5 py-1.5 text-[13px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            Up next
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-[13.5px]">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Days {stage.from}–{stage.to}
                        </span>
                        <span className="tabular-nums text-zinc-700 dark:text-zinc-300">
                          {stage.learned} / {stage.total}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-valuenow={stage.learned}
                        aria-valuemin={0}
                        aria-valuemax={stage.total}
                        aria-label={`${stage.label} progress`}
                        className="mt-4 h-[9px] w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-night-600"
                      >
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                            isCurrent ? "bg-brand-600 dark:bg-brand-400" : "bg-zinc-400 dark:bg-zinc-500"
                          }`}
                          style={{ width: `${stagePct}%`, minWidth: stagePct > 0 ? 30 : undefined }}
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/journey"
            className="relative mt-6 flex h-[54px] items-center justify-center rounded-[14px] border border-zinc-200 bg-zinc-900/[0.03] text-[15.5px] font-semibold text-zinc-900 transition-colors hover:bg-zinc-900/[0.06] dark:border-zinc-700 dark:bg-white/[0.03] dark:text-zinc-50 dark:hover:bg-white/[0.06]"
          >
            <span className="flex items-center gap-3">
              <IconBookOpen className="h-[19px] w-[19px] text-zinc-700 dark:text-zinc-200" />
              Open the full journey
            </span>
            <IconChevronRight className="absolute end-5 h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </Link>
        </aside>
      </div>

      {/* ------------------------------------------- Progress at a glance */}
      <section
        aria-label="Your progress at a glance"
        className="mt-10 grid grid-cols-1 gap-[22px] sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          href="/journey"
          tone="brand"
          label="Days completed"
          value={String(stats.daysCompleted)}
          suffix=" / 90"
          hint={`${90 - stats.daysCompleted} to go`}
          pct={daysPct}
          icon={<IconCalendar className="h-6 w-6" />}
        />
        <StatCard
          href="/vocabulary"
          tone="sky"
          label="Words learned"
          value={stats.learned.toLocaleString()}
          hint={`of ${stats.totalVocabulary.toLocaleString()}`}
          pct={wordsPct}
          icon={<IconTargetArrow className="h-6 w-6" />}
        />
        <StatCard
          href="/review"
          tone="amber"
          label="In review"
          value={stats.inReview.toLocaleString()}
          hint="words to revisit"
          pct={stats.inReview > 0 ? 100 : 0}
          icon={<IconFileText className="h-6 w-6" />}
        />
        <StatCard
          href="/progress"
          tone="clay"
          label="Day streak"
          value={String(stats.streak)}
          hint="days in a row"
          pct={streakPct}
          icon={<IconFlame className="h-6 w-6" />}
        />
      </section>
    </div>
  );
}

/* One hue per role, all at the same lightness / saturation band so four hues
 * still read as one calm family. The chip is the tinted-dark square behind the
 * icon; the bar is the progress fill. Class names are spelled out in full so
 * Tailwind can see them. */
const statTones = {
  brand: { chip: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300", bar: "bg-brand-600 dark:bg-brand-400" },
  sky: { chip: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300", bar: "bg-sky-600 dark:bg-sky-400" },
  amber: { chip: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", bar: "bg-amber-600 dark:bg-amber-500" },
  clay: { chip: "bg-clay-50 text-clay-700 dark:bg-clay-950 dark:text-clay-300", bar: "bg-clay-600 dark:bg-clay-400" },
} as const;

function StatCard({
  href,
  tone,
  label,
  value,
  suffix,
  hint,
  pct,
  icon,
}: {
  href: string;
  tone: keyof typeof statTones;
  label: string;
  value: string;
  suffix?: string;
  hint: string;
  pct: number;
  icon: ReactNode;
}) {
  const t = statTones[tone];
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-[18px] border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-night-700 dark:bg-night-900 dark:hover:border-zinc-600 lg:p-[22px]"
    >
      <div className="flex items-start gap-4">
        <span className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[16px] ${t.chip}`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200">{label}</p>
            <IconArrowRight className="h-5 w-5 shrink-0 text-zinc-600 transition-transform duration-150 group-hover:translate-x-0.5 dark:text-zinc-500" />
          </div>
          <p className="mt-2 text-[36px] font-bold leading-none tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            {value}
            {suffix ? <span className="text-[24px] font-medium text-zinc-600 dark:text-zinc-400">{suffix}</span> : null}
          </p>
          <p className="mt-2 text-[14px] text-zinc-600 dark:text-zinc-500">{hint}</p>
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Number(value.replace(/,/g, ""))}
        aria-label={label}
        className="mt-auto pt-5"
      >
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-night-600">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${t.bar}`}
            style={{ width: `${pct}%`, minWidth: pct > 0 ? 18 : undefined }}
          />
        </div>
      </div>
    </Link>
  );
}
