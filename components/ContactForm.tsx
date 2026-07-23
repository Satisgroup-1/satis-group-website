"use client";

import { useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_TOPICS = [
  "General enquiry",
  "Property enquiry",
  "Careers",
  "Investment",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

type FormState = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

type FormErrors = Partial<Record<"name" | "email" | "message", string>>;

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
  const [submitted, setSubmitted] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = "Enter your name.";
    if (!EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.message.trim()) nextErrors.message = "Enter a message.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Not wired to a backend yet; connect to an email provider (e.g. Resend)
    // once one is chosen, then replace this with a real submission.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-border px-6 py-8">
        <p className="text-sm tracking-[0.05em]">
          Thanks, {values.name.split(" ")[0]}. We&rsquo;ve received your
          {values.topic === "Careers" ? " application enquiry" : " message"}{" "}
          and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-muted">
            Name
          </span>
          <input
            type="text"
            value={values.name}
            onChange={handleChange("name")}
            aria-invalid={Boolean(errors.name)}
            className="border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
          {errors.name && <span className="text-sm text-muted">{errors.name}</span>}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-muted">
            Email
          </span>
          <input
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            aria-invalid={Boolean(errors.email)}
            className="border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
          {errors.email && <span className="text-sm text-muted">{errors.email}</span>}
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Topic
        </span>
        <select
          value={values.topic}
          onChange={handleChange("topic")}
          className="border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Message
        </span>
        <textarea
          rows={6}
          value={values.message}
          onChange={handleChange("message")}
          aria-invalid={Boolean(errors.message)}
          className="border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
        {errors.message && <span className="text-sm text-muted">{errors.message}</span>}
      </label>

      <button
        type="submit"
        className="self-start border border-foreground bg-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent"
      >
        Send message
      </button>
    </form>
  );
}
