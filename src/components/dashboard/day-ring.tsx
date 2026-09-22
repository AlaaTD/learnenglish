/* The "Day 03 of 90" dial. The arc fraction and its start angle are fixed to the
 * approved mock (a ~63% sweep beginning just left of 12 o'clock) rather than
 * derived from learner data — swap `value` for a real percentage when wanted.
 * One flat accent colour, no gradient. */
export function DayRing({ value = 63 }: { value?: number }) {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" fill="none" aria-hidden="true">
      <circle cx="80" cy="80" r="69" className="stroke-zinc-200 dark:stroke-night-600" strokeWidth="12" />
      <circle
        cx="80"
        cy="80"
        r="69"
        className="stroke-brand-400"
        strokeWidth="12"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${value} ${100 - value}`}
        transform="rotate(255 80 80)"
      />
    </svg>
  );
}
