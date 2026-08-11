"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Parses values like "60+", "£120m", "0.5mi", "8,000" into prefix/number/suffix
// so the numeric part can count up. Non-numeric values ("Grade II") render as-is.
const NUMERIC_PATTERN = /^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/;

export function AnimatedStat({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState<string | null>(null);

  const match = value.match(NUMERIC_PATTERN);

  useEffect(() => {
    if (!match || !isInView || reduceMotion) return;

    const [, prefix, rawNumber, suffix] = match;
    const target = parseFloat(rawNumber.replace(/,/g, ""));
    const decimals = rawNumber.includes(".")
      ? rawNumber.split(".")[1].length
      : 0;
    const useGrouping = rawNumber.includes(",");
    const duration = 1200;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      const formatted = current.toLocaleString("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping,
      });
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, reduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {/* The counting display is decorative; screen readers get the real value. */}
      <span aria-hidden="true">
        {display ??
          (match && !reduceMotion ? `${match[1]}0${match[3]}` : value)}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
