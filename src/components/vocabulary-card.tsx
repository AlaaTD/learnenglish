"use client";

import Link from "next/link";
import { useState } from "react";
import { AudioButton } from "./audio-button";
import { ArabicText, Badge, SmallLabel, Tag } from "./ui";
import { markVocabularyViewedAction } from "@/actions/day";
import { markWordViewedAction } from "@/actions/vocabulary";
import { audio } from "@/lib/audio";
import { VocabularyStateLabel, VocabularyStateStyle, type VocabularyState } from "@/lib/states";

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
  usedInConversation: boolean;
  inConversationCount: number;
  inParagraphCount: number;
};

// The border carries the learning state quietly; the badge names it.
const stateBorder: Record<string, string> = {
  UNLEARNED:
    "border-zinc-200 hover:border-brand-300 dark:border-zinc-800 dark:hover:border-brand-700",
  LEARNING: "border-sky-200 dark:border-sky-900",
  REVIEW: "border-amber-200 dark:border-amber-900",
  MASTERED: "border-emerald-200 dark:border-emerald-900",
};

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
  const state = word.state as VocabularyState;

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
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  const verbCells = word.verbForms
    ? [
        { key: "V1 · Base", ar: "المصدر", value: word.verbForms.v1 },
        { key: "V2 · Past", ar: "الماضي", value: word.verbForms.v2 },
        { key: "V3 · Participle", ar: "التصريف الثالث", value: word.verbForms.v3 },
      ]
    : [];

  return (
    <article
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      className={`group cursor-pointer rounded-2xl border bg-white p-4 transition-colors dark:bg-zinc-900 ${
        stateBorder[state] ?? stateBorder.UNLEARNED
      }`}
    >
      {/* Header: word identity on the left, state + audio + chevron on the right */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="break-words text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {word.headword}
            </span>
            {word.pronunciation ? (
              <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">{word.pronunciation}</span>
            ) : null}
            {word.partOfSpeech ? (
              <Tag tone="accent" className="italic">
                {word.partOfSpeech}
              </Tag>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{word.definition}</p>
          {word.translation ? <ArabicText className="mt-1">{word.translation}</ArabicText> : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge className={VocabularyStateStyle[state]}>{VocabularyStateLabel[state]}</Badge>
          <div className="flex items-center gap-1">
            <AudioButton text={word.headword} id={`word-${word.id}`} rate={audioRate} small />
            <svg
              aria-hidden="true"
              className={`h-4 w-4 text-zinc-500 transition-transform dark:text-zinc-400 ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className="mt-4 space-y-4 border-t border-zinc-100 pt-4 dark:border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Example sentence */}
          <div className="border-s-2 border-brand-200 ps-3 dark:border-brand-800">
            <SmallLabel>Example</SmallLabel>
            <p className="mt-1 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              &ldquo;{word.example}&rdquo;
            </p>
            {word.exampleArabic ? <ArabicText className="mt-1">{word.exampleArabic}</ArabicText> : null}
          </div>

          {/* Verb forms (verbs only): one neutral 3-cell strip instead of three coloured tiles */}
          {word.verbForms ? (
            <div>
              <SmallLabel className="mb-1.5">Verb forms · تصريفات الفعل</SmallLabel>
              <div className="grid grid-cols-3 divide-x divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-center rtl:divide-x-reverse dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50">
                {verbCells.map((cell) => (
                  <div key={cell.key} className="min-w-0 px-2 py-2.5">
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{cell.key}</p>
                    <p className="mt-0.5 break-words font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {cell.value}
                    </p>
                    <p dir="rtl" className="text-xs text-zinc-500 dark:text-zinc-400">
                      {cell.ar}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {word.collocations.length > 0 && (
            <div>
              <SmallLabel className="mb-1.5">Collocations</SmallLabel>
              <div className="flex flex-wrap gap-1.5">
                {word.collocations.map((c, i) => (
                  <Tag key={i}>{c}</Tag>
                ))}
              </div>
            </div>
          )}

          {(word.synonyms.length > 0 || word.antonyms.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {word.synonyms.length > 0 && (
                <div>
                  <SmallLabel className="mb-1.5">Synonyms</SmallLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {word.synonyms.map((s, i) => (
                      <Tag key={i} tone="success">
                        {s}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
              {word.antonyms.length > 0 && (
                <div>
                  <SmallLabel className="mb-1.5">Antonyms</SmallLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {word.antonyms.map((a, i) => (
                      <Tag key={i} tone="danger">
                        {a}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {word.relatedForms.length > 0 && (
            <div>
              <SmallLabel className="mb-1.5">Related forms</SmallLabel>
              <div className="flex flex-wrap gap-1.5">
                {word.relatedForms.map((rf, i) => (
                  <Tag key={i} className="font-mono">
                    {rf}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Footer meta */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <Link
              href={`/vocabulary/${word.id}`}
              className="font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              View full details →
            </Link>
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
        </div>
      ) : null}
    </article>
  );
}
