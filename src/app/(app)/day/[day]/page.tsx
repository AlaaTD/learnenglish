import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDayFull, getDayVocabularyWithState } from "@/lib/queries";
import { getDayProgressView } from "@/services/day-progress";
import { DayTabs, type DayTab } from "@/components/day-tabs";
import { VocabularyCard } from "@/components/vocabulary-card";
import { AudioButton } from "@/components/audio-button";
import { CompleteDayButton } from "@/components/day-buttons";
import {
  ArabicText,
  Badge,
  Card,
  EmptyState,
  PageHeader,
  ProgressBar,
  SmallLabel,
  StatTile,
  Tag,
  buttonClass,
} from "@/components/ui";
import { VocabularyState, VocabularyStateLabel, VocabularyStateStyle } from "@/lib/states";

export const metadata = { title: "Day" };

const VALID_TABS: DayTab[] = ["vocabulary", "grammar", "conversations", "paragraphs", "words"];

/** Sub-section title inside a lesson card. */
function SubHeading({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "danger" }) {
  return (
    <h3
      className={`text-xs font-semibold uppercase tracking-wide ${
        tone === "danger" ? "text-rose-700 dark:text-rose-300" : "text-zinc-500 dark:text-zinc-400"
      }`}
    >
      {children}
    </h3>
  );
}

/** One-line description shown above the content of a tab. */
function TabIntro({ children }: { children: ReactNode }) {
  return <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</p>;
}

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

  const learnedCount = vocabulary.filter((v) => v.state !== VocabularyState.UNLEARNED).length;
  const usedCount = vocabulary.filter((v) => v.usedInConversation).length;
  const learnedPercent = Math.round((learnedCount / 50) * 100);
  const completed = progress.status === "COMPLETED";
  const myWords = vocabulary.filter((v) => v.state !== "UNLEARNED" || v.usedInConversation);

  return (
    <div className="space-y-5">
      {/* Compact header: where you are, the title, and prev/next */}
      <PageHeader
        eyebrow={
          <>
            Day {String(dayNumber).padStart(2, "0")} of 90{day.stage ? ` · ${day.stage}` : ""}
          </>
        }
        title={day.title}
        description={day.topic}
        actions={
          <>
            {completed ? (
              <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                ✓ Completed
              </Badge>
            ) : null}
            {dayNumber > 1 ? (
              <Link
                href={`/day/${dayNumber - 1}`}
                className={buttonClass("secondary", "sm")}
                aria-label={`Go to Day ${dayNumber - 1}`}
              >
                ← Day {dayNumber - 1}
              </Link>
            ) : null}
            {dayNumber < 90 ? (
              <Link
                href={`/day/${dayNumber + 1}`}
                className={buttonClass("secondary", "sm")}
                aria-label={`Go to Day ${dayNumber + 1}`}
              >
                Day {dayNumber + 1} →
              </Link>
            ) : null}
          </>
        }
      />

      {/* Focus + progress in one card (two columns on desktop) */}
      <Card className="grid gap-4 md:grid-cols-3 md:items-center md:gap-6">
        <div className="md:col-span-2">
          <SmallLabel>Today&apos;s focus</SmallLabel>
          <p className="mt-1 text-sm leading-relaxed text-zinc-800 sm:text-base dark:text-zinc-200">{day.focus}</p>
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Words learned</span>
            <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              {learnedCount} / 50
              <span className="ms-1.5 text-xs font-normal text-zinc-500 dark:text-zinc-400">({learnedPercent}%)</span>
            </span>
          </div>
          <ProgressBar
            value={learnedCount}
            max={50}
            label="Day vocabulary learned"
            tone={completed ? "success" : "accent"}
          />
        </div>
      </Card>

      {vocabulary.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <h2 className="text-lg font-semibold">
            Day {dayNumber}: {day.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-amber-900 dark:text-amber-100">{day.description}</p>
          <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">
            Topic: {day.topic} · Stage: {day.stage}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/day/1" className={buttonClass("primary")}>
              ← Revisit Day 1 (Full 50 Words &amp; Lessons)
            </Link>
            <Link href="/journey" className={buttonClass("secondary")}>
              View 90-Day Journey Map
            </Link>
          </div>
        </div>
      ) : (
        <>
          <DayTabs day={dayNumber} active={tab} />

          {/* ─── Vocabulary ─── */}
          {tab === "vocabulary" && (
            <section aria-label="Today's vocabulary">
              <div className="grid items-start gap-3 lg:grid-cols-2">
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

          {/* ─── Grammar ─── */}
          {tab === "grammar" && (
            <section aria-label="Today's grammar" className="space-y-4">
              <TabIntro>
                Clear patterns, structural formulas, and real examples using today&apos;s 50 vocabulary words with
                Arabic explanations.
              </TabIntro>

              {day.grammarLessons.map((lesson) => (
                <Card key={lesson.id} className="space-y-6 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <Tag tone="accent">Grammar focus</Tag>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {lesson.title}
                      </h2>
                      {lesson.titleArabic ? <ArabicText className="mt-0.5">{lesson.titleArabic}</ArabicText> : null}
                    </div>

                    <div className={`grid gap-4 ${lesson.explanationArabic ? "md:grid-cols-2" : ""}`}>
                      <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {lesson.explanation}
                      </p>
                      {lesson.explanationArabic ? (
                        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                          <p dir="rtl" className="mb-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                            الشرح باللغة العربية:
                          </p>
                          <ArabicText>{lesson.explanationArabic}</ArabicText>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {lesson.structures.length > 0 && (
                    <div className="space-y-3">
                      <SubHeading>Structural Formulas &amp; Patterns · الصيغ والأنماط</SubHeading>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {lesson.structures.map((s, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40"
                          >
                            <Tag tone="accent">{s.label}</Tag>
                            <p className="mt-2 break-words font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {s.pattern}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <SubHeading>Practical Examples — Using Today&apos;s Vocabulary · أمثلة تطبيقية</SubHeading>
                    <ul className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                      {lesson.examples.map((ex, i) => (
                        <li key={i} className="flex items-start justify-between gap-3 p-3.5 sm:p-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
                              &ldquo;{ex.sentence}&rdquo;
                            </p>
                            {ex.translation ? <ArabicText className="mt-1">{ex.translation}</ArabicText> : null}
                            {(ex.usesVocabulary?.length ?? 0) > 0 && (
                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">Words:</span>
                                {ex.usesVocabulary.map((v, vi) => (
                                  <Tag key={vi} tone="accent">
                                    {v}
                                  </Tag>
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
                        </li>
                      ))}
                    </ul>
                  </div>

                  {lesson.commonUsage.length > 0 && (
                    <div className="space-y-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/40">
                      <SubHeading>Everyday Usage Notes · ملاحظات الاستخدام اليومي</SubHeading>
                      <ul className="space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {lesson.commonUsage.map((u, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400"
                            />
                            <span>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lesson.commonMistakes.length > 0 && (
                    <div className="space-y-3">
                      <SubHeading tone="danger">Common Mistakes &amp; Corrections · أخطاء شائعة وتصحيحها</SubHeading>
                      <div className="space-y-3">
                        {lesson.commonMistakes.map((m, i) => (
                          <div
                            key={i}
                            className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
                          >
                            <div className="grid divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-zinc-800">
                              <div className="flex items-start gap-2.5 p-3.5">
                                <span
                                  aria-hidden="true"
                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                                >
                                  ✕
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                                    Incorrect · خطأ
                                  </p>
                                  <p className="mt-0.5 break-words font-mono text-sm text-rose-800 line-through dark:text-rose-200">
                                    {m.wrong}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5 p-3.5">
                                <span
                                  aria-hidden="true"
                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                                >
                                  ✓
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                    Correct · صواب
                                  </p>
                                  <p className="mt-0.5 break-words font-mono text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                                    {m.right}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="border-t border-zinc-100 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                              <span className="font-semibold text-indigo-700 dark:text-indigo-300">Why · التفسير: </span>
                              {m.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </section>
          )}

          {/* ─── Conversations ─── */}
          {tab === "conversations" && (
            <section aria-label="Today's conversations" className="space-y-4">
              <TabIntro>
                Real everyday dialogues featuring today&apos;s 50 words with full Arabic line-by-line translations.
              </TabIntro>

              {day.conversations.map((conversation) => {
                const firstSpeaker = conversation.lines[0]?.speaker;

                return (
                  <Card key={conversation.id} className="space-y-5 sm:p-6">
                    <div className="flex flex-col gap-3 border-b border-zinc-100 pb-4 sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag tone="accent">Dialogue</Tag>
                          {conversation.setting ? (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{conversation.setting}</span>
                          ) : null}
                        </div>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                          {conversation.title}
                        </h2>
                        {conversation.titleArabic ? (
                          <ArabicText className="mt-0.5">{conversation.titleArabic}</ArabicText>
                        ) : null}
                        {conversation.settingArabic ? (
                          <p dir="rtl" lang="ar" className="text-sm text-zinc-500 dark:text-zinc-400">
                            الموقف: {conversation.settingArabic}
                          </p>
                        ) : null}
                      </div>
                      <AudioButton
                        text={conversation.lines.map((l) => `${l.speaker}. ${l.text}`).join(" ")}
                        id={`conv-${conversation.id}`}
                        rate={audioRate}
                        label="Listen to Full Dialogue"
                      />
                    </div>

                    {/* Chat layout: first speaker at the start edge, the other at the end edge */}
                    <div className="flex flex-col gap-3">
                      {conversation.lines.map((line, i) => {
                        const isFirst = line.speaker === firstSpeaker;
                        return (
                          <div
                            key={i}
                            className={`max-w-full rounded-2xl border p-3.5 sm:max-w-[85%] sm:p-4 ${
                              isFirst
                                ? "self-start border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/60"
                                : "self-end border-indigo-100 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/60"
                            }`}
                          >
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
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
                            <p className="text-base leading-relaxed text-zinc-900 dark:text-zinc-100">{line.text}</p>
                            {line.translation ? (
                              <ArabicText className="mt-2 border-t border-zinc-200 pt-2 dark:border-zinc-700">
                                {line.translation}
                              </ArabicText>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </section>
          )}

          {/* ─── Paragraphs ─── */}
          {tab === "paragraphs" && (
            <section aria-label="Today's paragraphs" className="space-y-4">
              <TabIntro>
                Read carefully to see how vocabulary connects into natural stories, with complete Arabic translations
                for full comprehension.
              </TabIntro>
              <p dir="rtl" lang="ar" className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
                نصيحة: استمع إلى النص الإنجليزي أولاً مع الصوت، ثم راجع الترجمة العربية لتثبيت المفردات، ثم اقرأه
                بصوت مرتفع.
              </p>

              {day.paragraphs.map((paragraph) => (
                <Card key={paragraph.id} className="space-y-5 sm:p-6">
                  <div className="flex flex-col gap-3 border-b border-zinc-100 pb-4 sm:flex-row sm:items-start sm:justify-between dark:border-zinc-800">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag tone="accent">{paragraph.kind}</Tag>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">~1 min read · Full narration</span>
                      </div>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {paragraph.title}
                      </h2>
                      {paragraph.titleArabic ? (
                        <ArabicText className="mt-0.5">{paragraph.titleArabic}</ArabicText>
                      ) : null}
                    </div>
                    <AudioButton
                      text={paragraph.text}
                      id={`para-${paragraph.id}`}
                      rate={audioRate}
                      label="Listen to Story"
                    />
                  </div>

                  {/* English and Arabic side by side on desktop, stacked on phones */}
                  <div className={`grid gap-6 ${paragraph.translation ? "lg:grid-cols-2" : ""}`}>
                    <div>
                      <SmallLabel className="mb-2">English</SmallLabel>
                      <p className="text-base leading-8 text-zinc-800 sm:text-lg dark:text-zinc-200">
                        {paragraph.text}
                      </p>
                    </div>
                    {paragraph.translation ? (
                      <div className="rounded-xl bg-zinc-50 p-4 sm:p-5 dark:bg-zinc-800/50">
                        <p dir="rtl" lang="ar" className="mb-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                          الترجمة العربية للنص
                        </p>
                        <ArabicText className="sm:text-lg">{paragraph.translation}</ArabicText>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ))}
            </section>
          )}

          {/* ─── My words ─── */}
          {tab === "words" && (
            <section aria-label="My words for today" className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="Today's 50" value={50} />
                <StatTile label="Learned" value={learnedCount} />
                <StatTile label="Used in conversation" value={usedCount} />
                <StatTile label="Not used yet" value={50 - usedCount} />
              </div>

              {myWords.length === 0 ? (
                <EmptyState title="No words from today yet.">
                  Learn words from the Vocabulary tab and they will collect here — your personal record of
                  today&apos;s work.
                </EmptyState>
              ) : (
                <Card padded={false} className="overflow-hidden">
                  <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {myWords.map((word) => (
                      <li key={word.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/vocabulary/${word.id}`}
                            className="font-medium text-zinc-900 hover:text-indigo-700 hover:underline dark:text-zinc-100 dark:hover:text-indigo-300"
                          >
                            {word.headword}
                          </Link>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{word.definition}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge className={VocabularyStateStyle[word.state as VocabularyState]}>
                            {VocabularyStateLabel[word.state as VocabularyState]}
                          </Badge>
                          {word.usedInConversation && (
                            <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                              Used
                            </Badge>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </section>
          )}
        </>
      )}

      {/* Finish the day: sits at the end of the content, after you've gone through it */}
      <CompleteDayButton
        dayNumber={dayNumber}
        completed={completed}
        nextDay={dayNumber < 90 ? dayNumber + 1 : null}
      />
    </div>
  );
}
