"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A line-art icon that draws itself in on view — the site's house
 * illustration idiom.
 *
 * Icons are given as bare `d` strings so each shape can carry its own
 * `pathLength` animation. Wrapping them in a single animated `<g>` looks
 * like it should work and reads more cleanly, but `pathLength` is only
 * honoured on shape elements: on a `<g>` the browser ignores it and the
 * drawing effect silently does nothing. Anything expressible as a path
 * belongs here — a circle becomes a pair of arcs.
 */
export function DrawnIcon({
  paths,
  className = "h-12 w-12 text-accent",
  delay = 0,
  duration = 1,
  stagger = 0,
}: {
  paths: string[];
  className?: string;
  /** Seconds before the first shape starts drawing. */
  delay?: number;
  /** Seconds each shape takes to draw. */
  duration?: number;
  /** Seconds between the start of one shape and the next. 0 draws them together. */
  stagger?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, index) => (
        <motion.path
          key={index}
          d={d}
          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration,
            delay: delay + index * stagger,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}
