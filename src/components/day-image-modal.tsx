"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface DayImageModalProps {
  dayNumber: number;
  dayTitle: string;
  imageUrl: string | null;
}

/* ─── Inline Banner ─────────────────────────────────────────────────────── */

/**
 * A premium-styled banner card that sits above the content tabs.
 * Shows either a CTA to view the infographic, or a disabled state
 * when no image is available.
 */
export function DayImageBanner({ dayNumber, dayTitle, imageUrl }: DayImageModalProps) {
  const hasImage = Boolean(imageUrl);

  if (!hasImage) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-100/50 p-4 sm:p-5 dark:border-zinc-800/60 dark:bg-zinc-900/40">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Disabled icon */}
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 sm:h-12 sm:w-12">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              ملخص اليوم البصري
            </p>
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
              لا توجد صورة تلخيصية متاحة لهذا اليوم حالياً
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-card dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Icon container (flat accent) */}
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-press dark:bg-brand-400 dark:text-zinc-950 dark:shadow-none sm:h-12 sm:w-12">
            <svg className="h-5 w-5 sm:h-5.5 sm:w-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 sm:text-base">
              ملخص اليوم البصري
              <span className="ms-2 hidden rounded-full bg-clay-100 px-2 py-0.5 text-[10px] font-bold text-clay-700 sm:inline-block dark:bg-clay-950 dark:text-clay-300">
                Infographic
              </span>
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 sm:text-[13px]">
              صورة مخصصة تلخص الكلمات والقواعد الأساسية لهذا اليوم
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <DayImageModal dayNumber={dayNumber} dayTitle={dayTitle} imageUrl={imageUrl} />
      </div>
    </div>
  );
}

/* ─── Modal Trigger Button + Lightbox ───────────────────────────────────── */

export function DayImageModal({ dayNumber, dayTitle, imageUrl }: DayImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      setZoom(1);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const hasImage = Boolean(imageUrl);

  if (!hasImage) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100/80 px-3.5 py-2.5 text-xs font-medium text-zinc-400 opacity-60 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-500 sm:px-4 sm:py-2.5 sm:text-sm"
        title="لا توجد صورة ملخص متاحة لهذا اليوم حالياً"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span>لا توجد صورة متاحة</span>
      </button>
    );
  }

  return (
    <>
      {/* CTA trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group/btn inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-press transition duration-150 hover:bg-brand-700 active:scale-[0.97] sm:px-5 sm:py-2.5 sm:text-sm dark:bg-brand-400 dark:text-zinc-950 dark:shadow-none dark:hover:bg-brand-300"
        title={`عرض صورة ملخص اليوم ${dayNumber}`}
      >
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>عرض الملخص البصري</span>
      </button>

      {/* ─── Fullscreen Lightbox Modal ───────────────────────────────────── */}
      {isOpen && imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`صورة ملخص اليوم ${dayNumber}: ${dayTitle}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          style={{ animation: "fadeIn 200ms ease-out" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: none; } }
          `}</style>

          <div
            className="relative mx-2 flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl sm:mx-4 sm:rounded-3xl"
            style={{ animation: "slideUp 250ms ease-out" }}
          >
            {/* ── Modal Header ── */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-zinc-950/60 px-3 py-2.5 sm:px-5 sm:py-3.5">
              {/* Title area */}
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
                  {String(dayNumber).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-zinc-100 sm:text-base">
                    ملخص اليوم {dayNumber}
                  </h3>
                  <p className="hidden text-xs text-zinc-400 sm:block">
                    {dayTitle} — انفوجرافيك الكلمات والقواعد
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                {/* Zoom controls */}
                <div className="hidden items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5 sm:flex">
                  <ModalIconBtn
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                    title="تصغير"
                    ariaLabel="Zoom out"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </ModalIconBtn>

                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="min-w-[3rem] rounded-md px-2 py-1 text-center font-mono text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                    title="إعادة ضبط"
                  >
                    {Math.round(zoom * 100)}%
                  </button>

                  <ModalIconBtn
                    onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                    title="تكبير"
                    ariaLabel="Zoom in"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </ModalIconBtn>
                </div>

                {/* Download */}
                <a
                  href={imageUrl}
                  download={`english90-day-${String(dayNumber).padStart(2, "0")}.png`}
                  className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
                  title="تحميل الصورة"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>تحميل</span>
                </a>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-rose-500/15 hover:text-rose-400 sm:h-10 sm:w-10 sm:ms-1"
                  title="إغلاق (Esc)"
                  aria-label="Close modal"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Mobile-only zoom & download bar ── */}
            <div className="flex items-center justify-between border-b border-white/5 bg-zinc-950/40 px-3 py-2 sm:hidden">
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
                <ModalIconBtn
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  title="تصغير"
                  ariaLabel="Zoom out"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </ModalIconBtn>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="min-w-[2.5rem] rounded-md px-1.5 py-1 text-center font-mono text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/10"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <ModalIconBtn
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  title="تكبير"
                  ariaLabel="Zoom in"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </ModalIconBtn>
              </div>

              <a
                href={imageUrl}
                download={`english90-day-${String(dayNumber).padStart(2, "0")}.png`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/10"
                title="تحميل"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                تحميل
              </a>
            </div>

            {/* ── Image Body ── */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto bg-zinc-950 p-2 sm:p-6"
              style={{ minHeight: "45dvh" }}
            >
              <div
                className="origin-center transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoom})` }}
              >
                <img
                  src={imageUrl}
                  alt={`ملخص اليوم ${dayNumber}: ${dayTitle}`}
                  className="max-h-[80dvh] w-auto max-w-full select-none rounded-xl border border-white/5 object-contain shadow-2xl"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Small helper button for modal toolbar ─────────────────────────────── */

function ModalIconBtn({
  onClick,
  title,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200"
      title={title}
      aria-label={ariaLabel}
    >
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        {children}
      </svg>
    </button>
  );
}
