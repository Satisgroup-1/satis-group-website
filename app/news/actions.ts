"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { addSubscriber } from "@/lib/newsletter-subscribers";

// Public newsletter signup. Addresses are appended to the signup list in
// content/newsletter/subscribers.json and reviewed under
// /admin/newsletter/subscribers.

export type SubscribeState = {
  error?: string;
  /** Set once the address is on the list, whether new or already there. */
  success?: string;
};

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
    return { success: "Thanks, you're on the list." };
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
    console.error("newsletter signup failed", err);
    return {
      error:
        "Something went wrong saving your details. Please try again, or email us directly.",
    };
  }

  revalidatePath("/admin/newsletter/subscribers");
  // Deliberately the same message for a new and an existing address, so the
  // form can't be used to test whether someone is on the list.
  return { success: "Thanks, you're on the list." };
}
