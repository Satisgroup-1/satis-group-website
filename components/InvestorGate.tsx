"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  "w-full border border-ink-foreground/25 bg-transparent px-4 py-3 text-sm text-ink-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-300 placeholder:text-ink-foreground/50 focus:border-accent";

const PRIMARY_BUTTON =
  "border border-accent bg-accent px-6 py-3 text-xs tracking-[0.2em] uppercase text-ink transition-colors duration-300 hover:bg-transparent hover:text-accent";

const GHOST_LINK =
  "text-xs tracking-[0.15em] uppercase text-ink-foreground/60 transition-colors hover:text-accent";

type View = "login" | "request" | "forgot";

export function InvestorGate() {
  const [view, setView] = useState<View>("login");
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    // Move focus to the new view's heading on view switches (not on mount).
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [view]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    if (!EMAIL_PATTERN.test(email) || !password) {
      setError("Enter your registered email address and password.");
      return;
    }
    // The investor platform backend is not connected yet, so no
    // credentials can be verified. Fail closed with an honest message.
    setError(
      "Those details aren't recognised. Access is by invitation — if you believe you should have access, request it below."
    );
  };

  const handleForgot = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setForgotSent(true);
  };

  const switchView = (next: View) => {
    setView(next);
    setError(null);
    setForgotSent(false);
  };

  return (
    <div className="w-full max-w-sm border border-ink-foreground/20 bg-ink p-8 sm:p-10">
      {view === "login" && (
        <>
          <span className="text-xs tracking-[0.35em] uppercase text-accent">
            Investor Login
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-xl font-medium tracking-tight text-ink-foreground"
          >
            Sign in to the platform.
          </h2>
          <form onSubmit={handleLogin} noValidate className="mt-8 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.2em] uppercase text-ink-foreground/60">
                Email
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs tracking-[0.2em] uppercase text-ink-foreground/60">
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className={INPUT_CLASS}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm leading-relaxed text-[#dcb878]">
                {error}
              </p>
            )}
            <button type="submit" className={PRIMARY_BUTTON}>
              Sign in
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => switchView("request")}
              className={GHOST_LINK}
            >
              Request access
            </button>
            <button
              type="button"
              onClick={() => switchView("forgot")}
              className={GHOST_LINK}
            >
              Forgot password
            </button>
          </div>
          <p className="mt-8 border-t border-ink-foreground/15 pt-5 text-xs leading-relaxed text-ink-foreground/60">
            By signing in you agree to our{" "}
            <Link
              href="/legal/terms"
              className="underline decoration-ink-foreground/30 underline-offset-4 transition-colors hover:text-accent"
            >
              website terms
            </Link>
            , including the Members Area conditions.
          </p>
        </>
      )}

      {view === "request" && (
        <>
          <span className="text-xs tracking-[0.35em] uppercase text-accent">
            Request Access
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-xl font-medium tracking-tight text-ink-foreground"
          >
            Access is by invitation.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-foreground/70">
            The platform is open to investors we work with. Tell us a little
            about yourself and the opportunities you&rsquo;re looking for, and
            we&rsquo;ll be in touch about access. Investor status is verified
            in line with FCA financial promotion rules.
          </p>
          <Link
            href="/contact?topic=Investment"
            className={`mt-8 inline-block ${PRIMARY_BUTTON}`}
          >
            Start a conversation
          </Link>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => switchView("login")}
              className={GHOST_LINK}
            >
              ← Back to sign in
            </button>
          </div>
        </>
      )}

      {view === "forgot" && (
        <>
          <span className="text-xs tracking-[0.35em] uppercase text-accent">
            Forgot Password
          </span>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-xl font-medium tracking-tight text-ink-foreground"
          >
            Reset your password.
          </h2>
          {forgotSent ? (
            <p
              role="status"
              className="mt-5 text-sm leading-relaxed text-ink-foreground/70"
            >
              If that address is registered with us, password reset
              instructions are on their way. Check your inbox.
            </p>
          ) : (
            <form
              onSubmit={handleForgot}
              noValidate
              className="mt-8 flex flex-col gap-5"
            >
              <label className="flex flex-col gap-2">
                <span className="text-xs tracking-[0.2em] uppercase text-ink-foreground/60">
                  Registered email
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={INPUT_CLASS}
                />
              </label>
              {error && (
                <p role="alert" className="text-sm leading-relaxed text-[#dcb878]">
                  {error}
                </p>
              )}
              <button type="submit" className={PRIMARY_BUTTON}>
                Send reset link
              </button>
            </form>
          )}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => switchView("login")}
              className={GHOST_LINK}
            >
              ← Back to sign in
            </button>
          </div>
        </>
      )}
    </div>
  );
}
