"use client";

import { useRef, useState } from "react";
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeFloor = schedule[Math.min(activeIndex, schedule.length - 1)];
  if (!activeFloor) return null;

  const handleTablistKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") {
      next = (activeIndex + 1) % schedule.length;
    } else if (event.key === "ArrowLeft") {
      next = (activeIndex - 1 + schedule.length) % schedule.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = schedule.length - 1;
    }
    if (next === null) return;
    event.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div
        className="flex flex-wrap gap-3"
        role="tablist"
        aria-label="Floors"
        onKeyDown={handleTablistKeyDown}
      >
        {schedule.map((floor, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={floor.name}
              type="button"
              role="tab"
              id={`floor-tab-${index}`}
              aria-selected={isActive}
              aria-controls={`floor-panel-${index}`}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              onClick={() => setActiveIndex(index)}
              className={`border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                isActive
                  ? "border-accent-strong bg-accent-strong font-medium text-white shadow-sm dark:border-accent dark:bg-accent dark:text-ink"
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
        <motion.div
          key={activeFloor.name}
          role="tabpanel"
          id={`floor-panel-${activeIndex}`}
          aria-labelledby={`floor-tab-${activeIndex}`}
          tabIndex={0}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ul className="mt-8 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
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
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
