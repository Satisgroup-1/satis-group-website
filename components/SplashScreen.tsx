"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "satis-splash-seen";
const LETTERS = ["S", "A", "T", "I", "S"];
const LETTER_X = [180, 245, 310, 375, 440];
const BASELINE = 128;
const TOTAL_MS = 3400;

// sessionStorage is external state; mirroring it via useSyncExternalStore
// avoids a post-hydration setState and stays StrictMode-safe because the
// snapshot only reads — dismiss() owns the write.
const emptySubscribe = () => () => {};

function getSeenSnapshot(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return true;
  }
}

// Server render: the splash is never in the SSR HTML.
const getSeenServerSnapshot = () => true;

export function SplashScreen() {
  const seen = useSyncExternalStore(
    emptySubscribe,
    getSeenSnapshot,
    getSeenServerSnapshot
  );
  const [dismissed, setDismissed] = useState(false);
  const reduceMotion = useReducedMotion();

  const show = !seen && !dismissed && !reduceMotion;

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(dismiss, TOTAL_MS);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [show, dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={dismiss}
          className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-black text-ink-foreground"
          aria-label="Satis Group intro animation"
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
                  <motion.g
                    initial={{ y: -170 }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: dropDelay,
                      duration: 1.15,
                      ease: [0.3, 0.7, 0.3, 1],
                    }}
                  >
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

          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            onClick={dismiss}
            autoFocus
            className="absolute bottom-8 px-4 py-2 text-[0.6rem] tracking-[0.3em] uppercase text-ink-foreground/50 transition-colors hover:text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
