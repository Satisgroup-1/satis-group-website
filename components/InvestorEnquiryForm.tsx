"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type FormErrors = Partial<Record<"name" | "email" | "company", string>>;

// The investor pages are a fixed black-and-gold treatment rather than the
// themed site palette, so these inputs mirror InvestorLogin's fields exactly.
const INPUT_CLASS =
  "w-full border border-white/20 bg-white/[.04] px-4 py-4 text-sm outline-none transition focus:border-[#c3a164]";
const LABEL_CLASS =
  "mb-2 block text-xs tracking-[.16em] uppercase text-white/55";

/** What happens after an enquiry lands, shown beside the form. */
const NEXT_STEPS = [
  {
    title: "We open your data room",
    body: "A login with the investment memorandum and the appraisals for every scheme we are currently raising against.",
  },
  {
    title: "You commit when ready",
    body: "Single-asset vehicles, per-scheme terms, and no obligation from having an account.",
  },
];

/** The steps, shown beside the form on large screens and beneath it on small
    ones, where the left panel is hidden. */
function NextSteps({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-8 ${className}`}>
      {NEXT_STEPS.map((step) => (
        <div key={step.title}>
          <p className="text-base font-medium tracking-tight">{step.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            {step.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export function InvestorEnquiryForm() {
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleChange =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!values.company.trim()) {
      nextErrors.company =
        "Enter your company, or “Individual” if you invest personally.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first invalid field.
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.company) companyRef.current?.focus();
      return;
    }

    // Not wired to a backend yet; connect to an email provider (e.g. Resend)
    // once one is chosen, then replace this with a real submission.
    setSubmitted(true);
  };

  return (
    <div className="bg-[#000000] text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1500px] lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 p-14 lg:flex lg:flex-col lg:justify-between">
          <div className="text-xs tracking-[.32em] uppercase text-[#c3a164]">
            Satis Group investor platform
          </div>
          <div className="max-w-2xl pb-12">
            <p className="mb-6 text-sm tracking-[.22em] uppercase text-[#c3a164]">
              Investor enquiry
            </p>
            {/* Display type only: the form column carries the page's h1,
                since this panel is hidden on small screens. */}
            <p className="text-6xl font-medium leading-[1.02] tracking-[-.045em]">
              The data room,
              <br />
              before the decision.
            </p>
            <p className="mt-8 max-w-lg text-lg leading-8 text-white/60">
              Tell us who you are and we will open an account on the investor
              platform, with the memorandum and the appraisals for our current
              raises to review before you commit to anything.
            </p>
          </div>
          <NextSteps className="border-t border-white/15 pt-7 sm:grid-cols-2" />
        </section>

        <section className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <p className="text-xs tracking-[.28em] uppercase text-[#c3a164]">
              Request access
            </p>
            {submitted ? (
              <div
                ref={successRef}
                role="status"
                tabIndex={-1}
                className="mt-4 border border-[#b18c4d]/50 bg-[#b18c4d]/10 p-6"
              >
                <h1 className="text-3xl font-medium tracking-tight">
                  Thanks, {values.name.trim().split(" ")[0]}.
                </h1>
                <p className="mt-4 text-sm leading-6 text-white/70">
                  We have your enquiry and will be in touch at{" "}
                  <span className="text-white">{values.email.trim()}</span> to
                  set up your investor login and the data room.
                </p>
                <Link
                  href="/investors"
                  className="mt-6 inline-block border border-[#c3a164] px-6 py-3.5 text-xs tracking-[.18em] uppercase text-[#c3a164] transition hover:bg-[#c3a164] hover:text-black"
                >
                  Back to sign in →
                </Link>
              </div>
            ) : (
              <>
                <h1 className="mt-4 text-4xl font-medium tracking-tight">
                  Become an investor.
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  Three details are all we need to open your account. This form
                  reaches the investment team directly.
                </p>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-10 space-y-6"
                >
                  <div>
                    <label className="block">
                      <span className={LABEL_CLASS}>Name</span>
                      <input
                        type="text"
                        ref={nameRef}
                        value={values.name}
                        onChange={handleChange("name")}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? "investor-name-error" : undefined
                        }
                        className={INPUT_CLASS}
                      />
                    </label>
                    {errors.name && (
                      <p
                        id="investor-name-error"
                        role="alert"
                        className="mt-2 text-sm text-[#e1a68e]"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block">
                      <span className={LABEL_CLASS}>Email</span>
                      <input
                        type="email"
                        ref={emailRef}
                        value={values.email}
                        onChange={handleChange("email")}
                        autoComplete="email"
                        inputMode="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "investor-email-error" : undefined
                        }
                        className={INPUT_CLASS}
                      />
                    </label>
                    {errors.email && (
                      <p
                        id="investor-email-error"
                        role="alert"
                        className="mt-2 text-sm text-[#e1a68e]"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block">
                      <span className={LABEL_CLASS}>Company</span>
                      <input
                        type="text"
                        ref={companyRef}
                        value={values.company}
                        onChange={handleChange("company")}
                        autoComplete="organization"
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={`investor-company-hint${
                          errors.company ? " investor-company-error" : ""
                        }`}
                        className={INPUT_CLASS}
                      />
                    </label>
                    <p
                      id="investor-company-hint"
                      className="mt-2 text-xs leading-5 text-white/40"
                    >
                      Investing personally? Enter &ldquo;Individual&rdquo;.
                    </p>
                    {errors.company && (
                      <p
                        id="investor-company-error"
                        role="alert"
                        className="mt-2 text-sm text-[#e1a68e]"
                      >
                        {errors.company}
                      </p>
                    )}
                  </div>

                  <label className="block">
                    <span className={LABEL_CLASS}>
                      Anything we should know{" "}
                      <span className="text-white/35">(optional)</span>
                    </span>
                    <textarea
                      rows={4}
                      value={values.message}
                      onChange={handleChange("message")}
                      className={INPUT_CLASS}
                    />
                  </label>

                  <button
                    type="submit"
                    className="shimmer-btn flex w-full items-center justify-between bg-[#b18c4d] px-5 py-4 text-xs font-medium tracking-[.18em] uppercase transition hover:bg-[#c3a164]"
                  >
                    Request investor access <span>→</span>
                  </button>
                </form>
              </>
            )}

            <NextSteps className="mt-12 border-t border-white/15 pt-7 lg:hidden" />

            <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45">
              <Link href="/investors" className="hover:text-white">
                Already have a login? Sign in
              </Link>
              <Link href="/contact" className="hover:text-white">
                General enquiry
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
