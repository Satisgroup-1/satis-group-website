"use client";

import { motion, useReducedMotion } from "framer-motion";

type Value = { title: string; body: string };

/**
 * The "How we work" principles, each with a line-art icon that draws itself
 * on view, a numbered node, and a hairline that fills on hover. Icons are
 * simple architectural line drawings to match the brand.
 */
const ICON_PATHS: Record<number, React.ReactNode> = {
  // Long-term thinking: a growth arc rising over a baseline
  0: (
    <>
      <line x1="6" y1="42" x2="42" y2="42" />
      <path d="M6 38 C 16 30, 24 20, 42 8" />
      <path d="M34 8 H42 V16" />
      <circle cx="6" cy="38" r="1.6" />
    </>
  ),
  // Considered design: a drafting compass
  1: (
    <>
      <circle cx="24" cy="10" r="3" />
      <line x1="22.5" y1="12.5" x2="14" y2="42" />
      <line x1="25.5" y1="12.5" x2="34" y2="42" />
      <path d="M18 30 C 22 33, 26 33, 30 30" />
      <line x1="24" y1="13" x2="24" y2="24" />
    </>
  ),
  // Straightforward delivery: a route from A to a checkpoint
  2: (
    <>
      <path d="M8 40 C 8 24, 40 26, 40 12" />
      <circle cx="8" cy="40" r="2.4" />
      <path d="M35 12 l4 -4 4 4 -4 4 z" transform="translate(-3 0)" />
      <path d="M33 12 l4 4 7 -9" />
    </>
  ),
};

export function ValuesGrid({ values }: { values: Value[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
      {values.map((value, index) => (
        <motion.div
          key={value.title}
          className="group relative flex flex-col bg-background p-8 transition-colors duration-300 hover:bg-surface"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between">
            <svg
              viewBox="0 0 48 48"
              className="h-12 w-12 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.g
                initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1, delay: 0.2 + index * 0.12, ease: "easeInOut" }}
              >
                {ICON_PATHS[index]}
              </motion.g>
            </svg>
            <span className="font-mono text-xs tracking-[0.2em] text-muted transition-colors group-hover:text-accent">
              0{index + 1}
            </span>
          </div>

          <h3 className="mt-8 text-lg font-medium tracking-tight">
            {value.title}
          </h3>
          <div className="mt-3 h-px w-10 origin-left bg-accent transition-transform duration-500 ease-out group-hover:scale-x-[3.5]" />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {value.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
