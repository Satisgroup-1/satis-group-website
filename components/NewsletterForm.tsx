"use client";

import { useEffect, useRef, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    // Not wired to a backend yet; connect to an email provider (e.g. Resend)
    // once one is chosen, then replace this with a real submission.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="border border-border px-6 py-8"
      >
        <p className="text-sm tracking-[0.05em]">
          Thanks, you&rsquo;re on the list. We&rsquo;ll be in touch when
          there&rsquo;s news to share.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          aria-label="Email address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-email-error" : undefined}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors placeholder:text-muted focus:border-accent sm:max-w-sm"
        />
        <button
          type="submit"
          className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent"
        >
          Subscribe
        </button>
      </div>
      {error && (
        <p id="newsletter-email-error" role="alert" className="text-sm text-clay">
          {error}
        </p>
      )}
    </form>
  );
}
