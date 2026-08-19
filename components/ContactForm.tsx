"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTACT_TOPICS,
  EMAIL_PATTERN,
  type ContactTopic,
} from "@/lib/contact";

export { CONTACT_TOPICS, type ContactTopic };

type FormState = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

type FormErrors = Partial<Record<"name" | "email" | "message", string>>;

const INPUT_CLASS =
  "border border-border bg-transparent px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors focus:border-accent";

export function ContactForm({
  initialTopic = "General enquiry",
}: {
  initialTopic?: ContactTopic;
}) {
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    topic: initialTopic,
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleChange =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter your name.";
    if (!EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.message.trim()) nextErrors.message = "Enter a message.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first invalid field.
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.message) messageRef.current?.focus();
      return;
    }

    setSending(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company: companyRef.current?.value ?? "",
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setSubmitError(
          data?.error ??
            "We couldn't send your message. Please try again later."
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        "We couldn't send your message. Please check your connection and try again."
      );
    } finally {
      setSending(false);
    }
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
          Thanks, {values.name.split(" ")[0]}. We&rsquo;ve received your
          message and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted">
              Name
            </span>
            <input
              type="text"
              ref={nameRef}
              value={values.name}
              onChange={handleChange("name")}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={INPUT_CLASS}
            />
          </label>
          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-clay">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted">
              Email
            </span>
            <input
              type="email"
              ref={emailRef}
              value={values.email}
              onChange={handleChange("email")}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={INPUT_CLASS}
            />
          </label>
          {errors.email && (
            <p id="email-error" role="alert" className="text-sm text-clay">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Topic
        </span>
        <select
          value={values.topic}
          onChange={handleChange("topic")}
          className="border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors focus:border-accent"
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-muted">
            Message
          </span>
          <textarea
            rows={6}
            ref={messageRef}
            value={values.message}
            onChange={handleChange("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={INPUT_CLASS}
          />
        </label>
        {errors.message && (
          <p id="message-error" role="alert" className="text-sm text-clay">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from real visitors; bots that fill it are dropped
          silently by the API. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto">
        <label>
          Company
          <input
            type="text"
            name="company"
            ref={companyRef}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-clay">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="self-start border border-foreground bg-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
