"use server";

import fs from "node:fs";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  SESSION_TTL_MS,
  isAuthenticated,
  sessionToken,
} from "@/lib/admin-auth";

export type LoginState = { error?: string };

// Minimal in-memory login throttle: 5 failures per IP per 15 minutes.
// Best-effort on serverless (per-instance), but inherited for free the day
// real credentials replace the demo ones.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function safeEquals(a: string, b: string): boolean {
  const max = Math.max(a.length, b.length, 1);
  const bufA = Buffer.alloc(max);
  const bufB = Buffer.alloc(max);
  bufA.write(a);
  bufB.write(b);
  return timingSafeEqual(bufA, bufB) && a.length === b.length;
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (attempts && attempts.resetAt > now && attempts.count >= LOGIN_MAX_ATTEMPTS) {
    return { error: "Too many attempts. Please try again later." };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const ok =
    safeEquals(username, ADMIN_USERNAME) && safeEquals(password, ADMIN_PASSWORD);
  if (!ok) {
    const entry =
      attempts && attempts.resetAt > now
        ? { count: attempts.count + 1, resetAt: attempts.resetAt }
        : { count: 1, resetAt: now + LOGIN_WINDOW_MS };
    loginAttempts.set(ip, entry);
    console.warn(`admin login failed (ip=${ip}, attempt=${entry.count})`);
    return { error: "Incorrect username or password." };
  }
  loginAttempts.delete(ip);
  let token: string;
  try {
    token = sessionToken();
  } catch {
    // Missing SATIS_ADMIN_SECRET in production: fail closed with a clear
    // message instead of crashing the page with a 500.
    return {
      error:
        "Admin sign-in isn't configured on this deployment: set the SATIS_ADMIN_SECRET environment variable and redeploy.",
    };
  }
  // Secure when actually served over https (hosting platforms set
  // x-forwarded-proto); a plain-http localhost `next start` still works.
  const proto = (await headers()).get("x-forwarded-proto");
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  revalidatePath("/admin");
  return {};
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

export type CreateNewsletterState = {
  error?: string;
  createdSlug?: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 64)
    .replace(/^-+|-+$/g, "");
}

export async function createNewsletter(
  _prev: CreateNewsletterState,
  formData: FormData
): Promise<CreateNewsletterState> {
  if (!(await isAuthenticated())) {
    return { error: "Your session has expired. Please sign in again." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title || !date || !summary || !body) {
    return { error: "All fields are required." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Date must be in YYYY-MM-DD format." };
  }
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return { error: "That date doesn't exist — check the day and month." };
  }
  const titleSlug = slugify(title);
  if (!titleSlug) {
    return { error: "The title must contain some letters or numbers." };
  }

  const slug = `${date}-${titleSlug}`;
  const dir = path.join(process.cwd(), "content", "newsletters");
  const file = path.join(dir, `${slug}.md`);

  // Frontmatter values are parsed line-by-line, so strip newlines.
  const clean = (value: string) => value.replace(/\r?\n/g, " ");
  const markdown = `---\ntitle: ${clean(title)}\ndate: ${date}\nsummary: ${clean(summary)}\n---\n\n${body}\n`;

  try {
    fs.mkdirSync(dir, { recursive: true });
    // "wx" fails if the file exists — atomic create, no check-then-act race.
    fs.writeFileSync(file, markdown, { encoding: "utf8", flag: "wx" });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "EEXIST") {
      return { error: `An issue named ${slug} already exists.` };
    }
    return {
      error:
        "Could not write the newsletter file. On read-only hosting (e.g. a serverless deployment) issues must be committed to the repository instead.",
    };
  }

  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/admin");
  return { createdSlug: slug };
}
