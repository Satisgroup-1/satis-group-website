"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PORTFOLIO, type PropertyType } from "@/lib/portfolio-data";
import { PropertyCard } from "./PropertyCard";

const FILTERS: Array<PropertyType | "All"> = ["All", "Residential", "Commercial"];

export function PortfolioGrid() {
  const [filter, setFilter] = useState<PropertyType | "All">("All");

  const properties =
    filter === "All"
      ? PORTFOLIO
      : PORTFOLIO.filter((property) => property.type === filter);

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

      <motion.div
        layout
        className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {properties.map((property) => (
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

      {properties.length === 0 && (
        <p className="mt-14 text-sm text-muted">No projects in this category yet.</p>
      )}
    </div>
  );
}
