"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ManchesterSkyline } from "./ManchesterSkyline";

/**
 * The Manchester skyline backdrop with a gentle scroll parallax: the
 * silhouette drifts up and fades slightly as the hero scrolls away, giving
 * the header depth without distracting from the copy.
 */
export function ParallaxSkyline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y = useSpring(yRaw, { stiffness: 80, damping: 30, mass: 0.5 });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 text-foreground sm:h-2/3"
        style={reduceMotion ? undefined : { y, opacity }}
      >
        <ManchesterSkyline className="h-full w-full" />
      </motion.div>
    </div>
  );
}
