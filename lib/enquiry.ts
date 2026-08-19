// Shared plumbing for the site's enquiry forms: read a field, throttle a
// sender, deliver the mail, and decide what to say when it can't be sent.
// The forms themselves only assemble a subject and a body.

import { headers } from "next/headers";
import { isEmailConfigured, sendEmail, type OutboundEmail } from "@/lib/email";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Field caps, so a scripted submission can't post a novel through a form.
export const MAX_FIELD = 200;
export const MAX_MESSAGE = 4000;

/** What a submitter is told when the mail could not be handed over. */
export const SEND_FAILED =
  "We could not send that just now. Please email info@satisgroup.co.uk and we will pick it up.";

export function readField(
  formData: FormData,
  name: string,
  max = MAX_FIELD
): string {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, max);
}

/**
 * Best-effort per-IP throttle, in the shape the admin and investor logins
 * use: an in-memory count per serverless instance, which is enough to blunt
 * a script without a shared store.
 */
export function createThrottle(limit: number, windowMs: number) {
  const seen = new Map<string, { count: number; resetAt: number }>();
  return async function allow(): Promise<boolean> {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const now = Date.now();
    const entry = seen.get(ip);
    if (entry && entry.resetAt > now) {
      seen.set(ip, { count: entry.count + 1, resetAt: entry.resetAt });
      return entry.count < limit;
    }
    seen.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  };
}

/**
 * Sends one enquiry, returning the message to show the submitter when it
 * didn't go — or nothing at all when it did.
 *
 * Without SATIS_RESEND_API_KEY there is nowhere to send. In development that
 * is expected, so the enquiry goes to the server log and the submitter sees
 * the confirmation. In production it is a misconfiguration, and saying so
 * beats dropping an enquiry silently.
 */
export async function deliverEnquiry(
  email: OutboundEmail & { label: string }
): Promise<{ error?: string }> {
  const { label, ...outbound } = email;

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        `${label} not sent: SATIS_RESEND_API_KEY is unset in production`
      );
      return { error: SEND_FAILED };
    }
    console.info(`${label} (not sent, no API key)\n${outbound.text}`);
    return {};
  }

  try {
    await sendEmail(outbound);
  } catch (error) {
    console.error(`${label} failed to send`, error);
    return { error: SEND_FAILED };
  }
  return {};
}
