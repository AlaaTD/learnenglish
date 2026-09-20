// Vocabulary states and domain constants.
// English-only labels — the UI never shows Arabic.

export const TOTAL_DAYS = 90;
export const WORDS_PER_DAY = 50;
export const TOTAL_VOCABULARY = TOTAL_DAYS * WORDS_PER_DAY; // 4,500

export const VocabularyState = {
  UNLEARNED: "UNLEARNED",
  LEARNING: "LEARNING",
  REVIEW: "REVIEW",
  MASTERED: "MASTERED",
} as const;
export type VocabularyState = (typeof VocabularyState)[keyof typeof VocabularyState];

export const VOCABULARY_STATES: VocabularyState[] = [
  VocabularyState.UNLEARNED,
  VocabularyState.LEARNING,
  VocabularyState.REVIEW,
  VocabularyState.MASTERED,
];

export const VocabularyStateLabel: Record<VocabularyState, string> = {
  UNLEARNED: "Not Learned",
  LEARNING: "Learning",
  REVIEW: "In Review",
  MASTERED: "Mastered",
};

export const VocabularyStateStyle: Record<VocabularyState, string> = {
  UNLEARNED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  LEARNING: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  REVIEW: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  MASTERED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export const DayStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;
export type DayStatus = (typeof DayStatus)[keyof typeof DayStatus];

export const DayStatusLabel: Record<DayStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const HistoryEventLabel: Record<string, string> = {
  VIEWED: "Viewed",
  LEARNED: "Learned",
  REVIEW_ADDED: "Added to Review",
  REVIEW_REMOVED: "Removed from Review",
  MASTERED: "Marked as Mastered",
  UNMASTERED: "Moved out of Mastered",
  USED_IN_CONVERSATION: "Used in Conversation",
  CONVERSATION_USE_CLEARED: "Conversation Use Cleared",
};

export const THEME_OPTIONS = ["light", "dark", "system"] as const;
export type ThemeOption = (typeof THEME_OPTIONS)[number];

export const REVIEW_DUE_DAYS = 3;
