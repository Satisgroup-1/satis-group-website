"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitContactEnquiry, type ContactState } from "@/app/contact/actions";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact-topics";

type FormValues = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

const INPUT_CLASS =
  "border border-border bg-transparent px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors focus:border-accent";

export function ContactForm({
  initialTopic = "General enquiry",
}: {
  initialTopic?: ContactTopic;
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    submitContactEnquiry,
    {}
  );
  // React resets the form once an action settles, so the fields are held in
  // state: a send that fails hands back everything the sender typed.
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    topic: initialTopic,
    message: "",
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const errors = state.fieldErrors ?? {};

  // React resets the form once an action settles. Text fields are re-applied
  // from state on the same render, but a select is left on its first option,
  // which would show "General enquiry" while state still held the topic the
  // sender picked — and that topic is what a retry would send.
  useEffect(() => {
    if (topicRef.current) topicRef.current.value = values.topic;
  }, [state, values.topic]);

  useEffect(() => {
    if (state.sent) successRef.current?.focus();
    // The browser catches the empty and malformed cases before submitting;
    // anything the server rejects still needs focus moved to it.
    else if (errors.name) nameRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.message) messageRef.current?.focus();
  }, [state, errors.name, errors.email, errors.message]);

  const set =
    (field: keyof FormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  if (state.sent) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="border border-border px-6 py-8"
      >
        <p className="text-sm tracking-[0.05em]">
          Thanks, {state.sent.name.split(" ")[0]}. We&rsquo;ve received your
          message and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      {/* Hidden from people, irresistible to form-filling bots. The action
          drops anything that fills it in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.2em] uppercase text-muted">
              Name
            </span>
            <input
              type="text"
              name="name"
              ref={nameRef}
              value={values.name}
              onChange={set("name")}
              required
              maxLength={200}
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
              name="email"
              ref={emailRef}
              value={values.email}
              onChange={set("email")}
              required
              maxLength={200}
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
          name="topic"
          ref={topicRef}
          value={values.topic}
          onChange={set("topic")}
          className="border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors focus:border-accent"
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      {/* Investment enquiries have their own form, in the investor platform's
          branding, which opens a data room rather than a general reply. */}
      {values.topic === "Investment" && (
        <p className="text-sm leading-relaxed text-muted">
          Looking to invest?{" "}
          <Link
            href="/investors/enquire"
            className="text-accent-text underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
          >
            Use the investor enquiry form
          </Link>{" "}
          and we will open an account with the memorandum and our current
          appraisals.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-muted">
            Message
          </span>
          <textarea
            rows={6}
            name="message"
            ref={messageRef}
            value={values.message}
            onChange={set("message")}
            required
            maxLength={4000}
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

      {state.error && (
        <p role="alert" className="text-sm text-clay">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start border border-foreground bg-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
