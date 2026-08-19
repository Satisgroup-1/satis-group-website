"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  subscribeToNewsletter,
  type SubscribeState,
} from "@/app/news/actions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(
    subscribeToNewsletter,
    {}
  );
  const [email, setEmail] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.success) successRef.current?.focus();
  }, [state.success]);

  if (state.success) {
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

  const error = clientError ?? state.error ?? null;

  return (
    <form
      action={action}
      // Validate before the request so a typo doesn't cost a round trip.
      onSubmit={(event) => {
        if (!EMAIL_PATTERN.test(email)) {
          event.preventDefault();
          setClientError("Enter a valid email address.");
          return;
        }
        setClientError(null);
      }}
      noValidate
      className="flex flex-col gap-4"
    >
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
        {/* Honeypot: hidden from people and assistive tech, filled by bots. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button
          type="submit"
          disabled={pending}
          className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Adding…" : "Subscribe"}
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
