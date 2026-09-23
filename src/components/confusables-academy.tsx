"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { ComponentType, SVGProps } from "react";
import type { ConfusableGroupData } from "@/lib/queries";
import { AudioButton } from "@/components/audio-button";
import { Ar } from "@/components/ui";
import {
  IconBolt,
  IconClock,
  IconSparkle,
  IconGrid,
  IconPalette,
  IconTargetArrow,
  IconBookOpen,
  IconChatDots,
  IconSearch,
  IconChevronDown,
} from "@/components/dashboard/icons";

// ─────────────────────────────────────────────────────────────
// Category Metadata & Definitions
// ─────────────────────────────────────────────────────────────

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface CategoryInfo {
  id: string;
  label: string;
  labelEn: string;
  icon: IconComponent;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export const CONFUSABLE_CATEGORIES: CategoryInfo[] = [
  {
    id: "all",
    label: "الكل",
    labelEn: "All",
    icon: IconSparkle,
    badgeColor: "text-zinc-800 dark:text-zinc-200",
    badgeBg: "bg-zinc-100 dark:bg-zinc-800",
    badgeBorder: "border-zinc-300 dark:border-zinc-700",
  },
  {
    id: "verbs-of-action",
    label: "أفعال الحركة والإنجاز",
    labelEn: "Verbs of Action",
    icon: IconBolt,
    badgeColor: "text-rose-700 dark:text-rose-300",
    badgeBg: "bg-rose-50 dark:bg-rose-950/50",
    badgeBorder: "border-rose-200 dark:border-rose-800/60",
  },
  {
    id: "prepositions-time",
    label: "حروف الجر والوقت",
    labelEn: "Prepositions & Time",
    icon: IconClock,
    badgeColor: "text-sky-700 dark:text-sky-300",
    badgeBg: "bg-sky-50 dark:bg-sky-950/50",
    badgeBorder: "border-sky-200 dark:border-sky-800/60",
  },
  {
    id: "adjectives-adverbs",
    label: "الصفات والظروف",
    labelEn: "Adjectives & Adverbs",
    icon: IconPalette,
    badgeColor: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
    badgeBorder: "border-emerald-200 dark:border-emerald-800/60",
  },
  {
    id: "modal-verbs",
    label: "الأفعال الناقصة",
    labelEn: "Modal Verbs",
    icon: IconTargetArrow,
    badgeColor: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-50 dark:bg-amber-950/50",
    badgeBorder: "border-amber-200 dark:border-amber-800/60",
  },
  {
    id: "nouns-articles",
    label: "الأسماء والتعريف",
    labelEn: "Nouns & Articles",
    icon: IconBookOpen,
    badgeColor: "text-brand-700 dark:text-brand-300",
    badgeBg: "bg-brand-50 dark:bg-brand-950/50",
    badgeBorder: "border-brand-200 dark:border-brand-800/60",
  },
  {
    id: "phrases-expressions",
    label: "تعبيرات شائعة",
    labelEn: "Phrases & Expressions",
    icon: IconChatDots,
    badgeColor: "text-clay-700 dark:text-clay-300",
    badgeBg: "bg-clay-50 dark:bg-clay-950/50",
    badgeBorder: "border-clay-200 dark:border-clay-800/60",
  },
  {
    id: "tricky-pairs",
    label: "أزواج خادعة",
    labelEn: "Tricky Pairs",
    icon: IconGrid,
    badgeColor: "text-white dark:text-zinc-950",
    badgeBg: "bg-zinc-900 dark:bg-zinc-100",
    badgeBorder: "border-zinc-900 dark:border-zinc-100",
  },
];

// Unified word-comparison card style — matches the "Structural Formulas" card
// background in grammar-academy.tsx (bg-zinc-50 / dark:bg-night-900/60) instead of
// the old per-word rotating palette (brand/clay/emerald/rose/amber/sky).
const WORD_CARD_STYLE = "border-zinc-200 bg-zinc-50 dark:border-night-800 dark:bg-night-900/60";
const WORD_COLLOCATION_PILL_STYLE =
  "bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-900/60";

// ─────────────────────────────────────────────────────────────
// Confusable Quiz Types & Generator
// ─────────────────────────────────────────────────────────────

export interface ConfusableQuizItem {
  id: string;
  type: "collocation" | "mistake" | "context";
  prompt: string;
  promptArabic?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationArabic?: string;
}

function generateConfusableQuiz(group: ConfusableGroupData): ConfusableQuizItem[] {
  const items: ConfusableQuizItem[] = [];
  let idCounter = 1;

  // 1. From Mistakes: Which sentence is correct?
  if (group.mistakes && group.mistakes.length > 0) {
    group.mistakes.forEach((m, idx) => {
      const isRightFirst = (idx + group.slug.length) % 2 === 0;
      const options = isRightFirst ? [m.right, m.wrong] : [m.wrong, m.right];
      const correctIndex = isRightFirst ? 0 : 1;

      items.push({
        id: `q_mistake_${idCounter++}`,
        type: "mistake",
        prompt: "اختر الجملة الصحيحة لغوياً (Which sentence is correct?):",
        options,
        correctIndex,
        explanation: `Correct: "${m.right}"`,
        explanationArabic: m.noteArabic || "الاستخدام الصحيح للكلمة يراعي السياق والمعنى المناسب.",
      });
    });
  }

  // 2. From Collocations in words
  const wordsList = group.words.map((w) => w.word);
  if (wordsList.length >= 2) {
    group.words.forEach((w) => {
      if (w.collocations && w.collocations.length > 0) {
        // Take up to 2 collocations per word
        w.collocations.slice(0, 2).forEach((col) => {
          // Replace the target word at the start or in the expression
          const regex = new RegExp(`^${w.word}\\b`, "i");
          if (regex.test(col)) {
            const blanked = col.replace(regex, "______");
            items.push({
              id: `q_colloc_${idCounter++}`,
              type: "collocation",
              prompt: `Complete the phrase: "${blanked}"`,
              promptArabic: `أكمل المتلازمة اللفظية المناسبة لـ "${w.word}":`,
              options: [...wordsList],
              correctIndex: wordsList.indexOf(w.word),
              explanation: `Collocation: "${col}"`,
              explanationArabic: w.ruleArabic || `نستخدم "${w.word}" مع هذا التعبير.`,
            });
          }
        });
      }
    });
  }

  // 3. From Examples
  if (group.examples && group.examples.length > 0) {
    group.examples.slice(0, 3).forEach((ex) => {
      // Find which word in group matches focus or is present
      const matchedWord = group.words.find((w) => {
        const pattern = new RegExp(`\\b${w.word}\\b`, "i");
        return pattern.test(ex.sentence) || (ex.focus && ex.focus.toLowerCase().includes(w.word.toLowerCase()));
      });

      if (matchedWord) {
        // Mask the word (case-insensitive)
        const pattern = new RegExp(`\\b${matchedWord.word}\\b`, "i");
        const masked = ex.sentence.replace(pattern, "______");

        if (masked !== ex.sentence) {
          items.push({
            id: `q_example_${idCounter++}`,
            type: "context",
            prompt: `اختر الكلمة المناسبة لإكمال الجملة: "${masked}"`,
            promptArabic: ex.sentenceArabic ? `المعنى: ${ex.sentenceArabic}` : undefined,
            options: [...wordsList],
            correctIndex: wordsList.indexOf(matchedWord.word),
            explanation: `Sentence: "${ex.sentence}"`,
            explanationArabic: ex.note || matchedWord.ruleArabic,
          });
        }
      }
    });
  }

  // Cap at 6 questions max to keep each quiz focused & fast
  return items.slice(0, 6);
}

// ─────────────────────────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────────────────────────

interface ConfusablesAcademyProps {
  groups: ConfusableGroupData[];
  initialSlug?: string;
  initialCategory?: string;
  currentDay?: number;
}

export function ConfusablesAcademy({ groups, initialSlug, initialCategory = "all" }: ConfusablesAcademyProps) {
  // Active Group selection
  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    if (initialSlug) {
      const found = groups.find((g) => g.slug === initialSlug);
      if (found) return found.slug;
    }
    return groups[0]?.slug ?? "";
  });

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeTab, setActiveTab] = useState<"study" | "quiz">("study");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [copiedCollocation, setCopiedCollocation] = useState<string | null>(null);

  // Quiz State
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; total: number; percentage: number }>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load saved scores
  useEffect(() => {
    try {
      const saved = localStorage.getItem("e90_confusables_scores");
      if (saved) {
        setQuizScores(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Close picker on outside click or Escape
  useEffect(() => {
    if (!isPickerOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPickerOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPickerOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isPickerOpen) {
      searchInputRef.current?.focus();
    }
  }, [isPickerOpen]);

  // Active group data
  const currentGroup = useMemo(() => {
    return groups.find((g) => g.slug === selectedSlug) || groups[0];
  }, [groups, selectedSlug]);

  // Filtered groups for picker & sidebar
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchesCategory = activeCategory === "all" || g.category === activeCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        g.title.toLowerCase().includes(q) ||
        g.titleArabic.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.summaryArabic.toLowerCase().includes(q) ||
        g.words.some((w) => w.word.toLowerCase().includes(q))
      );
    });
  }, [groups, activeCategory, searchQuery]);

  // Current Group Quiz Items
  const currentQuizQuestions = useMemo(() => {
    if (!currentGroup) return [];
    return generateConfusableQuiz(currentGroup);
  }, [currentGroup]);

  // Reset quiz responses when changing group
  useEffect(() => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
  }, [selectedSlug]);

  // Handle quiz answer selection
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    if (isQuizSubmitted || currentQuizQuestions.length === 0) return;
    let score = 0;
    currentQuizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    const total = currentQuizQuestions.length;
    const percentage = Math.round((score / total) * 100);

    const newScores = {
      ...quizScores,
      [currentGroup.slug]: { score, total, percentage },
    };

    setQuizScores(newScores);
    setIsQuizSubmitted(true);

    try {
      localStorage.setItem("e90_confusables_scores", JSON.stringify(newScores));
    } catch {
      // Ignore
    }
  };

  // Retake quiz
  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
  };

  // Copy collocation helper
  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCollocation(text);
      setTimeout(() => setCopiedCollocation(null), 1800);
    }
  };

  const currentScore = currentGroup ? quizScores[currentGroup.slug] : null;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* ─────────────────────────────────────────────────────────────
          1. Page Title — plain text, no card
      ───────────────────────────────────────────────────────────── */}
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
        Confusables{" "}
        <Ar className="text-lg font-semibold text-clay-700 dark:text-clay-300 sm:text-xl">
          · الكلمات المتشابهة
        </Ar>
      </h1>

      {/* ─────────────────────────────────────────────────────────────
          2. Group Picker
      ───────────────────────────────────────────────────────────── */}
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setIsPickerOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={isPickerOpen}
          className={`group flex w-full items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-start shadow-xs transition-all dark:bg-night-900 ${
            isPickerOpen
              ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md dark:border-brand-500"
              : "border-zinc-300 hover:border-zinc-400 dark:border-night-700 dark:hover:border-night-600"
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold text-zinc-900 dark:text-white" dir="ltr">
                {currentGroup?.title}
              </span>
              {currentScore && (
                <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-px text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {currentScore.percentage}%
                </span>
              )}
            </div>
            {currentGroup?.titleArabic && (
              <Ar className="mt-px block truncate text-[11px] text-clay-600 dark:text-clay-400">
                {currentGroup.titleArabic}
              </Ar>
            )}
          </div>

          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
              isPickerOpen
                ? "rotate-180 bg-brand-600 text-white dark:bg-brand-600 dark:text-white"
                : "bg-zinc-100 text-zinc-500 group-hover:bg-brand-100 group-hover:text-brand-700 dark:bg-night-800 dark:text-mist-400 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300"
            }`}
          >
            <IconChevronDown className="h-4 w-4" />
          </span>
        </button>

        {isPickerOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] sm:hidden"
            onClick={() => setIsPickerOpen(false)}
            aria-hidden="true"
          />
        )}

        {isPickerOpen && (
          <div
            role="listbox"
            aria-label="قائمة مجموعات الكلمات المتشابهة"
            className="fixed inset-x-3 top-20 z-40 sm:absolute sm:inset-x-auto sm:start-0 sm:top-full sm:mt-2 w-auto sm:w-[32rem] sm:max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-night-700 dark:bg-night-900 animate-fadeIn"
          >
            {/* Search & Category Filters */}
            <div className="space-y-2.5 border-b border-zinc-200/80 p-3 dark:border-night-800">
              <div className="flex items-center justify-between">
                <Ar className="text-sm font-bold text-zinc-900 dark:text-white">اختر مجموعة الكلمات</Ar>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 dark:bg-night-800 dark:text-mist-400">
                    {filteredGroups.length} مجموعة
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-mist-500 dark:hover:bg-night-800 dark:hover:text-mist-200"
                    aria-label="إغلاق القائمة"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="relative" dir="rtl">
                <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-mist-500">
                  <IconSearch className="h-4 w-4" />
                </span>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالكلمة الإنجليزية أو العربية..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 ps-9 pe-8 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:bg-white focus:outline-none sm:text-sm dark:border-night-700 dark:bg-night-950/70 dark:text-white dark:placeholder:text-mist-500 dark:focus:bg-night-950"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:text-mist-500 dark:hover:text-white"
                    aria-label="مسح البحث"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto text-xs">
                {CONFUSABLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      if (cat.id !== "all") {
                        const firstInCat = groups.find((g) => g.category === cat.id);
                        if (firstInCat && currentGroup?.category !== cat.id) {
                          setSelectedSlug(firstInCat.slug);
                        }
                      }
                    }}
                    className={`shrink-0 rounded-lg px-2.5 py-1 font-medium transition-all ${
                      activeCategory === cat.id
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-night-800 dark:text-mist-300 dark:hover:bg-night-750"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Groups list */}
            <div className="scrollbar-thin max-h-[55vh] space-y-1 overflow-y-auto p-2 sm:max-h-80">
              {filteredGroups.map((g) => {
                const isSelected = g.slug === currentGroup?.slug;
                const scoreData = quizScores[g.slug];

                return (
                  <button
                    key={g.slug}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedSlug(g.slug);
                      setIsPickerOpen(false);
                    }}
                    className={`group/item flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-start transition-all ${
                      isSelected
                        ? "bg-brand-50 ring-1 ring-brand-400 dark:bg-brand-950/30 dark:ring-brand-600"
                        : "hover:bg-zinc-50 dark:hover:bg-night-800/60"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span
                        dir="ltr"
                        className={`block truncate text-[13px] font-semibold leading-snug ${
                          isSelected ? "text-brand-700 dark:text-brand-300" : "text-zinc-800 dark:text-white"
                        }`}
                      >
                        {g.title}
                      </span>
                      <span
                        dir="rtl"
                        lang="ar"
                        className="mt-px block truncate text-[11px] text-clay-600 dark:text-clay-400"
                      >
                        {g.titleArabic}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {scoreData ? (
                        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-px text-[10px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {scoreData.percentage}%
                        </span>
                      ) : (
                        <span className="text-[9px] text-zinc-400 opacity-0 group-hover/item:opacity-100 dark:text-mist-500">
                          لم يُختبر
                        </span>
                      )}
                      {isSelected && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredGroups.length === 0 && (
                <div className="space-y-2 py-10 text-center">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    لم نجد مجموعة تطابق &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-mist-500">جرب البحث بكلمة أخرى أو ألغِ الفلتر</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-2 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
                  >
                    إعادة تعيين البحث
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-night-700 dark:bg-night-900 dark:text-mist-400">
              <span>
                إجمالي المعروض: {filteredGroups.length} من {groups.length}
              </span>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="px-3 py-1 font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>

      {currentGroup && (
        <div className="space-y-6">
          {/* Tab Switcher: Study vs Quiz — same markup/style as grammar-academy's Study/Quiz tabs */}
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
                  الدراسة<span className="hidden sm:inline"> والمقارنة (Study)</span>
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
                {currentScore && (
                  <span className="shrink-0 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300 sm:px-2 sm:text-[11px]">
                    {currentScore.percentage}%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: STUDY & COMPARISON
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "study" && (
            <div className="animate-reveal space-y-8">
              {/* Term title — folded into the study details instead of a separate header card */}
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 dir="ltr" className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                  {currentGroup.title}
                </h2>
                <Ar className="text-base font-semibold text-clay-700 dark:text-clay-300 sm:text-lg">
                  {currentGroup.titleArabic}
                </Ar>
              </div>

              {/* Summary Banner */}
              <div className="space-y-1.5 rounded-2xl border border-brand-200 bg-brand-50/40 p-4 dark:border-brand-900/40 dark:bg-brand-950/20 sm:p-5">
                <p className="text-sm font-bold text-brand-900 dark:text-brand-200 sm:text-base">
                  {currentGroup.summary}
                </p>
                <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
                  <Ar>{currentGroup.summaryArabic}</Ar>
                </p>
              </div>

              {/* Word Comparison Cards Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                    <Ar>
                      مقارنة الكلمات <span className="text-zinc-400 dark:text-mist-500">(Word Comparison)</span>
                    </Ar>
                  </h3>
                  <Ar className="text-xs text-zinc-400 dark:text-mist-500">{currentGroup.words.length} كلمات</Ar>
                </div>

                <div
                  className={`grid grid-cols-1 gap-4 ${
                    currentGroup.words.length === 2
                      ? "md:grid-cols-2"
                      : currentGroup.words.length === 3
                        ? "md:grid-cols-3"
                        : "md:grid-cols-2 lg:grid-cols-4"
                  }`}
                >
                  {currentGroup.words.map((w) => {
                    return (
                      <div
                        key={w.word}
                        className={`flex flex-col justify-between space-y-4 rounded-2xl border p-5 ${WORD_CARD_STYLE}`}
                      >
                        <div className="space-y-3">
                          {/* Word header + Audio — English row, isolated direction */}
                          <div dir="ltr" className="flex items-center justify-between border-b border-zinc-200/60 pb-3 dark:border-zinc-800">
                            <span className="text-2xl font-black text-zinc-900 dark:text-white">{w.word}</span>
                            <AudioButton text={w.word} small />
                          </div>

                          {/* Rule in English */}
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-mist-400">
                              Core Rule
                            </span>
                            <p className="mt-0.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">{w.rule}</p>
                          </div>

                          {/* Rule in Arabic */}
                          <div className="rounded-xl bg-white/70 p-3 dark:bg-night-900/80">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                              القاعدة بالعربية
                            </span>
                            <p className="mt-0.5 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                              <Ar>{w.ruleArabic}</Ar>
                            </p>
                          </div>
                        </div>

                        {/* Collocations Pills */}
                        {w.collocations && w.collocations.length > 0 && (
                          <div className="space-y-2 border-t border-zinc-200/60 pt-2 dark:border-zinc-800">
                            <span className="text-[11px] font-bold text-zinc-500 dark:text-mist-400">
                              متلازمات شائعة (Collocations):
                            </span>
                            <div dir="ltr" className="flex flex-wrap gap-1.5">
                              {w.collocations.map((col) => (
                                <button
                                  key={col}
                                  type="button"
                                  title="انقر للنسخ"
                                  onClick={() => handleCopy(col)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${WORD_COLLOCATION_PILL_STYLE}`}
                                >
                                  {copiedCollocation === col ? "✓ تم النسخ" : col}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Examples in Context */}
              {currentGroup.examples && currentGroup.examples.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                      <Ar>
                        أمثلة تطبيقية <span className="text-zinc-400 dark:text-mist-500">(Practical Examples)</span>
                      </Ar>
                    </h3>
                    <span className="text-xs text-zinc-400 dark:text-mist-500">استمع للنطق الأصلي</span>
                  </div>

                  <div className="divide-y divide-zinc-200 dark:divide-night-800">
                    {currentGroup.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2.5 py-3.5 first:pt-0 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0 flex-1 space-y-2">
                          <div dir="ltr" className="flex flex-wrap items-center gap-3">
                            <p className="text-base leading-relaxed text-zinc-900 dark:text-white">
                              &ldquo;{ex.sentence}&rdquo;
                            </p>
                            {ex.focus && (
                              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-200">
                                {ex.focus}
                              </span>
                            )}
                          </div>

                          {ex.sentenceArabic && (
                            <div dir="rtl" className="border-t border-zinc-100 pt-1.5 dark:border-night-800">
                              <p lang="ar" className="text-sm leading-relaxed text-clay-700 dark:text-clay-300">
                                {ex.sentenceArabic}
                              </p>
                            </div>
                          )}

                          {ex.note && (
                            <div className="flex items-start gap-2 pt-0.5">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                              <p dir="ltr" className="text-xs text-zinc-500 dark:text-mist-400">
                                {ex.note}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 pt-0.5">
                          <AudioButton text={ex.sentence} small label="استمع للمثال" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Mistakes */}
              {currentGroup.mistakes && currentGroup.mistakes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-700 dark:text-mist-200">
                      <Ar>
                        الأخطاء الشائعة <span className="text-zinc-400 dark:text-mist-500">(Common Mistakes)</span>
                      </Ar>
                    </h3>
                    <Ar className="text-xs text-zinc-400 dark:text-mist-500">
                      {currentGroup.mistakes.length} أخطاء شائعة
                    </Ar>
                  </div>

                  <div className="space-y-3">
                    {currentGroup.mistakes.map((m, idx) => (
                      <div key={idx} className="overflow-hidden rounded-lg border border-zinc-200 dark:border-night-800">
                        <div className="grid grid-cols-1 divide-y divide-zinc-200 dark:divide-night-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                          <div dir="ltr" className="flex items-start gap-2.5 bg-rose-50 p-3.5 dark:bg-rose-950/20">
                            <span className="mt-0.5 shrink-0 text-xs font-bold text-rose-600 dark:text-rose-400">
                              ✕
                            </span>
                            <p className="font-mono text-sm text-rose-700 line-through dark:text-rose-200">
                              {m.wrong}
                            </p>
                          </div>
                          <div
                            dir="ltr"
                            className="flex items-start justify-between gap-2.5 bg-emerald-50 p-3.5 dark:bg-emerald-950/20"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5 shrink-0 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                ✓
                              </span>
                              <p className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                                {m.right}
                              </p>
                            </div>
                            <div className="shrink-0 pt-0.5">
                              <AudioButton text={m.right} small label="استمع للجملة الصحيحة" />
                            </div>
                          </div>
                        </div>
                        {m.noteArabic && (
                          <div className="border-t border-zinc-200 bg-zinc-50 p-3.5 dark:border-night-800 dark:bg-night-900/60">
                            <p
                              dir="rtl"
                              lang="ar"
                              className="text-xs font-medium leading-relaxed text-clay-800 dark:text-clay-200"
                            >
                              {m.noteArabic}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Golden Rule */}
              {(currentGroup.tips?.length > 0 || currentGroup.tipsArabic?.length > 0) && (
                <div className="space-y-3 rounded-2xl border border-clay-200 bg-clay-50/60 p-5 dark:border-clay-900/50 dark:bg-clay-950/30">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-clay-600 dark:text-clay-400">
                      Golden Rule
                    </span>
                    <h3 className="text-base font-bold text-clay-900 dark:text-clay-100">
                      القاعدة الذهبية لتذكر الفرق
                    </h3>
                  </div>

                  <div className="space-y-2 pt-1">
                    {currentGroup.tips?.map((tip, idx) => (
                      <div key={`tip-en-${idx}`} dir="ltr" className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                        <p className="text-sm font-medium text-clay-900 dark:text-clay-100">{tip}</p>
                      </div>
                    ))}
                    {currentGroup.tipsArabic?.map((tipAr, idx) => (
                      <div key={`tip-ar-${idx}`} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                        <p className="text-sm font-semibold text-clay-800 dark:text-clay-200">
                          <Ar>{tipAr}</Ar>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: INTERACTIVE QUIZ
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "quiz" && (
            <div className="animate-reveal space-y-6">
              {currentQuizQuestions.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-night-700 dark:bg-night-900">
                  <p className="text-base text-zinc-600 dark:text-mist-300">
                    لا توجد أسئلة كافية لهذه المجموعة حالياً.
                  </p>
                </div>
              ) : (
                <>
                  {/* Quiz Instructions / Score Header */}
                  <div className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-night-700 dark:bg-night-900 sm:flex-row sm:items-center sm:p-5">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        <Ar>اختبار تثبيت الفروقات:</Ar> <span dir="ltr">{currentGroup.title}</span>
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-mist-400">
                        أجب عن الأسئلة لتثبيت القواعد والتفريق التلقائي بين الكلمات.
                      </p>
                    </div>

                    {isQuizSubmitted && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">النتيجة:</span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-black ${
                            (currentScore?.percentage ?? 0) >= 80
                              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {currentScore?.percentage ?? 0}% ({currentScore?.score ?? 0}/{currentScore?.total ?? 0})
                        </span>
                        <button
                          type="button"
                          onClick={handleResetQuiz}
                          className="rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:border-night-700 dark:bg-night-800 dark:text-mist-200"
                        >
                          إعادة الاختبار
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Question Cards */}
                  <div className="space-y-4">
                    {currentQuizQuestions.map((q, qIndex) => {
                      const selectedIdx = selectedAnswers[q.id];
                      const isAnswered = selectedIdx !== undefined;
                      const isCorrect = isAnswered && selectedIdx === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className={`space-y-4 rounded-2xl border p-5 transition ${
                            isQuizSubmitted
                              ? isCorrect
                                ? "border-emerald-300 bg-emerald-50/30 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                                : "border-rose-300 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/20"
                              : "border-zinc-200 bg-white dark:border-night-700 dark:bg-night-900"
                          }`}
                        >
                          {/* Question Prompt */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                                {qIndex + 1}
                              </span>
                              <p className="text-base font-bold text-zinc-900 dark:text-white">{q.prompt}</p>
                            </div>
                            {q.promptArabic && (
                              <p className="mr-8 text-xs text-zinc-500 dark:text-mist-400">
                                <Ar>{q.promptArabic}</Ar>
                              </p>
                            )}
                          </div>

                          {/* Options Grid */}
                          <div className="mr-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {q.options.map((option, optIdx) => {
                              const isThisSelected = selectedIdx === optIdx;
                              let optionClass =
                                "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 dark:border-night-800 dark:bg-night-800/70 dark:text-mist-200 dark:hover:bg-night-800";

                              if (isQuizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  optionClass =
                                    "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-500";
                                } else if (isThisSelected && optIdx !== q.correctIndex) {
                                  optionClass =
                                    "border-rose-500 bg-rose-50 text-rose-700 font-semibold dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-500";
                                } else {
                                  optionClass = "opacity-50 border-zinc-200 bg-zinc-50 dark:bg-night-900";
                                }
                              } else if (isThisSelected) {
                                optionClass =
                                  "border-brand-600 bg-brand-50 text-brand-900 font-bold dark:border-brand-400 dark:bg-brand-950 dark:text-brand-200";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={isQuizSubmitted}
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`rounded-xl border p-3 text-start text-sm transition ${optionClass}`}
                                >
                                  <span dir="ltr" className="block break-words font-mono text-xs sm:text-sm">
                                    {option}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation banner on submit */}
                          {isQuizSubmitted && (
                            <div className="mr-8 space-y-1 rounded-xl border border-zinc-200 bg-white/90 p-3 text-xs dark:border-night-700 dark:bg-night-950/80">
                              <p className="font-semibold text-zinc-900 dark:text-white">{q.explanation}</p>
                              {q.explanationArabic && (
                                <p className="font-medium text-zinc-600 dark:text-mist-300">
                                  <Ar>{q.explanationArabic}</Ar>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  {!isQuizSubmitted && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(selectedAnswers).length < currentQuizQuestions.length}
                        className="rounded-2xl bg-brand-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:pointer-events-none disabled:opacity-50"
                      >
                        تصحيح الإجابات وحساب النتيجة
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
