"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { GrammarAcademyLesson } from "@/lib/queries";
import { generateLessonQuiz, type QuizQuestion } from "@/lib/grammar-quiz";
import { AudioButton } from "@/components/audio-button";
import { Ar } from "@/components/ui";

interface GrammarAcademyProps {
  lessons: GrammarAcademyLesson[];
  initialDay?: number;
  currentDay?: number;
}

export function GrammarAcademy({ lessons, initialDay = 1, currentDay = 1 }: GrammarAcademyProps) {
  // Selection is keyed by lesson id, not day number: some days carry two grammar
  // lessons (e.g. Day 3 has both "There is / There are" and "Prepositions of
  // Place"), and a day-number key can only ever point at one of them.
  const [selectedLessonId, setSelectedLessonId] = useState<string>(() => {
    if (initialDay) {
      const initialLesson = lessons.find((l) => l.dayNumber === initialDay);
      if (initialLesson) return initialLesson.id;
    }
    return lessons[0]?.id ?? "";
  });

  const [activeTab, setActiveTab] = useState<"study" | "quiz">("study");
  const [searchQuery, setSearchQuery] = useState("");
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; total: number; percentage: number }>>({});

  // Load saved quiz scores from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("e90_grammar_scores");
      if (saved) {
        setQuizScores(JSON.parse(saved));
      }
    } catch {
      // Ignore local storage errors
    }
  }, []);

  // Filter lessons based on search query
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase();
    return lessons.filter(
      (lesson) =>
        lesson.title.toLowerCase().includes(q) ||
        (lesson.titleArabic && lesson.titleArabic.includes(q)) ||
        lesson.explanation.toLowerCase().includes(q) ||
        (lesson.explanationArabic && lesson.explanationArabic.includes(q)) ||
        lesson.day.topic.toLowerCase().includes(q) ||
        String(lesson.dayNumber) === q
    );
  }, [lessons, searchQuery]);

  // Group consecutive lessons that share a day number (6 of the 90 days carry two
  // grammar topics) into one card, so the sidebar shows the day once instead of
  // repeating its number and "اليوم" badge for each topic taught that day.
  const groupedLessons = useMemo(() => {
    const groups: { dayNumber: number; dayLessons: GrammarAcademyLesson[] }[] = [];
    for (const lesson of filteredLessons) {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dayNumber === lesson.dayNumber) {
        lastGroup.dayLessons.push(lesson);
      } else {
        groups.push({ dayNumber: lesson.dayNumber, dayLessons: [lesson] });
      }
    }
    return groups;
  }, [filteredLessons]);

  // Current active lesson
  const currentLesson = useMemo(() => {
    return lessons.find((l) => l.id === selectedLessonId) || lessons[0];
  }, [lessons, selectedLessonId]);

  // Next lesson in curriculum order — may be the second lesson of the same day
  // (for the 6 days that carry two grammar topics) before it advances to the
  // next day, unlike a plain "dayNumber + 1" jump.
  const nextLesson = useMemo(() => {
    const idx = lessons.findIndex((l) => l.id === currentLesson?.id);
    return idx >= 0 ? lessons[idx + 1] : undefined;
  }, [lessons, currentLesson]);

  // Quiz state for current lesson
  const [lessonQuestions, setLessonQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Regenerate quiz questions when lesson changes or quiz tab is selected
  useEffect(() => {
    if (currentLesson) {
      const qs = generateLessonQuiz(currentLesson);
      setLessonQuestions(qs);
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setSessionScore(0);
      setStreak(0);
      setQuizFinished(false);
    }
  }, [currentLesson]);

  const handleAnswerLessonQuestion = (optionIndex: number) => {
    if (isAnswered) return;
    const currentQ = lessonQuestions[currentQuestionIdx];
    if (!currentQ) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextLessonQuestion = () => {
    if (currentQuestionIdx + 1 < lessonQuestions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      setQuizFinished(true);
      const total = lessonQuestions.length;
      const finalScore = sessionScore + (selectedOption === lessonQuestions[currentQuestionIdx]?.correctIndex ? 0 : 0);
      const percentage = Math.round((finalScore / total) * 100);

      const updated = {
        ...quizScores,
        [currentLesson.id]: { score: finalScore, total, percentage },
      };
      setQuizScores(updated);
      try {
        localStorage.setItem("e90_grammar_scores", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const currentQ = lessonQuestions[currentQuestionIdx];
  const lessonScore = quizScores[currentLesson?.id];

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ─── Header ─── */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-night-700 dark:bg-night-900 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Grammar{" "}
              <Ar className="text-lg font-semibold text-clay-700 dark:text-clay-300 sm:text-xl">· قواعد اللغة الإنجليزية</Ar>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Link
              href={`/day/${currentDay}`}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-mist-300 dark:hover:bg-night-800 dark:hover:text-white"
            >
              <span>Day {currentDay}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Search ─── */}
      <div className="relative w-full sm:max-w-xs">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن قاعدة أو زمن أو موضوع..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 pe-8 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none dark:border-night-700 dark:bg-night-900/60 dark:text-white dark:placeholder:text-mist-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute end-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:text-mist-500 dark:hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lesson Directory & Day Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold tracking-tight text-zinc-600 dark:text-mist-300">
              قائمة الدروس ({filteredLessons.length})
            </h2>
            <span className="text-xs text-zinc-400 dark:text-mist-500">اختر يوماً للعرض</span>
          </div>

          <div className="max-h-[640px] overflow-y-auto space-y-3 pe-1.5 scrollbar-thin">
            {groupedLessons.map(({ dayNumber, dayLessons }) => {
              const isCurrentDay = dayNumber === currentDay;
              const isGroupSelected = dayLessons.some((l) => l.id === selectedLessonId);

              return (
                <div
                  key={dayNumber}
                  className={`w-full rounded-2xl border p-4 transition-all ${
                    isGroupSelected
                      ? "border-brand-500 bg-brand-50 dark:bg-night-850"
                      : "border-zinc-200 bg-white dark:border-night-800 dark:bg-night-900/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold font-mono ${
                        isGroupSelected
                          ? "bg-brand-500 text-white shadow-sm"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-night-800 dark:text-mist-300 dark:border-night-700"
                      }`}
                    >
                      {dayNumber}
                    </span>

                    <div className="min-w-0 flex-1">
                      {isCurrentDay && (
                        <span className="mb-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                          اليوم
                        </span>
                      )}

                      {dayLessons.map((lesson, i) => {
                        const isSelected = lesson.id === selectedLessonId;
                        const scoreData = quizScores[lesson.id];

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className={`block w-full text-start rounded-lg transition-colors ${
                              i > 0 ? "mt-2 border-t border-zinc-200 pt-2 dark:border-night-800/70" : ""
                            } ${isSelected ? "text-zinc-900 dark:text-white" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"}`}
                          >
                            <p className="truncate text-sm font-semibold">{lesson.title}</p>

                            {lesson.titleArabic && (
                              <p dir="rtl" lang="ar" className="mt-1 truncate text-xs text-clay-700 dark:text-clay-300">
                                {lesson.titleArabic}
                              </p>
                            )}

                            <div className="mt-2 flex items-center gap-2 text-[10px]">
                              <span className="text-zinc-400 dark:text-mist-500 truncate max-w-[130px]">{lesson.day.stage.split("—")[0]}</span>
                              {scoreData ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/60">
                                  <span>✓</span>
                                  <span>{scoreData.percentage}%</span>
                                </span>
                              ) : (
                                <span className="text-zinc-400 dark:text-mist-600">لم يُختبر</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLessons.length === 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500 dark:border-night-800 dark:bg-night-900/40 dark:text-mist-400">
                لا توجد دروس تطابق بحثك. جرب كلمة أخرى.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lesson Viewer or Quiz Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* View Mode Switcher Header */}
          {/* Flattened to one bordered level (was an outer card wrapping an inner pill track —
              §8/§26 Rule 02): a single quiet segmented control, same language as TabBar. */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-1.5 dark:border-night-800 dark:bg-night-900">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("study")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "study"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-mist-400 dark:hover:text-white"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>شرح وتفاصيل الدرس (Study)</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "quiz"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-mist-400 dark:hover:text-white"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>اختبار الدرس التفاعلي (Quiz)</span>
                {lessonScore && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9.5px] text-emerald-700 dark:text-emerald-300">
                    {lessonScore.percentage}%
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 px-2 text-xs text-zinc-500 dark:text-mist-400">
              <span>Day {currentLesson?.dayNumber}</span>
              <span>·</span>
              <span className="truncate max-w-[160px]">{currentLesson?.day.topic}</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              TAB 1: STUDY & DETAILED LESSON BREAKDOWN
              Reading-first per ENGLISH90_ROOT_CAUSE_VISUAL_READING_AUDIT.md §31/§44: the rule
              itself is the one thing the eye should land on (§18), not the day/stage badges
              around it. The English explanation is the primary reading anchor; the Arabic
              explanation is secondary and quiet, not an equal-weight twin box (§4, §25, §41).
              Every supporting section below (formulas, examples, usage notes, mistakes) is a
              labelled section with a divider, not another full bordered card nested inside this
              tab (§8 "Nested Visual Boundaries", §26 Rule 02).
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "study" && currentLesson && (
            <div className="space-y-8">
              {/* Lesson header: metadata quiet, title is the anchor (§18, §19) */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-mist-500">
                    Day {currentLesson.dayNumber} <span aria-hidden="true">·</span> {currentLesson.day.stage}
                  </p>
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-zinc-100 dark:text-brand-300 dark:hover:bg-night-800"
                  >
                    <span>اختبر نفسك في هذا الدرس</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">{currentLesson.title}</h2>
                  {currentLesson.titleArabic && (
                    <Ar className="mt-1 block text-lg font-semibold text-clay-700 dark:text-clay-300">{currentLesson.titleArabic}</Ar>
                  )}
                </div>

                {/* English explanation — the primary reading anchor: bounded width, relaxed
                    line-height, never leading-tight (§21, §22, §23). */}
                <p className="max-w-[70ch] text-[0.9375rem] leading-[1.65] text-zinc-700 dark:text-zinc-200">
                  {currentLesson.explanation}
                </p>

                {/* Arabic explanation — secondary, quiet warm tone, no competing box (§4, §41). */}
                {currentLesson.explanationArabic && (
                  <p dir="rtl" lang="ar" className="max-w-[70ch] text-[0.9375rem] leading-[1.8] text-clay-700 dark:text-clay-300">
                    {currentLesson.explanationArabic}
                  </p>
                )}
              </div>

              {/* Structural Formulas & Patterns */}
              {currentLesson.structures.length > 0 && (
                <div className="space-y-4 border-t border-zinc-200 pt-7 dark:border-night-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                      الصيغ والأنماط التركيبية <span className="text-zinc-400 dark:text-mist-500">(Structural Formulas)</span>
                    </h3>
                    <span className="text-xs text-zinc-400 dark:text-mist-500">{currentLesson.structures.length} صيغ</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentLesson.structures.map((s, i) => (
                      <div key={i} className="space-y-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-night-800 dark:bg-night-900/60">
                        <span className="inline-flex rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {s.label}
                        </span>
                        <p className="break-words font-mono text-sm font-medium leading-relaxed text-emerald-700 dark:text-emerald-300">
                          {s.pattern}
                        </p>
                        {s.explanationArabic && (
                          <p dir="rtl" lang="ar" className="border-t border-zinc-200 pt-1 text-xs text-zinc-500 dark:border-night-800 dark:text-mist-400">
                            {s.explanationArabic}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-Life Practical Examples */}
              {currentLesson.examples.length > 0 && (
                <div className="space-y-4 border-t border-zinc-200 pt-7 dark:border-night-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                      أمثلة تطبيقية <span className="text-zinc-400 dark:text-mist-500">(Practical Examples)</span>
                    </h3>
                    <span className="text-xs text-zinc-400 dark:text-mist-500">استمع للنطق الأصلي</span>
                  </div>
                  <div className="divide-y divide-zinc-200 dark:divide-night-800">
                    {currentLesson.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-3 py-3.5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-base leading-relaxed text-zinc-900 dark:text-white">&ldquo;{ex.sentence}&rdquo;</p>
                          {ex.translation && (
                            <p dir="rtl" lang="ar" className="text-sm leading-relaxed text-clay-700 dark:text-clay-300">
                              {ex.translation}
                            </p>
                          )}
                          {ex.usesVocabulary && ex.usesVocabulary.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] text-zinc-400 dark:text-mist-500">كلمات اليوم:</span>
                              {ex.usesVocabulary.map((word, wi) => (
                                <span key={wi} className="text-[11px] font-medium text-brand-700 dark:text-brand-300">
                                  {word}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0">
                          <AudioButton
                            text={ex.sentence}
                            id={`grammar-ex-${currentLesson.id}-${i}`}
                            small
                            label="استمع للمثال"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Everyday Usage Notes */}
              {currentLesson.commonUsage.length > 0 && (
                <div className="space-y-4 border-t border-zinc-200 pt-7 dark:border-night-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                    ملاحظات الاستخدام اليومي <span className="text-zinc-400 dark:text-mist-500">(Usage Notes)</span>
                  </h3>
                  <ul className="space-y-2">
                    {currentLesson.commonUsage.map((note, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes & Deep Analysis — the wrong/right split is a meaningful signal,
                  kept as its own bordered unit per item (§26 Rule 03: borders separate real
                  content, not decoration); the section itself no longer sits inside a second
                  outer card (§8). */}
              {currentLesson.commonMistakes.length > 0 && (
                <div className="space-y-4 border-t border-zinc-200 pt-7 dark:border-night-800">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                    الأخطاء الشائعة <span className="text-zinc-400 dark:text-mist-500">(Common Mistakes)</span>
                  </h3>
                  <div className="space-y-3">
                    {currentLesson.commonMistakes.map((m, i) => (
                      <div key={i} className="overflow-hidden rounded-lg border border-zinc-200 dark:border-night-800">
                        <div className="grid grid-cols-1 divide-y divide-zinc-200 dark:divide-night-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                          <div className="flex items-start gap-2.5 bg-rose-50 p-3.5 dark:bg-rose-950/20">
                            <span className="mt-0.5 shrink-0 text-xs font-bold text-rose-600 dark:text-rose-400">✕</span>
                            <p className="font-mono text-sm text-rose-700 dark:text-rose-200 line-through">{m.wrong}</p>
                          </div>
                          <div className="flex items-start gap-2.5 bg-emerald-50 p-3.5 dark:bg-emerald-950/20">
                            <span className="mt-0.5 shrink-0 text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</span>
                            <p className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-200">{m.right}</p>
                          </div>
                        </div>
                        <div className="border-t border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-night-800 dark:bg-night-900/60 dark:text-mist-300">
                          <span className="font-semibold text-clay-700 dark:text-clay-400">التفسير: </span>
                          <span>{m.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiet prompt to the quiz — one line, not a second full card (§25) */}
              <div className="flex flex-col items-center gap-3 border-t border-zinc-200 pt-7 text-center dark:border-night-800 sm:flex-row sm:justify-between sm:text-start">
                <p className="text-sm text-zinc-600 dark:text-mist-400">
                  جاهز لاختبار فهمك لقاعدة <span className="font-medium text-zinc-900 dark:text-mist-200">{currentLesson.title}</span>؟ (
                  {lessonQuestions.length} أسئلة)
                </p>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
                >
                  ابدأ الاختبار الآن →
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: INTERACTIVE LESSON QUIZ
              Per ENGLISH90_ROOT_CAUSE_VISUAL_READING_AUDIT.md §31/§32/§44: "Question → choices →
              feedback → next", nothing outweighs the question in visual weight. The question
              used to sit in its own bordered card nested inside the quiz stage card (§8); it now
              renders directly as the stage's primary content, and the header above it is quiet
              metadata, not a second title (§18, §25).
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "quiz" && (
            <div className="space-y-6">
              {!quizFinished && currentQ ? (
                <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-night-700 dark:bg-night-900 sm:p-8">
                  {/* Quiet header: lesson + progress metadata, not a competing headline */}
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-mist-500">
                      {currentLesson.title} <span aria-hidden="true">·</span> Day {currentLesson.dayNumber}
                    </p>
                    <div className="flex shrink-0 items-center gap-3 text-xs">
                      {streak > 1 && <span className="font-semibold text-amber-600 dark:text-amber-400">🔥 {streak}</span>}
                      <span className="font-mono font-semibold text-zinc-900 dark:text-mist-200">
                        {currentQuestionIdx + 1} / {lessonQuestions.length}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-night-800">
                    <div
                      className="h-full bg-brand-500 transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx + 1) / lessonQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question — the primary reading anchor of this screen (§18); no card wraps it */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-mist-500">
                      {currentQ.typeLabelArabic} <span className="opacity-70">({currentQ.typeLabel})</span>
                    </p>
                    <p className="text-lg font-semibold leading-relaxed text-zinc-900 dark:text-white sm:text-xl">{currentQ.prompt}</p>
                    <p dir="rtl" lang="ar" className="text-sm text-clay-700 dark:text-clay-300">
                      {currentQ.promptArabic}
                    </p>
                    {currentQ.sentenceSnippet && (
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 font-mono text-base font-semibold text-amber-700 dark:border-night-800 dark:bg-night-950 dark:text-amber-300">
                        {currentQ.sentenceSnippet}
                      </div>
                    )}
                    {currentQ.translation && (
                      <p dir="rtl" lang="ar" className="text-xs text-zinc-500 dark:text-mist-400">
                        المعنى بالعربي: {currentQ.translation}
                      </p>
                    )}
                  </div>

                  {/* 4 Options Grid — bordered, real interactive controls (§26 Rule 03) */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentQ.options.map((option, idx) => {
                      const isChosen = selectedOption === idx;
                      const isCorrect = idx === currentQ.correctIndex;

                      let btnStyle =
                        "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-night-750 dark:bg-night-950/80 dark:text-mist-200 dark:hover:border-night-600 dark:hover:bg-night-850";

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200";
                        } else if (isChosen && !isCorrect) {
                          btnStyle = "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200";
                        } else {
                          btnStyle = "border-zinc-200 bg-zinc-50 text-zinc-400 opacity-60 dark:border-night-800 dark:bg-night-950/40 dark:text-mist-600";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerLessonQuestion(idx)}
                          className={`flex items-center gap-3 rounded-xl border p-4 text-start text-sm font-medium transition-all ${btnStyle}`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                              isAnswered && isCorrect
                                ? "bg-emerald-500 text-night-950"
                                : isAnswered && isChosen && !isCorrect
                                  ? "bg-rose-500 text-white"
                                  : "border border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-night-700 dark:bg-night-800 dark:text-mist-400"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="min-w-0 flex-1 break-words">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Banner — meaningful feedback, kept as its own bordered
                      unit since it needs to read as a distinct system message (§26 Rule 03) */}
                  {isAnswered && (
                    <div
                      className={`space-y-1.5 rounded-xl border p-4 animate-fadeIn ${
                        selectedOption === currentQ.correctIndex
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-200"
                          : "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700/60 dark:bg-rose-950/40 dark:text-rose-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold">
                          {selectedOption === currentQ.correctIndex
                            ? "✓ إجابة صحيحة وممتازة!"
                            : "✕ إجابة غير صحيحة — راجع القاعدة:"}
                        </p>
                        <span className="font-mono text-xs text-zinc-500 dark:text-mist-400">
                          الصواب: {currentQ.options[currentQ.correctIndex]}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-95">{currentQ.explanation}</p>
                      {currentQ.explanationArabic && (
                        <p dir="rtl" lang="ar" className="pt-1 text-xs opacity-90">
                          {currentQ.explanationArabic}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Footer */}
                  {isAnswered && (
                    <div className="flex items-center justify-end pt-2">
                      <button
                        onClick={handleNextLessonQuestion}
                        className="rounded-lg bg-brand-600 px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-500 active:scale-95"
                      >
                        {currentQuestionIdx + 1 < lessonQuestions.length
                          ? "السؤال التالي (Next Question) →"
                          : "عرض النتيجة النهائية (Finish Quiz) 🎉"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Quiz Finished Summary — the score is the reading anchor here; the three
                   numbers below it are a quiet inline stat line, not a boxed mini-dashboard
                   (§26 Rule 02). */
                <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-night-700 dark:bg-night-900">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl text-white">
                    🏆
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">اكتمل اختبار {currentLesson.title}!</h3>
                    <p className="text-sm text-zinc-600 dark:text-mist-300">
                      نتيجتك: {sessionScore} من {lessonQuestions.length} (
                      {Math.round((sessionScore / Math.max(1, lessonQuestions.length)) * 100)}%)
                    </p>
                  </div>

                  <div className="mx-auto flex max-w-sm items-center justify-center gap-8">
                    <div>
                      <p className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">{sessionScore}</p>
                      <p className="text-[11px] text-zinc-400 dark:text-mist-500">صحيحة</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-bold text-rose-600 dark:text-rose-400">
                        {lessonQuestions.length - sessionScore}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-mist-500">أخطاء</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-bold text-amber-600 dark:text-amber-300">
                        {Math.round((sessionScore / Math.max(1, lessonQuestions.length)) * 100)}%
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-mist-500">الإتقان</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const qs = generateLessonQuiz(currentLesson);
                        setLessonQuestions(qs);
                        setCurrentQuestionIdx(0);
                        setSelectedOption(null);
                        setIsAnswered(false);
                        setSessionScore(0);
                        setStreak(0);
                        setQuizFinished(false);
                      }}
                      className="rounded-lg border border-zinc-200 bg-zinc-100 px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 dark:border-night-750 dark:bg-night-850 dark:text-mist-200 dark:hover:bg-night-800 dark:hover:text-white"
                    >
                      🔄 إعادة الاختبار
                    </button>
                    <button
                      onClick={() => setActiveTab("study")}
                      className="rounded-lg border border-brand-200 bg-brand-50 px-5 py-2.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-300 dark:hover:bg-brand-900"
                    >
                      📖 مراجعة الشرح
                    </button>
                    {nextLesson && (
                      <button
                        onClick={() => {
                          setSelectedLessonId(nextLesson.id);
                          setActiveTab("study");
                        }}
                        className="rounded-lg bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-500"
                      >
                        الدرس القادم (Day {nextLesson.dayNumber}) →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
