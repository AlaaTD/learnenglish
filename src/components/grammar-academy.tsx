"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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

  // Unified lesson picker: combines search + day/lesson selection into a single combobox
  // (replaces the old always-visible sidebar list — keeps mobile layouts compact).
  const [isLessonPickerOpen, setIsLessonPickerOpen] = useState(false);
  const lessonPickerRef = useRef<HTMLDivElement>(null);
  const lessonSearchInputRef = useRef<HTMLInputElement>(null);

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

  // Close the lesson picker on outside click or Escape, the two standard ways users expect a
  // combobox popover to dismiss.
  useEffect(() => {
    if (!isLessonPickerOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (lessonPickerRef.current && !lessonPickerRef.current.contains(event.target as Node)) {
        setIsLessonPickerOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLessonPickerOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLessonPickerOpen]);

  // Focus the search field the moment the picker opens; clear the filter on close so the next
  // open always starts from the full list.
  useEffect(() => {
    if (isLessonPickerOpen) {
      lessonSearchInputRef.current?.focus();
    } else {
      setSearchQuery("");
    }
  }, [isLessonPickerOpen]);

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
  // grammar topics) into one card, so the picker shows the day once instead of
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

      {/* ─── Lesson selector: its own full-width row, clearly labelled and styled as a
          dropdown — the primary "which lesson" control, kept above and visually separate
          from the Study/Quiz switch below it (they are not peers: Study/Quiz act on
          whichever lesson is chosen here). ─── */}
      <div className="space-y-1">
        <label className="block px-0.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-mist-600">
          Lesson
        </label>
        {/* Lesson picker: a single combobox trigger that opens search + the day/lesson list,
            replacing the old always-open sidebar column so mobile gets its space back. */}
        <div className="relative" ref={lessonPickerRef}>
          {/* Trigger — looks exactly like a native <select> input */}
          <button
            type="button"
            onClick={() => setIsLessonPickerOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={isLessonPickerOpen}
            className={`group flex w-full items-center rounded-lg border bg-zinc-50 text-start transition-all dark:bg-night-950 ${
              isLessonPickerOpen
                ? "border-brand-500 ring-2 ring-brand-500/20 dark:border-brand-500"
                : "border-zinc-300 dark:border-night-700"
            }`}
          >
            {/* Inline label — always visible, anchors the field semantically */}
            <span className="select-none shrink-0 border-r border-zinc-200 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:border-night-700 dark:text-mist-600">
              درس
            </span>

            {/* Current value */}
            <span className="min-w-0 flex-1 truncate px-3 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-100">
              {currentLesson?.title ?? (
                <span className="text-zinc-400 dark:text-mist-600">اختر درساً…</span>
              )}
            </span>

            {/* Chevron zone — full-height, contrasting bg like a native select arrow */}
            <span
              aria-hidden="true"
              className={`flex shrink-0 flex-col items-center justify-center self-stretch rounded-r-lg px-3 transition-colors ${
                isLessonPickerOpen
                  ? "bg-brand-600 text-white"
                  : "bg-zinc-200 text-zinc-500 group-hover:bg-zinc-300 dark:bg-night-700 dark:text-mist-300 dark:group-hover:bg-night-600"
              }`}
            >
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-150 ${isLessonPickerOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {isLessonPickerOpen && (
            <div
              role="listbox"
              aria-label="قائمة الدروس"
              className="absolute start-0 top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lift dark:border-night-700 dark:bg-night-900 sm:w-[26rem] sm:max-w-[calc(100vw-2rem)]"
            >
              <div className="space-y-2 border-b border-zinc-200 p-2.5 dark:border-night-800">
                <div className="flex items-center justify-between px-0.5">
                  <Ar className="text-xs font-semibold text-zinc-500 dark:text-mist-400">
                    قائمة الدروس ({filteredLessons.length})
                  </Ar>
                </div>
                <div className="relative" dir="rtl">
                  <input
                    ref={lessonSearchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن قاعدة أو زمن أو موضوع..."
                    lang="ar"
                    style={{ lineHeight: "1.25rem" }}
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2 ps-3 pe-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none dark:border-night-700 dark:bg-night-950/60 dark:text-white dark:placeholder:text-mist-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute end-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:text-mist-500 dark:hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin">
                {groupedLessons.map(({ dayNumber, dayLessons }) => {
                  const isCurrentDay = dayNumber === currentDay;
                  const isGroupSelected = dayLessons.some((l) => l.id === selectedLessonId);

                  return (
                    <div key={dayNumber} className="mb-1 last:mb-0">
                      <div className="flex items-center gap-2 px-1.5 pt-1.5">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold font-mono ${
                            isGroupSelected
                              ? "bg-brand-500 text-white"
                              : "bg-zinc-100 text-zinc-500 dark:bg-night-800 dark:text-mist-400"
                          }`}
                        >
                          {dayNumber}
                        </span>
                        {isCurrentDay && (
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            اليوم
                          </span>
                        )}
                      </div>

                      {dayLessons.map((lesson) => {
                        const isSelected = lesson.id === selectedLessonId;
                        const scoreData = quizScores[lesson.id];

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setIsLessonPickerOpen(false);
                            }}
                            className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-start transition-colors ${
                              isSelected
                                ? "bg-brand-50 dark:bg-brand-950/40"
                                : "hover:bg-zinc-50 dark:hover:bg-night-850/60"
                            }`}
                          >
                            {/* Selected indicator */}
                            <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                              isSelected ? "bg-brand-500" : "bg-transparent"
                            }`} />
                            <span className="min-w-0 flex-1">
                              <span className={`block truncate text-sm ${
                                isSelected ? "font-semibold text-brand-700 dark:text-brand-300" : "font-medium text-zinc-800 dark:text-zinc-200"
                              }`}>{lesson.title}</span>
                              {lesson.titleArabic && (
                                <Ar className="block truncate text-xs text-zinc-400 dark:text-mist-500">
                                  {lesson.titleArabic}
                                </Ar>
                              )}
                            </span>
                            {scoreData && (
                              <span className="shrink-0 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                                {scoreData.percentage}%
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}

                {filteredLessons.length === 0 && (
                  <div className="p-6 text-center text-sm text-zinc-500 dark:text-mist-400">
                    لا توجد دروس تطابق بحثك. جرب كلمة أخرى.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Study / Quiz mode switcher: its own row below the lesson selector, not beside
          it — this is the user-reported hierarchy fix. Study and Quiz are how you engage
          with the lesson already picked above, so they read as secondary to it. ─── */}
      <div className="flex justify-center sm:justify-start">
        <div className="flex items-stretch gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-night-800 dark:bg-night-800/60">
          <button
            onClick={() => setActiveTab("study")}
            className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:flex-none sm:px-4 sm:text-sm ${
              activeTab === "study"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-mist-400 dark:hover:text-white"
            }`}
          >
            <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <Ar>
              الشرح<span className="hidden sm:inline"> وتفاصيل الدرس (Study)</span>
            </Ar>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:flex-none sm:px-4 sm:text-sm ${
              activeTab === "quiz"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-mist-400 dark:hover:text-white"
            }`}
          >
            <svg className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <Ar>
              الاختبار<span className="hidden sm:inline"> التفاعلي (Quiz)</span>
            </Ar>
            {lessonScore && (
              <span className="shrink-0 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300 sm:px-2 sm:text-[11px]">
                {lessonScore.percentage}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── Content: full width now that the sidebar list lives inside the picker ─── */}
      <div className="space-y-5">
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

              {/* Title: English LTR first, Arabic RTL below with a subtle divider */}
              <div className="space-y-2">
                <div dir="ltr">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">{currentLesson.title}</h2>
                </div>
                {currentLesson.titleArabic && (
                  <div dir="rtl" className="border-t border-zinc-100 pt-2 dark:border-night-800">
                    <Ar className="block text-lg font-semibold text-clay-700 dark:text-clay-300">{currentLesson.titleArabic}</Ar>
                  </div>
                )}
              </div>

              {/* English explanation — primary anchor, always LTR (§21, §22, §23). */}
              <div dir="ltr">
                <p className="max-w-[70ch] text-[0.9375rem] leading-[1.65] text-zinc-700 dark:text-zinc-200">
                  {currentLesson.explanation}
                </p>
              </div>

              {/* Arabic explanation — secondary, RTL, separated by a faint rule (§4, §41). */}
              {currentLesson.explanationArabic && (
                <div dir="rtl" className="border-t border-zinc-100 pt-3 dark:border-night-800">
                  <p lang="ar" className="max-w-[70ch] text-[0.9375rem] leading-[1.8] text-clay-700 dark:text-clay-300">
                    {currentLesson.explanationArabic}
                  </p>
                </div>
              )}
            </div>

            {/* Structural Formulas & Patterns */}
            {currentLesson.structures.length > 0 && (
              <div className="space-y-4 border-t border-zinc-200 pt-7 dark:border-night-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                    <Ar>
                      الصيغ والأنماط التركيبية <span className="text-zinc-400 dark:text-mist-500">(Structural Formulas)</span>
                    </Ar>
                  </h3>
                  <Ar className="text-xs text-zinc-400 dark:text-mist-500">{currentLesson.structures.length} صيغ</Ar>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {currentLesson.structures.map((s, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-night-800 dark:bg-night-900/60">
                      {/* Label + pattern — always LTR */}
                      <div dir="ltr" className="space-y-1.5">
                        <span className="inline-flex rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {s.label}
                        </span>
                        <p className="break-words font-mono text-sm font-medium leading-relaxed text-emerald-700 dark:text-emerald-300">
                          {s.pattern}
                        </p>
                      </div>
                      {/* Arabic explanation — RTL, separated */}
                      {s.explanationArabic && (
                        <div dir="rtl" className="border-t border-zinc-200 pt-2 dark:border-night-800">
                          <p lang="ar" className="text-xs leading-relaxed text-zinc-500 dark:text-mist-400">
                            {s.explanationArabic}
                          </p>
                        </div>
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
                    <Ar>
                      أمثلة تطبيقية <span className="text-zinc-400 dark:text-mist-500">(Practical Examples)</span>
                    </Ar>
                  </h3>
                  <span className="text-xs text-zinc-400 dark:text-mist-500">استمع للنطق الأصلي</span>
                </div>
                <div className="divide-y divide-zinc-200 dark:divide-night-800">
                  {currentLesson.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-2.5 py-3.5 first:pt-0 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0 flex-1 space-y-2">
                        {/* English sentence — LTR */}
                        <div dir="ltr">
                          <p className="text-base leading-relaxed text-zinc-900 dark:text-white">&ldquo;{ex.sentence}&rdquo;</p>
                        </div>
                        {/* Arabic translation — RTL, separated */}
                        {ex.translation && (
                          <div dir="rtl" className="border-t border-zinc-100 pt-1.5 dark:border-night-800">
                            <p lang="ar" className="text-sm leading-relaxed text-clay-700 dark:text-clay-300">
                              {ex.translation}
                            </p>
                          </div>
                        )}
                        {ex.usesVocabulary && ex.usesVocabulary.length > 0 && (
                          <div dir="ltr" className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[11px] text-zinc-400 dark:text-mist-500">كلمات اليوم:</span>
                            {ex.usesVocabulary.map((word, wi) => (
                              <span key={wi} className="text-[11px] font-medium text-brand-700 dark:text-brand-300">
                                {word}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 pt-0.5">
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
                  <Ar>
                    ملاحظات الاستخدام اليومي <span className="text-zinc-400 dark:text-mist-500">(Usage Notes)</span>
                  </Ar>
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
                  <Ar>
                    الأخطاء الشائعة <span className="text-zinc-400 dark:text-mist-500">(Common Mistakes)</span>
                  </Ar>
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
                        <Ar>
                          <span className="font-semibold text-clay-700 dark:text-clay-400">التفسير: </span>
                          {m.note}
                        </Ar>
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
                  {/* Question type label: Arabic RTL + English LTR side-by-side but scoped */}
                  <div className="flex items-center gap-2">
                    <span dir="rtl" lang="ar" className="text-xs font-semibold text-zinc-500 dark:text-mist-500">{currentQ.typeLabelArabic}</span>
                    <span aria-hidden="true" className="text-zinc-300 dark:text-night-700">·</span>
                    <span dir="ltr" className="text-xs font-semibold text-zinc-400 dark:text-mist-600">({currentQ.typeLabel})</span>
                  </div>

                  {/* English question — LTR */}
                  <div dir="ltr">
                    <p className="text-lg font-semibold leading-relaxed text-zinc-900 dark:text-white sm:text-xl">{currentQ.prompt}</p>
                  </div>

                  {/* Arabic translation of question — RTL, separated */}
                  <div dir="rtl" className="border-t border-zinc-100 pt-1.5 dark:border-night-800">
                    <p lang="ar" className="text-sm text-clay-700 dark:text-clay-300">
                      {currentQ.promptArabic}
                    </p>
                  </div>

                  {currentQ.sentenceSnippet && (
                    <div dir="ltr" className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 font-mono text-base font-semibold text-amber-700 dark:border-night-800 dark:bg-night-950 dark:text-amber-300">
                      {currentQ.sentenceSnippet}
                    </div>
                  )}
                  {currentQ.translation && (
                    <div dir="rtl" className="border-t border-zinc-100 pt-1 dark:border-night-800">
                      <p lang="ar" className="text-xs text-zinc-500 dark:text-mist-400">
                        المعنى بالعربي: {currentQ.translation}
                      </p>
                    </div>
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
                    {/* Feedback header — Arabic verdict RTL, correct answer label LTR */}
                    <div dir="rtl" className="flex items-center justify-between gap-3">
                      <p lang="ar" className="text-xs font-bold">
                        {selectedOption === currentQ.correctIndex
                          ? "✓ إجابة صحيحة وممتازة!"
                          : "✕ إجابة غير صحيحة — راجع القاعدة:"}
                      </p>
                      <span dir="ltr" className="font-mono text-xs text-zinc-500 dark:text-mist-400">
                        {currentQ.options[currentQ.correctIndex]}
                      </span>
                    </div>
                    {/* English explanation — LTR */}
                    <div dir="ltr">
                      <p className="text-xs leading-relaxed opacity-95">{currentQ.explanation}</p>
                    </div>
                    {/* Arabic explanation — RTL, separated */}
                    {currentQ.explanationArabic && (
                      <div dir="rtl" className="border-t border-current/10 pt-1.5">
                        <p lang="ar" className="text-xs opacity-90">
                          {currentQ.explanationArabic}
                        </p>
                      </div>
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
  );
}
