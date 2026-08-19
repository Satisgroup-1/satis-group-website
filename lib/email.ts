// Transactional email for the site's forms. Resend's HTTP API is called
// directly rather than through its SDK, the way lib/github-storage.ts calls
// GitHub's: one less dependency, and the request is three lines either way.
//
// Set SATIS_RESEND_API_KEY in the hosting environment to turn sending on.
// Without it nothing is sent: in development the message is written to the
// server log instead, and in production the caller reports the failure to
// the sender rather than pretending the enquiry arrived.

const API_URL = process.env.SATIS_RESEND_API_URL ?? "https://api.resend.com/emails";

/** Where the investor enquiry form's submissions land. */
export const ENQUIRY_RECIPIENT =
  process.env.SATIS_ENQUIRY_TO ?? "noreply@satisgroup.co.uk";

/** Where the general contact form's submissions land: the same inbox unless
    SATIS_CONTACT_TO splits them out. */
export const CONTACT_RECIPIENT =
  process.env.SATIS_CONTACT_TO ?? ENQUIRY_RECIPIENT;

// Resend only accepts a sender on a domain verified in the account, so this
// is deliberately a satisgroup.co.uk address rather than the enquirer's.
// Their address rides on Reply-To, which keeps DMARC happy and still lets
// the team hit reply.
const ENQUIRY_SENDER =
  process.env.SATIS_ENQUIRY_FROM ??
  `Satis Group website <${ENQUIRY_RECIPIENT}>`;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SATIS_RESEND_API_KEY);
}

export type OutboundEmail = {
  subject: string;
  /** Plain text only: nothing submitted through a form is ever rendered as HTML. */
  text: string;
  /** Defaults to ENQUIRY_RECIPIENT. */
  to?: string;
  replyTo?: string;
};

/**
 * Sends one email, or throws with a message safe to show a form submitter.
 * Callers are expected to log the underlying failure themselves.
 */
export async function sendEmail(email: OutboundEmail): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error("Email is not configured (SATIS_RESEND_API_KEY is unset).");
  }

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SATIS_RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: ENQUIRY_SENDER,
        to: [email.to ?? ENQUIRY_RECIPIENT],
        subject: email.subject,
        text: email.text,
        ...(email.replyTo ? { reply_to: [email.replyTo] } : {}),
      }),
      cache: "no-store",
    });
  } catch (cause) {
    console.error("email request failed", cause);
    throw new Error("The email service could not be reached.");
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `The email service rejected the message (${response.status})${
        detail ? `: ${detail.slice(0, 300)}` : ""
      }`
    );
  }
}
