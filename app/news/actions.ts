"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { addSubscriber } from "@/lib/newsletter-subscribers";
import { ENQUIRY_RECIPIENT, isEmailConfigured, sendEmail } from "@/lib/email";

// Public newsletter signup. Addresses are appended to the signup list in
// content/newsletter/subscribers.json and reviewed under
// /admin/newsletter/subscribers.
//
// Saving that list needs a writable store: on serverless hosting that means
// SATIS_GITHUB_TOKEN, because the deployed filesystem is read-only. When it
// is missing or the token has expired the append throws, and the signup used
// to be dropped on the floor behind a "something went wrong" message. The
// address is now emailed to the enquiry inbox instead, so a configuration
// gap costs the team a manual paste rather than the subscriber.

export type SubscribeState = {
  error?: string;
  /** Set once the address is on the list, whether new or already there. */
  success?: string;
};

// Deliberately the same message for a new and an existing address, so the
// form can't be used to test whether someone is already on the list.
const SUCCESS_MESSAGE = "Thanks, you're on the list.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 80;

// Best-effort per-IP throttle, matching the login actions: per serverless
// instance, so it slows a crawler down rather than stopping a determined one.
const SIGNUP_WINDOW_MS = 60 * 60 * 1000;
const SIGNUP_MAX_ATTEMPTS = 10;
const signupAttempts = new Map<string, { count: number; resetAt: number }>();

export async function subscribeToNewsletter(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const now = Date.now();
  const attempts = signupAttempts.get(ip);
  if (
    attempts &&
    attempts.resetAt > now &&
    attempts.count >= SIGNUP_MAX_ATTEMPTS
  ) {
    return { error: "Too many signups from this connection. Try again later." };
  }
  signupAttempts.set(
    ip,
    attempts && attempts.resetAt > now
      ? { count: attempts.count + 1, resetAt: attempts.resetAt }
      : { count: 1, resetAt: now + SIGNUP_WINDOW_MS }
  );

  // Hidden field no person fills in; bots that fill every input land here.
  if (String(formData.get("company") ?? "").trim()) {
    return { success: SUCCESS_MESSAGE };
  }

  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL_LENGTH) {
    return { error: "Enter a valid email address." };
  }

  try {
    await addSubscriber({
      email,
      name: name.slice(0, MAX_NAME_LENGTH) || undefined,
      source: "News page signup form",
    });
  } catch (err) {
    console.error("newsletter signup could not be saved to the list", err);
    if (await emailSignupToTeam({ email, name: name.slice(0, MAX_NAME_LENGTH) })) {
      return { success: SUCCESS_MESSAGE };
    }
    return {
      error:
        "Something went wrong saving your details. Please try again, or email us directly.",
    };
  }

  revalidatePath("/admin/newsletter/subscribers");
  return { success: SUCCESS_MESSAGE };
}

/**
 * Last resort when the signup list itself cannot be written: hand the
 * address to the inbox the enquiry forms already use, for someone to add
 * under /admin/newsletter/subscribers. Returns whether it got through.
 *
 * With no mail service configured either — the normal state in development —
 * the signup goes to the server log and counts as delivered, matching how
 * lib/enquiry.ts treats an unconfigured development environment.
 */
async function emailSignupToTeam(signup: {
  email: string;
  name?: string;
}): Promise<boolean> {
  const text = [
    `Email: ${signup.email}`,
    ...(signup.name ? [`Name:  ${signup.name}`] : []),
    "",
    "The signup list could not be written, so this address is not on it yet.",
    "Add it under /admin/newsletter/subscribers once saving works again.",
    "",
    "\u2014 Sent from the newsletter signup form at /news",
  ].join("\n");

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`newsletter signup (not sent, no API key)\n${text}`);
      return true;
    }
    console.error(
      "newsletter signup could not be emailed either: SATIS_RESEND_API_KEY is unset in production"
    );
    return false;
  }

  try {
    await sendEmail({
      to: ENQUIRY_RECIPIENT,
      subject: `Newsletter signup: ${signup.email}`,
      text,
    });
    return true;
  } catch (err) {
    console.error("newsletter signup could not be emailed either", err);
    return false;
  }
}
