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
  getDevelopments,
  getDocumentsFor,
  getInsights,
  getInvestorById,
  getOpportunities,
  getUpdates,
  type Development,
  type InvestorProfile,
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
  developments: Development[],
  market: MarketData
): PortalData {
  const summary = computePortfolio(investor.id);
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

  const upcomingEvents = getCashEventsFor(investor.id)
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

  return {
    accountName: investor.name,
    greeting,
    lastUpdated,
    stats: [
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
    ],
    valueHistory: investor.valueHistory ?? [],
    developments: developments.map((d) => {
      const capTable = getCapTableFor(d.id).map((position) => ({
        holder: position.holder,
        sharePercent: `${position.sharePercent}%`,
        committed: formatMoneyCompact(position.committed),
        isYou: position.investorId === investor.id,
      }));
      const mine = summary.holdings.find((h) => h.developmentId === d.id);
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
        spv: {
          name: d.spv.name,
          equityValue: formatMoneyCompact(d.spv.equityValue),
          totalCommitted: formatMoneyCompact(d.spv.totalCommitted),
          seniorDebt: formatMoneyCompact(d.spv.seniorDebt),
          forecastIrr: `${d.spv.forecastIrr.toFixed(1)}%`,
        },
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
    updates: getUpdates().map((u) => ({
      date: formatPortalDate(u.date),
      site: developmentName(u.developmentId),
      title: u.title,
      body: u.body,
      tag: u.tag,
    })),
    insights: getInsights().map((insight) => ({
      ...insight,
      date: formatInsightDate(insight.date),
    })),
    documents: getDocumentsFor(investor.id).map((doc) => ({
      title: doc.title,
      kind: doc.kind,
      published: formatPortalDate(doc.published),
    })),
    opportunities: getOpportunities().map((o) => ({
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
      data={buildPortalData(investor, developments, market)}
      logout={investorLogout}
    />
  );
}
