"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  addSubscriber,
  removeSubscriber,
  setSubscriberStatus,
} from "@/lib/newsletter-subscribers";

export type SubscriberActionState = { error?: string; success?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EXPIRED: SubscriberActionState = {
  error: "Your session has expired. Please sign in again.",
};

function revalidate(): void {
  revalidatePath("/admin/newsletter/subscribers");
}

function message(err: unknown): string {
  return err instanceof Error
    ? err.message
    : "The signup list could not be saved. Please try again.";
}

/** Add someone who signed up away from the website — by phone, at an event. */
export async function addSubscriberManually(
  _prev: SubscriberActionState,
  formData: FormData
): Promise<SubscriberActionState> {
  if (!(await isAuthenticated())) return EXPIRED;

  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    const result = await addSubscriber({
      email,
      name: name || undefined,
      source: "Added by admin",
    });
    revalidate();
    return {
      success:
        result === "already-listed"
          ? `${email} was already on the list.`
          : result === "resubscribed"
            ? `${email} has been resubscribed.`
            : `${email} added to the list.`,
    };
  } catch (err) {
    return { error: message(err) };
  }
}

export async function unsubscribeSubscriber(
  _prev: SubscriberActionState,
  formData: FormData
): Promise<SubscriberActionState> {
  if (!(await isAuthenticated())) return EXPIRED;
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "No address was submitted." };
  try {
    await setSubscriberStatus(email, "unsubscribed");
    revalidate();
    return { success: `${email} unsubscribed.` };
  } catch (err) {
    return { error: message(err) };
  }
}

export async function resubscribeSubscriber(
  _prev: SubscriberActionState,
  formData: FormData
): Promise<SubscriberActionState> {
  if (!(await isAuthenticated())) return EXPIRED;
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "No address was submitted." };
  try {
    await setSubscriberStatus(email, "subscribed");
    revalidate();
    return { success: `${email} resubscribed.` };
  } catch (err) {
    return { error: message(err) };
  }
}

/** Erase a record entirely — for a deletion request. */
export async function deleteSubscriber(
  _prev: SubscriberActionState,
  formData: FormData
): Promise<SubscriberActionState> {
  if (!(await isAuthenticated())) return EXPIRED;
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "No address was submitted." };
  try {
    await removeSubscriber(email);
    revalidate();
    return { success: `${email} deleted.` };
  } catch (err) {
    return { error: message(err) };
  }
}
