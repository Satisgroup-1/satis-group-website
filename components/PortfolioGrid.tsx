"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PORTFOLIO,
  PORTFOLIO_PHASES,
  portfolioPhase,
  type PropertyType,
} from "@/lib/portfolio-data";
import { PropertyCard } from "./PropertyCard";

const FILTERS: Array<PropertyType | "All"> = ["All", "Residential", "Commercial"];

export function PortfolioGrid() {
  const [filter, setFilter] = useState<PropertyType | "All">("All");

  const properties =
    filter === "All"
      ? PORTFOLIO
      : PORTFOLIO.filter((property) => property.type === filter);

  // Split into Present / Future / Past, dropping any group the current
  // type filter leaves empty.
  const groups = PORTFOLIO_PHASES.map((group) => ({
    ...group,
    items: properties.filter((property) => portfolioPhase(property) === group.phase),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((option) => {
          const isActive = filter === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(option)}
              className={`border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                isActive
                  ? "border-accent bg-accent-strong font-medium text-white shadow-sm dark:bg-accent dark:text-ink"
                  : "border-border text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p role="status" className="sr-only">
        {properties.length} projects shown
      </p>

      {groups.map((group) => (
        <section key={group.phase} className="mt-16 first:mt-14">
          <div className="border-t border-border pt-6">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              {group.phase}.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {group.blurb}
            </p>
          </div>

          <motion.div
            layout
            className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {group.items.map((property) => (
                <motion.div
                  key={property.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      ))}

      {properties.length === 0 && (
        <p className="mt-14 text-sm text-muted">No projects in this category yet.</p>
      )}
    </div>
  );
}
