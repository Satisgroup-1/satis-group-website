"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * An indexed section label: a two-digit index, an animated hairline that
 * draws in on view, and a tracked-out brass label. Gives the page an
 * editorial, spec-sheet rhythm.
 */
export function Eyebrow({
  index,
  label,
  className = "",
}: {
  index?: string;
  label: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {index && (
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-accent">
          {index}
        </span>
      )}
      <motion.span
        aria-hidden="true"
        className="block h-px origin-left bg-accent/50"
        initial={reduceMotion ? { width: 32 } : { scaleX: 0, width: 32 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      />
      <span className="text-xs tracking-[0.35em] uppercase text-accent">
        {label}
      </span>
    </div>
  );
}
