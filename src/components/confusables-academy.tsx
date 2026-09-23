"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import type { ConfusableGroupData } from "@/lib/queries";
import { AudioButton } from "@/components/audio-button";
import { Ar } from "@/components/ui";

// ─────────────────────────────────────────────────────────────
// Category Metadata & Definitions
// ─────────────────────────────────────────────────────────────

export interface CategoryInfo {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export const CONFUSABLE_CATEGORIES: CategoryInfo[] = [
  {
    id: "all",
    label: "الكل",
    labelEn: "All",
    icon: "✨",
    badgeColor: "text-zinc-800 dark:text-zinc-200",
    badgeBg: "bg-zinc-100 dark:bg-zinc-800",
    badgeBorder: "border-zinc-300 dark:border-zinc-700",
  },
  {
    id: "verbs-of-action",
    label: "أفعال الحركة والإنجاز",
    labelEn: "Verbs of Action",
    icon: "⚡",
    badgeColor: "text-rose-700 dark:text-rose-300",
    badgeBg: "bg-rose-50 dark:bg-rose-950/50",
    badgeBorder: "border-rose-200 dark:border-rose-800/60",
  },
  {
    id: "prepositions-time",
    label: "حروف الجر والوقت",
    labelEn: "Prepositions & Time",
    icon: "⏱️",
    badgeColor: "text-sky-700 dark:text-sky-300",
    badgeBg: "bg-sky-50 dark:bg-sky-950/50",
    badgeBorder: "border-sky-200 dark:border-sky-800/60",
  },
  {
    id: "adjectives-adverbs",
    label: "الصفات والظروف",
    labelEn: "Adjectives & Adverbs",
    icon: "🎨",
    badgeColor: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
    badgeBorder: "border-emerald-200 dark:border-emerald-800/60",
  },
  {
    id: "modal-verbs",
    label: "الأفعال الناقصة",
    labelEn: "Modal Verbs",
    icon: "🎯",
    badgeColor: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-50 dark:bg-amber-950/50",
    badgeBorder: "border-amber-200 dark:border-amber-800/60",
  },
  {
    id: "nouns-articles",
    label: "الأسماء والتعريف",
    labelEn: "Nouns & Articles",
    icon: "📚",
    badgeColor: "text-indigo-700 dark:text-indigo-300",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/50",
    badgeBorder: "border-indigo-200 dark:border-indigo-800/60",
  },
  {
    id: "phrases-expressions",
    label: "تعبيرات شائعة",
    labelEn: "Phrases & Expressions",
    icon: "💬",
    badgeColor: "text-orange-700 dark:text-orange-300",
    badgeBg: "bg-orange-50 dark:bg-orange-950/50",
    badgeBorder: "border-orange-200 dark:border-orange-800/60",
  },
  {
    id: "tricky-pairs",
    label: "أزواج خادعة",
    labelEn: "Tricky Pairs",
    icon: "🧩",
    badgeColor: "text-purple-700 dark:text-purple-300",
    badgeBg: "bg-purple-50 dark:bg-purple-950/50",
    badgeBorder: "border-purple-200 dark:border-purple-800/60",
  },
];

const WORD_PALETTES = [
  {
    border: "border-blue-200 dark:border-blue-800/60",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
    pill: "bg-blue-100/70 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800/60",
  },
  {
    border: "border-purple-200 dark:border-purple-800/60",
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
    pill: "bg-purple-100/70 text-purple-900 dark:bg-purple-900/40 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800/60",
  },
  {
    border: "border-emerald-200 dark:border-emerald-800/60",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
    pill: "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800/60",
  },
  {
    border: "border-rose-200 dark:border-rose-800/60",
    bg: "bg-rose-50/50 dark:bg-rose-950/20",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200",
    pill: "bg-rose-100/70 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800/60",
  },
  {
    border: "border-amber-200 dark:border-amber-800/60",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
    pill: "bg-amber-100/70 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800/60",
  },
  {
    border: "border-indigo-200 dark:border-indigo-800/60",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200",
    pill: "bg-indigo-100/70 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800/60",
  },
];

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
        explanation: `✅ Correct: "${m.right}"`,
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

export function ConfusablesAcademy({
  groups,
  initialSlug,
  initialCategory = "all",
  currentDay = 1,
}: ConfusablesAcademyProps) {
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

  // Current group index & navigation
  const currentIndex = useMemo(() => {
    return groups.findIndex((g) => g.slug === currentGroup?.slug);
  }, [groups, currentGroup]);

  const prevGroup = currentIndex > 0 ? groups[currentIndex - 1] : null;
  const nextGroup = currentIndex < groups.length - 1 ? groups[currentIndex + 1] : null;

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

  const currentCategoryInfo =
    CONFUSABLE_CATEGORIES.find((c) => c.id === currentGroup?.category) || CONFUSABLE_CATEGORIES[0];

  const currentScore = currentGroup ? quizScores[currentGroup.slug] : null;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Hero Header Banner
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-brand-50/30 p-5 sm:p-8 shadow-sm dark:border-night-700/80 dark:from-night-950 dark:via-night-900 dark:to-night-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800 dark:bg-brand-900/80 dark:text-brand-200">
                <span>⚡</span>
                <span>Confusables Academy</span>
              </span>
              <span className="inline-flex items-center rounded-full bg-zinc-200/80 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-night-800 dark:text-mist-300">
                34 مجموعة مقارنة
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {Object.keys(quizScores).length} مكتملة بالاختبار
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              الكلمات المتشابهة في الإنجليزية
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-mist-300 leading-relaxed">
              فك الاشتباك بين الكلمات الأكثر التباساً في اللغة الإنجليزية — مثل{" "}
              <code className="rounded bg-brand-100/60 px-1 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
                make vs do
              </code>
              ،{" "}
              <code className="rounded bg-brand-100/60 px-1 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
                like vs love
              </code>
              ، و{" "}
              <code className="rounded bg-brand-100/60 px-1 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
                say vs tell
              </code>{" "}
              — مع قواعد دقيقة، جمل تطبيقية، واختبارات تفاعلية فورية.
            </p>
          </div>

          {/* Quick Group Selector Trigger */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center justify-between sm:justify-center gap-3 rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-brand-500 hover:bg-zinc-50 dark:border-night-700 dark:bg-night-900 dark:text-zinc-100 dark:hover:border-brand-500"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🔍</span>
                <span className="text-right">
                  <span className="block text-[11px] font-medium text-zinc-500 dark:text-mist-400">تصفح المجموعات</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{currentGroup?.title}</span>
                </span>
              </span>
              <svg className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CONFUSABLE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  // If switching categories and current group is not in this category, select first in category
                  if (cat.id !== "all") {
                    const firstInCat = groups.find((g) => g.category === cat.id);
                    if (firstInCat && currentGroup?.category !== cat.id) {
                      setSelectedSlug(firstInCat.slug);
                    }
                  }
                }}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white shadow dark:bg-white dark:text-zinc-950"
                    : "bg-white/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-night-900/80 dark:text-mist-400 dark:hover:bg-night-800 dark:hover:text-mist-100"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.id !== "all" && (
                  <span className="text-[10px] opacity-70">
                    ({groups.filter((g) => g.category === cat.id).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. Modal / Dropdown Picker for all 34 Groups
      ───────────────────────────────────────────────────────────── */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-16 bg-black/60 backdrop-blur-sm animate-reveal">
          <div
            ref={pickerRef}
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-night-700 dark:bg-night-950 max-h-[85vh] flex flex-col"
          >
            {/* Picker Header & Search */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-night-700 space-y-3 bg-zinc-50 dark:bg-night-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    اختر مجموعة الكلمات المتشابهة
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(false)}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-night-800 dark:hover:text-mist-200"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالكلمة بالإنجليزية أو بالعربية (مثال: make, do, like, سفر)..."
                  className="w-full rounded-2xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-night-700 dark:bg-night-950 dark:text-white dark:placeholder:text-mist-500"
                />
                <span className="absolute left-3.5 top-3 text-zinc-400">🔍</span>
              </div>
            </div>

            {/* Groups list */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
              {filteredGroups.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 dark:text-mist-400">
                  <p className="text-base font-semibold">لم يتم العثور على مجموعات مطابقة</p>
                  <p className="text-xs mt-1">جرب البحث بكلمة أخرى أو قم بإلغاء الفلتر</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredGroups.map((g) => {
                    const isCurrent = g.slug === currentGroup?.slug;
                    const cat = CONFUSABLE_CATEGORIES.find((c) => c.id === g.category);
                    const score = quizScores[g.slug];

                    return (
                      <button
                        key={g.slug}
                        type="button"
                        onClick={() => {
                          setSelectedSlug(g.slug);
                          setIsPickerOpen(false);
                        }}
                        className={`flex items-start justify-between p-3 rounded-2xl text-right transition border ${
                          isCurrent
                            ? "border-brand-500 bg-brand-50/70 dark:border-brand-500 dark:bg-brand-950/40"
                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-night-800 dark:bg-night-900/60 dark:hover:border-night-700 dark:hover:bg-night-800"
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-zinc-900 dark:text-white">
                              {g.title}
                            </span>
                            {cat && (
                              <span className="text-[10px] rounded-md px-1.5 py-0.5 bg-zinc-100 text-zinc-600 dark:bg-night-800 dark:text-mist-400">
                                {cat.icon} {cat.label}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-mist-400 line-clamp-1">
                            {g.titleArabic}
                          </p>
                        </div>

                        {score && (
                          <span
                            className={`shrink-0 ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              score.percentage === 100
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                            }`}
                          >
                            {score.percentage}% ⭐
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Picker Footer */}
            <div className="p-3 border-t border-zinc-200 dark:border-night-700 bg-zinc-50 dark:bg-night-900 flex items-center justify-between text-xs text-zinc-500 dark:text-mist-400">
              <span>إجمالي المعروض: {filteredGroups.length} من {groups.length}</span>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="px-3 py-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. Current Group Card Header & Navigator
      ───────────────────────────────────────────────────────────── */}
      {currentGroup && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm dark:border-night-700 dark:bg-night-900">
            {/* Title & Navigation */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${currentCategoryInfo.badgeBg} ${currentCategoryInfo.badgeColor} border ${currentCategoryInfo.badgeBorder}`}
                >
                  <span>{currentCategoryInfo.icon}</span>
                  <span>{currentCategoryInfo.label}</span>
                </span>
                <span className="text-xs text-zinc-500 dark:text-mist-400">
                  مجموعة {currentIndex + 1} من {groups.length}
                </span>
                {currentScore && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    نتيجة الاختبار: {currentScore.percentage}%
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {currentGroup.title}
                </h2>
                <span className="text-base sm:text-lg font-bold text-brand-700 dark:text-brand-400">
                  <Ar>{currentGroup.titleArabic}</Ar>
                </span>
              </div>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                disabled={!prevGroup}
                onClick={() => prevGroup && setSelectedSlug(prevGroup.slug)}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none dark:border-night-700 dark:bg-night-900 dark:text-mist-200 dark:hover:bg-night-800"
              >
                <span>السابق</span>
                <span>◀</span>
              </button>
              <button
                type="button"
                disabled={!nextGroup}
                onClick={() => nextGroup && setSelectedSlug(nextGroup.slug)}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none dark:border-night-700 dark:bg-night-900 dark:text-mist-200 dark:hover:bg-night-800"
              >
                <span>▶</span>
                <span>التالي</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher: Study vs Quiz */}
          <div className="flex border-b border-zinc-200 dark:border-night-700">
            <button
              type="button"
              onClick={() => setActiveTab("study")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-colors ${
                activeTab === "study"
                  ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-mist-400 dark:hover:text-mist-200"
              }`}
            >
              <span>📖</span>
              <span>الدراسة والقواعد والفروقات</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-colors ${
                activeTab === "quiz"
                  ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-mist-400 dark:hover:text-mist-200"
              }`}
            >
              <span>⚡</span>
              <span>اختبار سريع ({currentQuizQuestions.length} أسئلة)</span>
              {currentScore && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  {currentScore.percentage}%
                </span>
              )}
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: STUDY & COMPARISON
          ───────────────────────────────────────────────────────────── */}
          {activeTab === "study" && (
            <div className="space-y-8 animate-reveal">
              {/* Summary Banner */}
              <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-4 sm:p-5 dark:border-brand-900/40 dark:bg-brand-950/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">💡</span>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-bold text-brand-900 dark:text-brand-200">
                      {currentGroup.summary}
                    </p>
                    <p className="text-sm font-medium text-brand-800 dark:text-brand-300">
                      <Ar>{currentGroup.summaryArabic}</Ar>
                    </p>
                  </div>
                </div>
              </div>

              {/* Word Comparison Cards Grid */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>⚖️</span>
                  <span>مقارنة الكلمات والقواعد المحددة</span>
                </h3>

                <div
                  className={`grid grid-cols-1 gap-4 ${
                    currentGroup.words.length === 2
                      ? "md:grid-cols-2"
                      : currentGroup.words.length === 3
                      ? "md:grid-cols-3"
                      : "md:grid-cols-2 lg:grid-cols-4"
                  }`}
                >
                  {currentGroup.words.map((w, index) => {
                    const palette = WORD_PALETTES[index % WORD_PALETTES.length];
                    return (
                      <div
                        key={w.word}
                        className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${palette.border} ${palette.bg}`}
                      >
                        <div className="space-y-3">
                          {/* Word header + Audio */}
                          <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3 dark:border-zinc-800">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl font-black text-zinc-900 dark:text-white">
                                {w.word}
                              </span>
                              <span
                                className={`rounded-md px-2 py-0.5 text-xs font-semibold ${palette.badge}`}
                              >
                                كلمة {index + 1}
                              </span>
                            </div>
                            <AudioButton text={w.word} small />
                          </div>

                          {/* Rule in English */}
                          <div>
                            <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 dark:text-mist-400">
                              Core Rule
                            </span>
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                              {w.rule}
                            </p>
                          </div>

                          {/* Rule in Arabic */}
                          <div className="rounded-xl bg-white/70 p-3 dark:bg-night-900/80">
                            <span className="text-[11px] uppercase tracking-wider font-bold text-brand-700 dark:text-brand-400">
                              القاعدة بالعربية
                            </span>
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 mt-0.5">
                              <Ar>{w.ruleArabic}</Ar>
                            </p>
                          </div>
                        </div>

                        {/* Collocations Pills */}
                        {w.collocations && w.collocations.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                            <span className="text-[11px] font-bold text-zinc-500 dark:text-mist-400">
                              متلازمات شائعة (Collocations):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {w.collocations.map((col) => (
                                <button
                                  key={col}
                                  type="button"
                                  title="انقر للنسخ"
                                  onClick={() => handleCopy(col)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${palette.pill}`}
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
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>✍️</span>
                    <span>أمثلة تطبيقية واقعية</span>
                  </h3>

                  <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:divide-night-800 dark:border-night-700 dark:bg-night-900">
                    {currentGroup.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/60 dark:hover:bg-night-800/40 transition"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                              {ex.sentence}
                            </span>
                            <AudioButton text={ex.sentence} small />
                            {ex.focus && (
                              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-bold text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">
                                {ex.focus}
                              </span>
                            )}
                          </div>

                          {ex.sentenceArabic && (
                            <p className="text-sm font-medium text-zinc-600 dark:text-mist-300">
                              <Ar>{ex.sentenceArabic}</Ar>
                            </p>
                          )}

                          {ex.note && (
                            <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">
                              ℹ️ {ex.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Mistakes */}
              {currentGroup.mistakes && currentGroup.mistakes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>❌</span>
                    <span>أخطاء شائعة احذر منها (Common Mistakes)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentGroup.mistakes.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-rose-200 bg-rose-50/30 p-4 space-y-3 dark:border-rose-900/50 dark:bg-rose-950/20"
                      >
                        {/* Wrong */}
                        <div className="flex items-start gap-2">
                          <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">❌</span>
                          <p className="text-sm font-semibold text-rose-800 line-through dark:text-rose-300">
                            {m.wrong}
                          </p>
                        </div>

                        {/* Right */}
                        <div className="flex items-start gap-2 pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✅</span>
                          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                            {m.right}
                          </p>
                        </div>

                        {/* Note in Arabic */}
                        {m.noteArabic && (
                          <div className="rounded-xl bg-white/80 p-2.5 text-xs text-zinc-700 dark:bg-night-900 dark:text-mist-200">
                            <Ar>{m.noteArabic}</Ar>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Golden Rules & Pro Tips */}
              {(currentGroup.tips?.length > 0 || currentGroup.tipsArabic?.length > 0) && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-5 shadow-sm dark:border-amber-800/60 dark:bg-amber-950/30 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                    <span className="text-xl">🏆</span>
                    <h3 className="text-base font-bold">القاعدة الذهبية لتذكر الفرق (Golden Rule)</h3>
                  </div>

                  <div className="space-y-2">
                    {currentGroup.tips?.map((tip, idx) => (
                      <p key={idx} className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                        • {tip}
                      </p>
                    ))}
                    {currentGroup.tipsArabic?.map((tipAr, idx) => (
                      <p key={idx} className="text-sm font-bold text-amber-900 dark:text-amber-200">
                        <Ar>• {tipAr}</Ar>
                      </p>
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
            <div className="space-y-6 animate-reveal">
              {currentQuizQuestions.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-night-700 dark:bg-night-900">
                  <p className="text-base text-zinc-600 dark:text-mist-300">
                    لا توجد أسئلة كافية لهذه المجموعة حالياً.
                  </p>
                </div>
              ) : (
                <>
                  {/* Quiz Instructions / Score Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-night-700 dark:bg-night-900">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        اختبار تثبيت الفروقات: {currentGroup.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-mist-400">
                        أجب عن الأسئلة لتثبيت القواعد والتفريق التلقائي بين الكلمات.
                      </p>
                    </div>

                    {isQuizSubmitted && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          النتيجة:
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-black ${
                            (currentScore?.percentage ?? 0) >= 80
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
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
                          className={`rounded-2xl border p-5 transition space-y-4 ${
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
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800 dark:bg-brand-900/80 dark:text-brand-300">
                                {qIndex + 1}
                              </span>
                              <p className="text-base font-bold text-zinc-900 dark:text-white">
                                {q.prompt}
                              </p>
                            </div>
                            {q.promptArabic && (
                              <p className="text-xs text-zinc-500 dark:text-mist-400 mr-8">
                                <Ar>{q.promptArabic}</Ar>
                              </p>
                            )}
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mr-8">
                            {q.options.map((option, optIdx) => {
                              const isThisSelected = selectedIdx === optIdx;
                              let optionClass =
                                "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 dark:border-night-800 dark:bg-night-800/70 dark:text-mist-200 dark:hover:bg-night-800";

                              if (isQuizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  optionClass =
                                    "border-emerald-500 bg-emerald-100/70 text-emerald-950 font-bold dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-500";
                                } else if (isThisSelected && optIdx !== q.correctIndex) {
                                  optionClass =
                                    "border-rose-500 bg-rose-100/70 text-rose-950 font-semibold dark:bg-rose-950 dark:text-rose-200 dark:border-rose-500";
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
                                  className={`rounded-xl border p-3 text-right text-sm transition flex items-center justify-between ${optionClass}`}
                                >
                                  <span>{option}</span>
                                  {isQuizSubmitted && optIdx === q.correctIndex && (
                                    <span className="text-emerald-600 font-bold">✓</span>
                                  )}
                                  {isQuizSubmitted && isThisSelected && optIdx !== q.correctIndex && (
                                    <span className="text-rose-600 font-bold">✗</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation banner on submit */}
                          {isQuizSubmitted && (
                            <div className="mr-8 rounded-xl bg-white/90 p-3 text-xs dark:bg-night-950/80 border border-zinc-200 dark:border-night-700 space-y-1">
                              <p className="font-semibold text-zinc-900 dark:text-white">
                                {q.explanation}
                              </p>
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
                        className="rounded-2xl bg-brand-600 px-8 py-3 text-sm font-bold text-white shadow hover:bg-brand-700 disabled:opacity-50 disabled:pointer-events-none transition"
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
