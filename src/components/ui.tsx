import Link from "next/link";
import type { ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Shared UI primitives.
 *
 * Every screen is composed from these so spacing, radius, type scale and colour
 * usage stay consistent on phones and desktops:
 *   radius  : cards rounded-2xl · controls rounded-xl · chips rounded-md/full
 *   type    : page title 2xl/3xl · section title lg · body sm/base · meta xs (>=12px)
 *   colour  : neutrals for structure, indigo for the single accent, and
 *             emerald / amber / sky / rose ONLY to express meaning.
 * ------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger";
type ButtonSize = "md" | "sm";

const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary:
    "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
  ghost: "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
  /** A toggle that is currently "on" (e.g. Used ✓). */
  success:
    "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900",
  /** Neutral until hovered, then signals a destructive action (reset). */
  danger:
    "border border-zinc-200 bg-white text-zinc-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-rose-800 dark:hover:bg-rose-950 dark:hover:text-rose-200",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

/** Class recipe for buttons and button-styled links. */
export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", extra = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${extra}`.trim();
}

/** Shared look for text inputs, selects and number fields (add `w-full` where needed). */
export const fieldClass =
  "h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${
        padded ? "p-4 sm:p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Small caption used above groups of tags / fields inside a card. */
export function SmallLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ${className}`}>
      {children}
    </p>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

const tagTones = {
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  accent: "bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
  success: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  danger: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
} as const;

export function Tag({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof tagTones;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tagTones[tone]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Arabic text block. Neutral colour (long coloured text tires the eye), its own
 * font face + line height, and an optional accent bar on the reading-start side.
 */
export function ArabicText({
  children,
  className = "",
  bordered = false,
}: {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <p
      dir="rtl"
      lang="ar"
      className={`text-base text-zinc-700 dark:text-zinc-300 ${
        bordered ? "border-s-2 border-indigo-200 ps-3 dark:border-indigo-800" : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}

export function ProgressBar({
  value,
  max,
  className = "",
  label,
  tone = "accent",
}: {
  value: number;
  max: number;
  className?: string;
  label?: string;
  tone?: "accent" | "success";
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? "Progress"}
      className={`h-2 w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${
          tone === "success" ? "bg-emerald-600 dark:bg-emerald-500" : "bg-indigo-600 dark:bg-indigo-500"
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      {children ? (
        <div className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {children}
        </div>
      ) : null}
      {action ? (
        <Link href={action.href} className={buttonClass("primary", "md", "mt-5")}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p> : null}
    </>
  );
  const base = "block rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900";
  if (href) {
    return (
      <Link
        href={href}
        className={`${base} transition-colors hover:border-indigo-300 dark:hover:border-indigo-700`}
      >
        {body}
      </Link>
    );
  }
  return <div className={base}>{body}</div>;
}

export type TabBarItem = {
  key: string;
  label: string;
  href: string;
  active: boolean;
  count?: string | number;
};

/**
 * One tab style for the whole app (day sections, vocabulary states).
 * Scrolls horizontally on narrow screens; `sticky` pins it under the header.
 */
export function TabBar({
  items,
  label,
  sticky = false,
}: {
  items: TabBarItem[];
  label: string;
  sticky?: boolean;
}) {
  const nav = (
    <nav
      aria-label={label}
      className="rounded-2xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {items.map((item) => (
          <li key={item.key} className="shrink-0 sm:flex-1">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-sm transition-colors ${
                item.active
                  ? "bg-indigo-50 font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
                  : "font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-medium leading-none tabular-nums ${
                    item.active
                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {item.count}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (!sticky) return nav;
  return (
    <div className="sticky top-14 z-30 -mx-4 bg-zinc-50/95 px-4 py-2 backdrop-blur sm:mx-0 sm:px-0 dark:bg-zinc-950/95">
      {nav}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200"
    >
      {message}
    </div>
  );
}
