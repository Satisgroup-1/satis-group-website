"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/investor-auth";
import {
  INVESTOR_DATASETS,
  mutateDataset,
  readDataset,
  writeDataset,
  type CapTablePosition,
  type CashEvent,
  type Development,
  type InsightBlock,
  type Insight,
  type InvestorDataset,
  type InvestorDocument,
  type InvestorProfile,
  type Opportunity,
  type SiteUpdate,
} from "@/lib/investor-platform";

export type PlatformActionState = { error?: string; success?: string };

const text = (data: FormData, name: string) =>
  String(data.get(name) ?? "").trim();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 64)
    .replace(/^-+|-+$/g, "");
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

/** Forgiving money input: accepts 1200000, £1,200,000, 1.2m or 428k. */
function parseMoney(raw: string): number | null {
  const cleaned = raw.toLowerCase().replace(/[£,\s]/g, "");
  const match = cleaned.match(/^(\d+(?:\.\d+)?)(m|k)?$/);
  if (!match) return null;
  const value = Number(match[1]);
  if (match[2] === "m") return Math.round(value * 1_000_000);
  if (match[2] === "k") return Math.round(value * 1_000);
  return Math.round(value);
}

function parsePercent(raw: string): number | null {
  const value = Number(raw.replace(/[%\s]/g, ""));
  return Number.isFinite(value) ? value : null;
}

/**
 * Shared wrapper: admin gate, mutation, cache revalidation and the
 * read-only-hosting error surfaced as form feedback.
 */
async function runMutation(
  mutation: () => void,
  success: string
): Promise<PlatformActionState> {
  if (!(await isAuthenticated())) {
    return { error: "Your session has expired. Please sign in again." };
  }
  try {
    mutation();
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "The change could not be saved.",
    };
  }
  revalidatePath("/investors");
  revalidatePath("/admin/platform");
  return { success };
}

// ---------------------------------------------------------------------------
// Investors

export async function saveInvestor(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const name = text(formData, "name");
  const contactName = text(formData, "contactName");
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !contactName || !email) {
    return { error: "Account name, contact name and email are required." };
  }
  const id = text(formData, "id") || slugify(name);
  if (!id) return { error: "The account name must contain letters or numbers." };

  return runMutation(() => {
    mutateDataset<InvestorProfile>("investors", (investors) => {
      if (
        investors.some(
          (inv) => inv.email.toLowerCase() === email && inv.id !== id
        )
      ) {
        throw new Error("Another investor already uses that email.");
      }
      const existing = investors.find((inv) => inv.id === id);
      if (!existing && !password) {
        throw new Error("A password is required for a new investor.");
      }
      const profile: InvestorProfile = {
        id,
        name,
        contactName,
        email,
        passwordHash: password
          ? hashPassword(password)
          : existing!.passwordHash,
        joined: existing?.joined ?? new Date().toISOString().slice(0, 10),
        valueHistory: existing?.valueHistory ?? [],
      };
      return existing
        ? investors.map((inv) => (inv.id === id ? profile : inv))
        : [...investors, profile];
    });
  }, `Saved investor ${name}. They can now sign in at /investors.`);
}

export async function deleteInvestor(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const id = text(formData, "id");
  return runMutation(() => {
    mutateDataset<InvestorProfile>("investors", (investors) => {
      if (!investors.some((inv) => inv.id === id)) {
        throw new Error("Investor not found.");
      }
      return investors.filter((inv) => inv.id !== id);
    });
    mutateDataset<CapTablePosition>("cap-tables", (positions) =>
      positions.filter((p) => p.investorId !== id)
    );
    mutateDataset<CashEvent>("cash-events", (events) =>
      events.filter((e) => e.investorId !== id)
    );
    mutateDataset<InvestorDocument>("documents", (docs) =>
      docs.filter((d) => d.investorId !== id)
    );
  }, "Investor removed, along with their cap-table positions.");
}

export async function saveValueHistoryPoint(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const investorId = text(formData, "investorId");
  const label = text(formData, "label");
  const value = parseMoney(text(formData, "value"));
  if (!investorId || !label || value === null) {
    return { error: "Investor, period label and a valid value are required." };
  }
  return runMutation(() => {
    mutateDataset<InvestorProfile>("investors", (investors) => {
      const investor = investors.find((inv) => inv.id === investorId);
      if (!investor) throw new Error("Investor not found.");
      const history = (investor.valueHistory ?? []).filter(
        (point) => point.label !== label
      );
      investor.valueHistory = [...history, { label, value }];
      return investors;
    });
  }, `Recorded ${label} valuation.`);
}

// ---------------------------------------------------------------------------
// Developments (site + SPV)

export async function saveDevelopment(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const name = text(formData, "name");
  const place = text(formData, "place");
  const address = text(formData, "address");
  if (!name || !place || !address) {
    return { error: "Name, location and address are required." };
  }
  const id = text(formData, "id") || slugify(name);
  const gdv = parseMoney(text(formData, "gdv"));
  if (gdv === null) return { error: "Enter a gross value like £12.5m." };
  const lat = Number(text(formData, "lat"));
  const lng = Number(text(formData, "lng"));
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    return { error: "Latitude and longitude must be valid coordinates." };
  }
  const nextReport = text(formData, "nextReport");
  if (!isValidDate(nextReport)) {
    return { error: "Next report date must be YYYY-MM-DD." };
  }
  const equityValue = parseMoney(text(formData, "equityValue"));
  const totalCommitted = parseMoney(text(formData, "totalCommitted"));
  const seniorDebt = parseMoney(text(formData, "seniorDebt"));
  const siteIrr = parsePercent(text(formData, "siteIrr"));
  if (equityValue === null || totalCommitted === null || seniorDebt === null || siteIrr === null) {
    return {
      error:
        "SPV equity value, total committed, senior debt and site IRR are required — they drive every investor's portfolio figures.",
    };
  }
  const progressRaw = Number(text(formData, "progress"));
  const development: Development = {
    id,
    name,
    place,
    address,
    lat,
    lng,
    status: text(formData, "status") || "On programme",
    progress: Number.isFinite(progressRaw)
      ? Math.min(100, Math.max(0, progressRaw))
      : 0,
    gdv,
    phase: text(formData, "phase") || "Pre-construction",
    nextReport,
    summary: text(formData, "summary"),
    spv: {
      name: text(formData, "spvName") || `Satis (${name}) Ltd`,
      equityValue,
      totalCommitted,
      seniorDebt,
      forecastIrr: siteIrr,
    },
  };
  return runMutation(() => {
    mutateDataset<Development>("developments", (developments) => {
      const index = developments.findIndex((d) => d.id === id);
      if (index >= 0) {
        return developments.map((d) => (d.id === id ? development : d));
      }
      return [...developments, development];
    });
  }, `Saved ${name}.`);
}

export async function deleteDevelopment(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const id = text(formData, "id");
  return runMutation(() => {
    if (
      readDataset<CapTablePosition>("cap-tables").some(
        (p) => p.developmentId === id
      )
    ) {
      throw new Error("Remove this development's cap-table positions first.");
    }
    mutateDataset<Development>("developments", (developments) =>
      developments.filter((d) => d.id !== id)
    );
    mutateDataset<SiteUpdate>("updates", (updates) =>
      updates.filter((u) => u.developmentId !== id)
    );
  }, "Development removed.");
}

// ---------------------------------------------------------------------------
// Cap tables: the source of every portfolio figure

export async function saveCapPosition(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const developmentId = text(formData, "developmentId");
  const investorId = text(formData, "investorId");
  const holderInput = text(formData, "holder");
  const committed = parseMoney(text(formData, "committed"));
  const sharePercent = parsePercent(text(formData, "sharePercent"));
  if (!developmentId) return { error: "Choose a development." };
  if (!investorId && !holderInput) {
    return {
      error: "Choose a platform investor or name an external holder.",
    };
  }
  if (committed === null || sharePercent === null) {
    return { error: "Committed capital and share % must be numbers." };
  }
  if (sharePercent <= 0 || sharePercent > 100) {
    return { error: "Share % must be between 0 and 100." };
  }
  return runMutation(() => {
    if (
      !readDataset<Development>("developments").some(
        (d) => d.id === developmentId
      )
    ) {
      throw new Error("Development not found.");
    }
    const investor = investorId
      ? readDataset<InvestorProfile>("investors").find(
          (inv) => inv.id === investorId
        )
      : undefined;
    if (investorId && !investor) throw new Error("Investor not found.");
    const holder = investor ? investor.name : holderInput;
    const position: CapTablePosition = {
      developmentId,
      ...(investorId ? { investorId } : {}),
      holder,
      committed,
      sharePercent,
      status: text(formData, "status") || "Active",
    };
    mutateDataset<CapTablePosition>("cap-tables", (positions) => {
      const matches = (p: CapTablePosition) =>
        p.developmentId === developmentId &&
        (investorId ? p.investorId === investorId : p.holder === holder && !p.investorId);
      const others = positions.filter((p) => !matches(p));
      const total = others
        .filter((p) => p.developmentId === developmentId)
        .reduce((sum, p) => sum + p.sharePercent, 0);
      if (total + sharePercent > 100.001) {
        throw new Error(
          `That would take the SPV to ${(total + sharePercent).toFixed(1)}% — the cap table cannot exceed 100%.`
        );
      }
      return [...others, position];
    });
  }, "Cap-table position saved. Portfolio figures update automatically.");
}

export async function deleteCapPosition(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const developmentId = text(formData, "developmentId");
  const holder = text(formData, "holder");
  return runMutation(() => {
    mutateDataset<CapTablePosition>("cap-tables", (positions) =>
      positions.filter(
        (p) => !(p.developmentId === developmentId && p.holder === holder)
      )
    );
  }, "Cap-table position removed.");
}

// ---------------------------------------------------------------------------
// Cash events (project returns)

export async function saveCashEvent(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const investorId = text(formData, "investorId");
  const date = text(formData, "date");
  const type = text(formData, "type");
  const amount = parseMoney(text(formData, "amount"));
  const status = text(formData, "status") === "Paid" ? "Paid" : "Forecast";
  const developmentId = text(formData, "developmentId");
  if (!investorId || !type) {
    return { error: "Choose an investor and an event type." };
  }
  if (!isValidDate(date)) return { error: "Date must be YYYY-MM-DD." };
  if (amount === null) return { error: "Enter an amount like £125,000." };
  const event: CashEvent = {
    investorId,
    date,
    type,
    amount,
    status,
    ...(developmentId ? { developmentId } : {}),
  };
  return runMutation(() => {
    if (
      !readDataset<InvestorProfile>("investors").some(
        (inv) => inv.id === investorId
      )
    ) {
      throw new Error("Investor not found.");
    }
    mutateDataset<CashEvent>("cash-events", (events) => [...events, event]);
  }, `Recorded ${type.toLowerCase()} for ${date}.`);
}

export async function deleteCashEvent(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const key = text(formData, "key");
  return runMutation(() => {
    mutateDataset<CashEvent>("cash-events", (events) => {
      const index = events.findIndex(
        (e) => `${e.investorId}|${e.date}|${e.type}|${e.amount}` === key
      );
      if (index < 0) throw new Error("Cash event not found.");
      return events.filter((_, i) => i !== index);
    });
  }, "Cash event removed.");
}

// ---------------------------------------------------------------------------
// Site updates

export async function saveUpdate(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const date = text(formData, "date");
  const developmentId = text(formData, "developmentId");
  const title = text(formData, "title");
  const body = text(formData, "body");
  if (!developmentId || !title || !body) {
    return { error: "Development, title and update text are required." };
  }
  if (!isValidDate(date)) return { error: "Date must be YYYY-MM-DD." };
  const update: SiteUpdate = {
    date,
    developmentId,
    title,
    body,
    tag: text(formData, "tag") || "Update",
  };
  return runMutation(() => {
    mutateDataset<SiteUpdate>("updates", (updates) => [update, ...updates]);
  }, "Site update published.");
}

export async function deleteUpdate(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const key = text(formData, "key");
  return runMutation(() => {
    mutateDataset<SiteUpdate>("updates", (updates) => {
      const index = updates.findIndex((u) => `${u.date}|${u.title}` === key);
      if (index < 0) throw new Error("Update not found.");
      return updates.filter((_, i) => i !== index);
    });
  }, "Site update removed.");
}

// ---------------------------------------------------------------------------
// Opportunities (upcoming investments)

const OPPORTUNITY_STATUSES = ["Open", "Coming soon", "Fully subscribed"] as const;

export async function saveOpportunity(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const name = text(formData, "name");
  const place = text(formData, "place");
  const summary = text(formData, "summary");
  if (!name || !place || !summary) {
    return { error: "Name, location and summary are required." };
  }
  const id = text(formData, "id") || slugify(`${name}-${place}`);
  const statusRaw = text(formData, "status");
  const status = OPPORTUNITY_STATUSES.includes(
    statusRaw as (typeof OPPORTUNITY_STATUSES)[number]
  )
    ? (statusRaw as Opportunity["status"])
    : "Coming soon";
  const targetRaise = parseMoney(text(formData, "targetRaise"));
  const raisedToDate = parseMoney(text(formData, "raisedToDate") || "0");
  const minCommitment = parseMoney(text(formData, "minCommitment"));
  const targetIrr = parsePercent(text(formData, "targetIrr"));
  if (targetRaise === null || raisedToDate === null || minCommitment === null || targetIrr === null) {
    return {
      error: "Target raise, raised to date, min commitment and target IRR must be numbers.",
    };
  }
  const closesOn = text(formData, "closesOn");
  if (!isValidDate(closesOn)) {
    return { error: "Closes-on date must be YYYY-MM-DD." };
  }
  const opportunity: Opportunity = {
    id,
    name,
    place,
    address: text(formData, "address") || place,
    status,
    targetRaise,
    raisedToDate,
    minCommitment,
    targetIrr,
    targetMultiple: text(formData, "targetMultiple") || "—",
    horizon: text(formData, "horizon") || "—",
    closesOn,
    structure:
      text(formData, "structure") ||
      "Ordinary shares in a Satis single-asset SPV",
    summary,
    highlights: text(formData, "highlights")
      .split(/\r?\n/)
      .map((line) => line.replace(/^-\s*/, "").trim())
      .filter(Boolean),
  };
  return runMutation(() => {
    mutateDataset<Opportunity>("opportunities", (opportunities) => {
      const index = opportunities.findIndex((o) => o.id === id);
      if (index >= 0) {
        return opportunities.map((o) => (o.id === id ? opportunity : o));
      }
      return [...opportunities, opportunity];
    });
  }, `Saved opportunity ${name}.`);
}

export async function deleteOpportunity(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const id = text(formData, "id");
  return runMutation(() => {
    mutateDataset<Opportunity>("opportunities", (opportunities) =>
      opportunities.filter((o) => o.id !== id)
    );
  }, "Opportunity removed.");
}

// ---------------------------------------------------------------------------
// Insights

/**
 * Markdown-ish composer format: blocks separated by blank lines; "## " starts
 * a heading; consecutive "- " lines become a list; "> " starts a pull quote
 * (a trailing line beginning "— " becomes the attribution); everything else
 * is a paragraph. Stats rows, tables and callouts are available through the
 * JSON importer.
 */
function parseInsightBody(raw: string): InsightBlock[] {
  const blocks: InsightBlock[] = [];
  for (const chunk of raw.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("## ")) {
      const [headingLine, ...rest] = trimmed.split("\n");
      blocks.push({ type: "heading", text: headingLine.slice(3).trim() });
      const remainder = rest.join("\n").trim();
      if (remainder) blocks.push(...parseInsightBody(remainder));
      continue;
    }
    if (trimmed.startsWith("> ")) {
      const lines = trimmed
        .split("\n")
        .map((line) => line.replace(/^>\s?/, "").trim());
      const attributionIndex = lines.findIndex((line) => line.startsWith("— "));
      const attribution =
        attributionIndex >= 0
          ? lines[attributionIndex].replace(/^—\s*/, "")
          : undefined;
      const quoteText = (
        attributionIndex >= 0 ? lines.slice(0, attributionIndex) : lines
      )
        .join(" ")
        .trim();
      if (quoteText) {
        blocks.push({ type: "quote", text: quoteText, attribution });
      }
      continue;
    }
    const lines = trimmed.split("\n").map((line) => line.trim());
    if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({
        type: "list",
        items: lines.map((line) => line.slice(2).trim()).filter(Boolean),
      });
      continue;
    }
    blocks.push({ type: "paragraph", text: lines.join(" ") });
  }
  return blocks;
}

export async function saveInsight(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const title = text(formData, "title");
  const summary = text(formData, "summary");
  const date = text(formData, "date");
  const bodyRaw = text(formData, "body");
  if (!title || !summary || !bodyRaw) {
    return { error: "Title, summary and article body are required." };
  }
  if (!isValidDate(date)) return { error: "Date must be YYYY-MM-DD." };
  const slug = text(formData, "slug") || slugify(title);
  if (!slug) return { error: "The title must contain letters or numbers." };
  const themeRaw = text(formData, "theme");
  const insight: Insight = {
    slug,
    category: text(formData, "category") || "Market note",
    date,
    title,
    summary,
    read: text(formData, "read") || "5 min",
    theme:
      themeRaw === "sand" || themeRaw === "sage" || themeRaw === "dark"
        ? themeRaw
        : "dark",
    body: parseInsightBody(bodyRaw),
  };
  if (insight.body.length === 0) {
    return { error: "The article body is empty after parsing." };
  }
  return runMutation(() => {
    mutateDataset<Insight>("insights", (insights) => {
      const index = insights.findIndex((i) => i.slug === slug);
      if (index >= 0) return insights.map((i) => (i.slug === slug ? insight : i));
      return [insight, ...insights];
    });
  }, `Published “${title}”.`);
}

export async function deleteInsight(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  const slug = text(formData, "slug");
  return runMutation(() => {
    mutateDataset<Insight>("insights", (insights) =>
      insights.filter((i) => i.slug !== slug)
    );
  }, "Insight removed.");
}

// ---------------------------------------------------------------------------
// Bulk JSON import

type Snapshot = Partial<Record<InvestorDataset, unknown[]>>;

function assertString(value: unknown, message: string): asserts value is string {
  if (typeof value !== "string" || !value.trim()) throw new Error(message);
}

function assertNumber(value: unknown, message: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(message);
  }
}

function validateInsightBlocks(blocks: unknown, where: string): InsightBlock[] {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new Error(`${where} needs a non-empty body array.`);
  }
  for (const block of blocks) {
    const b = block as InsightBlock;
    switch (b.type) {
      case "list":
        if (!Array.isArray(b.items)) {
          throw new Error(`${where} list blocks need an items array.`);
        }
        break;
      case "heading":
      case "paragraph":
        assertString(b.text, `${where} ${b.type} blocks need text.`);
        break;
      case "quote":
        assertString(b.text, `${where} quote blocks need text.`);
        break;
      case "callout":
        assertString(b.text, `${where} callout blocks need text.`);
        break;
      case "stats":
        if (
          !Array.isArray(b.items) ||
          b.items.some(
            (item) =>
              typeof item?.value !== "string" || typeof item?.label !== "string"
          )
        ) {
          throw new Error(
            `${where} stats blocks need items with value and label strings.`
          );
        }
        break;
      case "table":
        if (!Array.isArray(b.headers) || !Array.isArray(b.rows)) {
          throw new Error(`${where} table blocks need headers and rows arrays.`);
        }
        break;
      default:
        throw new Error(
          `${where} blocks must be heading, paragraph, list, quote, stats, table or callout.`
        );
    }
  }
  return blocks as InsightBlock[];
}

/**
 * Validate an uploaded snapshot. Only the datasets present in the upload are
 * replaced; investor records may carry a plaintext "password" field which is
 * hashed here and never stored.
 */
function validateSnapshot(value: unknown): Snapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      "The import must be a JSON object keyed by dataset, e.g. {\"investors\": [...]}."
    );
  }
  const snapshot: Snapshot = {};
  for (const [key, records] of Object.entries(value)) {
    if (!(INVESTOR_DATASETS as readonly string[]).includes(key)) {
      throw new Error(
        `Unknown dataset “${key}”. Expected: ${INVESTOR_DATASETS.join(", ")}.`
      );
    }
    if (!Array.isArray(records)) {
      throw new Error(`“${key}” must be an array.`);
    }
    snapshot[key as InvestorDataset] = records as unknown[];
  }

  const investorIds = new Set(
    (
      (snapshot.investors as InvestorProfile[] | undefined) ??
      readDataset<InvestorProfile>("investors")
    ).map((inv) => inv.id)
  );
  const developmentIds = new Set(
    (
      (snapshot.developments as Development[] | undefined) ??
      readDataset<Development>("developments")
    ).map((d) => d.id)
  );

  snapshot.investors = snapshot.investors?.map((record, i) => {
    const inv = record as InvestorProfile & { password?: string };
    assertString(inv.id, `investors[${i}] needs an id.`);
    assertString(inv.name, `investors[${i}] needs a name.`);
    assertString(inv.contactName, `investors[${i}] needs a contactName.`);
    assertString(inv.email, `investors[${i}] needs an email.`);
    const { password, ...rest } = inv;
    const passwordHash = password ? hashPassword(password) : inv.passwordHash;
    if (typeof passwordHash !== "string" || !passwordHash.startsWith("scrypt:")) {
      throw new Error(
        `investors[${i}] needs a "password" (hashed on import) or an existing scrypt "passwordHash".`
      );
    }
    return {
      ...rest,
      email: inv.email.toLowerCase(),
      passwordHash,
      joined: inv.joined ?? new Date().toISOString().slice(0, 10),
      valueHistory: Array.isArray(inv.valueHistory) ? inv.valueHistory : [],
    };
  });

  snapshot.developments = snapshot.developments?.map((record, i) => {
    const d = record as Development;
    assertString(d.id, `developments[${i}] needs an id.`);
    assertString(d.name, `developments[${i}] needs a name.`);
    assertString(d.place, `developments[${i}] needs a place.`);
    assertString(d.address, `developments[${i}] needs an address.`);
    assertNumber(d.gdv, `developments[${i}] needs a numeric gdv.`);
    assertNumber(d.lat, `developments[${i}] needs a numeric lat.`);
    assertNumber(d.lng, `developments[${i}] needs a numeric lng.`);
    if (!d.spv || typeof d.spv !== "object") {
      throw new Error(`developments[${i}] needs an spv object.`);
    }
    assertString(d.spv.name, `developments[${i}].spv needs a name.`);
    assertNumber(
      d.spv.equityValue,
      `developments[${i}].spv needs a numeric equityValue.`
    );
    assertNumber(
      d.spv.totalCommitted,
      `developments[${i}].spv needs a numeric totalCommitted.`
    );
    assertNumber(
      d.spv.seniorDebt,
      `developments[${i}].spv needs a numeric seniorDebt.`
    );
    assertNumber(
      d.spv.forecastIrr,
      `developments[${i}].spv needs a numeric forecastIrr.`
    );
    return d;
  });

  snapshot["cap-tables"] = (() => {
    const records = snapshot["cap-tables"]?.map((record, i) => {
      const p = record as CapTablePosition;
      assertString(p.developmentId, `cap-tables[${i}] needs a developmentId.`);
      assertString(p.holder, `cap-tables[${i}] needs a holder name.`);
      assertNumber(p.committed, `cap-tables[${i}] needs numeric committed.`);
      assertNumber(
        p.sharePercent,
        `cap-tables[${i}] needs numeric sharePercent.`
      );
      if (!developmentIds.has(p.developmentId)) {
        throw new Error(
          `cap-tables[${i}] references unknown development “${p.developmentId}”.`
        );
      }
      if (p.investorId && !investorIds.has(p.investorId)) {
        throw new Error(
          `cap-tables[${i}] references unknown investor “${p.investorId}”.`
        );
      }
      return { status: p.status ?? "Active", ...p };
    });
    if (records) {
      const totals = new Map<string, number>();
      for (const p of records as CapTablePosition[]) {
        totals.set(
          p.developmentId,
          (totals.get(p.developmentId) ?? 0) + p.sharePercent
        );
      }
      for (const [developmentId, total] of totals) {
        if (total > 100.001) {
          throw new Error(
            `cap-tables: “${developmentId}” sums to ${total.toFixed(1)}% — a cap table cannot exceed 100%.`
          );
        }
      }
    }
    return records;
  })();

  snapshot["cash-events"] = snapshot["cash-events"]?.map((record, i) => {
    const e = record as CashEvent;
    assertString(e.investorId, `cash-events[${i}] needs an investorId.`);
    assertString(e.type, `cash-events[${i}] needs a type.`);
    assertNumber(e.amount, `cash-events[${i}] needs a numeric amount.`);
    if (!isValidDate(e.date)) {
      throw new Error(`cash-events[${i}] needs a YYYY-MM-DD date.`);
    }
    if (e.status !== "Paid" && e.status !== "Forecast") {
      throw new Error(`cash-events[${i}] status must be "Paid" or "Forecast".`);
    }
    if (!investorIds.has(e.investorId)) {
      throw new Error(
        `cash-events[${i}] references unknown investor “${e.investorId}”.`
      );
    }
    return e;
  });

  snapshot.updates = snapshot.updates?.map((record, i) => {
    const u = record as SiteUpdate;
    assertString(u.developmentId, `updates[${i}] needs a developmentId.`);
    assertString(u.title, `updates[${i}] needs a title.`);
    assertString(u.body, `updates[${i}] needs a body.`);
    if (!isValidDate(u.date)) throw new Error(`updates[${i}] needs a YYYY-MM-DD date.`);
    return { ...u, tag: u.tag ?? "Update" };
  });

  snapshot.documents = snapshot.documents?.map((record, i) => {
    const doc = record as InvestorDocument;
    assertString(doc.investorId, `documents[${i}] needs an investorId.`);
    assertString(doc.title, `documents[${i}] needs a title.`);
    assertString(doc.kind, `documents[${i}] needs a kind.`);
    if (!isValidDate(doc.published)) {
      throw new Error(`documents[${i}] needs a YYYY-MM-DD published date.`);
    }
    return doc;
  });

  snapshot.insights = snapshot.insights?.map((record, i) => {
    const insight = record as Insight;
    assertString(insight.slug, `insights[${i}] needs a slug.`);
    assertString(insight.title, `insights[${i}] needs a title.`);
    assertString(insight.summary, `insights[${i}] needs a summary.`);
    if (!isValidDate(insight.date)) {
      throw new Error(`insights[${i}] needs a YYYY-MM-DD date.`);
    }
    validateInsightBlocks(insight.body, `insights[${i}]`);
    return {
      ...insight,
      read: insight.read ?? "5 min",
      category: insight.category ?? "Market note",
      theme: insight.theme ?? "dark",
    };
  });

  snapshot.opportunities = snapshot.opportunities?.map((record, i) => {
    const o = record as Opportunity;
    assertString(o.id, `opportunities[${i}] needs an id.`);
    assertString(o.name, `opportunities[${i}] needs a name.`);
    assertString(o.place, `opportunities[${i}] needs a place.`);
    assertString(o.summary, `opportunities[${i}] needs a summary.`);
    assertNumber(o.targetRaise, `opportunities[${i}] needs a numeric targetRaise.`);
    assertNumber(
      o.raisedToDate,
      `opportunities[${i}] needs a numeric raisedToDate.`
    );
    assertNumber(
      o.minCommitment,
      `opportunities[${i}] needs a numeric minCommitment.`
    );
    assertNumber(o.targetIrr, `opportunities[${i}] needs a numeric targetIrr.`);
    if (!OPPORTUNITY_STATUSES.includes(o.status)) {
      throw new Error(
        `opportunities[${i}] status must be one of: ${OPPORTUNITY_STATUSES.join(", ")}.`
      );
    }
    if (!isValidDate(o.closesOn)) {
      throw new Error(`opportunities[${i}] needs a YYYY-MM-DD closesOn date.`);
    }
    return {
      ...o,
      address: o.address ?? o.place,
      targetMultiple: o.targetMultiple ?? "—",
      horizon: o.horizon ?? "—",
      structure: o.structure ?? "Ordinary shares in a Satis single-asset SPV",
      highlights: Array.isArray(o.highlights) ? o.highlights : [],
    };
  });

  return snapshot;
}

export async function importSnapshot(
  _prev: PlatformActionState,
  formData: FormData
): Promise<PlatformActionState> {
  if (!(await isAuthenticated())) {
    return { error: "Your session has expired. Please sign in again." };
  }
  const file = formData.get("dataset");
  let raw: string;
  if (file instanceof File && file.size > 0) {
    if (file.size > 4_000_000) {
      return { error: "The import must be smaller than 4 MB." };
    }
    raw = await file.text();
  } else {
    raw = String(formData.get("json") ?? "").trim();
  }
  if (!raw) {
    return { error: "Choose a JSON file or paste a JSON snapshot to import." };
  }

  let snapshot: Snapshot;
  try {
    snapshot = validateSnapshot(JSON.parse(raw));
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "The JSON could not be parsed.",
    };
  }
  // validateSnapshot's per-dataset passes assign `undefined` for datasets the
  // upload didn't include — keep only the arrays that were actually sent.
  const imported = (
    Object.entries(snapshot) as [InvestorDataset, unknown[] | undefined][]
  ).filter((entry): entry is [InvestorDataset, unknown[]] =>
    Array.isArray(entry[1])
  );
  if (imported.length === 0) {
    return { error: "The snapshot contained no datasets." };
  }
  try {
    for (const [dataset, records] of imported) {
      writeDataset(dataset, records);
    }
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "The import could not be saved.",
    };
  }
  revalidatePath("/investors");
  revalidatePath("/admin/platform");
  return {
    success: `Imported ${imported
      .map(([dataset, records]) => `${records.length} ${dataset}`)
      .join(", ")}.`,
  };
}
