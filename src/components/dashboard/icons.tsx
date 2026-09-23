import type { SVGProps } from "react";

/* ---------------------------------------------------------------------------
 * Stroke icon set for the midnight dashboard (nav + home). One consistent style:
 * 24px grid, 1.8 stroke, round caps, `currentColor`. Traced against the mock.
 * ------------------------------------------------------------------------- */

type IconProps = SVGProps<SVGSVGElement>;

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Bullseye with an arrow flying in from the top right (today's-lesson badge, "Words learned"). */
export function IconTargetArrow(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="11" cy="13" r="8" />
      <circle cx="11" cy="13" r="3.5" />
      <path d="M21.2 2.8 13.9 10.1" />
      <path d="M21.2 2.8h-4.4M21.2 2.8v4.4" />
    </Stroke>
  );
}

export function IconBookOpen(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M2 3.5h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
      <path d="M22 3.5h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
    </Stroke>
  );
}

/** Book with a ribbon bookmark ("90-day path"). */
export function IconBookMarked(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M10 2v8l3-3 3 3V2" />
    </Stroke>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </Stroke>
  );
}

/** Speech bubble with an ellipsis ("Everyday Communication"). */
export function IconChatDots(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
      <circle cx="8.2" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10.5h17" />
      <circle cx="8" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17.8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.8" r="0.9" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function IconFileText(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </Stroke>
  );
}

export function IconFlame(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Stroke>
  );
}

export function IconPlay({ children, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5.4v13.2a1 1 0 0 0 1.54.84l10.3-6.6a1 1 0 0 0 0-1.68L9.54 4.56A1 1 0 0 0 8 5.4z" />
      {children}
    </svg>
  );
}

export function IconRotateCcw(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </Stroke>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4.5 12h15" />
      <path d="m13 5.5 6.5 6.5-6.5 6.5" />
    </Stroke>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m6 9 6 6 6-6" />
    </Stroke>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="m9 5.5 6.5 6.5L9 18.5" />
    </Stroke>
  );
}

/** Filled outline circle with a check mark (exercise: correct answer). */
export function IconCheckCircle(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.3 12.3 2.6 2.6 4.8-5.2" />
    </Stroke>
  );
}

/** Outline circle with an X (exercise: wrong answer). */
export function IconXCircle(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
    </Stroke>
  );
}


export function IconBolt(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12.5 2.5 5 13.5h5.5L10 21.5l8.5-12h-5.5z" />
    </Stroke>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5l3.5 2" />
    </Stroke>
  );
}

export function IconSparkle({ children, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11 2c.6 3.6 2 5.4 5.6 6C13 8.6 11.2 10.4 10.6 14 10 10.4 8.6 8.6 5 8c3.6-.6 5.4-2.4 6-6z" />
      <path d="M17.5 14c.3 1.8 1 2.7 2.8 3-1.8.3-2.5 1.2-2.8 3-.3-1.8-1-2.7-2.8-3 1.8-.3 2.5-1.2 2.8-3z" />
      {children}
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Stroke>
  );
}

export function IconPalette(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3a9 8 0 1 0 0 16c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1 .8-1.7 1.7-1.7H16a5 4.5 0 0 0 5-4.5C21 5.5 17 3 12 3z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </Stroke>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </Stroke>
  );
}
