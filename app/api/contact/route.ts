import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  CONTACT_TOPICS,
  EMAIL_PATTERN,
  type ContactTopic,
} from "@/lib/contact";

export const dynamic = "force-dynamic";

const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

type ContactPayload = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  company?: string;
};

function parsePayload(body: unknown): ContactPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const { name, email, topic, message, company } = body as Record<
    string,
    unknown
  >;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !message.trim() ||
    !EMAIL_PATTERN.test(email) ||
    name.length > MAX_FIELD_LENGTH ||
    email.length > MAX_FIELD_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH ||
    !CONTACT_TOPICS.includes(topic as ContactTopic)
  ) {
    return null;
  }
  return {
    name: name.trim(),
    email: email.trim(),
    topic: topic as ContactTopic,
    message: message.trim(),
    company: typeof company === "string" ? company : undefined,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Please fill in all fields correctly." },
      { status: 400 }
    );
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so
  // bots don't learn they were caught.
  if (payload.company) {
    return NextResponse.json({ ok: true });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    console.error(
      "Contact form: SMTP_USER and/or SMTP_PASS environment variables are not set."
    );
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable." },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.office365.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false, // Microsoft 365 uses STARTTLS on port 587
    requireTLS: true,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const to = process.env.CONTACT_TO_EMAIL ?? "info@satisgroup.co.uk";

  try {
    await transporter.sendMail({
      from: { name: "Satis Group website", address: smtpUser },
      to,
      replyTo: { name: payload.name, address: payload.email },
      subject: `Website enquiry — ${payload.topic} — ${payload.name}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Topic: ${payload.topic}`,
        "",
        payload.message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Contact form: failed to send email.", error);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
