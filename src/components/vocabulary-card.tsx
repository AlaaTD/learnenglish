"use client";

import Link from "next/link";
import { useState } from "react";
import { AudioButton } from "./audio-button";
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
      onClick={toggle}
      className={`group relative overflow-hidden rounded-2xl border bg-white p-4.5 shadow-xs transition-all cursor-pointer dark:bg-zinc-900/95 hover:shadow-md ${
        state === "MASTERED"
          ? "border-emerald-300/80 shadow-emerald-500/5 dark:border-emerald-800/80"
          : state === "REVIEW"
            ? "border-amber-300/80 shadow-amber-500/5 dark:border-amber-800/80"
            : state === "LEARNING"
              ? "border-sky-300/80 shadow-sky-500/5 dark:border-sky-800/80"
              : "border-zinc-200/90 hover:border-indigo-200 dark:border-zinc-800 dark:hover:border-indigo-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors dark:text-zinc-50 dark:group-hover:text-indigo-400">
              {word.headword}
            </span>
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
            {word.verbForms ? (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                V1: {word.verbForms.v1} · V2: {word.verbForms.v2} · V3: {word.verbForms.v3}
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
        <div className="mt-3.5 space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800/80" onClick={(e) => e.stopPropagation()}>
          {/* Verb Conjugation Table (Only for Verbs) */}
          {word.verbForms && (
            <div className="rounded-2xl border border-indigo-100/90 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 p-4 shadow-xs dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-violet-950/20">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">
                    V
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                    Verb Forms · تصريفات الفعل
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-indigo-600/70 dark:text-indigo-400/70">
                  المصدر · الماضي · الماضي التام
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    V1 (Base / Present)
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                    {word.verbForms.v1}
                  </span>
                  <span className="block text-[10px] text-zinc-400 mt-0.5">المصدر / المضارع</span>
                </div>
                <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-2.5 dark:border-indigo-900/60 dark:bg-indigo-950/40">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    V2 (Past Simple)
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                    {word.verbForms.v2}
                  </span>
                  <span className="block text-[10px] text-indigo-500/80 mt-0.5">الماضي البسيط</span>
                </div>
                <div className="rounded-xl border border-violet-200/80 bg-violet-50/50 p-2.5 dark:border-violet-900/60 dark:bg-violet-950/40">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    V3 (Past Participle)
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-bold text-violet-700 dark:text-violet-300 font-mono">
                    {word.verbForms.v3}
                  </span>
                  <span className="block text-[10px] text-violet-500/80 mt-0.5">التصريف الثالث (التام)</span>
                </div>
              </div>
            </div>
          )}

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
            <Link
              href={`/vocabulary/${word.id}`}
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View full details →
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
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
          </div>
        </div>
      ) : null}

      {/* Minimal expand indicator */}
      <div className="mt-2.5 flex items-center justify-center">
        <span className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${open ? "text-indigo-500" : "text-zinc-400 group-hover:text-indigo-500"}`}>
          <svg
            className={`h-3.5 w-3.5 transform transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </article>
  );
}
