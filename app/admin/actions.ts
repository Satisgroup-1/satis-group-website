"use server";

import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  isAuthenticated,
  sessionToken,
} from "@/lib/admin-auth";
import { saveInvestorPlatformData } from "@/lib/investor-platform";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { error: "Incorrect username or password." };
  }
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  revalidatePath("/admin");
  return {};
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

export type ImportInvestorDataState = {
  error?: string;
  success?: string;
};

export async function importInvestorData(
  _prev: ImportInvestorDataState,
  formData: FormData
): Promise<ImportInvestorDataState> {
  if (!(await isAuthenticated())) {
    return { error: "Your session has expired. Please sign in again." };
  }
  const file = formData.get("dataset");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an investor platform JSON file to import." };
  }
  if (file.size > 5_000_000) return { error: "The import must be smaller than 5 MB." };
  try {
    const data = saveInvestorPlatformData(JSON.parse(await file.text()));
    revalidatePath("/investors");
    revalidatePath("/admin");
    return {
      success: `Imported ${data.users.length} users, ${data.portfolios.length} portfolios, ${data.developments.length} developments and ${data.articles.length} insights.`,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "The investor dataset could not be imported.",
    };
  }
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
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
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
  const titleSlug = slugify(title);
  if (!titleSlug) {
    return { error: "The title must contain some letters or numbers." };
  }

  const slug = `${date}-${titleSlug}`;
  const dir = path.join(process.cwd(), "content", "newsletters");
  const file = path.join(dir, `${slug}.md`);
  if (fs.existsSync(file)) {
    return { error: `An issue named ${slug} already exists.` };
  }

  // Frontmatter values are parsed line-by-line, so strip newlines.
  const clean = (value: string) => value.replace(/\r?\n/g, " ");
  const markdown = `---\ntitle: ${clean(title)}\ndate: ${date}\nsummary: ${clean(summary)}\n---\n\n${body}\n`;

  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, markdown, "utf8");
  } catch {
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
