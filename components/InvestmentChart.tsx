"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedStat } from "./AnimatedStat";

/**
 * "Portfolio at a glance": three animated metric bars (GDV, floorspace,
 * units) drawn from the Satis Company & Projects figures. Bars grow on view
 * and the numbers count up alongside. Bar widths are illustrative, chosen
 * for visual balance rather than a shared scale (the units differ).
 */
const METRICS = [
  { value: "£135m", label: "Gross development value", note: "Past, current & future combined", fill: 0.92 },
  { value: "109,000", label: "Sq ft of upcoming developments", note: "Residential & commercial", fill: 0.74 },
  { value: "482", label: "Units developed & developing", note: "Across Manchester & the North West", fill: 0.66 },
];

export function InvestmentChart() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col divide-y divide-border border-y border-border">
      {METRICS.map((metric, index) => (
        <div key={metric.label} className="group grid grid-cols-1 gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <AnimatedStat
                value={metric.value}
                className="text-3xl font-medium tracking-tight sm:text-4xl"
              />
              <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted sm:hidden">
                0{index + 1}
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden bg-surface">
              <motion.div
                className="h-full origin-left rounded-r-full bg-accent"
                initial={reduceMotion ? { scaleX: metric.fill } : { scaleX: 0 }}
                whileInView={{ scaleX: metric.fill }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.15,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                style={{ width: "100%" }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-sm tracking-[0.03em]">{metric.label}</p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {metric.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
