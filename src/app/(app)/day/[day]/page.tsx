import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDayFull, getDayVocabularyWithState } from "@/lib/queries";
import { getDayProgressView } from "@/services/day-progress";
import { DayTabs, type DayTab } from "@/components/day-tabs";
import { VocabularyCard } from "@/components/vocabulary-card";
import { AudioButton } from "@/components/audio-button";
import { CompleteDayButton } from "@/components/day-buttons";
import { Badge, EmptyState, ProgressBar } from "@/components/ui";
import { VocabularyState, VocabularyStateLabel, VocabularyStateStyle } from "@/lib/states";

export const metadata = { title: "Day" };

const VALID_TABS: DayTab[] = ["vocabulary", "grammar", "conversations", "paragraphs", "words"];

export default async function DayPage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser();
  const { day: dayParam } = await params;
  const { tab: tabParam } = await searchParams;
  const dayNumber = Number(dayParam);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 90) notFound();

  const day = await getDayFull(dayNumber);
  if (!day) notFound();

  const tab = (VALID_TABS.includes(tabParam as DayTab) ? tabParam : "vocabulary") as DayTab;
  const [vocabulary, progress, settings] = await Promise.all([
    getDayVocabularyWithState(user.id, dayNumber),
    getDayProgressView(user.id, dayNumber),
    db.userSettings.findUnique({ where: { userId: user.id } }),
  ]);
  const audioRate = settings?.audioSpeed === "slow" ? 0.8 : 1;
  const autoplayAudio = settings?.autoplayAudio ?? false;

  const learnedCount = vocabulary.filter(
    (v) => v.state !== VocabularyState.UNLEARNED,
  ).length;
  const usedCount = vocabulary.filter((v) => v.usedInConversation).length;

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5 text-sm">
          {dayNumber > 1 && (
            <Link
              href={`/day/${dayNumber - 1}`}
              className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300 transition-all"
              aria-label={`Go to Day ${dayNumber - 1}`}
            >
              ← Day {dayNumber - 1}
            </Link>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            DAY {String(dayNumber).padStart(2, "0")} / 90
          </span>
          <span className="hidden min-w-0 truncate text-xs font-semibold text-zinc-500 sm:inline dark:text-zinc-400">
            {day.stage}
          </span>
          {dayNumber < 90 && (
            <Link
              href={`/day/${dayNumber + 1}`}
              className="ml-auto inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-700 dark:hover:text-indigo-300 transition-all"
              aria-label={`Go to Day ${dayNumber + 1}`}
            >
              Day {dayNumber + 1} →
            </Link>
          )}
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {day.title}
          </h1>
          <p className="mt-1 text-base font-medium text-zinc-600 dark:text-zinc-400">{day.topic}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/70 flex items-start gap-3.5 shadow-xs">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-base font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            🎯
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Today&apos;s Focus
            </span>
            <p className="mt-0.5 text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
              {day.focus}
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400">Day {dayNumber} Learning Progress</span>
            <span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
              {learnedCount} / 50 words learned ({Math.round((learnedCount / 50) * 100)}%)
            </span>
          </div>
          <ProgressBar value={learnedCount} max={50} label="Day vocabulary learned" />
        </div>
      </header>

      {/* Unified Day Action (Complete / Reset) */}
      <CompleteDayButton
        dayNumber={dayNumber}
        completed={progress.status === "COMPLETED"}
        nextDay={dayNumber < 90 ? dayNumber + 1 : null}
      />

      {vocabulary.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <h2 className="text-lg font-semibold">Day {dayNumber}: {day.title}</h2>
          <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
            {day.description}
          </p>
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            Topic: {day.topic} · Stage: {day.stage}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/day/1"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              ← Revisit Day 1 (Full 50 Words & Lessons)
            </Link>
            <Link
              href="/journey"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              View 90-Day Journey Map
            </Link>
          </div>
        </div>
      ) : (
        <>
          <DayTabs day={dayNumber} active={tab} />

          {tab === "vocabulary" && (
            <section aria-label="Today's vocabulary" className="space-y-4">
              <div className="grid gap-3.5 lg:grid-cols-2">
                {vocabulary.map((word) => (
                  <VocabularyCard
                    key={word.id}
                    word={word}
                    trackDay={dayNumber}
                    audioRate={audioRate}
                    autoplayAudio={autoplayAudio}
                  />
                ))}
              </div>
            </section>
          )}

      {tab === "grammar" && (
        <section aria-label="Today's grammar" className="space-y-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Clear patterns, structural formulas, and real examples using today&apos;s 50 vocabulary words with Arabic explanations.
          </p>

          {day.grammarLessons.map((lesson) => (
            <article
              key={lesson.id}
              className="glass-card overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/95 space-y-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Grammar Focus
                  </span>
                  {lesson.titleArabic && (
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" dir="rtl">
                      {lesson.titleArabic}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {lesson.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-3xl">
                  {lesson.explanation}
                </p>
                {lesson.explanationArabic && (
                  <div className="mt-3 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/70 to-violet-50/40 p-4 text-sm font-medium text-indigo-950 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-violet-950/20 dark:text-indigo-200" dir="rtl">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">
                        ع
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        الشرح باللغة العربية:
                      </span>
                    </div>
                    <p className="leading-relaxed">{lesson.explanationArabic}</p>
                  </div>
                )}
              </div>

              {lesson.structures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Structural Formulas & Patterns · الصيغ والأنماط
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {lesson.structures.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-indigo-100/90 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 p-4 shadow-xs dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-violet-950/20"
                      >
                        <span className="inline-block rounded-md bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                          {s.label}
                        </span>
                        <div className="mt-2.5 font-mono text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                          {s.pattern}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Practical Examples — Using Today&apos;s Vocabulary · أمثلة تطبيقية
                </h3>
                <div className="space-y-2.5">
                  {lesson.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="hover-lift flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                            &ldquo;{ex.sentence}&rdquo;
                          </p>
                          {ex.translation && (
                            <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400 leading-relaxed" dir="rtl">
                              ↩ {ex.translation}
                            </p>
                          )}
                          {ex.usesVocabulary?.length > 0 && (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <span className="text-xs text-zinc-400 font-medium">Words:</span>
                              {ex.usesVocabulary.map((v, vi) => (
                                <span
                                  key={vi}
                                  className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <AudioButton
                          text={ex.sentence}
                          id={`grammar-${lesson.id}-${i}`}
                          rate={audioRate}
                          small
                          label="Listen to example"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {lesson.commonUsage.length > 0 && (
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Everyday Usage Notes · ملاحظات الاستخدام اليومي
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {lesson.commonUsage.map((u, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lesson.commonMistakes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                    Common Mistakes & Corrections · أخطاء شائعة وتصحيحها
                  </h3>
                  <div className="space-y-3">
                    {lesson.commonMistakes.map((m, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <div className="grid gap-3 p-4 sm:grid-cols-2 bg-zinc-50/50 dark:bg-zinc-950/30">
                          <div className="flex items-start gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              ✕
                            </span>
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                Incorrect · خطأ
                              </span>
                              <p className="mt-0.5 text-sm line-through text-rose-700 dark:text-rose-300 font-mono">
                                {m.wrong}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              ✓
                            </span>
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Correct · صواب
                              </span>
                              <p className="mt-0.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300 font-mono">
                                {m.right}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-zinc-100 bg-white px-4 py-2.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 flex items-center gap-2">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">Why · التفسير:</span>
                          <span>{m.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {tab === "conversations" && (
        <section aria-label="Today's conversations" className="space-y-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real everyday dialogues featuring today&apos;s 50 words with full Arabic line-by-line translations.
          </p>

          {day.conversations.map((conversation) => {
            const firstSpeaker = conversation.lines[0]?.speaker;

            return (
              <article
                key={conversation.id}
                className="glass-card overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/95"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5 dark:border-zinc-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Dialogue
                      </span>
                      {conversation.titleArabic && (
                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" dir="rtl">
                          {conversation.titleArabic}
                        </span>
                      )}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                        📍 {conversation.setting}
                      </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {conversation.title}
                    </h2>
                    {conversation.settingArabic && (
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400" dir="rtl">
                        الموقف: {conversation.settingArabic}
                      </p>
                    )}
                  </div>
                  <AudioButton
                    text={conversation.lines.map((l) => `${l.speaker}. ${l.text}`).join(" ")}
                    id={`conv-${conversation.id}`}
                    rate={audioRate}
                    label="Listen to Full Dialogue"
                  />
                </div>

                <div className="mt-6 space-y-4">
                  {conversation.lines.map((line, i) => {
                    const isSpeaker1 = line.speaker === firstSpeaker;
                    const speakerBadge = isSpeaker1
                      ? "bg-indigo-600 text-white shadow-indigo-600/20"
                      : "bg-emerald-600 text-white shadow-emerald-600/20";
                    const bubbleStyle = isSpeaker1
                      ? "border-indigo-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 bubble-speaker-a"
                      : "border-emerald-100 bg-emerald-50/40 dark:border-emerald-950 dark:bg-emerald-950/20 bubble-speaker-b sm:ml-6";

                    return (
                      <div key={i} className={`flex items-start gap-2.5 sm:gap-3.5 ${isSpeaker1 ? "" : "justify-start"}`}>
                        <div
                          className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold shadow-sm ${speakerBadge}`}
                        >
                          {line.speaker.slice(0, 2).toUpperCase()}
                        </div>
                        <div className={`flex-1 rounded-2xl border p-3.5 sm:p-4 shadow-xs transition-all ${bubbleStyle}`}>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                              {line.speaker}
                            </span>
                            <AudioButton
                              text={line.text}
                              id={`conv-line-${conversation.id}-${i}`}
                              rate={audioRate}
                              small
                              label={`Listen to ${line.speaker}`}
                            />
                          </div>
                          <p className="text-sm sm:text-base font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
                            {line.text}
                          </p>
                          {line.translation && (
                            <p className="mt-2 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 leading-relaxed border-t border-zinc-100 pt-2 dark:border-zinc-800/80" dir="rtl">
                              💬 {line.translation}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {tab === "paragraphs" && (
        <section aria-label="Today's paragraphs" className="space-y-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Read carefully to see how vocabulary connects into natural stories, with complete Arabic translations for full comprehension.
          </p>

          {day.paragraphs.map((paragraph) => {
            return (
              <article
                key={paragraph.id}
                className="glass-card overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-5 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/95"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-5 dark:border-zinc-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {paragraph.kind}
                      </span>
                      {paragraph.titleArabic && (
                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" dir="rtl">
                          {paragraph.titleArabic}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400 font-medium">· ~1 min read · Full narration</span>
                    </div>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {paragraph.title}
                    </h2>
                  </div>
                  <AudioButton
                    text={paragraph.text}
                    id={`para-${paragraph.id}`}
                    rate={audioRate}
                    label="Listen to Story"
                  />
                </div>

                <div className="mt-6">
                  <p className="drop-cap text-base sm:text-lg leading-8 text-zinc-800 dark:text-zinc-200 font-normal">
                    {paragraph.text}
                  </p>
                </div>

                {paragraph.translation && (
                  <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 p-5 sm:p-6 dark:border-emerald-900/50 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-teal-950/10 shadow-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-emerald-100/80 pb-3 dark:border-emerald-900/40">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
                          ع
                        </span>
                        <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                          الترجمة العربية للنص {paragraph.titleArabic ? `· ${paragraph.titleArabic}` : ""}
                        </h3>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        قراءة ثنائية اللغة
                      </span>
                    </div>
                    <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium" dir="rtl">
                      {paragraph.translation}
                    </p>
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-indigo-100/80 bg-indigo-50/40 p-4 text-xs text-indigo-900 dark:border-indigo-950 dark:bg-indigo-950/30 dark:text-indigo-200 flex items-center gap-2.5">
                  <span className="text-base">💡</span>
                  <p className="font-medium">
                    نصيحة: استمع إلى النص الإنجليزي أولاً مع الصوت، ثم راجع الترجمة العربية لتثبيت المفردات، ثم اقرأه بصوت مرتفع.
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {tab === "words" && (
        <section aria-label="My words for today" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Today&apos;s 50</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">50</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Learned</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{learnedCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Used in conversation</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{usedCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Not used yet</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{50 - usedCount}</p>
            </div>
          </div>

          {vocabulary.filter((v) => v.state !== "UNLEARNED" || v.usedInConversation).length === 0 ? (
            <EmptyState title="No words from today yet.">
              Learn words from the Vocabulary tab and they will collect here — your personal record
              of today&apos;s work.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {vocabulary
                .filter((v) => v.state !== "UNLEARNED" || v.usedInConversation)
                .map((word) => (
                  <li key={word.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <Link
                        href={`/vocabulary/${word.id}`}
                        className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
                      >
                        {word.headword}
                      </Link>
                      <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">{word.definition}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={VocabularyStateStyle[word.state as VocabularyState]}>
                        {VocabularyStateLabel[word.state as VocabularyState]}
                      </Badge>
                      {word.usedInConversation && (
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Used
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

        </>
      )}
    </div>
  );
}
