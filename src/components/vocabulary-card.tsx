"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";
import { AudioButton } from "./audio-button";
import { DifficultToggleButton } from "./difficult-toggle-button";
import { Ar, ArabicText, SmallLabel, Tag, textLinkClass } from "./ui";
import { markVocabularyViewedAction } from "@/actions/day";
import { markWordViewedAction } from "@/actions/vocabulary";
import { audio } from "@/lib/audio";

export type VocabularyCardWord = {
  id: string;
  headword: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  definition: string;
  example: string;
  translation: string | null;
  exampleArabic: string | null;
  verbForms?: { v1: string; v2: string; v3: string } | null;
  relatedForms: string[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  tags: string[];
  dayNumber: number;
  state: string;
  isDifficult?: boolean;
  usedInConversation: boolean;
  inConversationCount: number;
  inParagraphCount: number;
};

/**
 * A word's learning state shows as a hairline rail on the unit's leading edge, in the same status
 * colour the state would otherwise need a badge for. Words not learned yet stay plain, so a fresh
 * day reads calm and progress shows up as colour appearing. Per
 * ENGLISH90_ROOT_CAUSE_VISUAL_READING_AUDIT.md §20, this is a tiny STATE SIGNAL, not a coloured
 * card identity — kept to a 2px hairline in both layout contexts, never a wide tinted edge.
 */
const stateRail: Record<string, string> = {
  LEARNING: "before:bg-sky-500 dark:before:bg-sky-400",
  REVIEW: "before:bg-amber-500 dark:before:bg-amber-400",
  MASTERED: "before:bg-emerald-500 dark:before:bg-emerald-400",
};

/**
 * Two container treatments, per §15/§17/§38:
 *  - "reading" (default): the daily 50-word memorization flow (Day page). A word is a reading
 *    block, not a floating card — no border, no shadow, no radius. The parent list separates
 *    words with a hairline divider instead; whitespace and vertical rhythm do the "this word
 *    ended" job a card boundary used to do. This is the ONLY variant §17 has in mind when it
 *    says "reduce card-ness itself" instead of tuning padding/radius/shadow.
 *  - "grid": browsing contexts (Vocabulary Library, Difficult Words) where many words sit side
 *    by side in a multi-column grid and still need a visible boundary to read as separate items.
 *    Framing stays light even here — a hairline border, no shadow, no hover-lift — per §26 Rule
 *    04 ("shadows are rare, real elevation only").
 */
export type VocabularyCardVariant = "reading" | "grid";

const railShape: Record<VocabularyCardVariant, string> = {
  reading: "before:pointer-events-none before:absolute before:inset-y-5 before:start-0 before:w-0.5 before:rounded-e-full",
  grid: "before:pointer-events-none before:absolute before:inset-y-4 before:start-0 before:w-0.5 before:rounded-e-full",
};

/** A labelled group of chips (collocations, synonyms, ...). Renders nothing when empty. */
function ChipGroup({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone?: ComponentProps<typeof Tag>["tone"];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <SmallLabel className="mb-2">{label}</SmallLabel>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <Tag key={i} tone={tone}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}

export function VocabularyCard({
  word,
  trackDay,
  audioRate = 1,
  autoplayAudio = false,
  defaultOpen = false,
  variant = "reading",
}: {
  word: VocabularyCardWord;
  /** When set (day page), expanding the card counts the word as viewed for that day. */
  trackDay?: number;
  audioRate?: number;
  autoplayAudio?: boolean;
  defaultOpen?: boolean;
  /** "reading" (default): Day page memorization flow. "grid": Library / Difficult Words browsing grids. */
  variant?: VocabularyCardVariant;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [viewed, setViewed] = useState(false);
  const rail = stateRail[word.state];
  const isGrid = variant === "grid";

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !viewed) {
      setViewed(true);
      if (trackDay !== undefined) {
        void markVocabularyViewedAction(trackDay, word.id);
      } else {
        void markWordViewedAction(word.id, null);
      }
      if (autoplayAudio) {
        audio.speakWord(word.headword, { id: `word-${word.id}`, rate: audioRate });
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    // Only react when the card itself has focus. Enter / Space pressed on the audio button or on
    // "View full details" bubble up here, and must keep their own behaviour instead of toggling.
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  const verbCells = word.verbForms
    ? [
        { tag: "V1", name: "Base", ar: "المصدر", value: word.verbForms.v1 },
        { tag: "V2", name: "Past", ar: "الماضي", value: word.verbForms.v2 },
        { tag: "V3", name: "Participle", ar: "التصريف الثالث", value: word.verbForms.v3 },
      ]
    : [];

  return (
    <article
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      className={`group relative cursor-pointer transition-colors duration-150 ${
        isGrid
          ? `rounded-xl border bg-white p-4 dark:bg-zinc-900 ${
              open ? "border-zinc-300 dark:border-zinc-700" : "border-zinc-200 dark:border-zinc-800"
            } hover:border-brand-300 dark:hover:border-brand-700`
          : "ps-3.5 py-5 hover:bg-zinc-900/[0.025] dark:hover:bg-white/[0.025] sm:py-6"
      } ${rail ? `${railShape[variant]} ${rail}` : ""}`}
    >
      {/* Row 1 — the word, with its Arabic translation right beside it so the two read as one
          unit at a glance. Controls, badges and state colour still never share this line —
          only the translation does, since that's the whole point of putting it here. */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="min-w-0 break-words text-xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-[1.375rem]">
          {word.headword}
        </span>
        {word.translation ? (
          <ArabicText tone="warm" className="font-medium">
            {word.translation}
          </ArabicText>
        ) : null}
      </div>

      {/* Row 2 — how it sounds and what it is. The actions (difficult toggle, listen, expand) live
          here, one level below the headword, never sharing its weight (§19). */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {word.pronunciation ? (
            <span className="font-phonetic text-sm text-zinc-500 dark:text-zinc-400">{word.pronunciation}</span>
          ) : null}
          {word.partOfSpeech ? <Tag tone="accent">{word.partOfSpeech}</Tag> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <DifficultToggleButton
            vocabularyId={word.id}
            dayNumber={trackDay ?? word.dayNumber}
            initialIsDifficult={word.isDifficult ?? false}
          />
          <AudioButton text={word.headword} id={`word-${word.id}`} rate={audioRate} small />
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors group-hover:bg-zinc-900/[0.05] group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:bg-white/[0.06] dark:group-hover:text-zinc-200"
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>

      {/* Row 3 — definition: the most important text after the word itself and its translation
          (now shown up in Row 1). Bounded reading width (§21) and relaxed line-height (§22);
          never `leading-tight` (§23). */}
      <div className="mt-3.5 max-w-[68ch]">
        <p className="text-[0.9375rem] leading-[1.65] text-zinc-700 dark:text-zinc-300">{word.definition}</p>
      </div>

      {open ? (
        <div
          className="mt-5 max-w-[68ch] animate-reveal cursor-auto space-y-5 border-t border-zinc-200 pt-5 dark:border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Example sentence, set like a quotation */}
          <div className="border-s-2 border-brand-300 ps-3.5 dark:border-brand-700">
            <SmallLabel>Example</SmallLabel>
            <p className="mt-1.5 text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
              &ldquo;{word.example}&rdquo;
            </p>
            {word.exampleArabic ? (
              // Same start-edge alignment as the English quote above it, for the same reason
              // as the definition's translation line.
              <ArabicText tone="warm" className="mt-1.5 text-left">
                {word.exampleArabic}
              </ArabicText>
            ) : null}
          </div>

          {/* Verb forms (verbs only): one neutral 3-cell strip instead of three coloured tiles */}
          {word.verbForms ? (
            <div>
              <SmallLabel className="mb-2">
                Verb forms · <Ar>تصريفات الفعل</Ar>
              </SmallLabel>
              <div className="grid grid-cols-3 divide-x divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-center rtl:divide-x-reverse dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50">
                {verbCells.map((cell) => (
                  <div key={cell.tag} className="min-w-0 px-2 py-3">
                    <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">{cell.tag}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{cell.name}</p>
                    <p className="mt-1.5 break-words text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {cell.value}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Ar>{cell.ar}</Ar>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <ChipGroup label="Collocations" items={word.collocations} />

          {(word.synonyms.length > 0 || word.antonyms.length > 0) && (
            <div className="grid gap-5 sm:grid-cols-2">
              <ChipGroup label="Synonyms" items={word.synonyms} tone="success" />
              <ChipGroup label="Antonyms" items={word.antonyms} tone="danger" />
            </div>
          )}

          <ChipGroup label="Related forms" items={word.relatedForms} />

          {/* Footer: where this word lives, and the way to its full page */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag>Day {word.dayNumber}</Tag>
              {word.inConversationCount > 0 && (
                <Tag tone="accent">
                  In {word.inConversationCount} dialogue{word.inConversationCount > 1 ? "s" : ""}
                </Tag>
              )}
              {word.inParagraphCount > 0 && (
                <Tag tone="accent">
                  In {word.inParagraphCount} passage{word.inParagraphCount > 1 ? "s" : ""}
                </Tag>
              )}
            </div>
            <Link href={`/vocabulary/${word.id}`} className={textLinkClass}>
              View full details <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  );
}
