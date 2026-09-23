"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IconCheckCircle, IconRotateCcw, IconXCircle, IconArrowRight } from "@/components/dashboard/icons";
import { AudioButton } from "@/components/audio-button";
import { EmptyState, ProgressBar, SegmentedControl } from "./ui";

export type ExerciseWord = {
  id: string;
  headword: string;
  translation: string | null;
  partOfSpeech?: string | null;
};

type Answer = {
  wordId: string;
  correct: boolean;
  userAnswer: string;
};

type SavedProgress = {
  orderIds: string[];
  index: number;
  answers: Answer[];
};

type ExerciseMode = "single" | "batch";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]+$/, "")
    .replace(/\s+/g, " ");
}

export function DayExercise({
  words,
  storageKey,
}: {
  words: ExerciseWord[];
  storageKey: string;
}) {
  const usable = useMemo(
    () => words.filter((w) => w.translation && w.translation.trim().length > 0),
    [words],
  );

  const [mode, setMode] = useState<ExerciseMode>("single");

  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState<ExerciseWord[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [resetArmed, setResetArmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let restored: { order: ExerciseWord[]; index: number; answers: Answer[] } | null = null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedProgress>;
        const byId = new Map(usable.map((w) => [w.id, w]));
        if (
          Array.isArray(saved.orderIds) &&
          saved.orderIds.length === usable.length &&
          saved.orderIds.every((id) => byId.has(id))
        ) {
          restored = {
            order: saved.orderIds.map((id) => byId.get(id)!),
            index: Math.min(Math.max(saved.index ?? 0, 0), saved.orderIds.length),
            answers: Array.isArray(saved.answers) ? saved.answers : [],
          };
        }
      }
    } catch {

    }

    if (restored) {
      setOrder(restored.order);
      setIndex(restored.index);
      setAnswers(restored.answers);
    } else {
      setOrder(shuffle(usable));
    }
    setReady(true);
  }, [storageKey, usable]);

  useEffect(() => {
    if (!ready || order.length === 0) return;
    try {
      const payload: SavedProgress = {
        orderIds: order.map((w) => w.id),
        index,
        answers,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {

    }
  }, [ready, storageKey, order, index, answers]);

  useEffect(() => {
    if (!resetArmed) return;
    const timer = window.setTimeout(() => setResetArmed(false), 3000);
    return () => window.clearTimeout(timer);
  }, [resetArmed]);

  // ---- batch ("all words together") mode ----
  const [batchOrder, setBatchOrder] = useState<ExerciseWord[]>(() => shuffle(usable));
  const [batchInputs, setBatchInputs] = useState<Record<string, string>>({});
  const [batchChecked, setBatchChecked] = useState(false);
  const [batchAnswers, setBatchAnswers] = useState<Answer[]>([]);
  const batchInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset the batch order whenever the underlying word list actually changes
  // (e.g. a different day's vocabulary), without calling setState inside an
  // effect (avoids react-hooks/set-state-in-effect) — this is React's
  // recommended "adjust state during render" pattern.
  const [usableForBatch, setUsableForBatch] = useState(usable);
  if (usable !== usableForBatch) {
    setUsableForBatch(usable);
    setBatchOrder(shuffle(usable));
  }

  const total = order.length;
  const current = order[index];
  const finished = total > 0 && index >= total;
  const correctCount = answers.filter((a) => a.correct).length;
  const wrongCount = answers.filter((a) => !a.correct).length;

  function checkAnswer() {
    if (!current || result !== null || !input.trim()) return;
    const isCorrect = normalize(input) === normalize(current.headword);
    setResult(isCorrect ? "correct" : "wrong");
    setAnswers((prev) => [
      ...prev,
      { wordId: current.id, correct: isCorrect, userAnswer: input.trim() },
    ]);
  }

  function nextWord() {
    setResult(null);
    setInput("");
    setIndex((i) => i + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function restart() {
    setOrder(shuffle(usable));
    setIndex(0);
    setInput("");
    setResult(null);
    setAnswers([]);
    setResetArmed(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function practiceMistakesOnly() {
    const wrongIds = new Set(answers.filter((a) => !a.correct).map((a) => a.wordId));
    const wrongWords = usable.filter((w) => wrongIds.has(w.id));
    if (wrongWords.length === 0) return;
    setOrder(shuffle(wrongWords));
    setIndex(0);
    setInput("");
    setResult(null);
    setAnswers([]);
    setResetArmed(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleResetClick() {
    if (!resetArmed) {
      setResetArmed(true);
      return;
    }
    restart();
  }

  const batchTotal = batchOrder.length;
  const batchFilledCount = batchOrder.filter((w) => (batchInputs[w.id] ?? "").trim().length > 0).length;
  const batchCorrectCount = batchAnswers.filter((a) => a.correct).length;
  const batchWrongCount = batchAnswers.filter((a) => !a.correct).length;
  const batchPercent = batchTotal > 0 ? Math.round((batchCorrectCount / batchTotal) * 100) : 0;
  const batchTier = batchPercent >= 85 ? "excellent" : batchPercent >= 60 ? "good" : "low";
  const batchMsgEn =
    batchTier === "excellent"
      ? "Superb! You have solid mastery of these words."
      : batchTier === "good"
        ? "Great practice! Review the missed words below to cement them."
        : "Keep practicing! Regular repetition makes vocabulary stick.";
  const batchMsgAr =
    batchTier === "excellent"
      ? "أداء ممتاز! لديك تمكّن قوي من هذه المفردات"
      : batchTier === "good"
        ? "مجهود رائع! راجع الكلمات التي أخطأت بها بالأسفل لتثبيتها"
        : "استمر في التكرار! الممارسة اليومية هي سر الإتقان";

  function setBatchInput(wordId: string, value: string) {
    if (batchChecked) return;
    setBatchInputs((prev) => ({ ...prev, [wordId]: value }));
  }

  function checkAllAnswers() {
    if (batchChecked || batchOrder.length === 0) return;
    const results: Answer[] = batchOrder.map((w) => {
      const userAnswer = (batchInputs[w.id] ?? "").trim();
      const isCorrect = userAnswer.length > 0 && normalize(userAnswer) === normalize(w.headword);
      return { wordId: w.id, correct: isCorrect, userAnswer };
    });
    setBatchAnswers(results);
    setBatchChecked(true);
  }

  function restartBatch() {
    setBatchOrder(shuffle(usable));
    setBatchInputs({});
    setBatchChecked(false);
    setBatchAnswers([]);
  }

  function practiceBatchMistakesOnly() {
    const wrongIds = new Set(batchAnswers.filter((a) => !a.correct).map((a) => a.wordId));
    const wrongWords = usable.filter((w) => wrongIds.has(w.id));
    if (wrongWords.length === 0) return;
    setBatchOrder(shuffle(wrongWords));
    setBatchInputs({});
    setBatchChecked(false);
    setBatchAnswers([]);
  }

  function focusBatchInputAt(i: number) {
    const target = batchOrder[i];
    if (target) batchInputRefs.current[target.id]?.focus();
  }

  function handleBatchInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (i + 1 < batchOrder.length) {
      focusBatchInputAt(i + 1);
    } else {
      checkAllAnswers();
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-xl animate-pulse space-y-6">
        <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-night-800" />
        <div className="space-y-3 pt-2 text-center">
          <div className="mx-auto h-3 w-40 rounded-full bg-zinc-200 dark:bg-night-800" />
          <div className="mx-auto h-11 w-56 rounded-lg bg-zinc-200 dark:bg-night-800" />
        </div>
        <div className="h-14 w-full rounded-xl bg-zinc-200 dark:bg-night-800" />
        <div className="h-12 w-full rounded-xl bg-zinc-200 dark:bg-night-800" />
      </div>
    );
  }


  if (total === 0) {
    return (
      <EmptyState title="No exercise available for this day yet.">
        This day&apos;s words don&apos;t have Arabic meanings saved yet, so the exercise cannot be generated.
      </EmptyState>
    );
  }

  const isLast = index + 1 === total;

  const modeSwitcher = (
    <div className="flex justify-center">
      <SegmentedControl<ExerciseMode>
        value={mode}
        onChange={setMode}
        label="Exercise mode · نوع التمرين"
        size="sm"
        options={[
          { value: "single", label: "Word by Word · كلمة كلمة" },
          { value: "batch", label: "All at Once · كل الكلمات" },
        ]}
      />
    </div>
  );

  if (mode === "single" && finished) {
    const percent = Math.round((correctCount / total) * 100);
    const tier = percent >= 85 ? "excellent" : percent >= 60 ? "good" : "low";

    const msgEn =
      tier === "excellent"
        ? "Superb! You have solid mastery of these words."
        : tier === "good"
          ? "Great practice! Review the missed words below to cement them."
          : "Keep practicing! Regular repetition makes vocabulary stick.";

    const msgAr =
      tier === "excellent"
        ? "أداء ممتاز! لديك تمكّن قوي من هذه المفردات"
        : tier === "good"
          ? "مجهود رائع! راجع الكلمات التي أخطأت بها بالأسفل لتثبيتها"
          : "استمر في التكرار! الممارسة اليومية هي سر الإتقان";

    const missedAnswers = answers.filter((a) => !a.correct);
    const byId = new Map(usable.map((w) => [w.id, w]));
    const missedWords = missedAnswers
      .map((a) => {
        const word = byId.get(a.wordId);
        return word ? { word, userAnswer: a.userAnswer } : null;
      })
      .filter((item): item is { word: ExerciseWord; userAnswer: string } => Boolean(item));

    return (
      <div className="mx-auto w-full max-w-xl space-y-7">
        {modeSwitcher}

        <div className="space-y-7 text-center">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-mist-500">
              Exercise Completed · اكتمل التمرين
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{percent}%</h2>
            <p className="text-sm font-medium text-zinc-600 dark:text-mist-300">{msgEn}</p>
            <p dir="rtl" lang="ar" className="text-sm font-medium text-clay-700 dark:text-clay-300">
              {msgAr}
            </p>
          </div>

          {}
          <div className="mx-auto flex max-w-sm items-center justify-center gap-8">
            <div>
              <p className="font-mono text-lg font-bold text-zinc-900 dark:text-white">{total}</p>
              <p className="text-[11px] text-zinc-400 dark:text-mist-500">Total · إجمالي</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</p>
              <p className="text-[11px] text-zinc-400 dark:text-mist-500">Correct · صحيحة</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-rose-600 dark:text-rose-400">{wrongCount}</p>
              <p className="text-[11px] text-zinc-400 dark:text-mist-500">Mistakes · أخطاء</p>
            </div>
          </div>

          {missedWords.length > 0 && (
            <div className="space-y-1 border-t border-zinc-200 pt-6 text-start dark:border-night-800">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-mist-500">
                Words to Review · كلمات تحتاج إلى مراجعة ({missedWords.length})
              </p>
              <div className="divide-y divide-zinc-200 dark:divide-night-800">
                {missedWords.map(({ word, userAnswer }) => (
                  <div key={word.id} className="flex items-center gap-3 py-2.5">
                    <span dir="rtl" lang="ar" className="min-w-[92px] shrink-0 text-sm font-medium text-zinc-700 dark:text-mist-200">
                      {word.translation}
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-zinc-400 dark:text-mist-600">
                      →
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-zinc-900 dark:text-white">{word.headword}</span>
                      {userAnswer && (
                        <span className="ms-2 text-xs text-rose-600 dark:text-rose-300">
                          typed: <del>{userAnswer}</del>
                        </span>
                      )}
                    </div>
                    <AudioButton text={word.headword} small label={`Listen to ${word.headword}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-1">
            {wrongCount > 0 && (
              <button
                type="button"
                onClick={practiceMistakesOnly}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-night-700 dark:bg-night-900 dark:text-mist-200 dark:hover:bg-night-800 dark:hover:text-white"
              >
                <IconRotateCcw className="h-4 w-4" />
                Practice Missed Words Only ({wrongCount}) · تدريب على الأخطاء فقط
              </button>
            )}
            <button
              type="button"
              onClick={restart}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              <IconRotateCcw className="h-4 w-4" />
              Restart All Words ({total}) · إعادة التمرين كاملاً
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "single") {
    return (
      <div className="mx-auto w-full max-w-xl space-y-6">
        {modeSwitcher}

        {}
        <div className="flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-mist-500">
          <span className="font-medium tabular-nums">
            {index + 1} / {total}
          </span>
          <div className="flex items-center gap-4">
            {(correctCount > 0 || wrongCount > 0) && (
              <span className="tabular-nums">
                <span className="text-emerald-600 dark:text-emerald-400">{correctCount} correct</span>
                {wrongCount > 0 && (
                  <>
                    {" "}
                    · <span className="text-rose-600 dark:text-rose-400">{wrongCount} mistakes</span>
                  </>
                )}
              </span>
            )}
            <button
              type="button"
              onClick={handleResetClick}
              className={`font-medium transition-colors ${
                resetArmed ? "text-rose-600 dark:text-rose-400" : "text-zinc-500 hover:text-zinc-700 dark:text-mist-500 dark:hover:text-mist-300"
              }`}
            >
              {resetArmed ? "Confirm restart?" : "Restart"}
            </button>
          </div>
        </div>

        <ProgressBar value={answers.length} max={total} size="sm" label="Exercise progress" />

        {
}
        <div key={current.id} className="animate-reveal space-y-2.5 pt-2 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-mist-500">
            <span>Translate into English · ترجم للإنجليزية</span>
            {current.partOfSpeech && <span className="text-zinc-400 dark:text-mist-600">· {current.partOfSpeech}</span>}
          </p>
          <p dir="rtl" lang="ar" className="text-4xl font-bold text-zinc-900 dark:text-white sm:text-[2.75rem]">
            {current.translation}
          </p>
        </div>

        {}
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            result !== null ? nextWord() : checkAnswer();
          }}
          disabled={result !== null}
          placeholder="Type English word here..."
          autoFocus
          className={`h-14 w-full rounded-xl border bg-white px-4 text-center text-xl font-semibold text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-500 disabled:cursor-default dark:bg-night-950 dark:text-mist-100 dark:placeholder:text-mist-600 ${
            result === "correct"
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
              : result === "wrong"
                ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                : "border-zinc-300 dark:border-night-700"
          }`}
        />

        {
}
        {result === "correct" && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 animate-reveal dark:border-emerald-700/60 dark:bg-emerald-950/40">
            <div className="flex min-w-0 items-center gap-3">
              <IconCheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Correct Answer! · إجابة صحيحة
                </p>
                <p className="truncate text-base font-semibold text-zinc-900 dark:text-white">{current.headword}</p>
              </div>
            </div>
            <AudioButton text={current.headword} small label={`Listen to ${current.headword}`} />
          </div>
        )}

        {result === "wrong" && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4 animate-reveal dark:border-rose-700/60 dark:bg-rose-950/40">
            <div className="min-w-0 flex items-center gap-3">
              <IconXCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                  Incorrect · إجابة غير صحيحة
                </p>
                <p className="truncate text-sm text-zinc-700 dark:text-mist-200">
                  <del className="text-rose-600 dark:text-rose-300">{input.trim() || "(empty)"}</del>
                  <span className="mx-1.5 text-zinc-400 dark:text-mist-500">→</span>
                  <strong className="font-semibold text-zinc-900 dark:text-white">{current.headword}</strong>
                </p>
              </div>
            </div>
            <AudioButton text={current.headword} small label={`Listen to ${current.headword}`} />
          </div>
        )}

        {}
        {result !== null ? (
          <button
            type="button"
            onClick={nextWord}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            <span>{isLast ? "View Results · عرض النتيجة" : "Next Word · الكلمة التالية"}</span>
            <IconArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={checkAnswer}
            disabled={!input.trim()}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check Answer · تحقق من الإجابة
          </button>
        )}

        <p className="text-center text-xs text-zinc-400 dark:text-mist-600">Press Enter ↵</p>
      </div>
    );
  }

  // ---- batch ("all words together") mode ----
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {modeSwitcher}

      {!batchChecked ? (
        <>
          <div className="space-y-2 pt-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-mist-500">
              All Words Together · كل الكلمات مجمعة
            </p>
            <p className="text-sm text-zinc-600 dark:text-mist-400">
              {batchFilledCount} / {batchTotal} filled · {batchFilledCount} من {batchTotal} تمت كتابتها
            </p>
          </div>

          <ProgressBar value={batchFilledCount} max={batchTotal} size="sm" label="Batch exercise progress" />

          <div className="space-y-2.5">
            {batchOrder.map((word, i) => (
              <div
                key={word.id}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-night-700 dark:bg-night-900"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 font-mono text-xs font-semibold text-zinc-500 dark:bg-night-800 dark:text-mist-400">
                  {i + 1}
                </span>
                <input
                  ref={(el) => {
                    batchInputRefs.current[word.id] = el;
                  }}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={batchInputs[word.id] ?? ""}
                  onChange={(e) => setBatchInput(word.id, e.target.value)}
                  onKeyDown={(e) => handleBatchInputKeyDown(e, i)}
                  placeholder="Type English word..."
                  className="h-11 min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-500 dark:border-night-700 dark:bg-night-950 dark:text-mist-100 dark:placeholder:text-mist-600"
                />
                <span
                  dir="rtl"
                  lang="ar"
                  className="w-28 shrink-0 text-right text-base font-semibold text-zinc-900 dark:text-white sm:w-36"
                >
                  {word.translation}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={checkAllAnswers}
            disabled={batchFilledCount === 0}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check All Answers · تحقق من كل الإجابات
          </button>

          <p className="text-center text-xs text-zinc-400 dark:text-mist-600">
            Press Enter ↵ to move to the next word · اضغط Enter للانتقال للكلمة التالية
          </p>
        </>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2.5">
            {batchOrder.map((word, i) => {
              const ans = batchAnswers.find((a) => a.wordId === word.id);
              const isCorrect = ans?.correct ?? false;
              return (
                <div
                  key={word.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    isCorrect
                      ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700/60 dark:bg-emerald-950/30"
                      : "border-rose-300 bg-rose-50 dark:border-rose-700/60 dark:bg-rose-950/30"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/70 font-mono text-xs font-semibold text-zinc-500 dark:bg-night-800/70 dark:text-mist-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        isCorrect
                          ? "text-emerald-800 dark:text-emerald-200"
                          : "text-rose-700 line-through dark:text-rose-300"
                      }`}
                    >
                      {ans?.userAnswer || "(empty)"}
                    </p>
                    {!isCorrect && (
                      <p className="mt-0.5 text-xs text-zinc-600 dark:text-mist-300">
                        <span className="text-zinc-400 dark:text-mist-500">Correct: </span>
                        <strong className="font-semibold text-zinc-900 dark:text-white">{word.headword}</strong>
                      </p>
                    )}
                  </div>
                  <AudioButton text={word.headword} small label={`Listen to ${word.headword}`} />
                  {isCorrect ? (
                    <IconCheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <IconXCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                  )}
                  <span
                    dir="rtl"
                    lang="ar"
                    className="w-28 shrink-0 text-right text-base font-semibold text-zinc-900 dark:text-white sm:w-36"
                  >
                    {word.translation}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-7 border-t border-zinc-200 pt-6 text-center dark:border-night-800">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-mist-500">
                Exercise Completed · اكتمل التمرين
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{batchPercent}%</h2>
              <p className="text-sm font-medium text-zinc-600 dark:text-mist-300">{batchMsgEn}</p>
              <p dir="rtl" lang="ar" className="text-sm font-medium text-clay-700 dark:text-clay-300">
                {batchMsgAr}
              </p>
            </div>

            <div className="mx-auto flex max-w-sm items-center justify-center gap-8">
              <div>
                <p className="font-mono text-lg font-bold text-zinc-900 dark:text-white">{batchTotal}</p>
                <p className="text-[11px] text-zinc-400 dark:text-mist-500">Total · إجمالي</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">{batchCorrectCount}</p>
                <p className="text-[11px] text-zinc-400 dark:text-mist-500">Correct · صحيحة</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-rose-600 dark:text-rose-400">{batchWrongCount}</p>
                <p className="text-[11px] text-zinc-400 dark:text-mist-500">Mistakes · أخطاء</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {batchWrongCount > 0 && (
                <button
                  type="button"
                  onClick={practiceBatchMistakesOnly}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-night-700 dark:bg-night-900 dark:text-mist-200 dark:hover:bg-night-800 dark:hover:text-white"
                >
                  <IconRotateCcw className="h-4 w-4" />
                  Practice Missed Words Only ({batchWrongCount}) · تدريب على الأخطاء فقط
                </button>
              )}
              <button
                type="button"
                onClick={restartBatch}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
              >
                <IconRotateCcw className="h-4 w-4" />
                Restart All Words ({batchTotal}) · إعادة التمرين كاملاً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
