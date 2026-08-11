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
import {
  mutateInvestorPlatformData,
  saveInvestorPlatformData,
} from "@/lib/investor-platform";

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

export type InvestorAdminState = { error?: string; success?: string };

const text = (data: FormData, name: string) => String(data.get(name) ?? "").trim();

async function mutateInvestorData(
  operation: Parameters<typeof mutateInvestorPlatformData>[0],
  success: string
): Promise<InvestorAdminState> {
  if (!(await isAuthenticated())) return { error: "Your session has expired." };
  try {
    mutateInvestorPlatformData(operation);
    revalidatePath("/admin");
    revalidatePath("/investors");
    return { success };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "The change could not be saved." };
  }
}

export async function saveInvestorProfile(_prev: InvestorAdminState, formData: FormData) {
  const id = text(formData, "id") || `usr_${Date.now()}`;
  const email = text(formData, "email").toLowerCase();
  const displayName = text(formData, "displayName");
  const accountName = text(formData, "accountName");
  const portfolioId = text(formData, "portfolioId") || `portfolio_${id}`;
  if (!email || !displayName || !accountName) return { error: "Email, name and account name are required." };
  return mutateInvestorData((data) => {
    if (data.users.some((user) => user.email === email && user.id !== id)) throw new Error("That investor email already exists.");
    const user = { id, email, displayName, accountName, portfolioId };
    const index = data.users.findIndex((item) => item.id === id);
    if (index >= 0) data.users[index] = user; else data.users.push(user);
    if (!data.portfolios.some((portfolio) => portfolio.id === portfolioId)) {
      data.portfolios.push({ id: portfolioId, value: "£0", capitalInvested: "£0", forecastIrr: "0%", distributions: "£0", holdings: [] });
    }
  }, `Saved investor ${displayName}.`);
}

export async function deleteInvestorProfile(formData: FormData) {
  const id = text(formData, "id");
  await mutateInvestorData((data) => {
    const user = data.users.find((item) => item.id === id);
    if (!user) throw new Error("Investor not found.");
    data.users = data.users.filter((item) => item.id !== id);
    data.portfolios = data.portfolios.filter((item) => item.id !== user.portfolioId);
    data.documents = data.documents.filter((item) => item.portfolioId !== user.portfolioId);
  }, "Investor and associated portfolio removed.");
}

export async function saveHolding(_prev: InvestorAdminState, formData: FormData) {
  const portfolioId = text(formData, "portfolioId");
  const developmentId = text(formData, "developmentId");
  const holding = { developmentId, invested: text(formData, "invested"), currentValue: text(formData, "currentValue"), forecastIrr: text(formData, "forecastIrr"), multiple: text(formData, "multiple") };
  if (!portfolioId || !developmentId || !holding.invested) return { error: "Portfolio, property and invested amount are required." };
  return mutateInvestorData((data) => {
    const portfolio = data.portfolios.find((item) => item.id === portfolioId);
    if (!portfolio) throw new Error("Portfolio not found.");
    const index = portfolio.holdings.findIndex((item) => item.developmentId === developmentId);
    if (index >= 0) portfolio.holdings[index] = holding; else portfolio.holdings.push(holding);
  }, "Holding saved.");
}

export async function deleteHolding(formData: FormData) {
  const portfolioId = text(formData, "portfolioId");
  const developmentId = text(formData, "developmentId");
  await mutateInvestorData((data) => {
    const portfolio = data.portfolios.find((item) => item.id === portfolioId);
    if (!portfolio) throw new Error("Portfolio not found.");
    portfolio.holdings = portfolio.holdings.filter((item) => item.developmentId !== developmentId);
  }, "Holding removed.");
}

export async function saveDevelopment(_prev: InvestorAdminState, formData: FormData) {
  const id = text(formData, "id") || `development_${Date.now()}`;
  const development = { id, name: text(formData, "name"), place: text(formData, "place"), x: Number(text(formData, "x") || 50), y: Number(text(formData, "y") || 50), status: text(formData, "status"), progress: Number(text(formData, "progress") || 0), value: text(formData, "value"), phase: text(formData, "phase"), nextReport: text(formData, "nextReport") };
  if (!development.name || !development.place) return { error: "Property name and location are required." };
  return mutateInvestorData((data) => {
    const index = data.developments.findIndex((item) => item.id === id);
    if (index >= 0) data.developments[index] = development; else data.developments.push(development);
  }, `Saved ${development.name}.`);
}

export async function deleteDevelopment(formData: FormData) {
  const id = text(formData, "id");
  await mutateInvestorData((data) => {
    if (data.portfolios.some((portfolio) => portfolio.holdings.some((holding) => holding.developmentId === id))) throw new Error("Remove this property from investor holdings first.");
    data.developments = data.developments.filter((item) => item.id !== id);
    data.updates = data.updates.filter((item) => item.developmentId !== id);
  }, "Development removed.");
}

export async function saveSiteUpdate(_prev: InvestorAdminState, formData: FormData) {
  const update = { id: text(formData, "id") || `update_${Date.now()}`, date: text(formData, "date"), developmentId: text(formData, "developmentId"), title: text(formData, "title"), body: text(formData, "body"), tag: text(formData, "tag") };
  if (!update.date || !update.developmentId || !update.title || !update.body) return { error: "Date, property, title and update are required." };
  return mutateInvestorData((data) => { data.updates.unshift(update); }, "Site update published.");
}

export async function deleteSiteUpdate(formData: FormData) {
  const id = text(formData, "id");
  await mutateInvestorData((data) => { data.updates = data.updates.filter((item) => item.id !== id); }, "Site update removed.");
}

export async function saveInsightArticle(_prev: InvestorAdminState, formData: FormData) {
  const title = text(formData, "title");
  const article = { id: text(formData, "id") || `article_${Date.now()}`, category: text(formData, "category"), date: text(formData, "date"), title, summary: text(formData, "summary"), readTime: text(formData, "readTime"), body: text(formData, "body").split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) };
  if (!article.title || !article.summary || !article.body.length) return { error: "Title, summary and article body are required." };
  return mutateInvestorData((data) => { data.articles.unshift(article); }, `Published ${title}.`);
}

export async function deleteInsightArticle(formData: FormData) {
  const id = text(formData, "id");
  await mutateInvestorData((data) => { data.articles = data.articles.filter((item) => item.id !== id); }, "Insight removed.");
}

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
