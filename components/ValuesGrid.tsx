"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DrawnIcon } from "@/components/DrawnIcon";

type Value = { title: string; body: string };

/**
 * The "How we work" principles, each with a line-art icon that draws itself
 * on view, a numbered node, and a hairline that fills on hover. Icons are
 * simple architectural line drawings to match the brand — see DrawnIcon for
 * why they are stored as bare path strings.
 */
const ICON_PATHS: string[][] = [
  // Long-term thinking: a growth arc rising over a baseline
  [
    "M6 42 H42",
    "M6 38 C 16 30, 24 20, 42 8",
    "M34 8 H42 V16",
    "M4.4 38 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0",
  ],
  // Considered design: a drafting compass
  [
    "M21 10 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
    "M22.5 12.5 L14 42",
    "M25.5 12.5 L34 42",
    "M18 30 C 22 33, 26 33, 30 30",
    "M24 13 V24",
  ],
  // Straightforward delivery: a route from A to a checkpoint
  [
    "M7 42 C 7 32, 33 34, 33 23",
    "M4.6 42 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0",
    "M33 3 L43 13 L33 23 L23 13 Z",
    "M28.5 13 L32 16.5 L38 9.5",
  ],
];

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
            <DrawnIcon
              paths={ICON_PATHS[index] ?? []}
              delay={0.2 + index * 0.12}
            />
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
