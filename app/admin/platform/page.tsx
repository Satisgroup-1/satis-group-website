import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/AdminLogin";
import {
  AdminPlatform,
  type AdminPlatformData,
} from "@/components/AdminPlatform";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  computePortfolio,
  formatInsightDate,
  formatMoneyCompact,
  formatMoneyFull,
  formatPortalDate,
  getDevelopments,
  getInsights,
  getInvestors,
  getUpdates,
  readDataset,
  type CashEvent,
  type Holding,
} from "@/lib/investor-platform";

export const metadata: Metadata = {
  title: "Investor platform data",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie and the datasets are read per request.
export const dynamic = "force-dynamic";

function buildAdminData(): AdminPlatformData {
  const investors = getInvestors();
  const developments = getDevelopments();
  const developmentName = (id?: string) =>
    (id && developments.find((d) => d.id === id)?.name) ?? "Portfolio";
  const investorName = (id: string) =>
    investors.find((inv) => inv.id === id)?.name ?? id;

  return {
    investors: investors.map((inv) => {
      const summary = computePortfolio(inv.id);
      return {
        id: inv.id,
        name: inv.name,
        contactName: inv.contactName,
        email: inv.email,
        joined: formatPortalDate(inv.joined),
        value: formatMoneyCompact(summary.value),
        holdings: summary.holdingsCount,
      };
    }),
    developments: developments.map((d) => ({
      id: d.id,
      name: d.name,
      place: d.place,
      phase: d.phase,
      status: d.status,
      progress: d.progress,
      value: formatMoneyCompact(d.gdv),
    })),
    holdings: readDataset<Holding>("holdings").map((h) => ({
      investorId: h.investorId,
      investorName: investorName(h.investorId),
      developmentId: h.developmentId,
      developmentName: developmentName(h.developmentId),
      invested: formatMoneyCompact(h.invested),
      currentValue: formatMoneyCompact(h.currentValue),
      forecastIrr: `${h.forecastIrr.toFixed(1)}%`,
      status: h.status,
    })),
    cashEvents: readDataset<CashEvent>("cash-events")
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((e) => ({
        key: `${e.investorId}|${e.date}|${e.type}|${e.amount}`,
        investorName: investorName(e.investorId),
        date: formatPortalDate(e.date),
        type: e.type,
        amount: formatMoneyFull(e.amount),
        status: e.status,
      })),
    updates: getUpdates().map((u) => ({
      key: `${u.date}|${u.title}`,
      date: formatPortalDate(u.date),
      site: developmentName(u.developmentId),
      title: u.title,
      tag: u.tag,
    })),
    insights: getInsights().map((i) => ({
      slug: i.slug,
      category: i.category,
      date: formatInsightDate(i.date),
      title: i.title,
      read: i.read,
    })),
  };
}

export default async function AdminPlatformPage() {
  const authed = await isAuthenticated();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Admin
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
          {authed ? "Investor platform data." : "Sign in to continue."}
        </h1>

        {!authed ? (
          <div className="mt-10">
            <AdminLogin />
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Manage investor accounts, developments, holdings, project
              returns, site updates and insight articles — or import a full
              JSON dataset. Changes appear immediately in the investor
              platform.{" "}
              <Link
                href="/admin"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Back to the newsletter studio
              </Link>
              .
            </p>
            <div className="mt-12">
              <AdminPlatform data={buildAdminData()} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
