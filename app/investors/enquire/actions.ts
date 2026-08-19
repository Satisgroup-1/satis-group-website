"use server";

import { headers } from "next/headers";
import { ENQUIRY_RECIPIENT, isEmailConfigured, sendEmail } from "@/lib/email";

export type InvestorEnquiryState = {
  /** Set once the enquiry has been sent; drives the success panel. */
  sent?: { name: string; email: string };
  /** Message shown above the submit button when the send failed. */
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company", string>>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Field caps, so a scripted submission can't post a novel through the form.
const MAX_FIELD = 200;
const MAX_MESSAGE = 4000;

// Same best-effort per-IP throttle as the investor login: a handful of
// enquiries per window, per serverless instance.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ENQUIRIES = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function field(formData: FormData, name: string, max = MAX_FIELD): string {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);
}

export async function submitInvestorEnquiry(
  _prev: InvestorEnquiryState,
  formData: FormData
): Promise<InvestorEnquiryState> {
  const name = field(formData, "name");
  const email = field(formData, "email");
  const company = field(formData, "company");
  const message = field(formData, "message", MAX_MESSAGE);

  // Honeypot: hidden from people, irresistible to form-filling bots. Accept
  // the submission so the bot doesn't retune, but send nothing.
  if (field(formData, "website")) {
    return { sent: { name, email } };
  }

  const fieldErrors: InvestorEnquiryState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Enter your name.";
  if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!company) {
    fieldErrors.company =
      "Enter your company, or “Individual” if you invest personally.";
  }
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const seen = attempts.get(ip);
  if (seen && seen.resetAt > now && seen.count >= MAX_ENQUIRIES) {
    return {
      error:
        "That is a lot of enquiries from one place. Try again later, or email info@satisgroup.co.uk.",
    };
  }
  attempts.set(
    ip,
    seen && seen.resetAt > now
      ? { count: seen.count + 1, resetAt: seen.resetAt }
      : { count: 1, resetAt: now + WINDOW_MS }
  );

  const body = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company}`,
    "",
    message ? `Message:\n${message}` : "No message.",
    "",
    "— Sent from the investor enquiry form at /investors/enquire",
  ].join("\n");

  // Without a key there is nowhere to send: in development that is expected,
  // so the enquiry goes to the server log and the sender sees the success
  // panel. In production it is a misconfiguration, and saying so beats
  // dropping an investor enquiry silently.
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "investor enquiry not sent: SATIS_RESEND_API_KEY is unset in production"
      );
      return {
        error:
          "We could not send that just now. Please email info@satisgroup.co.uk and we will pick it up.",
      };
    }
    console.info(`investor enquiry (not sent, no API key)\n${body}`);
    return { sent: { name, email } };
  }

  try {
    await sendEmail({
      to: ENQUIRY_RECIPIENT,
      replyTo: email,
      subject: `Investor enquiry: ${name} (${company})`,
      text: body,
    });
  } catch (error) {
    console.error("investor enquiry failed to send", error);
    return {
      error:
        "We could not send that just now. Please email info@satisgroup.co.uk and we will pick it up.",
    };
  }

  return { sent: { name, email } };
}
