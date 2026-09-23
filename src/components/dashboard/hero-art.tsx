/* Decorative hill backdrop for the home hero card. Purely presentational:
 * smooth, rounded rolling hills (not jagged peaks) — a taller main hill mass
 * with a soft moss-toned glow behind its crest, a hazier distant range and a
 * fog band, everything fading into the card colour (ink) at the floor. Day
 * and night render the same hill geometry through two differently-toned
 * palettes below. */
export function HeroArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[inherit]">
      {/* Light mode: a lighter, warmer "day" palette. The sky stays at the same
       * depth as before (it sits directly behind the day-ring dial, which has
       * no backdrop chip of its own and needs a guaranteed-dark patch there),
       * but the hills themselves — the part of the art that actually reads as
       * "the picture" — are a full step lighter and warmer than before, with
       * richer moss/clay tones instead of flat grays. The text-side legibility
       * scrim is slightly stronger to compensate. */}
      <div className="absolute inset-0 block dark:hidden">
        <svg className="h-full w-full" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <linearGradient id="e90-sky-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-zinc-600)" />
              <stop offset="55%" stopColor="var(--color-zinc-700)" />
              <stop offset="100%" stopColor="var(--color-zinc-800)" />
            </linearGradient>
            <radialGradient id="e90-glow-day" cx="67%" cy="34%" r="46%">
              <stop offset="0%" stopColor="var(--color-brand-300)" stopOpacity="0.45" />
              <stop offset="55%" stopColor="var(--color-brand-400)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="e90-warm-day" cx="70%" cy="58%" r="36%">
              <stop offset="0%" stopColor="var(--color-clay-400)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-clay-400)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="e90-back-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-zinc-300)" />
              <stop offset="100%" stopColor="var(--color-zinc-500)" />
            </linearGradient>
            <linearGradient id="e90-peak-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-400)" />
              <stop offset="40%" stopColor="var(--color-zinc-500)" />
              <stop offset="100%" stopColor="var(--color-zinc-600)" />
            </linearGradient>
            <linearGradient id="e90-floor-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-zinc-700)" stopOpacity="0" />
              <stop offset="62%" stopColor="var(--color-zinc-700)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--color-zinc-700)" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <rect width="1000" height="520" fill="url(#e90-sky-day)" />
          <rect width="1000" height="520" fill="url(#e90-glow-day)" />
          <rect width="1000" height="520" fill="url(#e90-warm-day)" />

          {/* hazy distant hills */}
          <path
            d="M0,290 C33,273 67,257 100,240 C133,257 167,273 200,290 C233,275 267,260 300,245 C333,262 367,278 400,295 C433,275 467,255 500,235 C533,252 567,268 600,285 C633,267 667,248 700,230 C733,247 767,263 800,280 C833,270 867,260 900,250 C933,253 967,257 1000,260 V520 H0 Z"
            fill="url(#e90-back-day)"
            opacity="0.85"
          />
          {/* main rolling hill mass, rounded crest right of centre */}
          <path
            d="M30,520 C30,470 60,410 90,380 C120,355 150,340 180,330 C220,352 250,375 280,395 C310,370 340,342 370,320 C400,345 430,358 460,370 C500,300 520,230 560,190 C600,230 630,260 660,290 C690,270 720,250 760,235 C800,258 830,280 860,300 C895,312 928,326 960,340 C973,345 987,352 1000,360 V520 H0 Z"
            fill="url(#e90-peak-day)"
          />
          {/* soft shadow tucked into the first hill's hollow */}
          <path
            d="M30,520 C30,470 60,410 90,380 C120,355 150,340 180,330 C205,345 220,370 225,400 C230,440 220,480 210,520 Z"
            fill="var(--color-zinc-500)"
            opacity="0.35"
          />
          {/* fog band along the floor */}
          <path
            d="M0,460 C40,448 80,437 120,435 C160,433 200,448 240,458 C280,448 320,438 360,432 C400,426 440,442 480,455 C520,442 560,430 600,430 C640,430 680,444 720,452 C760,442 800,430 840,428 C880,426 920,440 960,448 C973,450 987,448 1000,445 V520 H0 Z"
            fill="var(--color-zinc-400)"
            opacity="0.55"
          />
          <rect width="1000" height="520" fill="url(#e90-floor-day)" />
        </svg>

        {/* Legibility scrims, strengthened a touch over the previous pass since
         * the hills themselves are lighter now. */}
        <div className="absolute inset-0 bg-[linear-gradient(97deg,rgba(58,53,46,0.82)_0%,rgba(58,53,46,0.46)_32%,rgba(58,53,46,0)_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,53,46,0.44)_0%,rgba(58,53,46,0)_26%)]" />
      </div>

      {/* Dark mode: unchanged "night" palette — same rolling-hill geometry as
       * the day version above, through the original colours, fading into the
       * card colour (ink) at the floor. */}
      <div className="absolute inset-0 hidden dark:block">
        <svg className="h-full w-full" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid slice" fill="none">
          <defs>
            <linearGradient id="e90-sky-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-zinc-800)" />
              <stop offset="55%" stopColor="var(--color-zinc-900)" />
              <stop offset="100%" stopColor="var(--color-zinc-950)" />
            </linearGradient>
            <radialGradient id="e90-glow-night" cx="67%" cy="34%" r="46%">
              <stop offset="0%" stopColor="var(--color-brand-300)" stopOpacity="0.5" />
              <stop offset="55%" stopColor="var(--color-brand-400)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--color-brand-400)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="e90-warm-night" cx="70%" cy="58%" r="34%">
              <stop offset="0%" stopColor="var(--color-clay-400)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--color-clay-400)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="e90-back-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-zinc-700)" />
              <stop offset="100%" stopColor="var(--color-zinc-850)" />
            </linearGradient>
            <linearGradient id="e90-peak-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-800)" />
              <stop offset="38%" stopColor="var(--color-zinc-800)" />
              <stop offset="100%" stopColor="var(--color-zinc-900)" />
            </linearGradient>
            <linearGradient id="e90-floor-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-zinc-950)" stopOpacity="0" />
              <stop offset="62%" stopColor="var(--color-zinc-950)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-zinc-950)" stopOpacity="0.96" />
            </linearGradient>
          </defs>

          <rect width="1000" height="520" fill="url(#e90-sky-night)" />
          <rect width="1000" height="520" fill="url(#e90-glow-night)" />
          <rect width="1000" height="520" fill="url(#e90-warm-night)" />

          {/* hazy distant hills */}
          <path
            d="M0,290 C33,273 67,257 100,240 C133,257 167,273 200,290 C233,275 267,260 300,245 C333,262 367,278 400,295 C433,275 467,255 500,235 C533,252 567,268 600,285 C633,267 667,248 700,230 C733,247 767,263 800,280 C833,270 867,260 900,250 C933,253 967,257 1000,260 V520 H0 Z"
            fill="url(#e90-back-night)"
            opacity="0.9"
          />
          {/* main rolling hill mass, rounded crest right of centre */}
          <path
            d="M30,520 C30,470 60,410 90,380 C120,355 150,340 180,330 C220,352 250,375 280,395 C310,370 340,342 370,320 C400,345 430,358 460,370 C500,300 520,230 560,190 C600,230 630,260 660,290 C690,270 720,250 760,235 C800,258 830,280 860,300 C895,312 928,326 960,340 C973,345 987,352 1000,360 V520 H0 Z"
            fill="url(#e90-peak-night)"
          />
          {/* soft shadow tucked into the first hill's hollow */}
          <path
            d="M30,520 C30,470 60,410 90,380 C120,355 150,340 180,330 C205,345 220,370 225,400 C230,440 220,480 210,520 Z"
            fill="var(--color-zinc-850)"
            opacity="0.55"
          />
          {/* fog band along the floor */}
          <path
            d="M0,460 C40,448 80,437 120,435 C160,433 200,448 240,458 C280,448 320,438 360,432 C400,426 440,442 480,455 C520,442 560,430 600,430 C640,430 680,444 720,452 C760,442 800,430 840,428 C880,426 920,440 960,448 C973,450 987,448 1000,445 V520 H0 Z"
            fill="var(--color-zinc-850)"
            opacity="0.85"
          />
          <rect width="1000" height="520" fill="url(#e90-floor-night)" />
        </svg>

        {/* Legibility scrims: darkened left column for the copy, darker sky at the top */}
        <div className="absolute inset-0 bg-[linear-gradient(97deg,rgba(16,20,18,0.88)_0%,rgba(16,20,18,0.45)_30%,rgba(16,20,18,0)_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,20,18,0.42)_0%,rgba(16,20,18,0)_24%)]" />
      </div>
    </div>
  );
}
