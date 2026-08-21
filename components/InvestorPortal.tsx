"use client";

import { useState } from "react";
import type { InsightBlock, InvestorTier } from "@/lib/investor-platform";
import { InvestorMap } from "@/components/InvestorMap";

type Section =
  | "overview"
  | "portfolio"
  | "developments"
  | "opportunities"
  | "market"
  | "insights"
  | "reports"
  | "financials"
  | "documents";

// ---------------------------------------------------------------------------
// Navigation
//
// The sidebar is grouped rather than flat so the platform reads as separate
// concerns: an account's own money, the reporting published to it, and the
// research anyone signed in can read. Prospective accounts see the pipeline,
// the data room and the research; everything tied to a position in a vehicle
// (cap tables, financials, monthly project reports) belongs to investors who
// have actually invested, and those accounts additionally get a portfolio
// dropdown that jumps straight to a single investment.

type NavItem = { id: Section; label: string; icon: string };
type NavGroup = { heading: string; items: NavItem[] };

const NAV_GROUPS: Record<InvestorTier, NavGroup[]> = {
  prospective: [
    {
      heading: "Investing with us",
      items: [
        { id: "overview", label: "Overview", icon: "\u2302" },
        { id: "opportunities", label: "Upcoming investments", icon: "\u25c8" },
        { id: "documents", label: "Data room", icon: "\u25a1" },
      ],
    },
    {
      heading: "Research",
      items: [
        { id: "developments", label: "Track record", icon: "\u25c7" },
        { id: "market", label: "Market intelligence", icon: "\u2197" },
        { id: "insights", label: "Insights", icon: "\u2261" },
      ],
    },
  ],
  invested: [
    {
      heading: "Your investments",
      items: [
        { id: "overview", label: "Overview", icon: "\u2302" },
        { id: "portfolio", label: "My portfolio", icon: "\u25c6" },
        { id: "financials", label: "Financials", icon: "\u00a3" },
      ],
    },
    {
      heading: "Reporting",
      items: [
        { id: "reports", label: "Monthly reports", icon: "\u25cb" },
        { id: "documents", label: "Documents", icon: "\u25a1" },
      ],
    },
    {
      heading: "Research",
      items: [
        { id: "developments", label: "All developments", icon: "\u25c7" },
        { id: "market", label: "Market intelligence", icon: "\u2197" },
        { id: "insights", label: "Insights", icon: "\u2261" },
      ],
    },
  ],
};

/** Every section a tier is allowed to open, in sidebar order. */
function navItems(tier: InvestorTier): NavItem[] {
  return NAV_GROUPS[tier].flatMap((group) => group.items);
}

const ENQUIRY_EMAIL = "info@satisgroup.co.uk";

/** mailto: for a specific question, so nothing on the page is a dead click. */
function mailto(subject: string, body?: string): string {
  const query = new URLSearchParams({ subject });
  if (body) query.set("body", body);
  return `mailto:${ENQUIRY_EMAIL}?${query.toString().replace(/\+/g, "%20")}`;
}

// Everything the portal renders arrives pre-formatted from the server page,
// which assembles it per signed-in investor from content/investors/*.json.
export type PortalData = {
  accountName: string;
  tier: InvestorTier;
  greeting: string;
  lastUpdated: string;
  stats: { label: string; value: string; note: string }[];
  valueHistory: { label: string; value: number }[];
  developments: {
    id: string;
    name: string;
    place: string;
    address: string;
    lat: number;
    lng: number;
    status: string;
    progress: number;
    value: string;
    phase: string;
    nextReport: string;
    summary: string;
    latestReport?: { title: string; period: string; file?: string };
    /** Vehicle detail is assembled for invested accounts only. */
    spv?: {
      name: string;
      equityValue: string;
      totalCommitted: string;
      seniorDebt: string;
      forecastIrr: string;
    };
    capTable: { holder: string; sharePercent: string; committed: string; isYou: boolean }[];
    yourPosition?: { sharePercent: string; committed: string; currentValue: string };
  }[];
  /**
   * One entry per cap-table position the account holds, carrying the
   * private file library behind the per-investment My Portfolio tabs.
   * Assembled for invested accounts only.
   */
  portfolio: {
    developmentId: string;
    name: string;
    spvName: string;
    place: string;
    status: string;
    phase: string;
    progress: number;
    nextReport: string;
    position: {
      sharePercent: string;
      committed: string;
      currentValue: string;
      forecastIrr: string;
      multiple: string;
      status: string;
    };
    files: {
      title: string;
      kind: string;
      category?: "legal" | "meetings" | "accounts";
      summary?: string;
      file?: string;
      published: string;
    }[];
  }[];
  holdings: {
    name: string;
    spvName: string;
    share: string;
    invested: string;
    currentValue: string;
    forecastIrr: string;
    multiple: string;
    status: string;
  }[];
  financialsHeadline: { value: string; delta: string };
  upcomingEvents: { date: string; type: string; amount: string }[];
  reports: {
    developmentId: string;
    date: string;
    period: string;
    site: string;
    title: string;
    body: string;
    tag: string;
    file?: string;
    tasks: { title: string; detail?: string; status?: string }[];
  }[];
  insights: {
    slug: string;
    category: string;
    date: string;
    title: string;
    summary: string;
    read: string;
    theme: "dark" | "sand" | "sage";
    body: InsightBlock[];
  }[];
  documents: {
    title: string;
    kind: string;
    published: string;
    summary?: string;
    file?: string;
  }[];
  opportunities: {
    id: string;
    name: string;
    place: string;
    address: string;
    status: "Open" | "Coming soon" | "Fully subscribed";
    targetRaise: string;
    raisedToDate: string;
    raisedPercent: number;
    minCommitment: string;
    targetIrr: string;
    targetMultiple: string;
    horizon: string;
    closesOn: string;
    structure: string;
    summary: string;
    highlights: string[];
  }[];
  market: {
    regions: {
      label: string;
      averagePrice: string;
      annualChange: string;
      rentPcm: string;
      grossYield: string;
    }[];
    badge: string;
    attribution: string;
    live: boolean;
  };
};

const INSIGHT_THEME: Record<PortalData["insights"][number]["theme"], string> = {
  dark: "#1f1f1f",
  sand: "#b7ab92",
  sage: "#7f8b7a",
};

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

/** Placeholder action for demo data: no dead clicks, no fake downloads. */
function DemoAction({ label, className }: { label: string; className: string }) {
  const [noted, setNoted] = useState(false);
  return (
    <button
      type="button"
      className={className}
      aria-live="polite"
      onClick={() => {
        setNoted(true);
        setTimeout(() => setNoted(false), 2200);
      }}
    >
      {noted ? "Demo only" : label}
    </button>
  );
}

/**
 * Download control: a real link once a file has been uploaded against the
 * record, and the demo placeholder until then.
 */
function DownloadAction({
  file,
  label = "Download ↓",
  className,
}: {
  file?: string;
  label?: string;
  className: string;
}) {
  if (!file) return <DemoAction label={label} className={className} />;
  return (
    <a href={file} download className={className}>
      {label}
    </a>
  );
}

/** SVG path for a value series inside a w×h viewBox, padded top and bottom. */
function linePath(values: number[], w: number, h: number, pad = 16): string {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - pad - ((value - min) / span) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

// ---------------------------------------------------------------------------
// Time horizons (D): both charts share the same range selector.

const HORIZONS: { id: string; label: string; quarters: number }[] = [
  { id: "1y", label: "1Y", quarters: 4 },
  { id: "3y", label: "3Y", quarters: 12 },
  { id: "5y", label: "5Y", quarters: 20 },
  { id: "max", label: "Max", quarters: Infinity },
];

function useHorizon(history: PortalData["valueHistory"]) {
  const available = HORIZONS.filter(
    (h, i) => i === 0 || history.length > (HORIZONS[i - 1]?.quarters ?? 0)
  );
  const [horizonId, setHorizonId] = useState("max");
  const active =
    available.find((h) => h.id === horizonId) ?? available[available.length - 1];
  const sliced =
    active.quarters === Infinity ? history : history.slice(-active.quarters);
  return { available, active, sliced, setHorizonId };
}

function HorizonPicker({
  options,
  activeId,
  onPick,
}: {
  options: { id: string; label: string }[];
  activeId: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex border border-[#d8d7d0]" role="group" aria-label="Chart time horizon">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onPick(o.id)}
          aria-pressed={activeId === o.id}
          className={`px-3 py-2 text-[10px] uppercase tracking-wider transition ${
            activeId === o.id
              ? "bg-[#121212] text-white"
              : "text-[#777e82] hover:bg-[#eee9df]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ValueChart({ history }: { history: PortalData["valueHistory"] }) {
  const { available, active, sliced, setHorizonId } = useHorizon(history);
  const path = linePath(sliced.map((p) => p.value), 700, 220);
  const labels =
    sliced.length < 2
      ? sliced.map((p) => p.label)
      : [...new Set([0, Math.floor(sliced.length / 3), Math.floor((sliced.length * 2) / 3), sliced.length - 1])].map(
          (i) => sliced[i].label
        );
  return (
    <section className="border border-[#d8d7d0] bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[.15em] uppercase text-[#747b7f]">Portfolio performance</p>
          <h2 className="mt-2 text-xl font-medium text-[#121212]">Value progression</h2>
        </div>
        <HorizonPicker options={available} activeId={active.id} onPick={setHorizonId} />
      </div>
      <div className="mt-10 h-56">
        {path ? (
          <svg viewBox="0 0 700 220" className="h-full w-full" aria-label={`Portfolio value chart, ${active.label} horizon`}>
            <g stroke="#e5e3dc" strokeWidth="1">{[20, 70, 120, 170, 220].map((y) => <line key={y} x1="0" x2="700" y1={y} y2={y} />)}</g>
            <path d={path} fill="none" stroke="#b18c4d" strokeWidth="3" />
            <path d={`${path} L700 220 L0 220Z`} fill="#b18c4d" opacity=".08" />
          </svg>
        ) : (
          <p className="text-sm text-[#858b8e]">Performance history will appear once your first valuation is recorded.</p>
        )}
      </div>
      <div className="flex justify-between text-[10px] text-[#858b8e]">{labels.map((l) => <span key={l}>{l}</span>)}</div>
    </section>
  );
}

function PerformanceBars({ history, headline }: { history: PortalData["valueHistory"]; headline: PortalData["financialsHeadline"] }) {
  const { available, active, sliced, setHorizonId } = useHorizon(history);
  const max = Math.max(...sliced.map((b) => b.value), 1);
  return (
    <section className="border border-[#d8d7d0] bg-white p-7 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#777e82]">Investment performance</p>
          <h2 className="mt-3 text-2xl text-[#121212]">{headline.value} <span className="text-sm text-[#687a64]">{headline.delta}</span></h2>
        </div>
        <HorizonPicker options={available} activeId={active.id} onPick={setHorizonId} />
      </div>
      <div className="mt-8 grid h-64 items-end gap-2 border-b border-[#d8d7d0]" style={{ gridTemplateColumns: `repeat(${Math.max(sliced.length, 1)}, minmax(0, 1fr))` }}>
        {sliced.map((b) => (
          <div key={b.label} className="group relative flex h-full items-end">
            <div className="w-full bg-[#b18c4d] opacity-80 transition group-hover:opacity-100" style={{ height: `${Math.round((b.value / max) * 100)}%` }} title={b.label} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[10px] text-[#858b8e]"><span>{sliced[0]?.label}</span><span>{sliced[sliced.length - 1]?.label}</span></div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
//
// One vertical, grouped menu on desktop; the same menu collapsed behind the
// current section's name on mobile, so a long nav no longer becomes a
// horizontally scrolling strip.

type NavCounts = Partial<Record<Section, number>>;

const NAV_ROW =
  "flex w-full items-center gap-3 px-4 py-3 text-left text-xs tracking-[.08em] transition";

function NavCount({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span className="bg-white/10 px-2 py-0.5 text-[10px] tabular-nums text-white/60">
      {count}
    </span>
  );
}

function NavRow({
  item,
  count,
  active,
  onClick,
}: {
  item: NavItem;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${NAV_ROW} ${
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span aria-hidden="true" className="w-5 text-center text-[#c4a262]">
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      <NavCount count={count} />
    </button>
  );
}

/**
 * My Portfolio, with a dropdown of the account's individual investments so a
 * position is one click away instead of a section plus a card hunt. The
 * parent row opens the section; the chevron only expands the list.
 */
function PortfolioNav({
  item,
  active,
  portfolio,
  selectedId,
  onPick,
}: {
  item: NavItem;
  active: boolean;
  portfolio: PortalData["portfolio"];
  selectedId: string;
  onPick: (developmentId?: string) => void;
}) {
  // Open by default: an invested account's positions are the whole point of
  // the platform, so the list is visible without a first click.
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div
        className={`flex items-center ${
          active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            onPick();
          }}
          aria-current={active ? "page" : undefined}
          className={`${NAV_ROW} transition hover:text-white ${
            active ? "text-white" : ""
          }`}
        >
          <span aria-hidden="true" className="w-5 text-center text-[#c4a262]">
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          <NavCount count={portfolio.length} />
        </button>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="investor-nav-portfolio"
          aria-label={open ? "Hide your investments" : "Show your investments"}
          className="px-3 py-3 text-[10px] text-white/40 transition hover:text-white"
        >
          <span aria-hidden="true">{open ? "\u25b4" : "\u25be"}</span>
        </button>
      </div>
      {open && (
        <ul
          id="investor-nav-portfolio"
          className="ml-6 mt-px border-l border-white/10 pl-1"
        >
          {portfolio.length === 0 && (
            <li className="px-3 py-2.5 text-[11px] leading-5 text-white/35">
              No positions yet.
            </li>
          )}
          {portfolio.map((p) => {
            const current = active && p.developmentId === selectedId;
            return (
              <li key={p.developmentId}>
                <button
                  type="button"
                  onClick={() => onPick(p.developmentId)}
                  aria-current={current ? "true" : undefined}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[11px] transition ${
                    current
                      ? "bg-white/10 text-white"
                      : "text-white/45 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="shrink-0 tabular-nums text-[10px] text-[#c4a262]">
                    {p.position.sharePercent}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Sidebar({
  accountName,
  tier,
  active,
  setActive,
  logout,
  portfolio,
  selectedInvestmentId,
  goPortfolio,
  counts,
}: {
  accountName: string;
  tier: InvestorTier;
  active: Section;
  setActive: (s: Section) => void;
  logout: () => Promise<void>;
  portfolio: PortalData["portfolio"];
  selectedInvestmentId: string;
  goPortfolio: (developmentId?: string) => void;
  counts: NavCounts;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeLabel =
    navItems(tier).find((item) => item.id === active)?.label ?? "Overview";
  const pick = (section: Section) => {
    setActive(section);
    setMenuOpen(false);
  };
  const pickInvestment = (developmentId?: string) => {
    goPortfolio(developmentId);
    setMenuOpen(false);
  };
  const signOut = (
    <button
      type="submit"
      className="text-xs tracking-[.14em] uppercase text-white/45 transition hover:text-white"
    >
      {"\u2190 Sign out"}
    </button>
  );
  return (
    <aside className="border-r border-[#d8d7d0] bg-[#121212] text-white lg:sticky lg:top-20 lg:flex lg:h-[calc(100vh-5rem)] lg:flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[.28em] uppercase text-[#c4a262]">
            {tier === "invested" ? "Investor account" : "Prospective investor"}
          </p>
          <p className="mt-2 truncate text-sm">{accountName}</p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="investor-nav"
          className="flex shrink-0 items-center gap-2 border border-white/15 px-3 py-2 text-[10px] uppercase tracking-[.14em] text-white/70 transition hover:border-white/40 hover:text-white lg:hidden"
        >
          {activeLabel}
          <span aria-hidden="true">{menuOpen ? "\u25b4" : "\u25be"}</span>
        </button>
      </div>
      <div
        id="investor-nav"
        className={`${
          menuOpen ? "block" : "hidden"
        } border-b border-white/10 lg:block lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:border-b-0`}
      >
        <nav className="p-3 lg:p-4" aria-label="Investor platform">
          {NAV_GROUPS[tier].map((group) => (
            <div key={group.heading} className="mb-5 last:mb-0">
              <p className="px-4 pb-2 text-[9px] tracking-[.22em] uppercase text-white/30">
                {group.heading}
              </p>
              <div className="space-y-px">
                {group.items.map((item) =>
                  item.id === "portfolio" ? (
                    <PortfolioNav
                      key={item.id}
                      item={item}
                      active={active === "portfolio"}
                      portfolio={portfolio}
                      selectedId={selectedInvestmentId}
                      onPick={pickInvestment}
                    />
                  ) : (
                    <NavRow
                      key={item.id}
                      item={item}
                      count={counts[item.id]}
                      active={active === item.id}
                      onClick={() => pick(item.id)}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </nav>
        <form action={logout} className="border-t border-white/10 p-5 lg:hidden">
          {signOut}
        </form>
      </div>
      <form
        action={logout}
        className="hidden border-t border-white/10 p-5 lg:block"
      >
        {signOut}
      </form>
    </aside>
  );
}

function PageTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <header className="mb-9"><p className="text-[10px] tracking-[.25em] uppercase text-[#96723d]">{eyebrow}</p><h1 className="mt-3 text-3xl font-medium tracking-[-.025em] text-[#121212] sm:text-4xl">{title}</h1>{copy && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687077]">{copy}</p>}</header>;
}

const PROSPECT_STEPS = [
  {
    step: "01",
    title: "Review the memorandum",
    body: "The data room holds our investment memorandum, the appraisal for each raise and a guide to how our vehicles are structured.",
  },
  {
    step: "02",
    title: "Talk it through",
    body: "Ask us anything about a scheme, its costs or its programme. We would rather answer twenty questions now than one after the event.",
  },
  {
    step: "03",
    title: "Commit to a raise",
    body: "Register interest against an open raise. Allocations are confirmed in order of registration, subject to suitability.",
  },
];

/** Prospective accounts: the pipeline, the data room and how to invest. */
function ProspectOverview({ data, go }: { data: PortalData; go: (s: Section) => void }) {
  const openOpportunity = data.opportunities.find((o) => o.status === "Open");
  return <>
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><PageTitle eyebrow="Prospective investor" title={data.greeting} copy="You have access to the material behind our current raises. Review it at your own pace, ask us anything, and commit when you are ready." /><div className="mb-9 text-right text-xs text-[#7c8285]"><span className="mb-1 block uppercase tracking-[.16em]">Last updated</span>{data.lastUpdated}</div></div>
    <div className="grid gap-px overflow-hidden border border-[#d8d7d0] bg-[#d8d7d0] sm:grid-cols-2 xl:grid-cols-4">
      {data.stats.map((x,i)=><div key={x.label} className="bg-white p-6"><div className="flex justify-between text-[10px] tracking-[.16em] uppercase text-[#777e82]"><span>{x.label}</span><span>0{i+1}</span></div><p className="mt-6 text-3xl font-medium tracking-tight text-[#121212]">{x.value}</p><p className="mt-2 text-xs text-[#617260]">{x.note}</p></div>)}
    </div>
    {openOpportunity && (
      <button onClick={() => go("opportunities")} className="mt-6 flex w-full flex-wrap items-center justify-between gap-3 border border-[#c9b98f] bg-[#f3ecdc] px-6 py-4 text-left transition hover:border-[#b18c4d]">
        <span className="text-sm text-[#4f4633]"><b className="mr-2 bg-[#b18c4d] px-2 py-1 text-[10px] uppercase tracking-wider text-white">Now raising</b>{openOpportunity.name}, {openOpportunity.place} — target {openOpportunity.targetIrr} IRR · closes {openOpportunity.closesOn}</span>
        <span className="text-[10px] uppercase tracking-[.16em] text-[#8a6c3f]">View opportunity →</span>
      </button>
    )}
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
      <section className="border border-[#d8d7d0] bg-white p-7 sm:p-9">
        <p className="text-xs tracking-[.15em] uppercase text-[#747b7f]">How investing with us works</p>
        <div className="mt-8 space-y-7">
          {PROSPECT_STEPS.map((s) => (
            <div key={s.step} className="border-t border-[#e5e3dc] pt-5 first:border-0 first:pt-0">
              <span className="text-[10px] tracking-[.2em] text-[#b18c4d]">{s.step}</span>
              <h3 className="mt-2 text-lg font-medium text-[#121212]">{s.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#687077]">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap gap-3">
          <button onClick={() => go("documents")} className="bg-[#121212] px-6 py-3.5 text-xs tracking-[.15em] uppercase text-white transition hover:bg-[#b18c4d]">Open the data room →</button>
          <button onClick={() => go("opportunities")} className="border border-[#d8d7d0] px-6 py-3.5 text-xs tracking-[.15em] uppercase text-[#121212] transition hover:border-[#b18c4d]">See what we are raising for →</button>
        </div>
      </section>
      <section className="bg-[#121212] p-7 text-white">
        <p className="text-[10px] tracking-[.18em] uppercase text-[#c4a262]">Your questions, answered</p>
        <h2 className="mt-5 text-2xl leading-8">Speak to the people running the schemes.</h2>
        <p className="mt-5 text-sm leading-6 text-white/60">Appraisals, programme, funding structure, exit assumptions: ask us directly and you will get an answer from the team delivering the project, not a call centre.</p>
        <a href={mailto("Investor question", "Hello Satis Group,\n\nMy question is:\n")} className="mt-8 inline-block bg-[#b18c4d] px-6 py-3.5 text-xs tracking-[.15em] uppercase text-white transition hover:bg-[#c3a164]">Ask a question →</a>
        {data.documents.length > 0 && (
          <div className="mt-10 border-t border-white/10 pt-7">
            <p className="text-[10px] tracking-[.18em] uppercase text-[#c4a262]">Latest in your data room</p>
            <ul className="mt-5 space-y-4">
              {data.documents.slice(0, 3).map((doc) => (
                <li key={doc.title}>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">{doc.kind} · {doc.published}</p>
                  <p className="mt-1 text-sm text-white/85">{doc.title}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => go("documents")} className="mt-6 text-[10px] tracking-[.16em] uppercase text-[#c4a262]">Open the data room →</button>
          </div>
        )}
      </section>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">{data.developments.slice(0,3).map(d=><article key={d.name} className="border border-[#d8d7d0] bg-white p-6"><div className="flex justify-between"><span className="text-[10px] uppercase tracking-[.14em] text-[#6b7969]">{d.status}</span><span className="text-xs text-[#8a8e90]">{d.progress}%</span></div><h3 className="mt-5 text-lg font-medium text-[#121212]">{d.name}</h3><p className="mt-1 text-xs text-[#83888b]">{d.place} · {d.phase}</p><div className="mt-6 h-1 bg-[#e6e3dc]"><div className="h-full bg-[#b18c4d]" style={{width:`${d.progress}%`}} /></div></article>)}</div>
  </>;
}

/**
 * Invested accounts: portfolio headline, value progression, latest reporting
 * and a card per position that opens that investment in My Portfolio.
 */
function Overview({ data, go, goPortfolio }: { data: PortalData; go: (s: Section) => void; goPortfolio: (developmentId?: string) => void }) {
  return <>
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><PageTitle eyebrow="Portfolio overview" title={data.greeting} copy="Here’s what’s happening across your Satis Group portfolio." /><div className="mb-9 text-right text-xs text-[#7c8285]"><span className="mb-1 block uppercase tracking-[.16em]">Last updated</span>{data.lastUpdated}</div></div>
    <div className="grid gap-px overflow-hidden border border-[#d8d7d0] bg-[#d8d7d0] sm:grid-cols-2 xl:grid-cols-4">
      {data.stats.map((x,i)=><div key={x.label} className="bg-white p-6"><div className="flex justify-between text-[10px] tracking-[.16em] uppercase text-[#777e82]"><span>{x.label}</span><span>0{i+1}</span></div><p className="mt-6 text-3xl font-medium tracking-tight text-[#121212]">{x.value}</p><p className="mt-2 text-xs text-[#617260]">{x.note}</p></div>)}
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
      <ValueChart history={data.valueHistory} />
      <section className="bg-[#121212] p-7 text-white"><p className="text-[10px] tracking-[.18em] uppercase text-[#c4a262]">Latest reports</p><div className="mt-6 space-y-6">{data.reports.slice(0,3).map((r,i)=><div key={r.title} className={i<2?"border-b border-white/10 pb-6":""}><p className="text-[10px] uppercase tracking-wider text-white/40">{r.period} · {r.site}</p><p className="mt-2 text-sm">{r.title}</p></div>)}{data.reports.length === 0 && <p className="text-sm text-white/55">Your first monthly report will appear here.</p>}</div><button onClick={()=>go("reports")} className="mt-8 text-[10px] tracking-[.16em] uppercase text-[#c4a262]">View monthly reports →</button></section>
    </div>
    {data.portfolio.length > 0 ? (
      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[.2em] uppercase text-[#96723d]">Your investments</p>
            <h2 className="mt-2 text-xl font-medium text-[#121212]">{data.portfolio.length} position{data.portfolio.length === 1 ? "" : "s"} across our vehicles.</h2>
          </div>
          <button onClick={()=>goPortfolio()} className="text-[10px] tracking-[.16em] uppercase text-[#8a6c3f] transition hover:text-[#121212]">Open my portfolio →</button>
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          {data.portfolio.slice(0,3).map((p)=>(
            <button key={p.developmentId} onClick={()=>goPortfolio(p.developmentId)} className="border border-[#d8d7d0] bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-[#b18c4d] hover:shadow-lg hover:shadow-[#121212]/5">
              <div className="flex justify-between"><span className="text-[10px] uppercase tracking-[.14em] text-[#6b7969]">{p.status}</span><span className="text-xs text-[#8a8e90]">{p.position.sharePercent} held</span></div>
              <h3 className="mt-5 text-lg font-medium text-[#121212]">{p.name}</h3>
              <p className="mt-1 text-xs text-[#83888b]">{p.spvName} · {p.phase}</p>
              <div className="mt-6 h-1 bg-[#e6e3dc]"><div className="h-full bg-[#b18c4d]" style={{width:`${p.progress}%`}} /></div>
              <div className="mt-5 flex items-end justify-between border-t border-[#ebe9e3] pt-4"><span className="text-lg font-medium text-[#121212]">{p.position.currentValue}</span><span className="text-[10px] uppercase tracking-wider text-[#8a6c3f]">View investment →</span></div>
            </button>
          ))}
        </div>
        {data.portfolio.length > 3 && <button onClick={()=>goPortfolio()} className="mt-5 text-[10px] tracking-[.16em] uppercase text-[#8a6c3f] transition hover:text-[#121212]">View all {data.portfolio.length} investments →</button>}
      </section>
    ) : (
      <div className="mt-6 grid gap-6 lg:grid-cols-3">{data.developments.slice(0,3).map(d=><article key={d.name} className="border border-[#d8d7d0] bg-white p-6"><div className="flex justify-between"><span className="text-[10px] uppercase tracking-[.14em] text-[#6b7969]">{d.status}</span><span className="text-xs text-[#8a8e90]">{d.progress}%</span></div><h3 className="mt-5 text-lg font-medium text-[#121212]">{d.name}</h3><p className="mt-1 text-xs text-[#83888b]">{d.place} · {d.phase}</p><div className="mt-6 h-1 bg-[#e6e3dc]"><div className="h-full bg-[#b18c4d]" style={{width:`${d.progress}%`}} /></div></article>)}</div>
    )}
  </>;
}

function Developments({ developments, tier, go }: { developments: PortalData["developments"]; tier: InvestorTier; go: (s: Section) => void }) {
  const [selectedId, setSelectedId] = useState(developments[0]?.id ?? "");
  const d = developments.find((x) => x.id === selectedId) ?? developments[0];
  if (!d) return <PageTitle eyebrow="Live portfolio" title="No developments yet." copy="Developments will appear here as they are added to the platform." />;
  const invested = tier === "invested";
  return <><PageTitle eyebrow="Live portfolio" title="Developments across Greater Manchester." copy={invested ? "Every Satis Group site on the map — select a pin or a row for programme, SPV and cap-table detail." : "Every Satis Group site on the map — select a pin or a row for the programme behind our track record."} />
    <div className="grid overflow-hidden border border-[#d8d7d0] bg-white xl:grid-cols-[1.35fr_.85fr]">
      <InvestorMap sites={developments} selectedId={d.id} onSelect={setSelectedId} />
      <div className="p-7 sm:p-9">
        <p className="text-[10px] tracking-[.18em] uppercase text-[#8a6c3f]">Selected development</p>
        <h2 className="mt-4 text-2xl font-medium text-[#121212]">{d.name}</h2>
        <p className="mt-1 text-sm text-[#737a7e]">{d.address}</p>
        <p className="mt-5 text-sm leading-6 text-[#687077]">{d.summary}</p>
        <div className="my-7 border-y border-[#deddd7] py-6"><div className="flex justify-between text-xs"><span>Overall progress</span><b>{d.progress}%</b></div><div className="mt-3 h-1 bg-[#e2e0d9]"><div className="h-full bg-[#b18c4d]" style={{width:`${d.progress}%`}} /></div></div>
        <dl className="grid grid-cols-2 gap-6 text-sm">
          <div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Current phase</dt><dd className="mt-2">{d.phase}</dd></div>
          <div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Gross value</dt><dd className="mt-2">{d.value}</dd></div>
          <div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Programme</dt><dd className="mt-2 text-[#667b62]">{d.status}</dd></div>
          <div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Next report</dt><dd className="mt-2">{d.nextReport}</dd></div>
        </dl>
        {d.spv && (
          <div className="mt-7 border border-[#deddd7] bg-[#faf8f3] p-5">
            <p className="text-[10px] uppercase tracking-[.16em] text-[#8a6c3f]">Investment vehicle</p>
            <p className="mt-2 text-sm font-medium text-[#121212]">{d.spv.name}</p>
            <dl className="mt-4 grid grid-cols-3 gap-4 text-xs text-[#737a7e]">
              <div><dt className="text-[10px] uppercase tracking-wider text-[#a0a5a8]">SPV equity</dt><dd className="mt-1 text-sm text-[#121212]">{d.spv.equityValue}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-wider text-[#a0a5a8]">Senior debt</dt><dd className="mt-1 text-sm text-[#121212]">{d.spv.seniorDebt}</dd></div>
              <div><dt className="text-[10px] uppercase tracking-wider text-[#a0a5a8]">Site IRR</dt><dd className="mt-1 text-sm text-[#121212]">{d.spv.forecastIrr}</dd></div>
            </dl>
            {d.yourPosition && <p className="mt-4 border-t border-[#e5e0d3] pt-3 text-xs text-[#617260]">Your position: <b>{d.yourPosition.sharePercent}</b> of the vehicle · {d.yourPosition.committed} committed · currently {d.yourPosition.currentValue}</p>}
            <table className="mt-4 w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-[#a0a5a8]"><tr><th className="pb-2 font-normal">Cap table</th><th className="pb-2 font-normal">Committed</th><th className="pb-2 text-right font-normal">Holding</th></tr></thead>
              <tbody>{d.capTable.map((row)=><tr key={row.holder} className={`border-t border-[#ece8dd] ${row.isYou ? "font-medium text-[#121212]" : "text-[#737a7e]"}`}><td className="py-2">{row.holder}{row.isYou && <span className="ml-2 bg-[#b18c4d] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white">You</span>}</td><td className="py-2">{row.committed}</td><td className="py-2 text-right">{row.sharePercent}</td></tr>)}</tbody>
            </table>
          </div>
        )}
        {invested ? (
          <div className="mt-7 border border-[#deddd7] bg-[#faf8f3] p-5">
            <p className="text-[10px] uppercase tracking-[.16em] text-[#8a6c3f]">Latest monthly report</p>
            <p className="mt-2 text-sm font-medium text-[#121212]">{d.latestReport ? `${d.latestReport.period} · ${d.latestReport.title}` : "The first monthly report for this site is still to come."}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => go("reports")} className="border border-[#d8d7d0] px-4 py-3 text-[10px] tracking-[.15em] uppercase text-[#121212] transition hover:border-[#b18c4d]">View monthly report →</button>
              {d.latestReport && <DownloadAction file={d.latestReport.file} label="Download report ↓" className="border border-[#d8d7d0] px-4 py-3 text-[10px] tracking-[.15em] uppercase text-[#8a6c3f] transition hover:border-[#b18c4d]" />}
            </div>
          </div>
        ) : (
          <a href={mailto(`Investor question: ${d.name}`, `Hello Satis Group,\n\nI would like to know more about ${d.name}.\n`)} className="shimmer-btn mt-7 block w-full bg-[#121212] px-5 py-4 text-center text-xs tracking-[.15em] uppercase text-white transition hover:bg-[#b18c4d]">Ask about this scheme →</a>
        )}
      </div>
    </div>
    <div className="mt-6 overflow-x-auto border border-[#d8d7d0] bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-[#d8d7d0] text-[10px] uppercase tracking-wider text-[#858b8e]"><tr>{["Development","Address","Phase","Programme","Progress"].map(h=><th key={h} className="px-6 py-4 font-normal">{h}</th>)}</tr></thead>
        <tbody>{developments.map((row)=><tr key={row.id} onClick={()=>setSelectedId(row.id)} className={`cursor-pointer border-b border-[#ebe9e3] transition last:border-0 hover:bg-[#faf8f3] ${row.id===d.id?"bg-[#f3ecdc]":""}`}><td className="px-6 py-4 font-medium text-[#121212]">{row.name}</td><td className="px-6 py-4 text-xs text-[#737a7e]">{row.address}</td><td className="px-6 py-4">{row.phase}</td><td className="px-6 py-4 text-[#667b62]">{row.status}</td><td className="px-6 py-4">{row.progress}%</td></tr>)}</tbody>
      </table>
    </div>
  </>;
}

function Opportunities({ opportunities }: { opportunities: PortalData["opportunities"] }) {
  const chip: Record<string, string> = {
    Open: "bg-[#5d7157] text-white",
    "Coming soon": "bg-[#b18c4d] text-white",
    "Fully subscribed": "bg-[#d8d7d0] text-[#62696d]",
  };
  return <><PageTitle eyebrow="Deal flow" title="Upcoming investments." copy="Current and forthcoming Satis Group single-asset raises. Allocations are confirmed in order of registration, subject to suitability." />
    <div className="space-y-6">{opportunities.map((o)=>(
      <article key={o.id} className="grid border border-[#d8d7d0] bg-white lg:grid-cols-[1.15fr_.85fr]">
        <div className="p-7 sm:p-9">
          <div className="flex flex-wrap items-center gap-3"><span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider ${chip[o.status]}`}>{o.status}</span><span className="text-[10px] uppercase tracking-[.16em] text-[#96723d]">{o.place}</span></div>
          <h2 className="mt-4 text-2xl font-medium text-[#121212]">{o.name}</h2>
          <p className="mt-1 text-xs text-[#8a8e90]">{o.address}</p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#687077]">{o.summary}</p>
          <ul className="mt-5 space-y-2">{o.highlights.map((h)=><li key={h} className="flex gap-3 text-sm leading-6 text-[#4f585d]"><span aria-hidden="true" className="mt-[.65em] h-px w-5 shrink-0 bg-[#b18c4d]" />{h}</li>)}</ul>
          <p className="mt-5 text-xs text-[#858b8e]">{o.structure}</p>
        </div>
        <div className="border-t border-[#e5e3dc] bg-[#faf8f3] p-7 sm:p-9 lg:border-l lg:border-t-0">
          <div className="grid grid-cols-2 gap-6">
            {[["Target raise",o.targetRaise],["Min commitment",o.minCommitment],["Target IRR",o.targetIrr],["Target multiple",o.targetMultiple],["Horizon",o.horizon],[o.status==="Coming soon"?"Expected launch":"Closes",o.closesOn]].map(([l,v])=><div key={l as string}><p className="text-[10px] uppercase tracking-wider text-[#a0a5a8]">{l}</p><p className="mt-1 text-lg font-medium text-[#121212]">{v}</p></div>)}
          </div>
          {o.status !== "Coming soon" && (
            <div className="mt-7">
              <div className="flex justify-between text-xs text-[#737a7e]"><span>{o.raisedToDate} committed</span><b>{o.raisedPercent}%</b></div>
              <div className="mt-2 h-1.5 bg-[#e6e3dc]"><div className="h-full bg-[#5d7157]" style={{width:`${o.raisedPercent}%`}} /></div>
            </div>
          )}
          {o.status === "Fully subscribed" ? (
            <p className="mt-7 text-xs leading-5 text-[#858b8e]">This raise is closed. Quarterly reporting will appear in the developments and documents sections.</p>
          ) : (
            <a href={`mailto:info@satisgroup.co.uk?subject=${encodeURIComponent(`Investor interest: ${o.name}, ${o.place}`)}`} className="shimmer-btn mt-7 block w-full bg-[#121212] px-5 py-4 text-center text-xs tracking-[.15em] uppercase text-white transition hover:bg-[#b18c4d]">
              {o.status === "Open" ? "Register interest →" : "Join the launch list →"}
            </a>
          )}
        </div>
      </article>
    ))}</div>
    <p className="mt-6 text-[10px] leading-5 text-[#858b8e]">Capital at risk. Target returns are not guaranteed and past performance is not a reliable indicator of future results. Investments are unlisted, illiquid and available to eligible investors only; nothing on this page is financial advice.</p>
  </>;
}

function Market({ market }: { market: PortalData["market"] }) {
  return <><PageTitle eyebrow="Greater Manchester" title="Market intelligence." copy="The indicators shaping residential and commercial real estate decisions across the city region." />
    <div className={`mb-6 flex flex-wrap items-center gap-3 border-l-2 px-5 py-4 text-xs leading-5 ${market.live ? "border-[#5d7157] bg-[#eef0e9] text-[#4a5546]" : "border-[#b18c4d] bg-[#eee9df] text-[#62696d]"}`}>
      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider text-white ${market.live ? "bg-[#5d7157]" : "bg-[#b18c4d]"}`}>{market.live ? "Live data" : "Snapshot"}</span>
      {market.badge}
    </div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{market.regions.map((r)=><div key={r.label} className="border border-[#d8d7d0] bg-white p-6"><p className="text-[10px] tracking-[.14em] uppercase text-[#7c8386]">{r.label}</p><p className="mt-5 text-3xl font-medium text-[#121212]">{r.averagePrice}</p><p className="mt-1 text-xs text-[#6b7969]">{r.annualChange} · 12 months</p><dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[#ebe9e3] pt-4 text-xs text-[#737a7e]"><div><dt className="text-[10px] uppercase tracking-wider text-[#a0a5a8]">Rent pcm</dt><dd className="mt-1 text-sm text-[#121212]">{r.rentPcm}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-[#a0a5a8]">Gross yield</dt><dd className="mt-1 text-sm text-[#121212]">{r.grossYield}</dd></div></dl></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
      <section className="border border-[#d8d7d0] bg-white p-7"><p className="text-xs tracking-[.15em] uppercase text-[#737a7e]">Submarket comparison</p><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-[#d8d7d0] text-[10px] uppercase tracking-wider text-[#858b8e]"><tr>{["Location","House price","12m change","Rent pcm","Gross yield"].map(x=><th key={x} className="pb-3 font-normal">{x}</th>)}</tr></thead><tbody>{market.regions.map(r=><tr key={r.label} className="border-b border-[#ebe9e3] last:border-0"><td className="py-4">{r.label}</td><td>{r.averagePrice}</td><td className="text-[#63775e]">{r.annualChange}</td><td>{r.rentPcm}</td><td>{r.grossYield}</td></tr>)}</tbody></table></div></section>
      <section className="bg-[#121212] p-7 text-white"><p className="text-[10px] tracking-[.18em] uppercase text-[#c4a262]">Satis Group view</p><h2 className="mt-5 text-2xl leading-8">Selective optimism in a supply-constrained market.</h2><p className="mt-5 text-sm leading-6 text-white/60">We remain focused on connected neighbourhoods where high-quality converted stock can meet resilient occupier demand.</p><div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-xs text-white/70"><p>01 &nbsp; Flight to quality continues</p><p>02 &nbsp; Rental demand remains resilient</p><p>03 &nbsp; Build-cost inflation is moderating</p></div></section>
    </div>
    <div className="mt-6 text-[10px] leading-5 text-[#858b8e]">{market.attribution}</div>
  </>;
}

// ---------------------------------------------------------------------------
// Insights (A): featured index + rich article reader.

function InsightBlockView({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="mt-12 text-2xl font-medium tracking-tight text-[#121212] first:mt-0">{block.text}</h2>;
    case "list":
      return <ul className="mt-6 space-y-3">{block.items.map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-[#4f585d]"><span aria-hidden="true" className="mt-[.7em] h-px w-6 shrink-0 bg-[#b18c4d]" />{item}</li>)}</ul>;
    case "quote":
      return <figure className="mt-10 border-l-2 border-[#b18c4d] bg-[#faf8f3] px-7 py-6"><blockquote className="text-xl leading-9 text-[#3c444a]">“{block.text}”</blockquote>{block.attribution && <figcaption className="mt-3 text-[10px] uppercase tracking-[.16em] text-[#8a6c3f]">{block.attribution}</figcaption>}</figure>;
    case "stats":
      return <div className="mt-10 grid gap-px overflow-hidden border border-[#e2ddd0] bg-[#e2ddd0] sm:grid-cols-3">{block.items.map((s) => <div key={s.label} className="bg-[#faf8f3] p-6"><p className="text-3xl font-medium tracking-tight text-[#8a6c3f]">{s.value}</p><p className="mt-2 text-xs leading-5 text-[#687077]">{s.label}</p></div>)}</div>;
    case "table":
      return <div className="mt-10 overflow-x-auto border border-[#e2ddd0]"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-[#f3efe6] text-[10px] uppercase tracking-wider text-[#79613b]"><tr>{block.headers.map((h) => <th key={h} className="px-5 py-3 font-normal">{h}</th>)}</tr></thead><tbody>{block.rows.map((row, i) => <tr key={i} className="border-t border-[#ece8dd] text-[#4f585d]">{row.map((cell, j) => <td key={j} className={`px-5 py-3.5 ${j === 0 ? "font-medium text-[#121212]" : ""}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
    case "callout":
      return <aside className="mt-10 border border-[#c9b98f] bg-[#f3ecdc] p-6">{block.title && <p className="text-[10px] uppercase tracking-[.18em] text-[#8a6c3f]">{block.title}</p>}<p className="mt-2 text-sm leading-7 text-[#4f4633]">{block.text}</p></aside>;
    default:
      return <p className="mt-6 text-base leading-8 text-[#4f585d] first:mt-0">{block.text}</p>;
  }
}

function Insights({ insights }: { insights: PortalData["insights"] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openIndex = insights.findIndex((x) => x.slug === openSlug);
  const open = openIndex >= 0 ? insights[openIndex] : undefined;
  if (open) {
    const next = insights[(openIndex + 1) % insights.length];
    return <article className="mx-auto max-w-3xl">
      <button onClick={() => setOpenSlug(null)} className="mb-8 text-[10px] tracking-[.16em] uppercase text-[#8a6c3f] hover:text-[#121212]">← All insights</button>
      <div className="flex h-24 items-end p-5" style={{ backgroundColor: INSIGHT_THEME[open.theme] }}><span className="bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[.16em] text-[#121212]">{open.category}</span></div>
      <p className="mt-6 text-[10px] tracking-[.16em] uppercase text-[#96723d]">{open.date} · {open.read} read · Satis Group research team</p>
      <h1 className="mt-4 text-4xl font-medium leading-tight tracking-tight text-[#121212] sm:text-5xl">{open.title}</h1>
      <p className="mt-6 text-xl leading-9 text-[#626a6e]">{open.summary}</p>
      <div className="mt-8 border-t border-[#d8d7d0] pt-2">{open.body.map((block, i) => <InsightBlockView key={i} block={block} />)}</div>
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#d8d7d0] pt-8">
        <a href={`mailto:info@satisgroup.co.uk?subject=${encodeURIComponent(`Insight discussion: ${open.title}`)}`} className="shimmer-btn bg-[#121212] px-6 py-3.5 text-xs tracking-[.15em] uppercase text-white transition hover:bg-[#b18c4d]">Discuss with the team →</a>
        {next && next.slug !== open.slug && <button onClick={() => setOpenSlug(next.slug)} className="text-left text-xs text-[#737a7e] transition hover:text-[#121212]"><span className="block text-[10px] uppercase tracking-[.16em] text-[#8a6c3f]">Read next</span><span className="mt-1 block max-w-60 font-medium">{next.title}</span></button>}
      </div>
    </article>;
  }
  const [featured, ...rest] = insights;
  return <><PageTitle eyebrow="Research & perspective" title="Insights for considered investment." copy="Research notes, guides and perspectives from the Satis Group development and investment teams." />
    {featured && (
      <button type="button" onClick={() => setOpenSlug(featured.slug)} className="group grid w-full border border-[#d8d7d0] bg-white text-left transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#121212]/5 lg:grid-cols-[.9fr_1.1fr]">
        <span className="block min-h-40" style={{ backgroundColor: INSIGHT_THEME[featured.theme] }} aria-hidden="true" />
        <span className="block p-8 sm:p-10">
          <span className="text-[10px] tracking-[.16em] uppercase text-[#96723d]">Latest · {featured.category} · {featured.date}</span>
          <span className="mt-4 block text-2xl font-medium leading-8 tracking-tight text-[#121212] sm:text-3xl">{featured.title}</span>
          <span className="mt-4 block max-w-xl text-sm leading-6 text-[#747b7f]">{featured.summary}</span>
          <span className="mt-6 flex justify-between text-[10px] uppercase tracking-wider text-[#8a6c3f]"><span>{featured.read} read</span><ArrowIcon /></span>
        </span>
      </button>
    )}
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{rest.map((x)=><button type="button" onClick={() => setOpenSlug(x.slug)} key={x.slug} className="group flex min-h-[340px] flex-col border border-[#d8d7d0] bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#121212]/5"><span className="mb-7 block h-24 w-full" style={{ backgroundColor: INSIGHT_THEME[x.theme] }} aria-hidden="true" /><span className="text-[10px] tracking-[.16em] uppercase text-[#96723d]">{x.category} · {x.date}</span><span className="mt-4 block text-xl font-medium leading-7 text-[#121212]">{x.title}</span><span className="mt-4 block text-sm leading-6 text-[#747b7f]">{x.summary}</span><span className="mt-auto flex w-full justify-between pt-6 text-[10px] uppercase tracking-wider"><span>{x.read} read</span><ArrowIcon/></span></button>)}</div></>;
}

/** One monthly report card, shared by the Reports and My Portfolio views. */
function ReportArticle({ r }: { r: PortalData["reports"][number] }) {
  return (
    <article className="border border-[#d8d7d0] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ebe9e3] p-6 sm:p-7">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#8a6c3f]">{r.period} · {r.site}</p>
          <h2 className="mt-2 text-xl font-medium text-[#121212]">{r.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#737a7e]">{r.body}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className="w-fit bg-[#eee9df] px-3 py-2 text-[10px] uppercase tracking-wider text-[#79613b]">{r.tag}</span>
          <DownloadAction file={r.file} label="Download report ↓" className="border border-[#d8d7d0] px-4 py-3 text-[10px] tracking-[.15em] uppercase text-[#8a6c3f] transition hover:border-[#b18c4d]" />
        </div>
      </div>
      {r.tasks.length > 0 && (
        <ul className="divide-y divide-[#ebe9e3]">
          {r.tasks.map((task)=>(
            <li key={task.title} className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 sm:px-7">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-[#121212]">{task.title}</p>
                {task.detail && <p className="mt-1 text-sm leading-6 text-[#737a7e]">{task.detail}</p>}
              </div>
              <div className="flex items-center gap-4">
                {task.status && <span className="text-[10px] uppercase tracking-wider text-[#63775e]">{task.status}</span>}
                <a href={mailto(`${r.site} — ${r.period}: ${task.title}`, `Hello Satis Group,\n\nRegarding "${task.title}" in the ${r.period} report for ${r.site}:\n`)} className="text-[10px] uppercase tracking-wider text-[#8a6c3f] transition hover:text-[#121212]">Ask a question →</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/**
 * Monthly project reports. Each report is downloadable in full, and every
 * line item carries its own question link so an investor can query one task
 * without composing a summary of the whole month.
 */
function Reports({ reports }: { reports: PortalData["reports"] }) {
  return <><PageTitle eyebrow="From the ground" title="Monthly reports." copy="One report per site, per month: programme, cost and the individual items behind them. Download the full report, or ask us about any single task." />
    {reports.length === 0 && <p className="border border-[#d8d7d0] bg-white p-7 text-sm text-[#687077]">Your first monthly report will appear here as soon as it is published.</p>}
    <div className="space-y-5">{reports.map((r)=><ReportArticle key={`${r.date}-${r.title}`} r={r} />)}</div>
  </>;
}

// ---------------------------------------------------------------------------
// My Portfolio: one view per cap-table position, each with its own file
// library split across All files / Legal / Monthly reports / Shareholder
// meetings / Accounts tabs.

type PortfolioTab = "files" | "legal" | "reports" | "meetings" | "accounts";

const PORTFOLIO_TABS: { id: PortfolioTab; label: string }[] = [
  { id: "files", label: "All files" },
  { id: "legal", label: "Legal" },
  { id: "reports", label: "Monthly reports" },
  { id: "meetings", label: "Shareholder meetings" },
  { id: "accounts", label: "Accounts" },
];

/** Document table shared by the file tabs of an investment. */
function FileRows({
  files,
  action = "Download ↓",
  empty,
}: {
  files: PortalData["portfolio"][number]["files"];
  action?: string;
  empty: string;
}) {
  return (
    <div className="border border-[#d8d7d0] bg-white">
      <div className="grid grid-cols-[1fr_auto] border-b border-[#d8d7d0] px-6 py-4 text-[10px] uppercase tracking-wider text-[#858b8e] sm:grid-cols-[1fr_170px_150px]"><span>Document</span><span className="hidden sm:block">Published</span><span>Action</span></div>
      {files.length === 0 && <p className="px-6 py-7 text-sm text-[#687077]">{empty}</p>}
      {files.map((x)=>(
        <div key={x.title} className="grid grid-cols-[1fr_auto] items-center border-b border-[#ebe9e3] px-6 py-5 last:border-0 sm:grid-cols-[1fr_170px_150px]">
          <div>
            <p className="text-sm font-medium text-[#121212]">{x.title}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[#858b8e]">{x.kind}</p>
            {x.summary && <p className="mt-2 max-w-xl text-sm leading-6 text-[#737a7e]">{x.summary}</p>}
          </div>
          <span className="hidden text-xs text-[#777e82] sm:block">{x.published}</span>
          <DownloadAction file={x.file} label={action} className="text-xs uppercase tracking-wider text-[#8a6c3f]" />
        </div>
      ))}
    </div>
  );
}

function MyPortfolio({ portfolio, reports, selectedId, onSelect }: { portfolio: PortalData["portfolio"]; reports: PortalData["reports"]; selectedId: string; onSelect: (developmentId: string) => void }) {
  const [tab, setTab] = useState<PortfolioTab>("files");
  const inv = portfolio.find((p) => p.developmentId === selectedId) ?? portfolio[0];
  if (!inv) {
    return <PageTitle eyebrow="My portfolio" title="No positions yet." copy="Your investments will appear here once you hold a position in one of our vehicles." />;
  }
  const invReports = reports.filter((r) => r.developmentId === inv.developmentId);
  const byCategory = (category: "legal" | "meetings" | "accounts") =>
    inv.files.filter((f) => f.category === category);
  return <><PageTitle eyebrow="My portfolio" title="Your investments." copy="Every vehicle you hold a position in, with its legal papers, monthly reports, shareholder meeting recordings and accounts." />
    <div className={`grid gap-px overflow-hidden border border-[#d8d7d0] bg-[#d8d7d0] sm:grid-cols-2 ${portfolio.length > 2 ? "xl:grid-cols-3" : ""}`} role="group" aria-label="Your investments">
      {portfolio.map((p)=>(
        <button key={p.developmentId} onClick={()=>{onSelect(p.developmentId);}} aria-pressed={p.developmentId===inv.developmentId} className={`p-6 text-left transition ${p.developmentId===inv.developmentId ? "bg-[#121212] text-white" : "bg-white hover:bg-[#faf8f3]"}`}>
          <div className="flex justify-between"><span className={`text-[10px] uppercase tracking-[.14em] ${p.developmentId===inv.developmentId ? "text-[#c4a262]" : "text-[#6b7969]"}`}>{p.status}</span><span className={`text-xs ${p.developmentId===inv.developmentId ? "text-white/50" : "text-[#8a8e90]"}`}>{p.position.sharePercent} held</span></div>
          <h3 className="mt-4 text-lg font-medium">{p.name}</h3>
          <p className={`mt-1 text-xs ${p.developmentId===inv.developmentId ? "text-white/50" : "text-[#83888b]"}`}>{p.spvName}</p>
          <p className={`mt-4 text-sm ${p.developmentId===inv.developmentId ? "text-white/85" : "text-[#121212]"}`}>{p.position.currentValue} <span className={p.developmentId===inv.developmentId ? "text-white/45" : "text-[#8a8e90]"}>current value</span></p>
        </button>
      ))}
    </div>
    <section className="mt-6 border border-[#d8d7d0] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ebe9e3] p-6 sm:p-7">
        <div>
          <p className="text-[10px] uppercase tracking-[.18em] text-[#8a6c3f]">{inv.spvName}</p>
          <h2 className="mt-2 text-2xl font-medium text-[#121212]">{inv.name}</h2>
          <p className="mt-1 text-xs text-[#83888b]">{inv.place} · {inv.phase} · next report {inv.nextReport}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-5">
          {[["Holding",inv.position.sharePercent],["Committed",inv.position.committed],["Current value",inv.position.currentValue],["Site IRR",inv.position.forecastIrr],["Multiple",inv.position.multiple]].map(([l,v])=>(
            <div key={l}><dt className="text-[10px] uppercase tracking-wider text-[#a0a5a8]">{l}</dt><dd className="mt-1 font-medium text-[#121212]">{v}</dd></div>
          ))}
        </dl>
      </div>
      <div className="flex overflow-x-auto border-b border-[#ebe9e3]" role="tablist" aria-label={`${inv.name} sections`}>
        {PORTFOLIO_TABS.map((t)=>(
          <button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)} className={`min-w-max border-b-2 px-5 py-4 text-[10px] uppercase tracking-[.14em] transition ${tab===t.id ? "border-[#b18c4d] text-[#121212]" : "border-transparent text-[#858b8e] hover:text-[#121212]"}`}>{t.label}</button>
        ))}
      </div>
      <div className="p-6 sm:p-7">
        {tab==="files" && <FileRows files={inv.files} empty="No files have been published for this investment yet." />}
        {tab==="legal" && <FileRows files={byCategory("legal")} empty="Your shareholder agreement and share certificate for this investment will appear here." />}
        {tab==="reports" && (
          invReports.length > 0
            ? <div className="space-y-5">{invReports.map((r)=><ReportArticle key={`${r.date}-${r.title}`} r={r} />)}</div>
            : <p className="text-sm text-[#687077]">The first monthly report for this investment will appear here as soon as it is published.</p>
        )}
        {tab==="meetings" && <FileRows files={byCategory("meetings")} action="Open recording →" empty="Recordings of this vehicle's shareholder meetings will appear here." />}
        {tab==="accounts" && <FileRows files={byCategory("accounts")} empty="The vehicle's annual accounts will appear here once filed." />}
      </div>
    </section>
  </>;
}

function Financials({ data }: { data: PortalData }) {
  return <><PageTitle eyebrow="Portfolio reporting" title="Financials." copy="Your positions across each single-asset SPV, derived from the vehicle cap tables and current equity valuations." /><div className="grid gap-6 lg:grid-cols-3"><PerformanceBars history={data.valueHistory} headline={data.financialsHeadline} /><section className="bg-[#121212] p-7 text-white"><p className="text-[10px] uppercase tracking-[.18em] text-[#c4a262]">Next cash events</p><div className="mt-6 space-y-6">{data.upcomingEvents.length === 0 && <p className="text-sm text-white/55">No forecast cash events.</p>}{data.upcomingEvents.map(x=><div key={`${x.date}-${x.type}`} className="border-b border-white/10 pb-5 last:border-0"><p className="text-[10px] text-white/40">{x.date}</p><div className="mt-2 flex justify-between text-sm"><span>{x.type}</span><span>{x.amount}</span></div></div>)}</div></section></div><section className="mt-6 border border-[#d8d7d0] bg-white p-7"><div className="flex justify-between"><h2 className="text-lg font-medium text-[#121212]">SPV holdings</h2><DemoAction label="Export CSV ↓" className="text-[10px] uppercase tracking-wider text-[#8a6c3f]" /></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="border-b border-[#d8d7d0] text-[10px] uppercase tracking-wider text-[#858b8e]"><tr>{["Site","Vehicle","Ownership","Committed","Current value","Site IRR","Multiple","Status"].map(x=><th key={x} className="pb-3 font-normal">{x}</th>)}</tr></thead><tbody>{data.holdings.map((h)=><tr key={h.name} className="border-b border-[#ebe9e3]"><td className="py-4 font-medium">{h.name}</td><td className="text-xs text-[#737a7e]">{h.spvName}</td><td>{h.share}</td><td>{h.invested}</td><td>{h.currentValue}</td><td className="text-[#63775e]">{h.forecastIrr}</td><td>{h.multiple}</td><td><span className="bg-[#edf0e9] px-2 py-1 text-[10px] uppercase text-[#63775e]">{h.status}</span></td></tr>)}</tbody></table></div></section><p className="mt-5 text-[10px] leading-5 text-[#858b8e]">Current values are your cap-table share of each SPV&rsquo;s equity at the latest valuation. Forecasts are based on current business plans and are not guaranteed; figures shown are illustrative demo data and do not constitute financial advice.</p></>;
}

function Documents({ documents, tier }: { documents: PortalData["documents"]; tier: InvestorTier }) {
  const prospective = tier === "prospective";
  return <><PageTitle eyebrow="Secure data room" title={prospective ? "Data room." : "Documents."} copy={prospective ? "The investment memorandum, appraisals and structure notes behind our current raises. Read them at your own pace, and ask us anything before you commit." : "Reports, statements and project documents for your portfolio."} />
    <div className="border border-[#d8d7d0] bg-white">
      <div className="grid grid-cols-[1fr_auto] border-b border-[#d8d7d0] px-6 py-4 text-[10px] uppercase tracking-wider text-[#858b8e] sm:grid-cols-[1fr_170px_130px]"><span>Document</span><span className="hidden sm:block">Published</span><span>Action</span></div>
      {documents.length === 0 && <p className="px-6 py-7 text-sm text-[#687077]">No documents have been published to your account yet.</p>}
      {documents.map(x=>(
        <div key={x.title} className="grid grid-cols-[1fr_auto] items-center border-b border-[#ebe9e3] px-6 py-5 last:border-0 sm:grid-cols-[1fr_170px_130px]">
          <div>
            <p className="text-sm font-medium text-[#121212]">{x.title}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[#858b8e]">PDF · {x.kind}</p>
            {x.summary && <p className="mt-2 max-w-xl text-sm leading-6 text-[#737a7e]">{x.summary}</p>}
          </div>
          <span className="hidden text-xs text-[#777e82] sm:block">{x.published}</span>
          <DownloadAction file={x.file} className="text-xs uppercase tracking-wider text-[#8a6c3f]" />
        </div>
      ))}
    </div>
    {prospective && (
      <div className="mt-6 flex flex-wrap items-center gap-6 border border-[#c9b98f] bg-[#f3ecdc] px-6 py-5">
        <p className="max-w-lg text-sm leading-6 text-[#4f4633]">Need something that is not here — a cost plan, a planning pack, a copy of the SPV articles? Ask and we will add it to your data room.</p>
        <a href={mailto("Data room request", "Hello Satis Group,\n\nPlease could you add the following to my data room:\n")} className="bg-[#121212] px-6 py-3.5 text-xs tracking-[.15em] uppercase text-white transition hover:bg-[#b18c4d]">Request a document →</a>
      </div>
    )}
  </>;
}

export function InvestorPortal({ data, logout }: { data: PortalData; logout: () => Promise<void> }) {
  const [active, setActive] = useState<Section>("overview");
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(
    data.portfolio[0]?.developmentId ?? ""
  );
  const allowed = navItems(data.tier).some((item) => item.id === active);
  const section = allowed ? active : "overview";
  const invested = data.tier === "invested";
  // The portfolio dropdown both opens the section and picks the investment,
  // so a position is reachable in one click from anywhere in the platform.
  const goPortfolio = (developmentId?: string) => {
    if (developmentId) setSelectedInvestmentId(developmentId);
    setActive("portfolio");
  };
  const counts: NavCounts = {
    opportunities: data.opportunities.length,
    reports: data.reports.length,
    documents: data.documents.length,
    developments: data.developments.length,
    insights: data.insights.length,
  };
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f4f2ed] text-[#2a2a2a]">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <Sidebar
          accountName={data.accountName}
          tier={data.tier}
          active={section}
          setActive={setActive}
          logout={logout}
          portfolio={data.portfolio}
          selectedInvestmentId={selectedInvestmentId}
          goPortfolio={goPortfolio}
          counts={counts}
        />
        <main className="min-w-0 px-5 py-9 sm:px-8 lg:px-10 lg:py-12 xl:px-14">
          {section === "overview" &&
            (invested ? (
              <Overview data={data} go={setActive} goPortfolio={goPortfolio} />
            ) : (
              <ProspectOverview data={data} go={setActive} />
            ))}
          {section === "portfolio" && (
            <MyPortfolio
              portfolio={data.portfolio}
              reports={data.reports}
              selectedId={selectedInvestmentId}
              onSelect={setSelectedInvestmentId}
            />
          )}
          {section === "developments" && (
            <Developments developments={data.developments} tier={data.tier} go={setActive} />
          )}
          {section === "opportunities" && <Opportunities opportunities={data.opportunities} />}
          {section === "market" && <Market market={data.market} />}
          {section === "insights" && <Insights insights={data.insights} />}
          {section === "reports" && <Reports reports={data.reports} />}
          {section === "financials" && <Financials data={data} />}
          {section === "documents" && <Documents documents={data.documents} tier={data.tier} />}
        </main>
      </div>
    </div>
  );
}
