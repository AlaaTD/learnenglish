import Link from "next/link";
import type { ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Shared UI primitives.
 *
 * Every screen is composed from these so spacing, radius, type scale and colour
 * usage stay consistent on phones and desktops:
 *   radius  : cards rounded-2xl (hero rounded-3xl) · controls rounded-xl · chips rounded-md/full
 *   type    : page title 3xl/4xl · section title lg · body sm/base · meta xs (>=12px)
 *   colour  : neutrals for structure and ink, `brand` (clay) for the single accent, and
 *             emerald / amber / sky / rose ONLY to express meaning.
 *   roles   : solid brand = the one action to take · brand tint = "you are here" in the
 *             navigation · ink pill = the selected tab · hairlines and a soft shadow for depth.
 * ------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger" | "inverse" | "inverseGhost";
type ButtonSize = "md" | "sm";

const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition duration-150 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  // Light: deep clay with white text. Dark: a lighter clay with ink text (keeps AA contrast
  // and reads as the brightest thing on a dark surface). The soft inset highlight makes it feel pressable.
  primary:
    "bg-brand-600 text-white shadow-press hover:bg-brand-700 dark:bg-brand-600 dark:text-white dark:shadow-none dark:hover:bg-brand-700",
  secondary:
    "border border-zinc-300 bg-white text-zinc-800 shadow-card hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:hover:border-zinc-500 dark:hover:bg-zinc-800",
  ghost:
    "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
  /** A toggle that is currently "on" (e.g. Used ✓). */
  success:
    "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900",
  /** Neutral until hovered, then signals a destructive action (reset). */
  danger:
    "border border-zinc-300 bg-white text-zinc-700 shadow-card hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-none dark:hover:border-rose-800 dark:hover:bg-rose-950 dark:hover:text-rose-200",
  // The two variants below are for buttons that sit ON the dark featured card. That card is dark
  // in both themes, so they do not change with the theme: a light clay reads as the brightest,
  // most actionable thing on it (ink text on clay-400 is 6.3:1).
  inverse: "bg-brand-400 text-zinc-950 hover:bg-brand-300",
  inverseGhost: "text-zinc-200 hover:bg-white/10 hover:text-white",
};

const buttonSizes: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-xs",
};

/** Class recipe for buttons and button-styled links. */
export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", extra = "") {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${extra}`.trim();
}

/**
 * Standalone text link ("Details →", "View all"). The padding is the hit area: 32px tall,
 * and the negative margin keeps the text itself aligned with its neighbours.
 */
export const textLinkClass =
  "-mx-2 inline-flex h-8 items-center gap-1 rounded-lg px-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:text-brand-300 dark:hover:bg-brand-950 dark:hover:text-brand-200";

/**
 * Shared look for text inputs, selects and number fields (add `w-full` where needed).
 * The border is deliberately a step darker than card hairlines so a field is always
 * findable (WCAG 1.4.11 asks for about 3:1 on control boundaries).
 */
export const fieldClass =
  "h-10 rounded-xl border border-zinc-400 bg-white px-3 text-sm text-zinc-900 shadow-card placeholder:text-zinc-500 focus-visible:border-brand-600 dark:border-zinc-500 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:placeholder:text-zinc-400 dark:focus-visible:border-brand-400";

/**
 * On/off control for a single boolean setting. Used instead of a native checkbox wherever the
 * choice reads as a state to flip (not a box to tick) — autoplay, notifications, etc.
 */
export function Switch({
  checked,
  onChange,
  id,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:outline-brand-400 ${
        checked ? "bg-brand-600 dark:bg-brand-400" : "bg-zinc-300 dark:bg-zinc-700"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-[18px] w-[18px] rounded-full bg-white shadow-card transition-transform duration-150 ease-out dark:bg-zinc-950 ${
          checked ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

/**
 * A row of mutually exclusive options rendered as a single pill-shaped control (the selected
 * option is a solid ink/brand segment). For short option sets — 2 to 4 choices — where a native
 * `<select>` would hide the alternatives behind a click for no good reason.
 */
export function SegmentedControl<Value extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
}: {
  value: Value;
  onChange: (value: Value) => void;
  options: { value: Value; label: string; icon?: ReactNode }[];
  label: string;
  size?: "md" | "sm";
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex items-center gap-1 rounded-xl border border-zinc-300 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-800/60"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors duration-150 ${
              size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm"
            } ${
              active
                ? "bg-white text-zinc-900 shadow-card dark:bg-zinc-950 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const cardTones = {
  default:
    "rounded-2xl border border-zinc-200 bg-white shadow-card dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none",
  // The one hero surface per screen: deep ink in light mode, deep clay in dark mode, with a
  // large quiet ring (the 90-day cycle) tucked behind the content. Children inherit cream text.
  featured:
    "relative isolate overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-lift before:pointer-events-none before:absolute before:-end-20 before:-top-20 before:-z-10 before:h-64 before:w-64 before:rounded-full before:border-[36px] before:border-brand-500/[0.14] [&_:focus-visible]:outline-brand-300 dark:border-brand-900 dark:bg-brand-950 dark:shadow-none",
} as const;

export function Card({
  children,
  className = "",
  padded = true,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  tone?: keyof typeof cardTones;
}) {
  const padding = padded ? (tone === "featured" ? "p-5 sm:p-7" : "p-4 sm:p-5") : "";
  return <div className={`${cardTones[tone]} ${padding} ${className}`}>{children}</div>;
}

/**
 * Small uppercase kicker with a clay rule in front. The rule is pinned to the FIRST line so it
 * stays put when the text wraps. `tone="onDark"` is for the featured card.
 */
export function Eyebrow({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "onDark" }) {
  const dark = tone === "onDark";
  return (
    <p
      className={`flex items-start gap-2.5 text-xs font-semibold uppercase tracking-wider ${
        dark ? "text-brand-300" : "text-brand-700 dark:text-brand-300"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-[7px] h-0.5 w-5 shrink-0 rounded-full ${dark ? "bg-brand-400" : "bg-brand-500"}`}
      />
      <span>{children}</span>
    </p>
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
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
    <p className={`text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 ${className}`}>
      {children}
    </p>
  );
}

/**
 * Inline Arabic fragment inside an English line or label. Letter-spacing breaks the
 * joins between Arabic letters, so this resets it (labels around it are letter-spaced).
 * The global rtl rule sets a tall line height that would stretch a small label, so the
 * fragment inherits the surrounding line height instead; the inline style is needed
 * because that global rule is intentionally un-layered and beats utility classes.
 */
export function Ar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      dir="rtl"
      lang="ar"
      style={{ lineHeight: "inherit" }}
      className={`normal-case tracking-normal ${className}`}
    >
      {children}
    </span>
  );
}

// A faint neutral hairline gives every tinted pill a crisp edge on any background.
const chipEdge = "ring-1 ring-inset ring-black/[0.06] dark:ring-white/10";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${chipEdge} ${className}`}
    >
      {children}
    </span>
  );
}

const tagTones = {
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  accent: "bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200",
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
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${chipEdge} ${tagTones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/*
 * Language colour rule for lesson screens: English content lives on the cool navy / indigo
 * palette, Arabic help (glosses, translations, explanations) takes the warm `clay` accent.
 * The language of a line is then readable at a glance, and one warm hue is enough to break up
 * the blue without adding a second "loud" colour.
 */
const arabicTones = {
  neutral: "text-zinc-700 dark:text-zinc-300",
  // clay-600 on the light surfaces is 5.2:1, clay-300 on the dark ones is 8.4:1 (both AA).
  warm: "text-clay-600 dark:text-clay-300",
} as const;

/**
 * Arabic text block with its own font face + line height, and an optional accent bar on the
 * reading-start side. `tone="warm"` is for short lines (glosses, titles, one-sentence
 * translations); long passages stay neutral (long coloured text tires the eye) and go inside an
 * `ArabicPanel` instead.
 */
export function ArabicText({
  children,
  className = "",
  bordered = false,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
  tone?: keyof typeof arabicTones;
}) {
  return (
    <p
      dir="rtl"
      lang="ar"
      className={`text-base ${arabicTones[tone]} ${
        bordered ? "border-s-2 border-brand-300 ps-3 dark:border-brand-800" : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}

/**
 * A softly warm-tinted panel for longer Arabic explanations and translations, with an optional
 * Arabic label on top. The text inside keeps the neutral ink colour; only the surface is warm.
 */
export function ArabicPanel({
  label,
  children,
  className = "",
}: {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-clay-100 bg-clay-50/70 p-4 dark:border-clay-900/70 dark:bg-clay-950/40 ${className}`}
    >
      {label ? (
        <p dir="rtl" lang="ar" className="mb-1.5 text-sm font-semibold text-clay-700 dark:text-clay-300">
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}

// The `inverse*` tones are for bars that sit on the dark featured card (dark in both themes).
const progressTrack = {
  accent: "bg-zinc-200 shadow-[inset_0_1px_1px_rgb(10_13_12/0.1)] dark:bg-zinc-800 dark:shadow-none",
  success: "bg-zinc-200 shadow-[inset_0_1px_1px_rgb(10_13_12/0.1)] dark:bg-zinc-800 dark:shadow-none",
  inverse: "bg-white/15",
  inverseSuccess: "bg-white/15",
} as const;

const progressFill = {
  accent: "bg-brand-600 dark:bg-brand-400",
  success: "bg-emerald-600 dark:bg-emerald-400",
  inverse: "bg-brand-400",
  inverseSuccess: "bg-emerald-400",
} as const;

export function ProgressBar({
  value,
  max,
  className = "",
  label,
  tone = "accent",
  size = "md",
}: {
  value: number;
  max: number;
  className?: string;
  label?: string;
  tone?: keyof typeof progressFill;
  size?: "md" | "sm";
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label ?? "Progress"}
      className={`${size === "sm" ? "h-1.5" : "h-2.5"} w-full overflow-hidden rounded-full ${progressTrack[tone]} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${progressFill[tone]}`}
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
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-900">
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
      <p className={`text-xs font-medium text-zinc-500 dark:text-zinc-400 ${href ? "pe-5" : ""}`}>{label}</p>
      <p className="mt-2 text-3xl font-semibold leading-none tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p> : null}
    </>
  );
  const base =
    "block rounded-2xl border border-zinc-200 bg-white p-4 shadow-card dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none";
  if (href) {
    return (
      <Link
        href={href}
        className={`${base} group relative transition duration-150 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift dark:hover:border-brand-700`}
      >
        {body}
        <span
          aria-hidden="true"
          className="absolute end-3.5 top-3.5 text-sm text-zinc-400 transition duration-150 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-300"
        >
          →
        </span>
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
 * A segmented control: the selected tab is a solid ink pill (clay is kept for actions).
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
      className="rounded-2xl border border-zinc-200 bg-white p-1.5 dark:border-night-700 dark:bg-night-900"
    >
      <ul className="flex items-center gap-1 overflow-x-auto scrollbar-none px-0.5">
        {items.map((item) => (
          <li key={item.key} className="shrink-0 sm:flex-1">
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-sm transition-colors duration-150 ${
                item.active
                  ? "bg-brand-600 font-semibold text-white"
                  : "font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-mist-400 dark:hover:bg-white/[0.04] dark:hover:text-mist-100"
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none tabular-nums ${
                    item.active
                      ? "bg-white/20 text-white"
                      : "bg-zinc-100 text-zinc-600 dark:bg-night-800 dark:text-mist-400"
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
    <div className="sticky top-[78px] sm:top-[84px] z-30 -mx-4 bg-zinc-50/95 px-4 py-2.5 transition-all dark:bg-night-950/95 sm:mx-0 sm:bg-transparent sm:px-0">
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
