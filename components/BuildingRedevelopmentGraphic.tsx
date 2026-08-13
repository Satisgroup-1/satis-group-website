"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const WINDOW_COLS = [130, 178, 226, 274, 322, 370];
const WINDOW_ROWS = [150, 210, 270, 330, 390];

const PHASES = [
  {
    step: "01",
    title: "Acquire",
    caption: "We find a neglected building with good bones.",
  },
  {
    step: "02",
    title: "Redevelop",
    caption: "Scaffolding goes up and a new rooftop rises.",
  },
  {
    step: "03",
    title: "Complete",
    caption: "The lights come on. Homes ready to live in.",
  },
];

/** A window that lights up in the final phase, staggered by index. */
function GlowWindow({
  x,
  y,
  index,
  progress,
}: {
  x: number;
  y: number;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.74 + (index % 7) * 0.02;
  const opacity = useTransform(progress, [start, start + 0.12], [0, 0.55]);
  return (
    <motion.rect
      x={x + 2}
      y={y + 2}
      width={24}
      height={32}
      fill="var(--accent)"
      style={{ opacity }}
    />
  );
}

function PhaseStepper({
  progress,
  activePhase,
}: {
  progress: MotionValue<number>;
  activePhase: number;
}) {
  const trackScaleX = useTransform(progress, [0.05, 0.95], [0, 1]);

  return (
    <div className="border-t border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-6 pb-5 pt-7 lg:px-10 lg:pt-9">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-muted">
          The story of every Satis Group building, told as you scroll
        </p>
        <div className="relative mt-4">
          {/* connecting track */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[5px] h-px bg-border"
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[5px] h-px origin-left bg-accent"
            style={{ scaleX: trackScaleX }}
          />
          <ol className="relative grid grid-cols-3 gap-4">
            {PHASES.map((phase, index) => {
              const isActive = activePhase === index;
              const isDone = activePhase > index;
              return (
                <li key={phase.step} className="flex flex-col gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-[11px] w-[11px] rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "scale-125 border-accent bg-accent"
                        : isDone
                          ? "border-accent bg-accent/40"
                          : "border-border bg-background"
                    }`}
                  />
                  <div>
                    <span
                      className={`text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-muted"
                      }`}
                    >
                      {phase.step} · {phase.title}
                    </span>
                    <p
                      className={`mt-1 hidden max-w-[16rem] text-xs leading-relaxed transition-colors duration-300 sm:block ${
                        isActive ? "text-foreground" : "text-muted/70"
                      }`}
                    >
                      {phase.caption}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          {/* Below sm the per-phase captions are hidden; show the active
              phase's caption full-width so the panel reads complete on
              mobile too. */}
          <p className="mt-3 text-xs leading-relaxed text-foreground sm:hidden">
            {PHASES[activePhase].caption}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BuildingRedevelopmentGraphic({
  children,
}: {
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.4,
  });

  useMotionValueEvent(progress, "change", (value) => {
    setActivePhase(value < 0.36 ? 0 : value < 0.7 ? 1 : 2);
  });

  // Three overlapping states scrubbed by scroll: original, construction, redeveloped
  const originalOpacity = useTransform(progress, [0, 0.26, 0.4], [1, 1, 0]);
  const scaffoldOpacity = useTransform(
    progress,
    [0.18, 0.34, 0.62, 0.78],
    [0, 1, 1, 0]
  );
  const finalOpacity = useTransform(progress, [0.66, 0.84, 1], [0, 1, 1]);

  const craneRotate = useTransform(progress, [0.18, 0.78], [-5, 7]);
  const extensionDraw = useTransform(progress, [0.4, 0.64], [0, 1]);
  const sweepX = useTransform(progress, [0.7, 1], [-80, 520]);
  const scrollHintOpacity = useTransform(progress, [0, 0.04], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const craneParallaxX = useTransform(smoothMouseX, [-1, 1], [-12, 12]);
  const craneParallaxY = useTransform(smoothMouseY, [-1, 1], [-7, 7]);
  const buildingParallaxX = useTransform(smoothMouseX, [-1, 1], [-5, 5]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    mouseY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div ref={containerRef} className="relative h-[280vh]">
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="sticky top-20 flex h-[calc(100vh-5rem)] w-full flex-col overflow-hidden"
      >
        {/* minmax(0,1fr) + min-h-0 let the graphic row shrink on short
            viewports, so the phase stepper below is never pushed out of the
            fixed-height sticky frame and cropped */}
        <div className="mx-auto grid h-full w-full min-h-0 max-w-7xl flex-1 grid-rows-[auto_minmax(0,1fr)] gap-4 px-6 pt-10 lg:grid-cols-[1fr_1fr] lg:grid-rows-none lg:items-center lg:gap-10 lg:px-10 lg:pt-0">
          {children && (
            <div className="relative z-10 max-w-xl pb-4 lg:pb-8">{children}</div>
          )}

          <div className="relative flex min-h-0 items-end justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-x-[8%] bottom-[12%] top-[8%] rounded-full bg-accent-soft blur-3xl"
            />
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 520 520"
              className="h-full max-h-[68vh] w-full text-foreground"
              style={{ x: buildingParallaxX }}
            >
              <defs>
                <linearGradient id="ground-wash" x1="0" y1="0" x2="0" y2="1">
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
              <rect x="16" y="455" width="488" height="31" fill="url(#ground-wash)" />

              {/* ground */}
              <line
                x1="16"
                y1="486"
                x2="504"
                y2="486"
                stroke="currentColor"
                strokeOpacity="0.35"
              />
              {/* trees flanking the building */}
              <g stroke="currentColor" strokeOpacity="0.45" fill="none">
                <path d="M62 486v-26M62 460c-10 2-16-6-14-16 8-4 18 2 14 16Z" />
                <path d="M462 486v-32M462 454c-12 3-19-7-16-19 9-5 21 2 16 19Z" />
              </g>

              {/* facade, shared by all states */}
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
              {/* entrance */}
              <rect
                x="243"
                y="428"
                width="34"
                height="58"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.6"
              />

              {/* ORIGINAL: pitched roof, chimney, worn details */}
              <motion.g style={{ opacity: originalOpacity }}>
                <path
                  d="M110 110 L260 54 L410 110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="300"
                  y="24"
                  width="16"
                  height="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {WINDOW_ROWS.map((y, rowIdx) =>
                  WINDOW_COLS.map((x, colIdx) => {
                    const missing = (rowIdx + colIdx) % 5 === 0;
                    return (
                      <g key={`orig-${x}-${y}`}>
                        <rect
                          x={x}
                          y={y}
                          width="28"
                          height="36"
                          fill="none"
                          stroke="currentColor"
                          strokeOpacity="0.7"
                        />
                        {missing && (
                          <path
                            d={`M${x} ${y} l28 36 M${x + 28} ${y} l-28 36`}
                            stroke="currentColor"
                            strokeOpacity="0.35"
                          />
                        )}
                      </g>
                    );
                  })
                )}
                {/* cracks */}
                <path
                  d="M140 240 l14 38 -10 42"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                />
                <path
                  d="M382 168 l16 34"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                />
              </motion.g>

              {/* CONSTRUCTION: scaffolding, crane, extension being drawn */}
              <motion.g style={{ opacity: scaffoldOpacity }}>
                {[118, 170, 222, 274, 326, 378].map((x) => (
                  <line
                    key={`v-${x}`}
                    x1={x}
                    y1="98"
                    x2={x}
                    y2="486"
                    stroke="currentColor"
                    strokeOpacity="0.5"
                    strokeWidth="0.75"
                  />
                ))}
                {[126, 186, 246, 306, 366, 426].map((y) => (
                  <line
                    key={`h-${y}`}
                    x1="102"
                    y1={y}
                    x2="418"
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.5"
                    strokeWidth="0.75"
                  />
                ))}
                {[126, 246, 366].map((y) => (
                  <g key={`diag-${y}`}>
                    <line
                      x1="102"
                      y1={y + 60}
                      x2="162"
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity="0.35"
                      strokeWidth="0.75"
                    />
                    <line
                      x1="358"
                      y1={y}
                      x2="418"
                      y2={y + 60}
                      stroke="currentColor"
                      strokeOpacity="0.35"
                      strokeWidth="0.75"
                    />
                  </g>
                ))}

                {/* rooftop extension outline drawing in */}
                <motion.path
                  d="M150 110 L150 64 L370 64 L370 110"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="6 5"
                  style={{ pathLength: extensionDraw }}
                />

                {/* crane */}
                <motion.g
                  style={{
                    x: craneParallaxX,
                    y: craneParallaxY,
                    rotate: craneRotate,
                    // SVG origins are bounding-box fractions in Framer Motion;
                    // this pins rotation to the crane's base at (52, 486)
                    originX: 0.275,
                    originY: 1,
                  }}
                >
                  <line
                    x1="52"
                    y1="16"
                    x2="52"
                    y2="486"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="8"
                    y1="12"
                    x2="168"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="8"
                    y1="12"
                    x2="22"
                    y2="34"
                    stroke="currentColor"
                  />
                  <line
                    x1="52"
                    y1="12"
                    x2="26"
                    y2="34"
                    stroke="currentColor"
                    strokeOpacity="0.5"
                    strokeWidth="0.75"
                  />
                  <line
                    x1="146"
                    y1="12"
                    x2="168"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  {/* hook with gentle swing */}
                  <motion.g
                    animate={reduceMotion ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    // pivot the swing from where the cable meets the jib
                    style={{ originX: 0.5, originY: 0 }}
                  >
                    <line
                      x1="132"
                      y1="12"
                      x2="132"
                      y2="66"
                      stroke="currentColor"
                    />
                    <circle
                      cx="132"
                      cy="70"
                      r="3.5"
                      fill="none"
                      stroke="currentColor"
                    />
                    <rect
                      x="120"
                      y="74"
                      width="24"
                      height="12"
                      fill="none"
                      stroke="var(--accent)"
                    />
                  </motion.g>
                </motion.g>
              </motion.g>

              {/* REDEVELOPED: modern flat roof, extension, lit windows */}
              <motion.g style={{ opacity: finalOpacity }}>
                <line
                  x1="110"
                  y1="110"
                  x2="410"
                  y2="110"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* rooftop extension, now solid */}
                <rect
                  x="150"
                  y="64"
                  width="220"
                  height="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* planters soften the finished frontage */}
                <g stroke="var(--sage)" fill="none" strokeOpacity="0.85">
                  <path d="M181 486v-25m0 8-10-14m10 8 12-17m-12 22-15-6m15-2 15-8" />
                  <path d="M337 486v-22m0 7-9-12m9 7 11-15m-11 20 14-7" />
                  <path d="M164 477h34l-4 9h-26Z" fill="var(--sage)" fillOpacity="0.14" />
                  <path d="M322 477h31l-4 9h-23Z" fill="var(--sage)" fillOpacity="0.14" />
                </g>
                {[168, 216, 264, 312].map((x) => (
                  <rect
                    key={`ext-${x}`}
                    x={x}
                    y="76"
                    width="26"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.6"
                  />
                ))}
                {/* clean window grid */}
                {WINDOW_ROWS.map((y) =>
                  WINDOW_COLS.map((x) => (
                    <rect
                      key={`fin-${x}-${y}`}
                      x={x}
                      y={y}
                      width="28"
                      height="36"
                      rx="1"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.6"
                    />
                  ))
                )}
                {/* windows lighting up */}
                {WINDOW_ROWS.map((y, rowIdx) =>
                  WINDOW_COLS.map((x, colIdx) => (
                    <GlowWindow
                      key={`glow-${x}-${y}`}
                      x={x}
                      y={y}
                      index={rowIdx * WINDOW_COLS.length + colIdx}
                      progress={progress}
                    />
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
                {/* light sweep across facade */}
                <clipPath id="facade-clip">
                  <rect x="110" y="64" width="300" height="422" />
                </clipPath>
                <motion.rect
                  x="0"
                  y="60"
                  width="46"
                  height="430"
                  fill="currentColor"
                  opacity="0.07"
                  clipPath="url(#facade-clip)"
                  style={{ x: sweepX, skewX: -12 }}
                />
              </motion.g>
            </motion.svg>

            <div className="pointer-events-none absolute left-0 top-2 hidden items-center gap-3 text-[0.58rem] tracking-[0.25em] uppercase text-muted xl:flex">
              <span className="h-px w-10 bg-accent" />
              Elevation study · North West
            </div>

            {/* scroll hint */}
            <motion.div
              className="pointer-events-none absolute bottom-2 right-0 flex items-center gap-2 text-muted"
              style={{ opacity: scrollHintOpacity }}
            >
              <span className="text-[0.6rem] tracking-[0.3em] uppercase">
                Scroll
              </span>
              <motion.span
                animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                ↓
              </motion.span>
            </motion.div>
          </div>
        </div>

        <PhaseStepper progress={progress} activePhase={activePhase} />
      </div>
    </div>
  );
}
