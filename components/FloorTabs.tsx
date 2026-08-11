"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FloorSchedule } from "@/lib/property-pages";

export function FloorTabs({
  schedule,
  unitNoun = "Apartment",
}: {
  schedule: FloorSchedule[];
  unitNoun?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFloor = schedule[activeIndex];

  return (
    <div>
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Floors">
        {schedule.map((floor, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={floor.name}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(index)}
              className={`border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                isActive
                  ? "border-accent bg-accent font-medium text-white shadow-sm"
                  : "border-border text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {floor.name}
              <span className="ml-2 opacity-70">{floor.units.length}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={activeFloor.name}
          role="tabpanel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2"
        >
          {activeFloor.units.map((unit) => (
            <li
              key={unit.apt}
              className="group flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors hover:border-accent"
            >
              <span className="flex items-baseline gap-3">
                <span className="text-xs tracking-[0.2em] text-accent">
                  {unit.apt}
                </span>
                <span className="text-sm font-medium">
                  {unitNoun} {unit.apt}
                </span>
              </span>
              <span className="text-right text-xs leading-relaxed text-muted">
                {unit.beds}
                {unit.size && (
                  <>
                    <br />
                    {unit.size}
                  </>
                )}
              </span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
