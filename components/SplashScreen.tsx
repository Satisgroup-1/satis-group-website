"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "satis-splash-seen";
const LETTERS = ["S", "A", "T", "I", "S"];
const LETTER_X = [180, 245, 310, 375, 440];
const BASELINE = 128;
const TOTAL_MS = 3400;

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const reduceMotion = useReducedMotion();

  // Decide whether to show. We only READ the "seen" flag here, never set it:
  // React StrictMode double-invokes effects in dev, and setting the flag on
  // mount let the throwaway first run mark it seen so the real run skipped it.
  // The flag is written in dismiss() instead, once the splash has actually run.
  useEffect(() => {
    if (reduceMotion) return;
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    setShow(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(dismiss, TOTAL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={dismiss}
          className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-ink text-ink-foreground"
          aria-label="Satis Group intro animation. Click to skip."
          role="dialog"
        >
          <svg
            viewBox="0 0 620 240"
            className="w-full max-w-2xl px-8"
            aria-hidden="true"
          >
            {LETTERS.map((letter, index) => {
              const x = LETTER_X[index];
              const dropDelay = 0.2 + index * 0.22;
              return (
                <g key={`${letter}-${index}`}>
                  {/* letter + its crane cable descend together */}
                  <motion.g
                    initial={{ y: -170 }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: dropDelay,
                      duration: 1.15,
                      ease: [0.3, 0.7, 0.3, 1],
                    }}
                  >
                    {/* cable from far above down to the letter's top; fades once landed */}
                    <motion.line
                      x1={x}
                      x2={x}
                      y1={-420}
                      y2={BASELINE - 50}
                      stroke="currentColor"
                      strokeWidth="1"
                      initial={{ opacity: 0.55 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: dropDelay + 1.35, duration: 0.45 }}
                    />
                    {/* hook */}
                    <motion.rect
                      x={x - 5}
                      y={BASELINE - 58}
                      width="10"
                      height="8"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="1"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: dropDelay + 1.35, duration: 0.45 }}
                    />
                    <motion.text
                      x={x}
                      y={BASELINE}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="64"
                      fontWeight="500"
                      letterSpacing="0.2em"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: dropDelay, duration: 0.3 }}
                    >
                      {letter}
                    </motion.text>
                  </motion.g>
                </g>
              );
            })}

            {/* ground line the letters settle onto */}
            <motion.line
              x1="140"
              x2="490"
              y1={BASELINE + 14}
              y2={BASELINE + 14}
              stroke="var(--accent)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.1, duration: 1.4, ease: "easeInOut" }}
            />

            {/* GROUP lockup */}
            <motion.text
              x="312"
              y={BASELINE + 52}
              textAnchor="middle"
              fill="currentColor"
              fontSize="18"
              letterSpacing="0.6em"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 2.3, duration: 0.5 }}
            >
              GROUP
            </motion.text>
          </svg>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-8 text-[0.6rem] tracking-[0.3em] uppercase text-ink-foreground/50"
          >
            Click to skip
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
