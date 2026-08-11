import fs from "node:fs";
import path from "node:path";
import bundledInvestors from "@/content/investors/investors.json";
import bundledDevelopments from "@/content/investors/developments.json";
import bundledHoldings from "@/content/investors/holdings.json";
import bundledCashEvents from "@/content/investors/cash-events.json";
import bundledUpdates from "@/content/investors/updates.json";
import bundledDocuments from "@/content/investors/documents.json";
import bundledInsights from "@/content/investors/insights.json";

// Data layer for the investor platform. All records live as JSON files in
// content/investors/ so the dataset is versioned with the repository and can
// be edited three ways: directly in git, through the /admin/platform forms,
// or via the bulk JSON importer. Files are re-read per request (the investor
// pages are force-dynamic) so imports show up immediately. The static
// imports above keep the seed data inside the serverless bundle: Vercel only
// traces files referenced through the module graph, so without them a fresh
// deployment could fail to find the JSON on disk.

export type InvestorProfile = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  passwordHash: string;
  joined: string;
  valueHistory: { label: string; value: number }[];
};

export type Development = {
  id: string;
  name: string;
  place: string;
  /** Percentage coordinates on the stylised Greater Manchester map. */
  x: number;
  y: number;
  status: string;
  progress: number;
  gdv: number;
  phase: string;
  nextReport: string;
  summary: string;
};

export type Holding = {
  investorId: string;
  developmentId: string;
  invested: number;
  currentValue: number;
  forecastIrr: number;
  status: string;
};

export type CashEvent = {
  investorId: string;
  date: string;
  type: string;
  amount: number;
  developmentId?: string;
  status: "Paid" | "Forecast";
};

export type SiteUpdate = {
  date: string;
  developmentId: string;
  title: string;
  body: string;
  tag: string;
};

export type InvestorDocument = {
  investorId: string;
  title: string;
  kind: string;
  published: string;
};

export type InsightBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type Insight = {
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  read: string;
  theme: "dark" | "sand" | "sage";
  body: InsightBlock[];
};

export const INVESTOR_DATA_DIR = path.join(
  process.cwd(),
  "content",
  "investors"
);

export const INVESTOR_DATASETS = [
  "investors",
  "developments",
  "holdings",
  "cash-events",
  "updates",
  "documents",
  "insights",
] as const;

export type InvestorDataset = (typeof INVESTOR_DATASETS)[number];

const BUNDLED_DATASETS: Record<InvestorDataset, unknown> = {
  investors: bundledInvestors,
  developments: bundledDevelopments,
  holdings: bundledHoldings,
  "cash-events": bundledCashEvents,
  updates: bundledUpdates,
  documents: bundledDocuments,
  insights: bundledInsights,
};

export function readDataset<T>(dataset: InvestorDataset): T[] {
  const file = path.join(INVESTOR_DATA_DIR, `${dataset}.json`);
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    const bundled = BUNDLED_DATASETS[dataset];
    return Array.isArray(bundled) ? (structuredClone(bundled) as T[]) : [];
  }
}

/**
 * Persist a dataset. Throws a friendly error on read-only hosting so server
 * actions can surface it; on such deployments the exported JSON should be
 * committed to the repository instead.
 */
export function writeDataset(dataset: InvestorDataset, records: unknown[]) {
  if (!Array.isArray(records)) {
    throw new Error(`Refusing to write non-array data to ${dataset}.json.`);
  }
  const file = path.join(INVESTOR_DATA_DIR, `${dataset}.json`);
  try {
    fs.mkdirSync(INVESTOR_DATA_DIR, { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  } catch {
    throw new Error(
      "This deployment has read-only storage, so changes cannot be saved here. Export the dataset, apply your change and commit the JSON to the repository instead."
    );
  }
}

export function mutateDataset<T>(
  dataset: InvestorDataset,
  mutate: (records: T[]) => T[]
): T[] {
  const records = mutate(readDataset<T>(dataset));
  writeDataset(dataset, records as unknown[]);
  return records;
}

/** Full snapshot of every dataset — used by the export route and importer. */
export function getPlatformSnapshot(): Record<InvestorDataset, unknown[]> {
  return Object.fromEntries(
    INVESTOR_DATASETS.map((dataset) => [dataset, readDataset(dataset)])
  ) as Record<InvestorDataset, unknown[]>;
}

export function getInvestors(): InvestorProfile[] {
  return readDataset<InvestorProfile>("investors");
}

export function getInvestorById(id: string): InvestorProfile | undefined {
  return getInvestors().find((investor) => investor.id === id);
}

export function findInvestorByEmail(
  email: string
): InvestorProfile | undefined {
  const needle = email.trim().toLowerCase();
  return getInvestors().find(
    (investor) => investor.email.toLowerCase() === needle
  );
}

export function getDevelopments(): Development[] {
  return readDataset<Development>("developments");
}

export function getHoldingsFor(investorId: string): Holding[] {
  return readDataset<Holding>("holdings").filter(
    (holding) => holding.investorId === investorId
  );
}

export function getCashEventsFor(investorId: string): CashEvent[] {
  return readDataset<CashEvent>("cash-events")
    .filter((event) => event.investorId === investorId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpdates(): SiteUpdate[] {
  return readDataset<SiteUpdate>("updates").sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getDocumentsFor(investorId: string): InvestorDocument[] {
  return readDataset<InvestorDocument>("documents")
    .filter((doc) => doc.investorId === investorId)
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getInsights(): Insight[] {
  return readDataset<Insight>("insights").sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

// ---------------------------------------------------------------------------
// Derived portfolio figures

export type PortfolioSummary = {
  value: number;
  invested: number;
  /** Current-value-weighted forecast IRR across active holdings. */
  weightedIrr: number;
  distributionsToDate: number;
  holdingsCount: number;
  nextForecastEvent?: CashEvent;
};

export function computePortfolio(investorId: string): PortfolioSummary {
  const holdings = getHoldingsFor(investorId);
  const value = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const invested = holdings.reduce((sum, h) => sum + h.invested, 0);
  const weightedIrr =
    value > 0
      ? holdings.reduce((sum, h) => sum + h.forecastIrr * h.currentValue, 0) /
        value
      : 0;
  const events = getCashEventsFor(investorId);
  const distributionsToDate = events
    .filter((e) => e.status === "Paid" && e.type !== "Capital call")
    .reduce((sum, e) => sum + e.amount, 0);
  const nextForecastEvent = events.find((e) => e.status === "Forecast");
  return {
    value,
    invested,
    weightedIrr,
    distributionsToDate,
    holdingsCount: holdings.length,
    nextForecastEvent,
  };
}

// ---------------------------------------------------------------------------
// Formatting

/** £4.82m / £428k style compact money for headline stats. */
export function formatMoneyCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    const millions = (amount / 1_000_000).toFixed(2).replace(/\.?0+$/, "");
    return `£${millions}m`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `£${Math.round(amount / 1_000)}k`;
  }
  return `£${amount}`;
}

/** £125,000 style full money for cash events and tables. */
export function formatMoneyFull(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

/** 08 Aug 2026 style date used across the portal. */
export function formatPortalDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** 6 Aug 2026 style date for insight bylines. */
export function formatInsightDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
