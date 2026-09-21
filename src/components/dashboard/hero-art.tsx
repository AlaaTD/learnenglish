/* Decorative mountain backdrop for the home hero card. Purely presentational:
 * layered ridges traced to match the approved mock — a main massif right of
 * centre with a violet haze behind its peak, a distant range and a fog band,
 * everything fading into the card colour at the floor. */
export function HeroArt() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[inherit]">
      <svg
        className="h-full w-full"
        viewBox="0 0 1000 520"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="e90-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101d3a" />
            <stop offset="55%" stopColor="#0d1830" />
            <stop offset="100%" stopColor="#0a1326" />
          </linearGradient>
          <radialGradient id="e90-glow" cx="67%" cy="34%" r="46%">
            <stop offset="0%" stopColor="#7386d0" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#5468bd" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#5468bd" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="e90-warm" cx="70%" cy="58%" r="34%">
            <stop offset="0%" stopColor="#d18470" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#d18470" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="e90-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#252e54" />
            <stop offset="100%" stopColor="#131c38" />
          </linearGradient>
          <linearGradient id="e90-peak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3f4f8c" />
            <stop offset="38%" stopColor="#282f55" />
            <stop offset="100%" stopColor="#151e3a" />
          </linearGradient>
          <linearGradient id="e90-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1326" stopOpacity="0" />
            <stop offset="62%" stopColor="#0a1326" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0a1326" stopOpacity="0.96" />
          </linearGradient>
        </defs>

        <rect width="1000" height="520" fill="url(#e90-sky)" />
        <rect width="1000" height="520" fill="url(#e90-glow)" />
        <rect width="1000" height="520" fill="url(#e90-warm)" />

        {/* distant range */}
        <path
          d="M0 302 L95 262 L190 292 L285 240 L380 284 L470 232 L565 276 L660 218 L760 268 L860 224 L935 262 L1000 236 V520 H0 Z"
          fill="url(#e90-back)"
          opacity="0.9"
        />
        {/* main massif, apex right of centre */}
        <path
          d="M55 520 L235 358 L318 402 L445 282 L520 328 L648 122 L700 208 L795 282 L872 238 L1000 388 V520 Z"
          fill="url(#e90-peak)"
        />
        {/* shadowed left flank of the massif */}
        <path d="M55 520 L235 358 L318 402 L420 300 L480 520 Z" fill="#1a2344" opacity="0.55" />
        {/* fog band along the floor */}
        <path
          d="M0 452 L120 420 L250 452 L390 414 L520 452 L660 418 L800 456 L930 424 L1000 448 V520 H0 Z"
          fill="#0c1529"
          opacity="0.85"
        />
        <rect width="1000" height="520" fill="url(#e90-floor)" />
      </svg>

      {/* Legibility scrims: darkened left column for the copy, darker sky at the top */}
      <div className="absolute inset-0 bg-[linear-gradient(97deg,rgba(8,13,26,0.88)_0%,rgba(8,13,26,0.45)_30%,rgba(8,13,26,0)_58%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,26,0.42)_0%,rgba(8,13,26,0)_24%)]" />
    </div>
  );
}
