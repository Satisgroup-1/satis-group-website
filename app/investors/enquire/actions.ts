"use server";

import { ENQUIRY_RECIPIENT } from "@/lib/email";
import {
  createThrottle,
  deliverEnquiry,
  EMAIL_PATTERN,
  MAX_MESSAGE,
  readField,
} from "@/lib/enquiry";

export type InvestorEnquiryState = {
  /** Set once the enquiry has been sent; drives the success panel. */
  sent?: { name: string; email: string };
  /** Message shown above the submit button when the send failed. */
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company", string>>;
};

const allow = createThrottle(5, 15 * 60 * 1000);

export async function submitInvestorEnquiry(
  _prev: InvestorEnquiryState,
  formData: FormData
): Promise<InvestorEnquiryState> {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const company = readField(formData, "company");
  const message = readField(formData, "message", MAX_MESSAGE);

  // Honeypot: hidden from people, irresistible to form-filling bots. Accept
  // the submission so the bot doesn't retune, but send nothing.
  if (readField(formData, "website")) {
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

  if (!(await allow())) {
    return {
      error:
        "That is a lot of enquiries from one place. Try again later, or email noreply.ai@satisgroup.co.uk.",
    };
  }

  const { error } = await deliverEnquiry({
    label: "investor enquiry",
    to: ENQUIRY_RECIPIENT,
    replyTo: email,
    subject: `Investor enquiry: ${name} (${company})`,
    text: [
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Company: ${company}`,
      "",
      message ? `Message:\n${message}` : "No message.",
      "",
      "— Sent from the investor enquiry form at /investors/enquire",
    ].join("\n"),
  });
  if (error) return { error };

  return { sent: { name, email } };
}
