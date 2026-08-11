"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      >
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4L17 17M7 7 5.6 5.6"
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        }`}
      >
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          d="M20.5 14.5a8.5 8.5 0 1 1-9-11 7 7 0 0 0 9 11Z"
        />
      </svg>
    </button>
  );
}
