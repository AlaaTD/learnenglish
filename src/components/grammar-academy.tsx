"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { GrammarAcademyLesson } from "@/lib/queries";
import { generateLessonQuiz, generateChallengeQuiz, type QuizQuestion } from "@/lib/grammar-quiz";
import { AudioButton } from "@/components/audio-button";

interface GrammarAcademyProps {
  lessons: GrammarAcademyLesson[];
  initialDay?: number;
  currentDay?: number;
}

const STAGES = [
  { id: "ALL", name: "All Stages", nameArabic: "جميع المراحل", days: "1–50" },
  { id: "Foundation — Daily Life", name: "Stage 1: Foundation", nameArabic: "المرحلة الأولى: التأسيس والحياة اليومية", days: "1–10" },
  { id: "Expanding Horizons", name: "Stage 2: Horizons", nameArabic: "المرحلة الثانية: توسيع المدارك", days: "11–20" },
  { id: "Work, Media and the World", name: "Stage 3: Work & Media", nameArabic: "المرحلة الثالثة: العمل والإعلام", days: "21–30" },
  { id: "Professional and Abstract", name: "Stage 4: Professional", nameArabic: "المرحلة الرابعة: المفاهيم المهنية", days: "31–40" },
  { id: "Relationships, Personality and Emotions", name: "Stage 5: Emotions & Society", nameArabic: "المرحلة الخامسة: العلاقات والمشاعر", days: "41–50" },
];

export function GrammarAcademy({ lessons, initialDay = 1, currentDay = 1 }: GrammarAcademyProps) {
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    if (initialDay && lessons.some((l) => l.dayNumber === initialDay)) {
      return initialDay;
    }
    return lessons[0]?.dayNumber ?? 1;
  });

  const [activeTab, setActiveTab] = useState<"study" | "quiz" | "challenge">("study");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("ALL");
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

  // Filter lessons based on stage and search query
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesStage = selectedStage === "ALL" || lesson.day.stage === selectedStage;
      if (!matchesStage) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        lesson.title.toLowerCase().includes(q) ||
        (lesson.titleArabic && lesson.titleArabic.includes(q)) ||
        lesson.explanation.toLowerCase().includes(q) ||
        (lesson.explanationArabic && lesson.explanationArabic.includes(q)) ||
        lesson.day.topic.toLowerCase().includes(q) ||
        String(lesson.dayNumber) === q
      );
    });
  }, [lessons, selectedStage, searchQuery]);

  // Current active lesson
  const currentLesson = useMemo(() => {
    return lessons.find((l) => l.dayNumber === selectedDay) || lessons[0];
  }, [lessons, selectedDay]);

  // Quiz state for current lesson
  const [lessonQuestions, setLessonQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Challenge quiz questions
  const [challengeQuestions, setChallengeQuestions] = useState<QuizQuestion[]>([]);
  const [challengeQuestionIdx, setChallengeQuestionIdx] = useState(0);
  const [challengeSelectedOption, setChallengeSelectedOption] = useState<number | null>(null);
  const [challengeIsAnswered, setChallengeIsAnswered] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [challengeFinished, setChallengeFinished] = useState(false);

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

  const handleStartChallenge = () => {
    const stageLessons = selectedStage === "ALL" ? lessons : lessons.filter((l) => l.day.stage === selectedStage);
    const qs = generateChallengeQuiz(stageLessons, 15);
    setChallengeQuestions(qs);
    setChallengeQuestionIdx(0);
    setChallengeSelectedOption(null);
    setChallengeIsAnswered(false);
    setChallengeScore(0);
    setChallengeStreak(0);
    setChallengeFinished(false);
    setActiveTab("challenge");
  };

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

  const handleAnswerChallengeQuestion = (optionIndex: number) => {
    if (challengeIsAnswered) return;
    const currentQ = challengeQuestions[challengeQuestionIdx];
    if (!currentQ) return;

    setChallengeSelectedOption(optionIndex);
    setChallengeIsAnswered(true);

    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      setChallengeScore((prev) => prev + 1);
      setChallengeStreak((prev) => prev + 1);
    } else {
      setChallengeStreak(0);
    }
  };

  const handleNextChallengeQuestion = () => {
    if (challengeQuestionIdx + 1 < challengeQuestions.length) {
      setChallengeQuestionIdx((prev) => prev + 1);
      setChallengeSelectedOption(null);
      setChallengeIsAnswered(false);
    } else {
      setChallengeFinished(true);
    }
  };

  const currentQ = lessonQuestions[currentQuestionIdx];
  const challengeQ = challengeQuestions[challengeQuestionIdx];
  const lessonScore = quizScores[currentLesson?.id];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ─── Hero Header ─── */}
      <div className="rounded-3xl border border-night-700 bg-night-900 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/60 px-3.5 py-1 text-xs font-semibold text-brand-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>English90 ACADEMY · نظام القواعد الشامل</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-english">
              Grammar Academy{" "}
              <span className="text-clay-400 font-arabic text-2xl sm:text-3xl font-bold">
                · أكاديمية القواعد الإنجليزية
              </span>
            </h1>
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-mist-300">
              قسم مستقل ومفصل لدراسة قواعد اللغة الإنجليزية بأعلى درجات الدقة والعمق، مع شروحات عربية أصيلة، وصيغ
              تركيبية موثقة، واختبارات تفاعلية فورية مخصصة لكل يوم من أيام المنهج.
            </p>
          </div>

          {/* Quick Challenge Trigger Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleStartChallenge}
              className="flex items-center justify-center gap-2 rounded-2xl bg-clay-500 hover:bg-clay-400 px-5 py-3.5 text-sm font-bold text-night-950 shadow-md transition-all active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>تحدي القواعد الشامل (Challenge Mode)</span>
            </button>
            <Link
              href={`/day/${currentDay}`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-night-700 bg-night-800/80 px-4 py-3.5 text-sm font-semibold text-mist-200 transition-all hover:bg-night-700 hover:text-white"
            >
              <span>اليوم الحالي (Day {currentDay})</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-night-800 pt-6">
          <div className="rounded-2xl border border-night-800/80 bg-night-900/60 p-3.5">
            <p className="text-xs text-mist-400">الدروس المتاحة (Lessons)</p>
            <p className="mt-1 text-2xl font-bold text-white font-mono">{lessons.length} درس</p>
            <p className="text-[11px] text-emerald-400">Days 1 – {lessons.length}</p>
          </div>
          <div className="rounded-2xl border border-night-800/80 bg-night-900/60 p-3.5">
            <p className="text-xs text-mist-400">الصيغ والأنماط (Formulas)</p>
            <p className="mt-1 text-2xl font-bold text-white font-mono">
              {lessons.reduce((acc, l) => acc + l.structures.length, 0)}+ صيغة
            </p>
            <p className="text-[11px] text-brand-300">Monospace Blueprints</p>
          </div>
          <div className="rounded-2xl border border-night-800/80 bg-night-900/60 p-3.5">
            <p className="text-xs text-mist-400">الأمثلة الصوتية (Audio Ex.)</p>
            <p className="mt-1 text-2xl font-bold text-white font-mono">
              {lessons.reduce((acc, l) => acc + l.examples.length, 0)}+ مثال
            </p>
            <p className="text-[11px] text-clay-400">Native Audio Pronunciation</p>
          </div>
          <div className="rounded-2xl border border-night-800/80 bg-night-900/60 p-3.5">
            <p className="text-xs text-mist-400">الاختبارات التفاعلية (Quizzes)</p>
            <p className="mt-1 text-2xl font-bold text-white font-mono">
              {Object.keys(quizScores).length} / {lessons.length}
            </p>
            <p className="text-[11px] text-amber-300">دروس تم اجتياز اختبارها</p>
          </div>
        </div>
      </div>

      {/* ─── Search & Stage Filter Bar ─── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Stage Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStage(s.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedStage === s.id
                  ? "bg-brand-600 text-white shadow-md ring-1 ring-brand-400"
                  : "bg-night-900 text-mist-400 hover:bg-night-800 hover:text-mist-200 border border-night-800"
              }`}
            >
              <span>{s.name}</span>
              <span className="ms-1.5 text-[10px] opacity-75 font-mono">({s.days})</span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن قاعدة أو زمن أو موضوع..."
            className="w-full rounded-xl border border-night-700 bg-night-900/90 px-3.5 py-2 pe-9 text-xs text-white placeholder:text-mist-500 focus:border-brand-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-mist-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Directory & Day Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold tracking-tight text-mist-300">
              قائمة الدروس ({filteredLessons.length})
            </h2>
            <span className="text-xs text-mist-500">اختر يوماً للعرض</span>
          </div>

          <div className="max-h-[640px] overflow-y-auto space-y-2 pe-1.5 scrollbar-thin">
            {filteredLessons.map((lesson) => {
              const isSelected = lesson.dayNumber === selectedDay;
              const isCurrentDay = lesson.dayNumber === currentDay;
              const scoreData = quizScores[lesson.id];

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedDay(lesson.dayNumber);
                    if (activeTab === "challenge") setActiveTab("study");
                  }}
                  className={`w-full text-start flex items-start gap-3 rounded-2xl border p-3.5 transition-all ${
                    isSelected
                      ? "border-brand-500 bg-night-850 shadow-sm ring-1 ring-brand-500/40"
                      : "border-night-800 bg-night-900/70 hover:border-night-750 hover:bg-night-850 text-mist-300"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold font-mono ${
                      isSelected
                        ? "bg-brand-500 text-white shadow-sm"
                        : "bg-night-800 text-mist-300 border border-night-700"
                    }`}
                  >
                    {lesson.dayNumber}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <p
                        className={`truncate text-sm font-semibold ${
                          isSelected ? "text-white" : "text-zinc-200"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      {isCurrentDay && (
                        <span className="shrink-0 rounded-full bg-emerald-950 px-2 py-0.5 text-[9.5px] font-bold text-emerald-300 border border-emerald-800">
                          اليوم
                        </span>
                      )}
                    </div>

                    {lesson.titleArabic && (
                      <p className="mt-0.5 truncate text-xs text-clay-300 font-arabic">
                        {lesson.titleArabic}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-[10px]">
                      <span className="text-mist-500 truncate max-w-[130px]">{lesson.day.stage.split("—")[0]}</span>
                      {scoreData ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-300 border border-emerald-800/60">
                          <span>✓</span>
                          <span>{scoreData.percentage}%</span>
                        </span>
                      ) : (
                        <span className="text-mist-600">لم يُختبر</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredLessons.length === 0 && (
              <div className="rounded-2xl border border-night-800 bg-night-900/40 p-6 text-center text-sm text-mist-400">
                لا توجد دروس تطابق بحثك. جرب كلمة أخرى أو اختر مرحلة مختلفة.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lesson Viewer or Quiz Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* View Mode Switcher Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-night-700/80 bg-night-900/90 p-2 shadow-inner">
            <div className="flex items-center gap-1.5 p-1 bg-night-950 rounded-xl border border-night-800">
              <button
                onClick={() => setActiveTab("study")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "study"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-mist-400 hover:text-white"
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
                    : "text-mist-400 hover:text-white"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>اختبار الدرس التفاعلي (Quiz)</span>
                {lessonScore && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9.5px] text-emerald-300">
                    {lessonScore.percentage}%
                  </span>
                )}
              </button>

              <button
                onClick={handleStartChallenge}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "challenge"
                    ? "bg-clay-500 text-night-950 font-bold shadow-sm"
                    : "text-mist-400 hover:text-white"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>التحدي الشامل</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 px-2 text-xs text-mist-400">
              <span>Day {currentLesson?.dayNumber}</span>
              <span>·</span>
              <span className="truncate max-w-[160px]">{currentLesson?.day.topic}</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              TAB 1: STUDY & DETAILED LESSON BREAKDOWN
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "study" && currentLesson && (
            <div className="space-y-6">
              {/* Lesson Hero Header */}
              <div className="rounded-3xl border border-night-700 bg-night-900/90 p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-900/70 border border-brand-700 px-3 py-0.5 text-xs font-bold text-brand-300 font-mono">
                      Day {currentLesson.dayNumber}
                    </span>
                    <span className="rounded-full bg-night-800 px-3 py-0.5 text-xs font-medium text-mist-400 border border-night-700">
                      {currentLesson.day.stage}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab("quiz")}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-500 active:scale-95"
                  >
                    <span>🎯 اختبر نفسك في هذا الدرس</span>
                    <span>→</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-english">
                    {currentLesson.title}
                  </h2>
                  {currentLesson.titleArabic && (
                    <p className="mt-1 text-lg font-semibold text-clay-300 font-arabic">
                      {currentLesson.titleArabic}
                    </p>
                  )}
                </div>

                {/* English & Arabic Explanation Grid */}
                <div className="grid gap-4 md:grid-cols-2 pt-2">
                  <div className="rounded-2xl border border-night-750 bg-night-950/60 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                      <span>Conceptual Explanation (English)</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-200">
                      {currentLesson.explanation}
                    </p>
                  </div>

                  {currentLesson.explanationArabic && (
                    <div className="rounded-2xl border border-night-750 bg-night-950/60 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-clay-400 font-arabic">
                        <span className="h-1.5 w-1.5 rounded-full bg-clay-400" />
                        <span>الشرح والقاعدة بالتفصيل (Arabic)</span>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-200 font-arabic">
                        {currentLesson.explanationArabic}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Structural Formulas & Patterns */}
              {currentLesson.structures.length > 0 && (
                <div className="rounded-3xl border border-night-700 bg-night-900/80 p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-400" />
                      <h3 className="text-base font-bold text-white">
                        الصيغ والأنماط التركيبية (Structural Formulas &amp; Patterns)
                      </h3>
                    </div>
                    <span className="text-xs text-mist-500 font-mono">
                      {currentLesson.structures.length} صيغ محددة
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentLesson.structures.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-night-750 bg-night-950 p-4 space-y-2 transition-all hover:border-brand-600/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="inline-flex rounded-lg bg-brand-950 px-2.5 py-0.5 text-xs font-bold text-brand-300 border border-brand-800/60">
                            {s.label}
                          </span>
                        </div>
                        <p className="font-mono text-sm font-semibold text-emerald-300 break-words leading-relaxed">
                          {s.pattern}
                        </p>
                        {s.explanationArabic && (
                          <p className="text-xs text-mist-400 font-arabic pt-1 border-t border-night-850">
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
                <div className="rounded-3xl border border-night-700 bg-night-900/80 p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-clay-400" />
                      <h3 className="text-base font-bold text-white">
                        أمثلة تطبيقية واقعية مع الصوتيات (Practical Examples)
                      </h3>
                    </div>
                    <span className="text-xs text-mist-500">استمع للنطق الأصلي</span>
                  </div>

                  <div className="space-y-2.5">
                    {currentLesson.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-night-750 bg-night-950/70 p-4 transition-all hover:border-night-700"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-base font-medium text-white leading-relaxed font-english">
                            &ldquo;{ex.sentence}&rdquo;
                          </p>
                          {ex.translation && (
                            <p className="text-sm text-clay-300 font-arabic leading-relaxed">
                              {ex.translation}
                            </p>
                          )}
                          {ex.usesVocabulary && ex.usesVocabulary.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                              <span className="text-[11px] text-mist-500">كلمات اليوم:</span>
                              {ex.usesVocabulary.map((word, wi) => (
                                <span
                                  key={wi}
                                  className="rounded-md bg-night-850 px-2 py-0.5 text-[11px] font-medium text-brand-300 border border-night-700"
                                >
                                  {word}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 pt-1 sm:pt-0">
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
                <div className="rounded-3xl border border-night-700 bg-night-900/80 p-6 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-400" />
                    <h3 className="text-base font-bold text-white">
                      ملاحظات الاستخدام اليومي والمحادثة (Everyday Usage Notes)
                    </h3>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {currentLesson.commonUsage.map((note, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes & Deep Analysis */}
              {currentLesson.commonMistakes.length > 0 && (
                <div className="rounded-3xl border border-night-700 bg-night-900/80 p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-400" />
                      <h3 className="text-base font-bold text-white">
                        تحليل الأخطاء الشائعة وتصحيحها (Common Mistakes &amp; Corrections)
                      </h3>
                    </div>
                    <span className="text-xs text-rose-300 font-semibold">تجنب هذه العثرات</span>
                  </div>

                  <div className="space-y-3.5">
                    {currentLesson.commonMistakes.map((m, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-2xl border border-night-750 bg-night-950"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:divide-night-800 divide-night-800">
                          {/* Incorrect */}
                          <div className="p-4 flex items-start gap-3 bg-rose-950/20">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-900/80 text-rose-200 text-xs font-bold">
                              ✕
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                                Incorrect · خطأ شائع
                              </p>
                              <p className="mt-1 font-mono text-sm text-rose-200 line-through">
                                {m.wrong}
                              </p>
                            </div>
                          </div>

                          {/* Correct */}
                          <div className="p-4 flex items-start gap-3 bg-emerald-950/20">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-900/80 text-emerald-200 text-xs font-bold">
                              ✓
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                                Correct · الصواب
                              </p>
                              <p className="mt-1 font-mono text-sm font-semibold text-emerald-200">
                                {m.right}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Why / Explanation Note */}
                        <div className="border-t border-night-800 bg-night-900/60 p-3.5 px-4 text-xs text-mist-300">
                          <span className="font-bold text-clay-400">التفسير والقاعدة: </span>
                          <span>{m.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA Card to Quiz */}
              <div className="rounded-3xl border border-night-700 bg-night-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1 text-center sm:text-start">
                  <h4 className="text-lg font-bold text-white">
                    جاهز لاختبار فهمك لقاعدة {currentLesson.title}؟
                  </h4>
                  <p className="text-xs text-mist-400">
                    أجب عن {lessonQuestions.length} أسئلة تفاعلية متنوعة للتأكد من رسوخ القاعدة واكتشاف أي أخطاء لديك.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-500 hover:scale-105 active:scale-95"
                >
                  <span>ابدأ الاختبار الآن (Take Quiz) ✍️</span>
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: INTERACTIVE LESSON QUIZ
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "quiz" && (
            <div className="space-y-5">
              {!quizFinished && currentQ ? (
                <div className="rounded-3xl border border-night-700 bg-night-900 p-6 sm:p-8 shadow-2xl space-y-6">
                  {/* Quiz Header Bar */}
                  <div className="flex items-center justify-between border-b border-night-800 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
                        اختبار درس اليوم {currentLesson.dayNumber}
                      </span>
                      <h3 className="text-lg font-bold text-white">{currentLesson.title}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {streak > 1 && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-950 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-800">
                          🔥 {streak} متتالية
                        </span>
                      )}
                      <div className="text-end">
                        <span className="text-xs font-bold text-white font-mono">
                          السؤال {currentQuestionIdx + 1} / {lessonQuestions.length}
                        </span>
                        <p className="text-[10px] text-mist-400">النقاط: {sessionScore}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-night-800">
                    <div
                      className="h-full bg-brand-500 transition-all duration-300"
                      style={{
                        width: `${((currentQuestionIdx + 1) / lessonQuestions.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Question Prompt Card */}
                  <div className="rounded-2xl border border-night-750 bg-night-950 p-5 space-y-3">
                    <div className="inline-flex rounded-lg bg-brand-950/80 px-2.5 py-0.5 text-xs font-bold text-brand-300 border border-brand-800/60">
                      {currentQ.typeLabelArabic} ({currentQ.typeLabel})
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                      {currentQ.prompt}
                    </p>
                    <p className="text-xs text-clay-300 font-arabic">{currentQ.promptArabic}</p>

                    {currentQ.sentenceSnippet && (
                      <div className="mt-3 rounded-xl border border-night-800 bg-night-900/80 p-3.5 font-mono text-base font-semibold text-amber-300">
                        {currentQ.sentenceSnippet}
                      </div>
                    )}

                    {currentQ.translation && (
                      <p className="text-xs text-mist-400 font-arabic">
                        المعنى بالعربي: {currentQ.translation}
                      </p>
                    )}
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentQ.options.map((option, idx) => {
                      const isChosen = selectedOption === idx;
                      const isCorrect = idx === currentQ.correctIndex;

                      let btnStyle =
                        "border-night-750 bg-night-950/80 text-mist-200 hover:border-night-600 hover:bg-night-850";

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-md ring-1 ring-emerald-500";
                        } else if (isChosen && !isCorrect) {
                          btnStyle = "border-rose-500 bg-rose-950/60 text-rose-200 ring-1 ring-rose-500";
                        } else {
                          btnStyle = "border-night-800 bg-night-950/40 text-mist-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerLessonQuestion(idx)}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-start font-medium text-sm transition-all ${btnStyle}`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold font-mono ${
                              isAnswered && isCorrect
                                ? "bg-emerald-500 text-night-950"
                                : isAnswered && isChosen && !isCorrect
                                ? "bg-rose-500 text-white"
                                : "bg-night-800 text-mist-400 border border-night-700"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="min-w-0 flex-1 break-words">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Banner */}
                  {isAnswered && (
                    <div
                      className={`rounded-2xl border p-4 space-y-1.5 animate-fadeIn ${
                        selectedOption === currentQ.correctIndex
                          ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-200"
                          : "border-rose-700/60 bg-rose-950/40 text-rose-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold">
                          {selectedOption === currentQ.correctIndex
                            ? "✓ إجابة صحيحة وممتازة!"
                            : "✕ إجابة غير صحيحة — راجع القاعدة:"}
                        </p>
                        <span className="text-xs text-mist-400 font-mono">
                          الصواب: {currentQ.options[currentQ.correctIndex]}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-95">{currentQ.explanation}</p>
                      {currentQ.explanationArabic && (
                        <p className="text-xs font-arabic pt-1 opacity-90">
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
                        className="rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-brand-500 active:scale-95"
                      >
                        {currentQuestionIdx + 1 < lessonQuestions.length
                          ? "السؤال التالي (Next Question) →"
                          : "عرض النتيجة النهائية (Finish Quiz) 🎉"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Quiz Finished Summary Card */
                <div className="rounded-3xl border border-night-700 bg-night-900 p-8 text-center space-y-6 shadow-xl">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-3xl text-white shadow-md">
                    🏆
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-white">
                      اكتمل اختبار {currentLesson.title}!
                    </h3>
                    <p className="text-sm text-mist-300">
                      نتيجتك: {sessionScore} من {lessonQuestions.length} (
                      {Math.round((sessionScore / Math.max(1, lessonQuestions.length)) * 100)}%)
                    </p>
                  </div>

                  <div className="mx-auto max-w-sm rounded-2xl border border-night-800 bg-night-950 p-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[11px] text-mist-500">الإجابات الصحيحة</p>
                      <p className="text-lg font-bold text-emerald-400 font-mono">{sessionScore}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-mist-500">الأخطاء</p>
                      <p className="text-lg font-bold text-rose-400 font-mono">
                        {lessonQuestions.length - sessionScore}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-mist-500">نسبة الإتقان</p>
                      <p className="text-lg font-bold text-amber-300 font-mono">
                        {Math.round((sessionScore / Math.max(1, lessonQuestions.length)) * 100)}%
                      </p>
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
                      className="rounded-xl border border-night-750 bg-night-850 px-5 py-2.5 text-xs font-semibold text-mist-200 hover:bg-night-800 hover:text-white"
                    >
                      🔄 إعادة الاختبار
                    </button>
                    <button
                      onClick={() => setActiveTab("study")}
                      className="rounded-xl border border-brand-700 bg-brand-950 px-5 py-2.5 text-xs font-semibold text-brand-300 hover:bg-brand-900"
                    >
                      📖 مراجعة الشرح
                    </button>
                    {currentLesson.dayNumber < lessons.length && (
                      <button
                        onClick={() => {
                          setSelectedDay(currentLesson.dayNumber + 1);
                          setActiveTab("study");
                        }}
                        className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-500"
                      >
                        الدرس القادم (Day {currentLesson.dayNumber + 1}) →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 3: COMPREHENSIVE GRAMMAR CHALLENGE
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "challenge" && (
            <div className="space-y-5">
              {!challengeFinished && challengeQ ? (
                <div className="rounded-3xl border border-clay-700/50 bg-night-900 p-6 sm:p-8 shadow-2xl space-y-6">
                  {/* Challenge Header */}
                  <div className="flex items-center justify-between border-b border-night-800 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-clay-400">
                        تحدي القواعد الشامل · {selectedStage === "ALL" ? "جميع المراحل" : selectedStage}
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        سؤال من اليوم {challengeQ.dayNumber}: {challengeQ.lessonTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {challengeStreak > 1 && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-950 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-800">
                          🔥 {challengeStreak} متتالية
                        </span>
                      )}
                      <div className="text-end">
                        <span className="text-xs font-bold text-white font-mono">
                          {challengeQuestionIdx + 1} / {challengeQuestions.length}
                        </span>
                        <p className="text-[10px] text-clay-400">النقاط: {challengeScore}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-night-800">
                    <div
                      className="h-full bg-clay-500 transition-all duration-300"
                      style={{
                        width: `${((challengeQuestionIdx + 1) / challengeQuestions.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Question Prompt */}
                  <div className="rounded-2xl border border-night-750 bg-night-950 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-clay-950 px-2.5 py-0.5 text-xs font-bold text-clay-300 border border-clay-800/60">
                        {challengeQ.typeLabelArabic}
                      </span>
                      <span className="text-xs text-mist-500 font-mono">Day {challengeQ.dayNumber}</span>
                    </div>

                    <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                      {challengeQ.prompt}
                    </p>
                    <p className="text-xs text-clay-300 font-arabic">{challengeQ.promptArabic}</p>

                    {challengeQ.sentenceSnippet && (
                      <div className="mt-2 rounded-xl border border-night-800 bg-night-900/80 p-3.5 font-mono text-base font-semibold text-amber-300">
                        {challengeQ.sentenceSnippet}
                      </div>
                    )}
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {challengeQ.options.map((option, idx) => {
                      const isChosen = challengeSelectedOption === idx;
                      const isCorrect = idx === challengeQ.correctIndex;

                      let btnStyle =
                        "border-night-750 bg-night-950/80 text-mist-200 hover:border-night-600 hover:bg-night-850";

                      if (challengeIsAnswered) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-md ring-1 ring-emerald-500";
                        } else if (isChosen && !isCorrect) {
                          btnStyle = "border-rose-500 bg-rose-950/60 text-rose-200 ring-1 ring-rose-500";
                        } else {
                          btnStyle = "border-night-800 bg-night-950/40 text-mist-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={challengeIsAnswered}
                          onClick={() => handleAnswerChallengeQuestion(idx)}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-start font-medium text-sm transition-all ${btnStyle}`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold font-mono ${
                              challengeIsAnswered && isCorrect
                                ? "bg-emerald-500 text-night-950"
                                : challengeIsAnswered && isChosen && !isCorrect
                                ? "bg-rose-500 text-white"
                                : "bg-night-800 text-mist-400 border border-night-700"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="min-w-0 flex-1 break-words">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation */}
                  {challengeIsAnswered && (
                    <div
                      className={`rounded-2xl border p-4 space-y-1.5 animate-fadeIn ${
                        challengeSelectedOption === challengeQ.correctIndex
                          ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-200"
                          : "border-rose-700/60 bg-rose-950/40 text-rose-200"
                      }`}
                    >
                      <p className="text-xs font-bold">
                        {challengeSelectedOption === challengeQ.correctIndex
                          ? "✓ إجابة ممتازة وصحيحة!"
                          : "✕ إجابة غير دقيقة — التفسير النحوي:"}
                      </p>
                      <p className="text-xs leading-relaxed opacity-95">{challengeQ.explanation}</p>
                      {challengeQ.explanationArabic && (
                        <p className="text-xs font-arabic pt-1 opacity-90">{challengeQ.explanationArabic}</p>
                      )}
                    </div>
                  )}

                  {/* Next Question Button */}
                  {challengeIsAnswered && (
                    <div className="flex items-center justify-end pt-2">
                      <button
                        onClick={handleNextChallengeQuestion}
                        className="rounded-xl bg-clay-500 px-6 py-2.5 text-xs font-bold text-night-950 shadow-md transition-all hover:bg-clay-400 active:scale-95"
                      >
                        {challengeQuestionIdx + 1 < challengeQuestions.length
                          ? "السؤال التالي في التحدي →"
                          : "عرض النتيجة الإجمالية 🏆"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Challenge Summary Screen */
                <div className="rounded-3xl border border-night-700 bg-night-900 p-8 text-center space-y-6 shadow-xl">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-clay-500 text-night-950 text-3xl shadow-md">
                    🌟
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-white">
                      اكتمل تحدي القواعد الشامل بنجاح!
                    </h3>
                    <p className="text-sm text-mist-300">
                      أحرزت {challengeScore} من أصل {challengeQuestions.length} أسئلة (
                      {Math.round((challengeScore / Math.max(1, challengeQuestions.length)) * 100)}%)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={handleStartChallenge}
                      className="rounded-xl bg-clay-500 px-6 py-3 text-xs font-bold text-night-950 shadow-lg hover:bg-clay-400"
                    >
                      ⚡ خوض تحدٍّ جديد (15 سؤال آخر)
                    </button>
                    <button
                      onClick={() => setActiveTab("study")}
                      className="rounded-xl border border-night-700 bg-night-800 px-5 py-3 text-xs font-semibold text-mist-200 hover:bg-night-700 hover:text-white"
                    >
                      العودة لشرح الدروس
                    </button>
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
