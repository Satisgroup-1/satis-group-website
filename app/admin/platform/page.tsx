import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/AdminLogin";
import {
  AdminPlatform,
  type AdminPlatformData,
} from "@/components/AdminPlatform";
import { isAuthenticated } from "@/lib/admin-auth";
import { isGitHubPersistenceEnabled } from "@/lib/github-storage";
import {
  computePortfolio,
  formatInsightDate,
  formatMoneyCompact,
  formatMoneyFull,
  formatPortalDate,
  getCapTable,
  getDevelopments,
  getInsights,
  getInvestors,
  getInvestorTier,
  getOpportunities,
  getUpdates,
  readDataset,
  type CashEvent,
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
        tier: getInvestorTier(inv),
        value: formatMoneyCompact(summary.value),
        positions: summary.holdingsCount,
      };
    }),
    developments: developments.map((d) => ({
      id: d.id,
      name: d.name,
      place: d.place,
      address: d.address,
      phase: d.phase,
      status: d.status,
      progress: d.progress,
      value: formatMoneyCompact(d.gdv),
      spvName: d.spv.name,
      equityValue: formatMoneyCompact(d.spv.equityValue),
    })),
    capPositions: getCapTable().map((p) => ({
      developmentId: p.developmentId,
      developmentName: developmentName(p.developmentId),
      holder: p.holder,
      investorId: p.investorId,
      committed: formatMoneyCompact(p.committed),
      committedRaw: p.committed,
      sharePercentRaw: p.sharePercent,
      status: p.status ?? "Active",
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
      period: u.period,
      site: developmentName(u.developmentId),
      title: u.title,
      tag: u.tag,
      tasks: u.tasks?.length ?? 0,
      file: u.file,
    })),
    insights: getInsights().map((i) => ({
      slug: i.slug,
      category: i.category,
      date: formatInsightDate(i.date),
      title: i.title,
      read: i.read,
    })),
    opportunities: getOpportunities().map((o) => ({
      id: o.id,
      name: o.name,
      place: o.place,
      status: o.status,
      targetRaise: formatMoneyCompact(o.targetRaise),
      raisedPercent:
        o.targetRaise > 0
          ? Math.min(100, Math.round((o.raisedToDate / o.targetRaise) * 100))
          : 0,
      closesOn: formatPortalDate(o.closesOn),
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
              Manage investor accounts, developments and their SPV cap tables,
              project returns, monthly project reports, insight articles and upcoming
              investments — or import a full JSON dataset. Portfolio figures
              are derived from the cap tables, so changes appear immediately
              in the investor platform.{" "}
              <Link
                href="/admin"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Back to the admin home
              </Link>
              .
            </p>
            {isGitHubPersistenceEnabled() ? (
              <p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted">
                Changes are committed straight to the repository and go live
                when the automatic deployment finishes (about a minute) — a
                just-saved change may briefly not show in these lists yet.
              </p>
            ) : process.env.VERCEL ? (
              <p className="mt-4 max-w-2xl text-xs leading-relaxed text-clay">
                This hosting has read-only storage and no repository token, so
                changes made here will not save. Set SATIS_GITHUB_TOKEN in the
                hosting environment — see the operations guide.
              </p>
            ) : null}
            <div className="mt-12">
              <AdminPlatform data={buildAdminData()} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
