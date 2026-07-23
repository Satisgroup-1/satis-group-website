"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedStat } from "./AnimatedStat";

/**
 * A single headline stat for the ink stats band: a small index, a count-up
 * number, a label, and a brass meter bar that grows in on view.
 */
export function StatMeter({
  index,
  value,
  label,
  delay = 0,
}: {
  index: string;
  value: string;
  label: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="group relative">
      <span className="font-mono text-[0.65rem] tracking-[0.25em] text-ink-foreground/50">
        {index}
      </span>
      <AnimatedStat
        value={value}
        className="mt-3 block text-4xl font-medium tracking-tight text-accent lg:text-5xl"
      />
      <div className="mt-5 h-px w-full bg-ink-foreground/15">
        <motion.div
          className="h-px origin-left bg-accent"
          initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.1, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>
      <p className="mt-4 text-sm tracking-[0.05em] text-ink-foreground/70">
        {label}
      </p>
    </div>
  );
}
