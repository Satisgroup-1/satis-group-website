/**
 * A subtle technical-drawing grid: fine ruled lines with a coarser overlay
 * and small registration dots at each major intersection. Uses currentColor
 * so it inherits the surrounding text colour; keep it at low opacity behind
 * content. Presentational only, no client runtime.
 */
export function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="bp-fine"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        </pattern>
        <pattern
          id="bp-coarse"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <rect width="160" height="160" fill="url(#bp-fine)" />
          <path
            d="M160 0H0V160"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeOpacity="0.65"
          />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" fillOpacity="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bp-coarse)" />
    </svg>
  );
}
