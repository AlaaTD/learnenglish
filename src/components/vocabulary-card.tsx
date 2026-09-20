"use client";

import Link from "next/link";
import { useState } from "react";
import { AudioButton } from "./audio-button";
import { WordActions } from "./word-actions";
import { Badge } from "./ui";
import { markVocabularyViewedAction } from "@/actions/day";
import { markWordViewedAction } from "@/actions/vocabulary";
import { VocabularyStateLabel, VocabularyStateStyle, type VocabularyState } from "@/lib/states";

export type VocabularyCardWord = {
  id: string;
  headword: string;
  pronunciation: string | null;
  partOfSpeech: string | null;
  definition: string;
  example: string;
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

export function VocabularyCard({
  word,
  trackDay,
  audioRate = 1,
  defaultOpen = false,
}: {
  word: VocabularyCardWord;
  /** When set (day page), expanding the card counts the word as viewed for that day. */
  trackDay?: number;
  audioRate?: number;
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
    }
  }

  return (
    <article
      className={`hover-lift group relative overflow-hidden rounded-2xl border bg-white p-4.5 shadow-xs transition-all dark:bg-zinc-900/95 ${
        state === "MASTERED"
          ? "border-emerald-300/80 shadow-emerald-500/5 dark:border-emerald-800/80"
          : state === "REVIEW"
            ? "border-amber-300/80 shadow-amber-500/5 dark:border-amber-800/80"
            : state === "LEARNING"
              ? "border-sky-300/80 shadow-sky-500/5 dark:border-sky-800/80"
              : "border-zinc-200/90 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/vocabulary/${word.id}`}
              className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors dark:text-zinc-50 dark:group-hover:text-indigo-400"
            >
              {word.headword}
            </Link>
            {word.pronunciation ? (
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {word.pronunciation}
              </span>
            ) : null}
            {word.partOfSpeech ? (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {word.partOfSpeech}
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
            {word.definition}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <AudioButton text={word.headword} rate={audioRate} small />
          <Badge className={VocabularyStateStyle[state]}>{VocabularyStateLabel[state]}</Badge>
        </div>
      </div>

      {open ? (
        <div className="mt-3.5 space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
          <div className="rounded-xl border-l-3 border-indigo-500 bg-indigo-50/40 p-3 dark:bg-indigo-950/20 dark:border-indigo-400">
            <span className="block text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Example
            </span>
            <p className="mt-1 text-sm italic text-zinc-800 dark:text-zinc-200 leading-relaxed">
              &ldquo;{word.example}&rdquo;
            </p>
          </div>

          {word.collocations.length > 0 && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Collocations
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {word.collocations.map((c, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(word.synonyms.length > 0 || word.antonyms.length > 0) && (
            <div className="grid gap-2 sm:grid-cols-2">
              {word.synonyms.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Synonyms
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {word.synonyms.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {word.antonyms.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Antonyms
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {word.antonyms.map((a, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-rose-50 px-2 py-0.5 text-xs text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {word.relatedForms.length > 0 && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Related Forms
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {word.relatedForms.map((rf, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    {rf}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="font-semibold text-zinc-500 dark:text-zinc-400">Day {word.dayNumber}</span>
            {word.inConversationCount > 0 && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                In {word.inConversationCount} dialogue{word.inConversationCount > 1 ? "s" : ""}
              </span>
            )}
            {word.inParagraphCount > 0 && (
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 font-medium text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                In {word.inParagraphCount} passage{word.inParagraphCount > 1 ? "s" : ""}
              </span>
            )}
            {word.usedInConversation && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                ✓ Used by you
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2.5 dark:border-zinc-800/80">
        <WordActions
          vocabularyId={word.id}
          dayNumber={word.dayNumber}
          initialState={{ state, usedInConversation: word.usedInConversation }}
          compact
        />
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50 transition-colors"
        >
          <span>{open ? "Less" : "Details"}</span>
          <svg
            className={`h-3.5 w-3.5 transform transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </article>
  );
}
