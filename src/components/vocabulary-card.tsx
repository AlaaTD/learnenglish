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
 * A word's learning state shows as a short rail on the card's leading edge, in the same status
 * colour as its badge. Words not learned yet stay plain, so a fresh day reads calm and progress
 * shows up as colour appearing. The badge always names the state: colour is never the only signal.
 */
const stateRail: Record<string, string> = {
  LEARNING: "before:bg-sky-500 dark:before:bg-sky-400",
  REVIEW: "before:bg-amber-500 dark:before:bg-amber-400",
  MASTERED: "before:bg-emerald-500 dark:before:bg-emerald-400",
};
const railShape =
  "before:pointer-events-none before:absolute before:inset-y-4 before:start-0 before:w-1 before:rounded-e-full";

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
}: {
  word: VocabularyCardWord;
  /** When set (day page), expanding the card counts the word as viewed for that day. */
  trackDay?: number;
  audioRate?: number;
  autoplayAudio?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [viewed, setViewed] = useState(false);
  const rail = stateRail[word.state];

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
      className={`group relative cursor-pointer rounded-2xl border bg-white p-4 shadow-card transition duration-150 hover:border-brand-300 hover:shadow-lift dark:bg-zinc-900 dark:shadow-none dark:hover:border-brand-700 ${
        open ? "border-zinc-300 shadow-lift dark:border-zinc-700" : "border-zinc-200 dark:border-zinc-800"
      } ${rail ? `${railShape} ${rail}` : ""}`}
    >
      {/* Row 1: the word, with its actions (difficult toggle, listen, expand) at the end */}
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          {word.headword}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <DifficultToggleButton
            vocabularyId={word.id}
            dayNumber={trackDay ?? word.dayNumber}
            initialIsDifficult={word.isDifficult ?? false}
          />
          <AudioButton text={word.headword} id={`word-${word.id}`} rate={audioRate} small />
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors group-hover:bg-zinc-100 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-800 dark:group-hover:text-zinc-100"
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

      {/* Row 2: how it sounds and what it is */}
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        {word.pronunciation ? (
          <span className="font-phonetic text-sm text-zinc-500 dark:text-zinc-400">{word.pronunciation}</span>
        ) : null}
        {word.partOfSpeech ? <Tag tone="accent">{word.partOfSpeech}</Tag> : null}
      </div>

      <p className="mt-2.5 text-[0.9375rem] leading-6 text-zinc-700 dark:text-zinc-300">{word.definition}</p>
      {word.translation ? (
        <ArabicText tone="warm" className="mt-1 font-medium">
          {word.translation}
        </ArabicText>
      ) : null}

      {open ? (
        <div
          className="mt-4 animate-reveal cursor-auto space-y-5 border-t border-zinc-200 pt-4 dark:border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Example sentence, set like a quotation */}
          <div className="border-s-2 border-brand-300 ps-3.5 dark:border-brand-700">
            <SmallLabel>Example</SmallLabel>
            <p className="mt-1.5 text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
              &ldquo;{word.example}&rdquo;
            </p>
            {word.exampleArabic ? (
              <ArabicText tone="warm" className="mt-1.5">
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
              <div className="grid grid-cols-3 divide-x divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-center rtl:divide-x-reverse dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50">
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
