import type { Metadata } from "next";
import { InvestorLogin } from "@/components/InvestorLogin";
import { InvestorPortal, type PortalData } from "@/components/InvestorPortal";
import { getSessionInvestorId } from "@/lib/investor-auth";
import { getMarketData, type MarketData } from "@/lib/market-data";
import {
  computePortfolio,
  formatInsightDate,
  formatMoneyCompact,
  formatMoneyFull,
  formatPortalDate,
  getCapTableFor,
  getCashEventsFor,
  getDevelopmentDocumentsFor,
  getDevelopments,
  getDocumentsFor,
  getInsights,
  getInvestorById,
  getInvestorTier,
  getOpportunities,
  getUpdates,
  type Development,
  type InvestorProfile,
  type InvestorTier,
} from "@/lib/investor-platform";
import { investorLogout } from "./actions";

export const metadata: Metadata = {
  title: "Investor platform",
  description:
    "Portfolio performance, Greater Manchester market intelligence, development updates and investor reporting from Satis Group.",
  alternates: { canonical: "/investors" },
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie and data lives in per-request JSON reads, so
// this page must render per-request.
export const dynamic = "force-dynamic";

function buildPortalData(
  investor: InvestorProfile,
  tier: InvestorTier,
  developments: Development[],
  market: MarketData
): PortalData {
  const invested = tier === "invested";
  const summary = computePortfolio(investor.id);
  // Everything private to an SPV — its cap table, financials and monthly
  // reports — is only assembled for accounts holding a cap-table position
  // in that development. Other developments still show their public card.
  const memberDevelopmentIds = new Set(
    summary.holdings.map((h) => h.developmentId)
  );
  const memberOf = (developmentId: string) =>
    invested && memberDevelopmentIds.has(developmentId);
  const developmentById = new Map(developments.map((d) => [d.id, d]));
  const developmentName = (id?: string) =>
    (id && developmentById.get(id)?.name) ?? "Portfolio";

  const now = new Date();
  const hour = Number(
    now.toLocaleString("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Europe/London",
    })
  );
  const greeting = `${
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  }, ${investor.contactName}.`;
  const opportunities = getOpportunities();
  const documents = getDocumentsFor(investor.id, tier);
  // Read once: the datasets are re-read from disk on every accessor call.
  const reports = getUpdates();
  const lastUpdated = `${now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  })} · ${now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  })}`;

  const growth =
    summary.invested > 0
      ? `${summary.value >= summary.invested ? "+" : ""}${(
          (summary.value / summary.invested - 1) *
          100
        ).toFixed(1)}% on committed capital`
      : "Awaiting first investment";
  const nextEvent = summary.nextForecastEvent;

  const upcomingEvents = (invested ? getCashEventsFor(investor.id) : [])
    .filter((event) => event.status === "Forecast")
    .slice(0, 3)
    .map((event) => ({
      date: new Date(`${event.date}T00:00:00Z`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
      }),
      type: event.type,
      amount: formatMoneyFull(event.amount),
    }));

  const delta = summary.value - summary.invested;

  const openRaises = opportunities.filter((o) => o.status === "Open");
  const minCommitment = openRaises.length
    ? Math.min(...openRaises.map((o) => o.minCommitment))
    : 0;

  // Prospective accounts see the pipeline they could invest in; invested
  // accounts see their own position. Nothing private to an SPV (cap tables,
  // equity values, cash events, monthly reports) is assembled for a
  // prospective account, or for developments the account holds no
  // cap-table position in — see memberOf above.
  const prospectStats = [
    {
      label: "Open raises",
      value: String(openRaises.length),
      note: openRaises.length
        ? "Accepting commitments now"
        : "Next raise announced soon",
    },
    {
      label: "Minimum commitment",
      value: minCommitment ? formatMoneyCompact(minCommitment) : "—",
      note: "Per single-asset vehicle",
    },
    {
      label: "In your data room",
      value: String(documents.length),
      note: "Memoranda, appraisals and guides",
    },
    {
      label: "Live developments",
      value: String(developments.length),
      note: "Across Greater Manchester",
    },
  ];

  return {
    accountName: investor.name,
    tier,
    greeting: invested ? greeting : `Welcome, ${investor.contactName}.`,
    lastUpdated,
    stats: invested
      ? [
          {
            label: "Portfolio value",
            value: formatMoneyCompact(summary.value),
            note: growth,
          },
          {
            label: "Capital committed",
            value: formatMoneyCompact(summary.invested),
            note: `Across ${summary.holdingsCount} SPV position${
              summary.holdingsCount === 1 ? "" : "s"
            }`,
          },
          {
            label: "Forecast IRR",
            value: `${summary.weightedIrr.toFixed(1)}%`,
            note: "Site IRRs, weighted by current value",
          },
          {
            label: "Distributions to date",
            value: formatMoneyCompact(summary.distributionsToDate),
            note: nextEvent
              ? `Next forecast: ${formatPortalDate(nextEvent.date)}`
              : "No forecast events",
          },
        ]
      : prospectStats,
    valueHistory: invested ? investor.valueHistory ?? [] : [],
    developments: developments.map((d) => {
      const capTable = memberOf(d.id)
        ? getCapTableFor(d.id).map((position) => ({
            holder: position.holder,
            sharePercent: `${position.sharePercent}%`,
            committed: formatMoneyCompact(position.committed),
            isYou: position.investorId === investor.id,
          }))
        : [];
      const mine = summary.holdings.find((h) => h.developmentId === d.id);
      const latest = memberOf(d.id)
        ? reports.find((u) => u.developmentId === d.id)
        : undefined;
      return {
        id: d.id,
        name: d.name,
        place: d.place,
        address: d.address,
        lat: d.lat,
        lng: d.lng,
        status: d.status,
        progress: d.progress,
        value: formatMoneyCompact(d.gdv),
        phase: d.phase,
        nextReport: formatPortalDate(d.nextReport),
        summary: d.summary,
        latestReport: latest
          ? {
              title: latest.title,
              period: latest.period ?? formatPortalDate(latest.date),
              file: latest.file,
            }
          : undefined,
        spv: memberOf(d.id)
          ? {
              name: d.spv.name,
              equityValue: formatMoneyCompact(d.spv.equityValue),
              totalCommitted: formatMoneyCompact(d.spv.totalCommitted),
              seniorDebt: formatMoneyCompact(d.spv.seniorDebt),
              forecastIrr: `${d.spv.forecastIrr.toFixed(1)}%`,
            }
          : undefined,
        capTable,
        yourPosition: mine
          ? {
              sharePercent: `${mine.sharePercent}%`,
              committed: formatMoneyCompact(mine.committed),
              currentValue: formatMoneyCompact(mine.currentValue),
            }
          : undefined,
      };
    }),
    // One entry per cap-table position: the investment's headline figures
    // plus its private file library (legal papers, meeting recordings,
    // accounts), for the per-investment tabs under My Portfolio.
    portfolio: invested
      ? summary.holdings.map((h) => {
          const d = developmentById.get(h.developmentId);
          return {
            developmentId: h.developmentId,
            name: h.developmentName,
            spvName: h.spvName,
            place: d?.place ?? "",
            status: d?.status ?? h.status,
            phase: d?.phase ?? "",
            progress: d?.progress ?? 0,
            nextReport: d ? formatPortalDate(d.nextReport) : "—",
            position: {
              sharePercent: `${h.sharePercent}%`,
              committed: formatMoneyCompact(h.committed),
              currentValue: formatMoneyCompact(h.currentValue),
              forecastIrr: `${h.siteIrr.toFixed(1)}%`,
              multiple:
                h.committed > 0
                  ? `${(h.currentValue / h.committed).toFixed(2)}x`
                  : "—",
              status: h.status,
            },
            files: getDevelopmentDocumentsFor(investor.id, h.developmentId).map(
              (doc) => ({
                title: doc.title,
                kind: doc.kind,
                category: doc.category,
                summary: doc.summary,
                file: doc.file,
                published: formatPortalDate(doc.published),
              })
            ),
          };
        })
      : [],
    holdings: summary.holdings.map((h) => ({
      name: h.developmentName,
      spvName: h.spvName,
      share: `${h.sharePercent}%`,
      invested: formatMoneyCompact(h.committed),
      currentValue: formatMoneyCompact(h.currentValue),
      forecastIrr: `${h.siteIrr.toFixed(1)}%`,
      multiple:
        h.committed > 0 ? `${(h.currentValue / h.committed).toFixed(2)}x` : "—",
      status: h.status,
    })),
    financialsHeadline: {
      value: formatMoneyCompact(summary.value),
      delta: `${delta >= 0 ? "+" : "−"}${formatMoneyCompact(Math.abs(delta))}`,
    },
    upcomingEvents,
    reports: invested
      ? reports
          .filter((u) => memberOf(u.developmentId))
          .map((u) => ({
          developmentId: u.developmentId,
          date: formatPortalDate(u.date),
          period: u.period ?? formatPortalDate(u.date),
          site: developmentName(u.developmentId),
          title: u.title,
          body: u.body,
          tag: u.tag,
          file: u.file,
          tasks: (u.tasks ?? []).map((task) => ({
            title: task.title,
            detail: task.detail,
            status: task.status,
          })),
        }))
      : [],
    insights: getInsights().map((insight) => ({
      ...insight,
      date: formatInsightDate(insight.date),
    })),
    documents: documents.map((doc) => ({
      title: doc.title,
      kind: doc.kind,
      summary: doc.summary,
      file: doc.file,
      published: formatPortalDate(doc.published),
    })),
    // Upcoming raises are for prospective accounts only: invested accounts
    // have no opportunities section, so nothing is assembled for them.
    opportunities: invested ? [] : opportunities.map((o) => ({
      id: o.id,
      name: o.name,
      place: o.place,
      address: o.address,
      status: o.status,
      targetRaise: formatMoneyCompact(o.targetRaise),
      raisedToDate: formatMoneyCompact(o.raisedToDate),
      raisedPercent:
        o.targetRaise > 0
          ? Math.min(100, Math.round((o.raisedToDate / o.targetRaise) * 100))
          : 0,
      minCommitment: formatMoneyCompact(o.minCommitment),
      targetIrr: `${o.targetIrr}%`,
      targetMultiple: o.targetMultiple,
      horizon: o.horizon,
      closesOn: formatPortalDate(o.closesOn),
      structure: o.structure,
      summary: o.summary,
      highlights: o.highlights,
    })),
    market: {
      regions: market.regions.map((r) => ({
        label: r.label,
        averagePrice: formatMoneyFull(r.averagePrice),
        annualChange: `${r.annualChange >= 0 ? "+" : ""}${r.annualChange}%`,
        rentPcm: formatMoneyFull(r.rentPcm),
        grossYield: `${r.grossYield}%`,
      })),
      badge:
        market.source === "live"
          ? `HM Land Registry UK House Price Index · ${market.asOf}`
          : `Curated snapshot · ${market.asOf} · live feed unavailable`,
      attribution: market.attribution,
      live: market.source === "live",
    },
  };
}

export default async function InvestorsPage() {
  const developments = getDevelopments();
  const investorId = await getSessionInvestorId();
  const investor = investorId ? getInvestorById(investorId) : undefined;

  if (!investor) {
    const onTrack = developments.filter(
      (d) => d.status === "On programme" || d.status === "Ahead"
    ).length;
    return (
      <InvestorLogin
        stats={{
          developments: String(developments.length),
          gdv: formatMoneyCompact(
            developments.reduce((sum, d) => sum + d.gdv, 0)
          ),
          onProgramme:
            developments.length > 0
              ? `${Math.round((onTrack / developments.length) * 100)}%`
              : "—",
        }}
      />
    );
  }

  const market = await getMarketData();
  return (
    <InvestorPortal
      data={buildPortalData(
        investor,
        getInvestorTier(investor),
        developments,
        market
      )}
      logout={investorLogout}
    />
  );
}
