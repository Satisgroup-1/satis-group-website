"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Brass L-shaped registration marks that sit just outside an image's
 * corners, like crop marks on an architectural drawing. They draw in on
 * view and nudge outward on hover (pair with a `group` parent).
 */
export function FrameCorners({ inset = "-0.75rem" }: { inset?: string }) {
  const reduceMotion = useReducedMotion();
  const size = "1.75rem";

  const corners = [
    { key: "tl", style: { top: inset, left: inset }, borders: "border-l border-t", translate: "group-hover:-translate-x-1 group-hover:-translate-y-1" },
    { key: "tr", style: { top: inset, right: inset }, borders: "border-r border-t", translate: "group-hover:translate-x-1 group-hover:-translate-y-1" },
    { key: "bl", style: { bottom: inset, left: inset }, borders: "border-l border-b", translate: "group-hover:-translate-x-1 group-hover:translate-y-1" },
    { key: "br", style: { bottom: inset, right: inset }, borders: "border-r border-b", translate: "group-hover:translate-x-1 group-hover:translate-y-1" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {corners.map((corner, index) => (
        <motion.span
          key={corner.key}
          className={`absolute ${corner.borders} border-accent transition-transform duration-500 ease-out ${corner.translate}`}
          style={{ width: size, height: size, ...corner.style }}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            delay: 0.15 + index * 0.08,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
