"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IconCheckCircle, IconRotateCcw, IconXCircle, IconArrowRight } from "@/components/dashboard/icons";
import { AudioButton } from "@/components/audio-button";
import { EmptyState } from "./ui";

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
      // Storage unavailable or corrupted.
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
      // Ignore write errors.
    }
  }, [ready, storageKey, order, index, answers]);

  useEffect(() => {
    if (!resetArmed) return;
    const timer = window.setTimeout(() => setResetArmed(false), 3000);
    return () => window.clearTimeout(timer);
  }, [resetArmed]);

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

  /* ── Loading Skeleton ── */
  if (!ready) {
    return (
      <>
        <style>{exStyles}</style>
        <div className="ex-root">
          <div className="ex-skeleton-bar" />
          <div className="ex-stage-card">
            <div className="ex-skeleton-line" style={{ width: "35%", height: 16 }} />
            <div className="ex-skeleton-box" style={{ height: 140 }} />
            <div className="ex-skeleton-line" style={{ width: "100%", height: 60 }} />
            <div className="ex-skeleton-line" style={{ width: "100%", height: 52 }} />
          </div>
        </div>
      </>
    );
  }

  /* ── Empty State ── */
  if (total === 0) {
    return (
      <EmptyState title="No exercise available for this day yet.">
        This day&apos;s words don&apos;t have Arabic meanings saved yet, so the exercise cannot be generated.
      </EmptyState>
    );
  }

  /* ── Finished State ── */
  if (finished) {
    const percent = Math.round((correctCount / total) * 100);
    const tier = percent >= 85 ? "excellent" : percent >= 60 ? "good" : "low";
    const circumference = 2 * Math.PI * 52;
    const ringColor = tier === "excellent" ? "#34d399" : tier === "good" ? "#fbbf24" : "#f87171";

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

    // Build missed words list
    const missedAnswers = answers.filter((a) => !a.correct);
    const byId = new Map(usable.map((w) => [w.id, w]));
    const missedWords = missedAnswers
      .map((a) => {
        const word = byId.get(a.wordId);
        return word ? { word, userAnswer: a.userAnswer } : null;
      })
      .filter((item): item is { word: ExerciseWord; userAnswer: string } => Boolean(item));

    return (
      <>
        <style>{exStyles}</style>
        <div className="ex-root">
          <div className="ex-stage-card ex-done-container">
            <div className="ex-done-header">
              <span className="ex-eyebrow">Exercise Completed · اكتمل التمرين</span>
              <h2 className="ex-done-title">Performance Summary</h2>
            </div>

            {/* Score Ring */}
            <div className="ex-ring-wrap">
              <svg viewBox="0 0 120 120" className="ex-ring-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1c2743" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: circumference * (1 - percent / 100),
                    transition: "stroke-dashoffset 1s ease",
                  }}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="ex-ring-text">
                <span className="ex-ring-num" style={{ color: ringColor }}>
                  {percent}%
                </span>
                <span className="ex-ring-sub">Accuracy</span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="ex-stats-grid">
              <div className="ex-stat-tile">
                <span className="ex-stat-val text-white">{total}</span>
                <span className="ex-stat-lbl">Total Words · إجمالي</span>
              </div>
              <div className="ex-stat-tile">
                <span className="ex-stat-val text-emerald-400">{correctCount}</span>
                <span className="ex-stat-lbl">Correct · صحيحة</span>
              </div>
              <div className="ex-stat-tile">
                <span className="ex-stat-val text-rose-400">{wrongCount}</span>
                <span className="ex-stat-lbl">Mistakes · أخطاء</span>
              </div>
            </div>

            {/* Message Box */}
            <div className="ex-msg-box">
              <p className="ex-msg-en">{msgEn}</p>
              <p className="ex-msg-ar">{msgAr}</p>
            </div>

            {/* Missed Words Section */}
            {missedWords.length > 0 && (
              <div className="ex-missed-section">
                <div className="ex-missed-header">
                  <span className="ex-missed-title">
                    Words to Review · كلمات تحتاج إلى مراجعة ({missedWords.length})
                  </span>
                </div>
                <div className="ex-missed-list">
                  {missedWords.map(({ word, userAnswer }) => (
                    <div key={word.id} className="ex-missed-row">
                      <div className="ex-missed-ar" dir="rtl">
                        {word.translation}
                      </div>
                      <div className="ex-missed-arrow">→</div>
                      <div className="ex-missed-correct">
                        <span className="ex-missed-headword">{word.headword}</span>
                        {userAnswer && (
                          <span className="ex-missed-typed">
                            (typed: <del>{userAnswer}</del>)
                          </span>
                        )}
                      </div>
                      <div className="ex-missed-audio">
                        <AudioButton text={word.headword} small label={`Listen to ${word.headword}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="ex-done-actions">
              {wrongCount > 0 && (
                <button
                  type="button"
                  onClick={practiceMistakesOnly}
                  className="ex-btn ex-btn-secondary"
                >
                  <IconRotateCcw style={{ width: 17, height: 17 }} />
                  Practice Missed Words Only ({wrongCount}) · تدريب على الأخطاء فقط
                </button>
              )}
              <button type="button" onClick={restart} className="ex-btn ex-btn-primary">
                <IconRotateCcw style={{ width: 17, height: 17 }} />
                Restart All Words ({total}) · إعادة التمرين كاملاً
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Main Exercise View ── */
  const pct = total > 0 ? (answers.length / total) * 100 : 0;
  const isLast = index + 1 === total;

  return (
    <>
      <style>{exStyles}</style>
      <div className="ex-root">
        {/* Top Control & Stats Bar */}
        <div className="ex-topbar">
          <div className="ex-topbar-left">
            <div className="ex-counter-badge">
              <span className="ex-counter-label">Question</span>
              <span className="ex-counter-curr">{index + 1}</span>
              <span className="ex-counter-sep">/</span>
              <span className="ex-counter-total">{total}</span>
            </div>

            <div className="ex-stats-pills">
              <span className="ex-pill ex-pill-ok">
                <span className="ex-pill-dot" />
                {correctCount} Correct
              </span>
              {wrongCount > 0 && (
                <span className="ex-pill ex-pill-err">
                  <span className="ex-pill-dot" />
                  {wrongCount} Mistakes
                </span>
              )}
            </div>
          </div>

          <div className="ex-topbar-right">
            <span className="ex-keycap-hint">Enter ↵</span>
            <button
              type="button"
              onClick={handleResetClick}
              className={`ex-reset-btn${resetArmed ? " ex-reset-btn--armed" : ""}`}
              title="Reset progress"
            >
              <IconRotateCcw style={{ width: 14, height: 14 }} />
              {resetArmed ? "Confirm restart?" : "Restart"}
            </button>
          </div>
        </div>

        {/* Smooth Progress Bar */}
        <div className="ex-progress-track">
          <div className="ex-progress-bar" style={{ width: `${pct}%` }} />
        </div>

        {/* Main Stage Card */}
        <div key={current.id} className="ex-stage-card ex-anim-enter">
          {/* Card Meta / Eyebrow */}
          <div className="ex-stage-meta">
            <span className="ex-eyebrow">Translate into English · ترجم للإنجليزية</span>
            {current.partOfSpeech && (
              <span className="ex-pos-tag">{current.partOfSpeech}</span>
            )}
          </div>

          {/* Hero Arabic Word Stage */}
          <div className="ex-hero-arabic-box">
            <p dir="rtl" lang="ar" className="ex-arabic-head">
              {current.translation}
            </p>
            <span className="ex-arabic-sub">اكتب الكلمة الإنجليزية المناسبة بالأسفل</span>
          </div>

          {/* User Input Field */}
          <div className="ex-input-container">
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
              className={`ex-input-field${
                result === "correct"
                  ? " ex-input-field--ok"
                  : result === "wrong"
                    ? " ex-input-field--err"
                    : ""
              }`}
            />
          </div>

          {/* Feedback Area */}
          {result === "correct" && (
            <div className="ex-feedback-box ex-feedback--ok">
              <div className="ex-feedback-left">
                <IconCheckCircle className="ex-feedback-icon" />
                <div className="ex-feedback-content">
                  <span className="ex-feedback-title">Correct Answer! · إجابة صحيحة</span>
                  <span className="ex-feedback-word">{current.headword}</span>
                </div>
              </div>
              <AudioButton text={current.headword} small label={`Listen to ${current.headword}`} />
            </div>
          )}

          {result === "wrong" && (
            <div className="ex-feedback-box ex-feedback--err">
              <div className="ex-feedback-left">
                <IconXCircle className="ex-feedback-icon" />
                <div className="ex-feedback-content">
                  <span className="ex-feedback-title">Incorrect · إجابة غير صحيحة</span>
                  <div className="ex-feedback-comparison">
                    <span className="ex-wrong-entry">
                      You typed: <del>{input.trim() || "(empty)"}</del>
                    </span>
                    <span className="ex-correct-target">
                      Correct: <strong>{current.headword}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <AudioButton text={current.headword} small label={`Listen to ${current.headword}`} />
            </div>
          )}

          {/* Action Button */}
          {result !== null ? (
            <button
              type="button"
              onClick={nextWord}
              className="ex-btn ex-btn-primary"
            >
              <span>{isLast ? "View Results · عرض النتيجة" : "Next Word · الكلمة التالية"}</span>
              <IconArrowRight style={{ width: 17, height: 17 }} />
              <span className="ex-btn-keycap">Enter ↵</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={checkAnswer}
              disabled={!input.trim()}
              className="ex-btn ex-btn-primary"
            >
              <span>Check Answer · تحقق من الإجابة</span>
              <span className="ex-btn-keycap">Enter ↵</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────── Clean, Flat, Professional Styles ─────────────── */
const exStyles = `
  /* Root Container - Generous Width for Desktop / Tablets */
  .ex-root {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: inherit;
  }

  /* Skeleton Loading */
  .ex-skeleton-bar {
    height: 6px;
    border-radius: 999px;
    background: #1c2743;
    animation: ex-pulse 1.5s ease-in-out infinite;
  }
  .ex-skeleton-box, .ex-skeleton-line {
    border-radius: 14px;
    background: #1c2743;
    animation: ex-pulse 1.5s ease-in-out infinite;
  }
  .ex-stage-card .ex-skeleton-box + .ex-skeleton-line,
  .ex-stage-card .ex-skeleton-line + .ex-skeleton-line {
    margin-top: 14px;
  }
  @keyframes ex-pulse {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.7; }
  }

  /* Top Bar */
  .ex-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .ex-topbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ex-counter-badge {
    display: inline-flex;
    align-items: baseline;
    gap: 5px;
    background: #131c31;
    border: 1px solid #1f2d4e;
    padding: 6px 14px;
    border-radius: 999px;
  }
  .ex-counter-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #7488ab;
  }
  .ex-counter-curr {
    font-size: 16px;
    font-weight: 800;
    color: #f6f8fc;
  }
  .ex-counter-sep {
    font-size: 13px;
    font-weight: 600;
    color: #4c5b80;
  }
  .ex-counter-total {
    font-size: 14px;
    font-weight: 600;
    color: #8ea1c4;
  }

  /* Stat Pills */
  .ex-stats-pills {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ex-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
  }
  .ex-pill-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
  }
  .ex-pill-ok {
    background: #0f261c;
    border: 1px solid #276148;
    color: #5fae8a;
  }
  .ex-pill-ok .ex-pill-dot {
    background: #5fae8a;
  }
  .ex-pill-err {
    background: #3a141b;
    border: 1px solid #8c3040;
    color: #d16f7f;
  }
  .ex-pill-err .ex-pill-dot {
    background: #d16f7f;
  }

  /* Top Bar Right */
  .ex-topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ex-keycap-hint {
    font-size: 11px;
    font-weight: 600;
    color: #7488ab;
    background: #131c31;
    border: 1px solid #1f2d4e;
    padding: 4px 8px;
    border-radius: 6px;
  }
  .ex-reset-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: #7488ab;
    background: transparent;
    border: 1px solid transparent;
    padding: 4px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.15s, background-color 0.15s, border-color 0.15s;
  }
  .ex-reset-btn:hover {
    color: #c7d3e8;
    background: #16223c;
    border-color: #1f2d4e;
  }
  .ex-reset-btn--armed {
    color: #d16f7f !important;
    background: #3a141b !important;
    border-color: #8c3040 !important;
  }

  /* Progress Track */
  .ex-progress-track {
    width: 100%;
    height: 6px;
    border-radius: 999px;
    background: #16223c;
    overflow: hidden;
  }
  .ex-progress-bar {
    height: 100%;
    border-radius: 999px;
    background: #5468bd;
    transition: width 0.35s ease;
  }

  /* Stage Card */
  .ex-stage-card {
    background: #0e1728;
    border: 1px solid #1c2743;
    border-radius: 20px;
    padding: 36px 38px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 10px 30px -10px rgba(5, 7, 15, 0.5);
  }
  @media (max-width: 640px) {
    .ex-stage-card {
      padding: 24px 18px;
      border-radius: 16px;
      gap: 16px;
    }
  }

  .ex-anim-enter {
    animation: ex-fade 0.22s ease-out;
  }
  @keyframes ex-fade {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  /* Meta & Eyebrow */
  .ex-stage-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ex-eyebrow {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7488ab;
  }
  .ex-pos-tag {
    font-size: 11px;
    font-weight: 600;
    color: #8ea1c4;
    background: #16223c;
    border: 1px solid #1c2743;
    padding: 2px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Hero Arabic Box */
  .ex-hero-arabic-box {
    background: #090f1d;
    border: 1px solid #1c2743;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 120px;
  }
  .ex-arabic-head {
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 700;
    color: #f6f8fc;
    line-height: 1.5;
    margin: 0;
    font-family: var(--font-readex), Cairo, Tahoma, sans-serif;
  }
  .ex-arabic-sub {
    font-size: 13px;
    color: #7488ab;
    font-weight: 500;
  }

  /* Input Field */
  .ex-input-container {
    width: 100%;
  }
  .ex-input-field {
    width: 100%;
    height: 60px;
    background: #060a12;
    border: 1.5px solid #1c2743;
    border-radius: 14px;
    padding: 0 20px;
    font-size: 20px;
    font-weight: 600;
    color: #f6f8fc;
    text-align: center;
    letter-spacing: -0.01em;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
    font-family: inherit;
  }
  .ex-input-field::placeholder {
    color: #4c5b80;
    font-weight: 400;
    font-size: 17px;
  }
  .ex-input-field:focus {
    border-color: #5468bd;
    box-shadow: 0 0 0 3px rgba(84, 104, 189, 0.2);
  }
  .ex-input-field:disabled {
    cursor: default;
  }
  .ex-input-field--ok {
    border-color: #5fae8a !important;
    background: rgba(15, 38, 28, 0.45) !important;
  }
  .ex-input-field--err {
    border-color: #d16f7f !important;
    background: rgba(58, 20, 27, 0.45) !important;
  }

  /* Feedback Box */
  .ex-feedback-box {
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    animation: ex-fade 0.18s ease-out;
  }
  .ex-feedback--ok {
    background: #0f261c;
    border: 1px solid #276148;
  }
  .ex-feedback--err {
    background: #3a141b;
    border: 1px solid #8c3040;
  }
  .ex-feedback-left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }
  .ex-feedback-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  .ex-feedback--ok .ex-feedback-icon {
    color: #5fae8a;
  }
  .ex-feedback--err .ex-feedback-icon {
    color: #d16f7f;
  }
  .ex-feedback-content {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }
  .ex-feedback-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .ex-feedback--ok .ex-feedback-title {
    color: #86c4a3;
  }
  .ex-feedback--err .ex-feedback-title {
    color: #e195a0;
  }
  .ex-feedback-word {
    font-size: 18px;
    font-weight: 700;
    color: #f6f8fc;
  }
  .ex-feedback-comparison {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
    font-size: 14px;
  }
  .ex-wrong-entry {
    color: #e195a0;
  }
  .ex-wrong-entry del {
    opacity: 0.85;
  }
  .ex-correct-target {
    color: #f6f8fc;
  }
  .ex-correct-target strong {
    font-weight: 700;
    color: #ffffff;
  }

  /* Buttons */
  .ex-btn {
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: inherit;
    transition: background-color 0.15s, opacity 0.15s;
    box-sizing: border-box;
  }
  .ex-btn-primary {
    background: #3f52a3;
    color: #ffffff;
  }
  .ex-btn-primary:hover:not(:disabled) {
    background: #5468bd;
  }
  .ex-btn-primary:active:not(:disabled) {
    background: #33438a;
  }
  .ex-btn-secondary {
    background: #16223c;
    border: 1px solid #1c2743;
    color: #c7d3e8;
  }
  .ex-btn-secondary:hover:not(:disabled) {
    background: #1c2743;
    color: #ffffff;
  }
  .ex-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .ex-btn-keycap {
    font-size: 11px;
    font-weight: 600;
    background: rgba(0, 0, 0, 0.25);
    padding: 3px 7px;
    border-radius: 6px;
    opacity: 0.85;
  }

  /* ─────────────── Finished / Results View ─────────────── */
  .ex-done-container {
    text-align: center;
    align-items: center;
    gap: 24px;
    padding: 44px 38px;
  }
  @media (max-width: 640px) {
    .ex-done-container {
      padding: 28px 18px;
    }
  }
  .ex-done-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .ex-done-title {
    font-size: 24px;
    font-weight: 800;
    color: #f6f8fc;
    margin: 0;
    letter-spacing: -0.02em;
  }

  /* Ring */
  .ex-ring-wrap {
    position: relative;
    width: 140px;
    height: 140px;
    margin: 4px 0;
  }
  .ex-ring-svg {
    width: 100%;
    height: 100%;
  }
  .ex-ring-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .ex-ring-num {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .ex-ring-sub {
    font-size: 11px;
    font-weight: 600;
    color: #7488ab;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 4px;
  }

  /* Stats Grid */
  .ex-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
  }
  .ex-stat-tile {
    background: #090f1d;
    border: 1px solid #1c2743;
    border-radius: 14px;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .ex-stat-val {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.1;
  }
  .ex-stat-lbl {
    font-size: 11px;
    font-weight: 600;
    color: #7488ab;
  }

  /* Message Box */
  .ex-msg-box {
    background: #090f1d;
    border: 1px solid #1c2743;
    border-radius: 14px;
    padding: 18px 24px;
    width: 100%;
    box-sizing: border-box;
  }
  .ex-msg-en {
    font-size: 14px;
    color: #c7d3e8;
    margin: 0;
    font-weight: 500;
  }
  .ex-msg-ar {
    font-size: 15px;
    color: #d18470;
    margin: 8px 0 0;
    font-weight: 600;
    direction: rtl;
    line-height: 1.7;
    font-family: var(--font-readex), Cairo, Tahoma, sans-serif;
  }

  /* Missed Words Section */
  .ex-missed-section {
    width: 100%;
    background: #090f1d;
    border: 1px solid #1c2743;
    border-radius: 16px;
    padding: 20px;
    text-align: left;
    box-sizing: border-box;
  }
  .ex-missed-header {
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #1c2743;
  }
  .ex-missed-title {
    font-size: 13px;
    font-weight: 700;
    color: #e195a0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .ex-missed-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 240px;
    overflow-y: auto;
    padding-right: 4px;
  }
  .ex-missed-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #16223c;
    border: 1px solid #1c2743;
    border-radius: 10px;
    padding: 10px 14px;
  }
  .ex-missed-ar {
    font-size: 15px;
    font-weight: 600;
    color: #f6f8fc;
    min-width: 100px;
    font-family: var(--font-readex), Cairo, Tahoma, sans-serif;
  }
  .ex-missed-arrow {
    color: #4c5b80;
    font-size: 14px;
  }
  .ex-missed-correct {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px;
  }
  .ex-missed-headword {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }
  .ex-missed-typed {
    font-size: 12px;
    color: #e195a0;
  }
  .ex-missed-audio {
    flex-shrink: 0;
  }

  /* Finished Actions */
  .ex-done-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
`;
