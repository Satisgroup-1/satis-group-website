/**
 * The redeveloped building, drawn once and held still, for use as a page-hero
 * backdrop. It reuses the final state of the scroll-driven graphic on the home
 * page (see BuildingRedevelopmentGraphic) without any of its motion or scroll
 * wiring, and sits at low opacity so hero copy stays legible over it.
 */
const WINDOW_COLS = [130, 178, 226, 274, 322, 370];
const WINDOW_ROWS = [150, 210, 270, 330, 390];

export function BuildingBackdrop() {
  return (
    <div className="absolute inset-0 flex items-end justify-end">
      <svg
        aria-hidden="true"
        viewBox="0 0 520 520"
        className="h-full w-auto max-w-[70%] text-foreground opacity-[0.22] sm:max-w-[46%] lg:max-w-[38%]"
      >
        <defs>
          <linearGradient id="hero-ground-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <circle
          cx="438"
          cy="72"
          r="34"
          fill="var(--accent)"
          fillOpacity="0.1"
          stroke="var(--accent)"
          strokeOpacity="0.4"
        />
        <path
          d="M20 486V410h48v76M426 486V390h34v96m0-54h38v54"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.13"
        />
        <rect x="16" y="455" width="488" height="31" fill="url(#hero-ground-wash)" />
        <line x1="16" y1="486" x2="504" y2="486" stroke="currentColor" strokeOpacity="0.35" />

        {/* trees flanking the building */}
        <g stroke="currentColor" strokeOpacity="0.45" fill="none">
          <path d="M62 486v-26M62 460c-10 2-16-6-14-16 8-4 18 2 14 16Z" />
          <path d="M462 486v-32M462 454c-12 3-19-7-16-19 9-5 21 2 16 19Z" />
        </g>

        {/* facade */}
        <rect
          x="110"
          y="110"
          width="300"
          height="376"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <line x1="110" y1="110" x2="410" y2="110" stroke="currentColor" strokeWidth="1.5" />

        {/* rooftop extension */}
        <rect x="150" y="64" width="220" height="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {[168, 216, 264, 312].map((x) => (
          <rect key={`ext-${x}`} x={x} y="76" width="26" height="22" fill="none" stroke="currentColor" strokeOpacity="0.6" />
        ))}

        {/* planters soften the finished frontage */}
        <g stroke="var(--sage)" fill="none" strokeOpacity="0.85">
          <path d="M181 486v-25m0 8-10-14m10 8 12-17m-12 22-15-6m15-2 15-8" />
          <path d="M337 486v-22m0 7-9-12m9 7 11-15m-11 20 14-7" />
          <path d="M164 477h34l-4 9h-26Z" fill="var(--sage)" fillOpacity="0.14" />
          <path d="M322 477h31l-4 9h-23Z" fill="var(--sage)" fillOpacity="0.14" />
        </g>

        {/* window grid, lit */}
        {WINDOW_ROWS.map((y) =>
          WINDOW_COLS.map((x) => (
            <g key={`win-${x}-${y}`}>
              <rect x={x} y={y} width="28" height="36" rx="1" fill="none" stroke="currentColor" strokeOpacity="0.6" />
              <rect x={x + 2} y={y + 2} width="24" height="32" fill="var(--accent)" opacity="0.4" />
            </g>
          ))
        )}

        {/* accent door */}
        <rect
          x="243"
          y="428"
          width="34"
          height="58"
          fill="var(--accent)"
          fillOpacity="0.25"
          stroke="var(--accent)"
        />
      </svg>
    </div>
  );
}
