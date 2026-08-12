"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";

const STORAGE_KEY = "satis-terms-accepted";

// Acceptance state read via useSyncExternalStore: the server snapshot is
// "accepted" (render nothing, no hydration mismatch), the client snapshot is
// localStorage, and accepting notifies subscribers.
let acceptListeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  acceptListeners.push(listener);
  return () => {
    acceptListeners = acceptListeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage unavailable (private mode): fail open rather than trap.
    return true;
  }
}

function acceptTerms() {
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {
    // Accept for this visit even when storage is unavailable.
    acceptedFallback = true;
  }
  acceptListeners.forEach((l) => l());
}

let acceptedFallback = false;

// Site-entry gate: first-time visitors must accept the terms of use before
// browsing. Acceptance persists in localStorage; the gate renders nothing on
// the server and for returning visitors, so there is no hydration flash and
// crawlers still see the full page content. Sits at z-80, beneath the splash
// screen (z-90) so the two never fight on the homepage.
export function TermsGate() {
  const accepted = useSyncExternalStore(
    subscribe,
    () => acceptedFallback || getSnapshot(),
    // Server snapshot: treat as accepted so nothing renders during SSR.
    () => true
  );
  const open = !accepted;
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    acceptRef.current?.focus();
    // Keep keyboard focus inside the gate while it is open.
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = document.querySelectorAll<HTMLElement>(
        "[data-terms-gate] a, [data-terms-gate] button"
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      data-terms-gate
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-gate-title"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
    >
      <div className="w-full max-w-xl border-t border-accent bg-background p-8 sm:border sm:border-border sm:p-10">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Satis Group
        </span>
        <h2
          id="terms-gate-title"
          className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl"
        >
          Terms of use.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          By continuing to this website you confirm that you have read and
          accept our{" "}
          <Link
            href="/legal/terms"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/legal/privacy-policy"
            className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
          >
            Privacy Policy
          </Link>
          . Nothing on this site constitutes financial advice or an offer to
          invest.
        </p>
        <button
          ref={acceptRef}
          type="button"
          onClick={acceptTerms}
          className="mt-8 w-full border border-foreground bg-foreground px-6 py-4 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent sm:w-auto"
        >
          Accept &amp; enter site
        </button>
      </div>
    </div>
  );
}
