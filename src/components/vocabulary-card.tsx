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
      className={`rounded-xl border bg-white transition-colors dark:bg-zinc-900 ${
        state === "MASTERED"
          ? "border-emerald-200 dark:border-emerald-900"
          : state === "REVIEW"
            ? "border-amber-200 dark:border-amber-900"
            : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <Link
              href={`/vocabulary/${word.id}`}
              className="text-lg font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
            >
              {word.headword}
            </Link>
            {word.pronunciation ? (
              <span className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
                {word.pronunciation}
              </span>
            ) : null}
            {word.partOfSpeech ? (
              <span className="text-xs italic text-zinc-400 dark:text-zinc-500">
                {word.partOfSpeech}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{word.definition}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <AudioButton text={word.headword} rate={audioRate} small />
          <Badge className={VocabularyStateStyle[state]}>{VocabularyStateLabel[state]}</Badge>
        </div>
      </div>

      {open ? (
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3 dark:border-zinc-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-200">
            <span className="font-medium text-zinc-500 dark:text-zinc-400">Example: </span>
            {word.example}
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            {word.collocations.length > 0 && (
              <span>
                <span className="font-medium">Collocations: </span>
                {word.collocations.join(", ")}
              </span>
            )}
            {word.synonyms.length > 0 && (
              <span>
                <span className="font-medium">Synonyms: </span>
                {word.synonyms.join(", ")}
              </span>
            )}
            {word.antonyms.length > 0 && (
              <span>
                <span className="font-medium">Antonyms: </span>
                {word.antonyms.join(", ")}
              </span>
            )}
            {word.relatedForms.length > 0 && (
              <span>
                <span className="font-medium">Related forms: </span>
                {word.relatedForms.join(", ")}
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
            <span>Day {word.dayNumber}</span>
            {word.inConversationCount > 0 && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                In {word.inConversationCount} conversation{word.inConversationCount > 1 ? "s" : ""}
              </span>
            )}
            {word.inParagraphCount > 0 && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                In {word.inParagraphCount} paragraph{word.inParagraphCount > 1 ? "s" : ""}
              </span>
            )}
            {word.usedInConversation && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Used by you
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
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
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {open ? "Show less" : "Details"}
        </button>
      </div>
    </article>
  );
}
