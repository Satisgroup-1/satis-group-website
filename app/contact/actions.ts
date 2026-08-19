"use server";

import { CONTACT_RECIPIENT } from "@/lib/email";
import {
  createThrottle,
  deliverEnquiry,
  EMAIL_PATTERN,
  MAX_MESSAGE,
  readField,
} from "@/lib/enquiry";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact-topics";

export type ContactState = {
  /** Set once the message has been sent; drives the success panel. */
  sent?: { name: string };
  /** Message shown above the submit button when the send failed. */
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

const allow = createThrottle(5, 15 * 60 * 1000);

export async function submitContactEnquiry(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const message = readField(formData, "message", MAX_MESSAGE);
  // Anything other than one of ours is treated as a general enquiry rather
  // than trusted into the subject line.
  const requested = readField(formData, "topic");
  const topic: ContactTopic = CONTACT_TOPICS.includes(requested as ContactTopic)
    ? (requested as ContactTopic)
    : "General enquiry";

  // Honeypot: hidden from people, irresistible to form-filling bots. Accept
  // the submission so the bot doesn't retune, but send nothing.
  if (readField(formData, "website")) return { sent: { name } };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Enter your name.";
  if (!EMAIL_PATTERN.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!message) fieldErrors.message = "Enter a message.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  if (!(await allow())) {
    return {
      error:
        "That is a lot of messages from one place. Try again later, or email info@satisgroup.co.uk.",
    };
  }

  const { error } = await deliverEnquiry({
    label: "contact enquiry",
    to: CONTACT_RECIPIENT,
    replyTo: email,
    subject: `${topic}: ${name}`,
    text: [
      `Name:  ${name}`,
      `Email: ${email}`,
      `Topic: ${topic}`,
      "",
      `Message:\n${message}`,
      "",
      "— Sent from the contact form at /contact",
    ].join("\n"),
  });
  if (error) return { error };

  return { sent: { name } };
}
