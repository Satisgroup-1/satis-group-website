"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Looping skyline footage behind the homepage hero copy. Reduced-motion
 * visitors get the first frame as a still image instead of playback.
 */
export function HeroVideoBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0">
      <video
        className="h-full w-full object-cover"
        src="/videos/hero-skyline.mp4"
        autoPlay={!reduceMotion}
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
