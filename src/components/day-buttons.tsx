"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeDayAction, resetDayAction } from "@/actions/day";
import { buttonClass } from "./ui";

export function CompleteDayButton({
  dayNumber,
  completed,
  nextDay,
}: {
  dayNumber: number;
  ready?: boolean;
  completed: boolean;
  nextDay: number | null;
}) {
  const router = useRouter();
  const [optimisticCompleted, setOptimisticCompleted] = useState<boolean | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Server truth wins unless the user just acted optimistically in this mount.
  const isCompleted = optimisticCompleted ?? completed;

  const handleComplete = () => {
    setError(null);
    startTransition(async () => {
      try {
        await completeDayAction(dayNumber);
        setOptimisticCompleted(true);
        router.refresh();
      } catch {
        setError("حدث خطأ أثناء حفظ الإنجاز، يرجى المحاولة مرة أخرى.");
      }
    });
  };

  const handleReset = () => {
    setError(null);
    startTransition(async () => {
      try {
        await resetDayAction(dayNumber);
        setOptimisticCompleted(false);
        router.refresh();
      } catch {
        setError("حدث خطأ أثناء إعادة التعيين، يرجى المحاولة مرة أخرى.");
      }
    });
  };

  if (isCompleted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5 dark:border-emerald-900 dark:bg-emerald-950/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
              aria-hidden="true"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p dir="rtl" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                تم إكمال دراسة اليوم {dayNumber} وحفظ الـ 50 كلمة بنجاح!
              </p>
              <p dir="rtl" className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                كل الكلمات والدروس محفوظة في حسابك. يمكنك المتابعة أو إعادة التعيين إذا أردت البدء من جديد.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {nextDay && nextDay <= 90 && (
              <Link href={`/day/${nextDay}`} className={buttonClass("primary")}>
                اليوم التالي (Day {nextDay}) →
              </Link>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={handleReset}
              className={buttonClass("danger")}
            >
              {pending ? "جاري التعيين…" : "↺ إعادة تعيين اليوم (Reset)"}
            </button>
          </div>
        </div>
        {error && (
          <p dir="rtl" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p dir="rtl" className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            إنهاء دراسة اليوم {dayNumber}
          </p>
          <p dir="rtl" className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            عند انتهائك من مراجعة الكلمات والجرامر والمحادثات، اضغط الزر لحفظ اليوم بالكامل دفعة واحدة.
          </p>
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={handleComplete}
          className={buttonClass("primary", "md", "shrink-0 px-5")}
        >
          {pending ? <span>جاري الحفظ…</span> : <span>✓ تم الانتهاء من دراسة اليوم بالكامل</span>}
        </button>
      </div>
      {error && (
        <p dir="rtl" className="mt-3 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
