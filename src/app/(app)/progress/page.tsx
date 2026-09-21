import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getUserStats } from "@/services/stats";
import { Card, PageHeader, ProgressBar, SectionHeading, StatTile, buttonClass } from "@/components/ui";

export const metadata = { title: "Curriculum Progress" };

export default async function ProgressPage() {
  const user = await requireUser();
  const stats = await getUserStats(user.id);
  const daysPercent = Math.min(100, Math.round((stats.daysCompleted / 90) * 100));

  // Word-state distribution (learning + review + mastered = learned)
  const total = stats.totalVocabulary;
  const segments = [
    { key: "mastered", label: "Mastered", value: stats.mastered, bar: "bg-emerald-600 dark:bg-emerald-500", dot: "bg-emerald-600 dark:bg-emerald-500" },
    { key: "review", label: "In review", value: stats.inReview, bar: "bg-amber-500 dark:bg-amber-400", dot: "bg-amber-500 dark:bg-amber-400" },
    { key: "learning", label: "Learning", value: stats.learning, bar: "bg-sky-600 dark:bg-sky-500", dot: "bg-sky-600 dark:bg-sky-500" },
    { key: "unlearned", label: "Not learned yet", value: stats.unlearned, bar: "bg-zinc-300 dark:bg-zinc-700", dot: "bg-zinc-300 dark:bg-zinc-600" },
  ];
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Progress"
        description="Your milestones across the 90-day English curriculum — no exams, no pressure."
        actions={
          <Link href={`/day/${stats.currentDay}`} className={buttonClass("primary", "md", "px-5")}>
            Continue Day {stats.currentDay} <span aria-hidden="true">→</span>
          </Link>
        }
      />

      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Current day" value={`Day ${stats.currentDay}`} hint="of 90 days" />
        <StatTile label="Days completed" value={stats.daysCompleted} hint={`${90 - stats.daysCompleted} remaining`} />
        <StatTile label="Words learned" value={stats.learned.toLocaleString()} hint={`of ${total.toLocaleString()} words`} />
        <StatTile label="Mastered" value={stats.mastered.toLocaleString()} hint="fully confident" />
        <StatTile label="Used in conversation" value={stats.usedInConversation.toLocaleString()} hint="in your own practice" />
        <StatTile
          label="Day streak"
          value={stats.streak}
          hint={stats.streak > 0 ? "days in a row" : "start today"}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5">
          <SectionHeading title="Overall" description="Days finished and vocabulary learned." />
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span className="text-zinc-700 dark:text-zinc-300">Days finished</span>
                <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
                  {stats.daysCompleted} / 90 ({daysPercent}%)
                </span>
              </div>
              <ProgressBar value={stats.daysCompleted} max={90} label="Days completed" />
            </div>
            <div>
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span className="text-zinc-700 dark:text-zinc-300">Vocabulary learned</span>
                <span className="tabular-nums text-zinc-600 dark:text-zinc-400">
                  {stats.learned.toLocaleString()} / {total.toLocaleString()} ({stats.overallPercent}%)
                </span>
              </div>
              <ProgressBar value={stats.learned} max={total} label="Vocabulary learned" />
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <SectionHeading title="Your words" description="How the 4,500 words are distributed right now." />
          <div
            role="img"
            aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(", ")}
            className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800"
          >
            {segments.map((s) => (
              <span key={s.key} className={s.bar} style={{ width: `${pct(s.value)}%` }} />
            ))}
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {segments.map((s) => (
              <li key={s.key} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} aria-hidden="true" />
                  {s.label}
                </span>
                <span className="tabular-nums text-zinc-600 dark:text-zinc-400">{s.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="space-y-3" aria-label="Progress by stage">
        <SectionHeading title="By stage" description="Nine stages of ten days each — 500 words per stage.">
          <Link href="/journey" className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
            Open the journey →
          </Link>
        </SectionHeading>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {stats.stageProgress.map((stage) => {
            const isCurrent = stats.currentDay >= stage.from && stats.currentDay <= stage.to;
            return (
              <Link
                key={stage.label}
                href={`/journey#day-${stage.from}`}
                className={`block rounded-2xl border bg-white p-4 transition-colors hover:border-brand-300 dark:bg-zinc-900 dark:hover:border-brand-700 ${
                  isCurrent
                    ? "border-brand-300 dark:border-brand-800"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Days {stage.from}–{stage.to}
                  {isCurrent ? " · Current" : ""}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{stage.label}</p>
                <ProgressBar className="mt-3" value={stage.learned} max={stage.total} label={`${stage.label} progress`} />
                <p className="mt-1.5 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                  {stage.learned} / {stage.total} words
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
