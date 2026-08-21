"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { DrawnIcon } from "@/components/DrawnIcon";

export type AdminSegment = {
  href: string;
  title: string;
  body: string;
};

/**
 * The control-room tile grid. Each segment gets a line-art icon that draws
 * itself on view, a numbered node on a hairline, and a surface fill on
 * hover — the same architectural-drawing idiom as the public site's
 * "How we work" grid, so the admin area reads as part of the brand.
 *
 * Icons are stored as bare path strings — see DrawnIcon for why.
 */
const ICON_PATHS: string[][] = [
  // Newsletter: a broadsheet — masthead rule, columns and a plate
  [
    "M8 12 H40 V38 H8 Z",
    "M12 18 H36",
    "M12 24 H23",
    "M12 29 H23",
    "M12 34 H23",
    "M27 24 H36 V34 H27 Z",
  ],
  // Signup list: ruled rows with markers, and a plus for a new entry
  [
    "M10 14 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0",
    "M18 14 H40",
    "M10 22 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0",
    "M18 22 H40",
    "M10 30 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0",
    "M18 30 H34",
    "M12 39 H20",
    "M16 35 V43",
  ],
  // Investors: a building elevation beside a rising return line
  [
    "M8 41 V19 L21 11 V41",
    "M12 22 H17",
    "M12 29 H17",
    "M12 36 H17",
    "M8 41 H41",
    "M25 37 L30 29 L34 33 L40 15",
    "M33 13 H41 V21",
  ],
  // Admin accounts: a key, set on the diagonal
  [
    "M9 17 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0",
    "M14 17 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
    "M22.5 22.5 L39 39",
    "M31 31 L26.5 35.5",
    "M35 35 L30.5 39.5",
  ],
  // Instructions: an open manual
  [
    "M24 14 V40",
    "M24 14 C 19 11, 13 10, 8 11 V37 C 13 36, 19 37, 24 40",
    "M24 14 C 29 11, 35 10, 40 11 V37 C 35 36, 29 37, 24 40",
    "M12 18 H20",
    "M12 23 H20",
    "M28 18 H36",
    "M28 23 H36",
  ],
  // Appraisal download: an application window with a download arrow
  [
    "M8 10 H40 V38 H8 Z",
    "M8 17 H40",
    "M12 13.5 H13.5",
    "M17 13.5 H18.5",
    "M24 21 V31",
    "M19 26 L24 31 L29 26",
    "M16 35 H32",
  ],
];

export function AdminSegmentGrid({ segments }: { segments: AdminSegment[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {segments.map((segment, index) => (
        <motion.div
          key={segment.href}
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: index * 0.09, ease: "easeOut" }}
          className="bg-background"
        >
          <Link
            href={segment.href}
            className="group relative flex h-full flex-col p-8 transition-colors duration-300 hover:bg-surface"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-3 right-3 h-6 w-6 border-t border-r border-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b border-l border-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="flex items-start justify-between">
              <DrawnIcon
                paths={ICON_PATHS[index] ?? []}
                className="h-12 w-12 text-accent transition-colors duration-300 group-hover:text-accent-strong"
                delay={0.25 + index * 0.09}
                duration={0.7}
                stagger={0.07}
              />
              <span className="flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-accent-text">
                <span
                  aria-hidden="true"
                  className="h-px w-6 origin-right bg-accent/50 transition-transform duration-500 group-hover:scale-x-150"
                />
                <span className="font-mono tracking-[0.2em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
            </div>

            <h2 className="mt-6 text-xl font-medium tracking-tight">
              {segment.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {segment.body}
            </p>

            <span className="mt-auto flex items-center gap-3 pt-8 text-xs tracking-[0.2em] uppercase">
              Open
              <span
                aria-hidden="true"
                className="h-px w-6 bg-accent/50 transition-all duration-300 group-hover:w-10"
              />
              <span
                aria-hidden="true"
                className="text-accent transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
