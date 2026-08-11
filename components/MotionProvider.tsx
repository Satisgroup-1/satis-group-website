"use client";

import { MotionConfig } from "framer-motion";

// Global reduced-motion safety net: framer-motion tones down transform
// animations for users with prefers-reduced-motion, including components
// that don't call useReducedMotion themselves.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
