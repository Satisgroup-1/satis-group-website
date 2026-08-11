import fs from "node:fs";
import path from "node:path";

export type InvestorDevelopment = {
  id: string;
  name: string;
  place: string;
  x: number;
  y: number;
  status: string;
  progress: number;
  value: string;
  phase: string;
  nextReport: string;
};

export type InvestorHolding = {
  developmentId: string;
  invested: string;
  currentValue: string;
  forecastIrr: string;
  multiple: string;
};

export type InvestorPlatformData = {
  version: number;
  updatedAt: string;
  users: Array<{
    id: string;
    email: string;
    displayName: string;
    accountName: string;
    portfolioId: string;
  }>;
  portfolios: Array<{
    id: string;
    value: string;
    capitalInvested: string;
    forecastIrr: string;
    distributions: string;
    holdings: InvestorHolding[];
  }>;
  developments: InvestorDevelopment[];
  updates: Array<{
    id: string;
    date: string;
    developmentId: string;
    title: string;
    body: string;
    tag: string;
  }>;
  articles: Array<{
    id: string;
    category: string;
    date: string;
    title: string;
    summary: string;
    readTime: string;
    body: string[];
  }>;
  documents: Array<{
    id: string;
    portfolioId: string;
    title: string;
    category: string;
    published: string;
    url: string;
  }>;
};

export type InvestorDashboardData = Omit<InvestorPlatformData, "users" | "portfolios"> & {
  user: InvestorPlatformData["users"][number];
  portfolio: InvestorPlatformData["portfolios"][number];
};

const DATA_FILE = path.join(process.cwd(), "data", "investor-platform.json");

export function validateInvestorPlatformData(value: unknown): InvestorPlatformData {
  if (!value || typeof value !== "object") throw new Error("Import must be a JSON object.");
  const data = value as Partial<InvestorPlatformData>;
  const collections = ["users", "portfolios", "developments", "updates", "articles", "documents"] as const;
  for (const name of collections) {
    if (!Array.isArray(data[name])) throw new Error(`“${name}” must be an array.`);
  }
  if (!data.users?.every((user) => user.id && user.email && user.portfolioId)) {
    throw new Error("Every user requires id, email and portfolioId.");
  }
  if (!data.portfolios?.every((portfolio) => portfolio.id && Array.isArray(portfolio.holdings))) {
    throw new Error("Every portfolio requires id and a holdings array.");
  }
  if (!data.developments?.every((development) => development.id && development.name)) {
    throw new Error("Every development requires id and name.");
  }
  return data as InvestorPlatformData;
}

export function getInvestorPlatformData(): InvestorPlatformData {
  return validateInvestorPlatformData(JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
}

export function getInvestorDashboard(email: string): InvestorDashboardData {
  const data = getInvestorPlatformData();
  const user = data.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("Investor profile not found.");
  const portfolio = data.portfolios.find((item) => item.id === user.portfolioId);
  if (!portfolio) throw new Error("Investor portfolio not found.");
  const { users: _users, portfolios: _portfolios, ...shared } = data;
  void _users;
  void _portfolios;
  return { ...shared, user, portfolio };
}

export function saveInvestorPlatformData(value: unknown): InvestorPlatformData {
  const data = validateInvestorPlatformData(value);
  const normalized = { ...data, version: data.version || 1, updatedAt: new Date().toISOString() };
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}

export function mutateInvestorPlatformData(
  mutate: (data: InvestorPlatformData) => void
): InvestorPlatformData {
  const data = getInvestorPlatformData();
  mutate(data);
  return saveInvestorPlatformData(data);
}
