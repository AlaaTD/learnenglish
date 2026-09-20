"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { completeDayAction, resetDayAction } from "@/actions/day";

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
      <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/80 p-5 shadow-xs dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-teal-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-sm">
              ✓
            </span>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                تم إكمال دراسة اليوم {dayNumber} وحفظ الـ 50 كلمة بنجاح!
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                كل الكلمات والدروس محفوظة في حسابك. يمكنك المتابعة أو إعادة التعيين إذا أردت البدء من جديد.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {nextDay && nextDay <= 90 && (
              <Link
                href={`/day/${nextDay}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all"
              >
                اليوم التالي (Day {nextDay}) →
              </Link>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-red-800 dark:hover:bg-red-950/50 dark:hover:text-red-300 transition-all disabled:opacity-50"
            >
              {pending ? "جاري التعيين…" : "↺ إعادة تعيين اليوم (Reset)"}
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white/90 p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
            إنهاء دراسة اليوم {dayNumber}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            عند انتهائك من مراجعة الكلمات والجرامر والمحادثات، اضغط الزر لحفظ اليوم بالكامل دفعة واحدة.
          </p>
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={handleComplete}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-60 shrink-0"
        >
          {pending ? (
            <span>جاري الحفظ…</span>
          ) : (
            <span>✓ تم الانتهاء من دراسة اليوم بالكامل</span>
          )}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
