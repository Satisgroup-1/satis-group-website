import fs from "node:fs";
import path from "node:path";
import {
  commitRepoJson,
  fetchRepoJson,
  isGitHubPersistenceEnabled,
} from "@/lib/github-storage";
import bundledInvestors from "@/content/investors/investors.json";
import bundledDevelopments from "@/content/investors/developments.json";
import bundledCapTables from "@/content/investors/cap-tables.json";
import bundledCashEvents from "@/content/investors/cash-events.json";
import bundledUpdates from "@/content/investors/updates.json";
import bundledDocuments from "@/content/investors/documents.json";
import bundledInsights from "@/content/investors/insights.json";
import bundledOpportunities from "@/content/investors/opportunities.json";

// Data layer for the investor platform. All records live as JSON files in
// content/investors/ so the dataset is versioned with the repository and can
// be edited three ways: directly in git, through the /admin/platform forms,
// or via the bulk JSON importer. Files are re-read per request (the investor
// pages are force-dynamic) so imports show up immediately. The static
// imports above keep the seed data inside the serverless bundle: Vercel only
// traces files referenced through the module graph, so without them a fresh
// deployment could fail to find the JSON on disk.

/**
 * Platform accounts come in two kinds. A "prospective" investor has a login
 * so they can read the investment memorandum, appraisals and market work
 * before committing; an "invested" investor additionally sees their own
 * positions, financials and the monthly project reports for their sites.
 */
export type InvestorTier = "prospective" | "invested";

export const INVESTOR_TIERS: InvestorTier[] = ["prospective", "invested"];

export type InvestorProfile = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  passwordHash: string;
  joined: string;
  /** Omitted on older records: the tier is then derived from cap tables. */
  tier?: InvestorTier;
  valueHistory: { label: string; value: number }[];
};

export type DevelopmentSpv = {
  /** Registered name of the single-asset vehicle, e.g. "Satis (QUBE) Ltd". */
  name: string;
  /** Current equity (net asset) value of the SPV. */
  equityValue: number;
  /** Total equity committed across all members. */
  totalCommitted: number;
  seniorDebt: number;
  /** Site-level forecast IRR applied to every position in the vehicle. */
  forecastIrr: number;
};

export type Development = {
  id: string;
  name: string;
  place: string;
  address: string;
  lat: number;
  lng: number;
  status: string;
  progress: number;
  gdv: number;
  phase: string;
  nextReport: string;
  summary: string;
  spv: DevelopmentSpv;
};

/**
 * One line of an SPV's cap table. investorId links the position to a
 * platform account; positions without one (the GP, aggregated third
 * parties) still render in the site cap table for completeness.
 */
export type CapTablePosition = {
  developmentId: string;
  investorId?: string;
  holder: string;
  committed: number;
  sharePercent: number;
  status?: string;
};

export type CashEvent = {
  investorId: string;
  date: string;
  type: string;
  amount: number;
  developmentId?: string;
  status: "Paid" | "Forecast";
};

/** One line item inside a monthly report, so an investor can query it. */
export type ReportTask = {
  title: string;
  detail?: string;
  status?: string;
};

/**
 * A monthly project report. Stored in updates.json (the dataset kept its
 * original name) and surfaced to invested accounts as "Monthly reports":
 * `period` names the month covered, `file` makes the full report
 * downloadable, and `tasks` lists the individual items investors can ask
 * questions about.
 */
export type SiteUpdate = {
  date: string;
  developmentId: string;
  title: string;
  body: string;
  tag: string;
  period?: string;
  file?: string;
  tasks?: ReportTask[];
};

export type InvestorDocument = {
  /** An account id, or "all" to share the document with every account. */
  investorId: string;
  title: string;
  kind: string;
  published: string;
  /** Path or URL to the file; without one the portal shows a demo action. */
  file?: string;
  /** Restricts a shared document to one tier. */
  audience?: InvestorTier;
  summary?: string;
};

export type Opportunity = {
  id: string;
  name: string;
  place: string;
  address: string;
  status: "Open" | "Coming soon" | "Fully subscribed";
  targetRaise: number;
  raisedToDate: number;
  minCommitment: number;
  targetIrr: number;
  targetMultiple: string;
  horizon: string;
  closesOn: string;
  structure: string;
  summary: string;
  highlights: string[];
};

export type InsightBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; title?: string; text: string };

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
  "cap-tables",
  "cash-events",
  "updates",
  "documents",
  "insights",
  "opportunities",
] as const;

export type InvestorDataset = (typeof INVESTOR_DATASETS)[number];

const BUNDLED_DATASETS: Record<InvestorDataset, unknown> = {
  investors: bundledInvestors,
  developments: bundledDevelopments,
  "cap-tables": bundledCapTables,
  "cash-events": bundledCashEvents,
  updates: bundledUpdates,
  documents: bundledDocuments,
  insights: bundledInsights,
  opportunities: bundledOpportunities,
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

function repoPath(dataset: InvestorDataset): string {
  return `content/investors/${dataset}.json`;
}

function commitMessage(dataset: InvestorDataset): string {
  return `Update ${dataset}.json via the admin platform`;
}

function writeDatasetToDisk(dataset: InvestorDataset, records: unknown[]) {
  const file = path.join(INVESTOR_DATA_DIR, `${dataset}.json`);
  try {
    fs.mkdirSync(INVESTOR_DATA_DIR, { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  } catch {
    throw new Error(
      "This deployment has read-only storage, so changes cannot be saved here. Set SATIS_GITHUB_TOKEN in the hosting environment so the admin can commit changes to the repository (see the operations guide)."
    );
  }
}

/**
 * Persist a dataset: committed to the repository when GitHub persistence is
 * configured (read-only hosting), written to disk otherwise. Throws a
 * friendly error either way so server actions can surface it.
 */
export async function writeDataset(
  dataset: InvestorDataset,
  records: unknown[]
): Promise<void> {
  if (!Array.isArray(records)) {
    throw new Error(`Refusing to write non-array data to ${dataset}.json.`);
  }
  if (isGitHubPersistenceEnabled()) {
    const current = await fetchRepoJson(repoPath(dataset));
    await commitRepoJson(
      repoPath(dataset),
      records,
      current?.sha,
      commitMessage(dataset)
    );
    return;
  }
  writeDatasetToDisk(dataset, records);
}

export async function mutateDataset<T>(
  dataset: InvestorDataset,
  mutate: (records: T[]) => T[]
): Promise<T[]> {
  if (isGitHubPersistenceEnabled()) {
    // The repository is the source of truth here: reading it back (rather
    // than the deployed files, which lag until the next deployment) keeps
    // rapid successive edits from overwriting each other.
    const current = await fetchRepoJson(repoPath(dataset));
    const records = mutate(
      current ? (current.records as T[]) : readDataset<T>(dataset)
    );
    if (!Array.isArray(records)) {
      throw new Error(`Refusing to write non-array data to ${dataset}.json.`);
    }
    await commitRepoJson(
      repoPath(dataset),
      records,
      current?.sha,
      commitMessage(dataset)
    );
    return records;
  }
  const records = mutate(readDataset<T>(dataset));
  writeDatasetToDisk(dataset, records as unknown[]);
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

export function getCapTable(): CapTablePosition[] {
  return readDataset<CapTablePosition>("cap-tables");
}

/** All cap-table lines for one SPV/site, largest position first. */
export function getCapTableFor(developmentId: string): CapTablePosition[] {
  return getCapTable()
    .filter((position) => position.developmentId === developmentId)
    .sort((a, b) => b.sharePercent - a.sharePercent);
}

/** An investor's positions across every SPV. */
export function getPositionsFor(investorId: string): CapTablePosition[] {
  return getCapTable().filter(
    (position) => position.investorId === investorId
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

/**
 * An account's tier: the stored value when set, otherwise derived — anyone
 * holding a cap-table position has invested, everyone else is prospective.
 */
export function getInvestorTier(investor: InvestorProfile): InvestorTier {
  if (investor.tier) return investor.tier;
  return getPositionsFor(investor.id).length > 0 ? "invested" : "prospective";
}

/**
 * Documents visible to one account: their own, plus anything published to
 * "all" that either carries no audience or matches their tier (an
 * investment memorandum for prospective investors, say).
 */
export function getDocumentsFor(
  investorId: string,
  tier?: InvestorTier
): InvestorDocument[] {
  return readDataset<InvestorDocument>("documents")
    .filter((doc) => {
      if (doc.investorId === investorId) return true;
      if (doc.investorId !== "all") return false;
      return !doc.audience || !tier || doc.audience === tier;
    })
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getInsights(): Insight[] {
  return readDataset<Insight>("insights").sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getOpportunities(): Opportunity[] {
  const order = { Open: 0, "Coming soon": 1, "Fully subscribed": 2 };
  return readDataset<Opportunity>("opportunities").sort(
    (a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3)
  );
}

// ---------------------------------------------------------------------------
// Derived portfolio figures
//
// The portfolio is a pure product of SPV cap tables: an investor's value in
// a site is their cap-table share of that SPV's current equity value, their
// cost basis is the capital they committed to the vehicle, and the return
// assumption is the site-level forecast IRR. Nothing is stored per investor.

export type HoldingView = {
  developmentId: string;
  developmentName: string;
  spvName: string;
  sharePercent: number;
  committed: number;
  /** sharePercent × SPV equity value. */
  currentValue: number;
  siteIrr: number;
  status: string;
};

export type PortfolioSummary = {
  value: number;
  invested: number;
  /** Current-value-weighted site forecast IRR across active positions. */
  weightedIrr: number;
  distributionsToDate: number;
  holdingsCount: number;
  nextForecastEvent?: CashEvent;
  holdings: HoldingView[];
};

export function computePortfolio(investorId: string): PortfolioSummary {
  const developments = getDevelopments();
  const developmentById = new Map(developments.map((d) => [d.id, d]));
  const holdings: HoldingView[] = getPositionsFor(investorId).flatMap(
    (position) => {
      const development = developmentById.get(position.developmentId);
      if (!development) return [];
      return [
        {
          developmentId: development.id,
          developmentName: development.name,
          spvName: development.spv.name,
          sharePercent: position.sharePercent,
          committed: position.committed,
          currentValue: Math.round(
            (position.sharePercent / 100) * development.spv.equityValue
          ),
          siteIrr: development.spv.forecastIrr,
          status: position.status ?? "Active",
        },
      ];
    }
  );

  const value = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const invested = holdings.reduce((sum, h) => sum + h.committed, 0);
  const weightedIrr =
    value > 0
      ? holdings.reduce((sum, h) => sum + h.siteIrr * h.currentValue, 0) /
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
    holdings,
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
