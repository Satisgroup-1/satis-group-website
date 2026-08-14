import fallback from "@/content/investors/market-fallback.json";

// Live market intelligence for the investor platform, drawn from the HM Land
// Registry UK House Price Index open-data API (Open Government Licence, no
// API key). Each region's latest month is fetched server-side with Next's
// data cache (12 h revalidate) and a short timeout; any failure falls back to
// the curated snapshot in content/investors/market-fallback.json so the
// section never breaks. Rent and yield columns stay curated — ONS publishes
// rents at a geography that doesn't map cleanly to these boroughs — and are
// labelled as such in the UI.

export type MarketRegion = {
  id: string;
  label: string;
  averagePrice: number;
  annualChange: number;
  rentPcm: number;
  grossYield: number;
};

export type MarketData = {
  regions: MarketRegion[];
  source: "live" | "fallback";
  /** e.g. "May 2026" — the HPI month the price figures refer to. */
  asOf: string;
  attribution: string;
};

type FallbackRegion = (typeof fallback.regions)[number];

const HPI_BASE = "https://landregistry.data.gov.uk/data/ukhpi/region";

function monthLabel(period: string): string {
  const parsed = new Date(`${period}-01T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return period;
  return parsed.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

async function fetchRegionMonth(
  regionId: string,
  period: string
): Promise<{ averagePrice: number; annualChange: number } | null> {
  try {
    const res = await fetch(`${HPI_BASE}/${regionId}/month/${period}.json`, {
      // Refresh twice a day; HPI publishes monthly.
      next: { revalidate: 43200 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      result?: {
        primaryTopic?: {
          averagePrice?: number;
          percentageAnnualChange?: number;
        };
      };
    };
    const topic = json.result?.primaryTopic;
    if (typeof topic?.averagePrice !== "number") return null;
    return {
      averagePrice: Math.round(topic.averagePrice),
      annualChange:
        typeof topic.percentageAnnualChange === "number"
          ? Math.round(topic.percentageAnnualChange * 10) / 10
          : 0,
    };
  } catch {
    return null;
  }
}

/** Candidate HPI months, newest first — publication lags ~2 months. */
function candidateMonths(count = 4): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let back = 2; back < 2 + count; back++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, 1));
    months.push(d.toISOString().slice(0, 7));
  }
  return months;
}

// Per-instance memo so a slow or blocked API only ever delays one request:
// live results are kept for 12 h, a fallback result is retried after 10 min.
let memo: { data: MarketData; expires: number } | null = null;

export async function getMarketData(): Promise<MarketData> {
  if (memo && memo.expires > Date.now()) return memo.data;
  const data = await resolveMarketData();
  memo = {
    data,
    expires:
      Date.now() + (data.source === "live" ? 12 * 3600_000 : 10 * 60_000),
  };
  return data;
}

async function resolveMarketData(): Promise<MarketData> {
  const fallbackData: MarketData = {
    regions: fallback.regions as FallbackRegion[],
    source: "fallback",
    asOf: monthLabel(fallback.asOf),
    attribution:
      "Curated snapshot. Live HM Land Registry feed unavailable, figures indicative.",
  };

  const months = candidateMonths();
  const results = await Promise.all(
    (fallback.regions as FallbackRegion[]).map(async (region) => {
      for (const period of months) {
        const live = await fetchRegionMonth(region.id, period);
        if (live) return { region, live, period };
      }
      return { region, live: null, period: null };
    })
  );

  // All-or-nothing: mixing months/sources across cards would mislead.
  if (results.some((r) => !r.live)) return fallbackData;

  const period = results[0].period as string;
  return {
    regions: results.map(({ region, live }) => ({
      ...region,
      averagePrice: live!.averagePrice,
      annualChange: live!.annualChange,
    })),
    source: "live",
    asOf: monthLabel(period),
    attribution:
      "House prices: HM Land Registry UK House Price Index (Open Government Licence). Rents and yields: Satis Group research.",
  };
}
