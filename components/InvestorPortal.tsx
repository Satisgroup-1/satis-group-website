"use client";

import { useState } from "react";
import type { InsightBlock } from "@/lib/investor-platform";

type Section =
  | "overview"
  | "developments"
  | "market"
  | "insights"
  | "updates"
  | "financials"
  | "documents";

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "developments", label: "Developments", icon: "◇" },
  { id: "market", label: "Market intelligence", icon: "↗" },
  { id: "insights", label: "Insights", icon: "≡" },
  { id: "updates", label: "Site updates", icon: "○" },
  { id: "financials", label: "Financials", icon: "£" },
  { id: "documents", label: "Documents", icon: "□" },
];

// Everything the portal renders arrives pre-formatted from the server page,
// which assembles it per signed-in investor from content/investors/*.json.
export type PortalData = {
  accountName: string;
  greeting: string;
  lastUpdated: string;
  stats: { label: string; value: string; note: string }[];
  valueHistory: { label: string; value: number }[];
  developments: {
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
    summary: string;
  }[];
  holdings: {
    name: string;
    invested: string;
    currentValue: string;
    forecastIrr: string;
    multiple: string;
    status: string;
  }[];
  financialsHeadline: { value: string; delta: string };
  upcomingEvents: { date: string; type: string; amount: string }[];
  updates: { date: string; site: string; title: string; body: string; tag: string }[];
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
  documents: { title: string; kind: string; published: string }[];
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

function Sparkline({ points, color = "#b6904f" }: { points: string; color?: string }) {
  return (
    <svg viewBox="0 0 180 52" className="h-12 w-full" aria-hidden="true">
      <path d={`${points} L180 52 L0 52 Z`} fill={color} opacity=".08" />
      <polyline points={points.replace(/[ML]/g, "")} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
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

function chartLabels(history: PortalData["valueHistory"]): string[] {
  if (history.length < 2) return history.map((p) => p.label);
  const picks = [
    0,
    Math.floor(history.length / 3),
    Math.floor((history.length * 2) / 3),
    history.length - 1,
  ];
  return [...new Set(picks)].map((i) => history[i].label);
}

function Sidebar({ accountName, active, setActive, logout }: { accountName: string; active: Section; setActive: (s: Section) => void; logout: () => Promise<void> }) {
  return (
    <aside className="border-r border-[#d8d7d0] bg-[#121212] text-white lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)]">
      <div className="border-b border-white/10 px-6 py-6"><p className="text-[10px] tracking-[.28em] uppercase text-[#c4a262]">Investor account</p><p className="mt-2 text-sm">{accountName}</p></div>
      <nav className="flex overflow-x-auto p-3 lg:block lg:space-y-1 lg:p-4" aria-label="Investor platform">
        {navItems.map((item) => <button key={item.id} onClick={() => setActive(item.id)} className={`flex min-w-max items-center gap-3 px-4 py-3 text-left text-xs tracking-[.08em] transition lg:w-full ${active === item.id ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}><span className="w-5 text-center text-[#c4a262]">{item.icon}</span>{item.label}</button>)}
      </nav>
      <form action={logout} className="hidden absolute bottom-0 left-0 right-0 border-t border-white/10 p-5 lg:block"><button type="submit" className="text-xs tracking-[.14em] uppercase text-white/45 hover:text-white">← Sign out</button></form>
    </aside>
  );
}

function PageTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <header className="mb-9"><p className="text-[10px] tracking-[.25em] uppercase text-[#96723d]">{eyebrow}</p><h1 className="mt-3 text-3xl font-medium tracking-[-.025em] text-[#121212] sm:text-4xl">{title}</h1>{copy && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687077]">{copy}</p>}</header>;
}

function Overview({ data, go }: { data: PortalData; go: (s: Section) => void }) {
  const values = data.valueHistory.map((p) => p.value);
  const path = linePath(values, 700, 220);
  return <>
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><PageTitle eyebrow="Portfolio overview" title={data.greeting} copy="Here’s what’s happening across your Satis portfolio." /><div className="mb-9 text-right text-xs text-[#7c8285]"><span className="mb-1 block uppercase tracking-[.16em]">Last updated</span>{data.lastUpdated}</div></div>
    <div className="grid gap-px overflow-hidden border border-[#d8d7d0] bg-[#d8d7d0] sm:grid-cols-2 xl:grid-cols-4">
      {data.stats.map((x,i)=><div key={x.label} className="bg-white p-6"><div className="flex justify-between text-[10px] tracking-[.16em] uppercase text-[#777e82]"><span>{x.label}</span><span>0{i+1}</span></div><p className="mt-6 text-3xl font-medium tracking-tight text-[#121212]">{x.value}</p><p className="mt-2 text-xs text-[#617260]">{x.note}</p></div>)}
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
      <section className="border border-[#d8d7d0] bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs tracking-[.15em] uppercase text-[#747b7f]">Portfolio performance</p><h2 className="mt-2 text-xl font-medium text-[#121212]">Value progression</h2></div><span className="border border-[#d8d7d0] px-3 py-2 text-[10px] uppercase tracking-wider">All time</span></div><div className="mt-10 h-56">{path ? <svg viewBox="0 0 700 220" className="h-full w-full" aria-label="Portfolio value chart"><g stroke="#e5e3dc" strokeWidth="1">{[20,70,120,170,220].map(y=><line key={y} x1="0" x2="700" y1={y} y2={y}/>)}</g><path d={path} fill="none" stroke="#b18c4d" strokeWidth="3"/><path d={`${path} L700 220 L0 220Z`} fill="#b18c4d" opacity=".08"/></svg> : <p className="text-sm text-[#858b8e]">Performance history will appear once your first valuation is recorded.</p>}</div><div className="flex justify-between text-[10px] text-[#858b8e]">{chartLabels(data.valueHistory).map(l=><span key={l}>{l}</span>)}</div></section>
      <section className="bg-[#121212] p-7 text-white"><p className="text-[10px] tracking-[.18em] uppercase text-[#c4a262]">Latest activity</p><div className="mt-6 space-y-6">{data.updates.slice(0,3).map((u,i)=><div key={u.title} className={i<2?"border-b border-white/10 pb-6":""}><p className="text-[10px] uppercase tracking-wider text-white/40">{u.date} · {u.site}</p><p className="mt-2 text-sm">{u.title}</p></div>)}</div><button onClick={()=>go("updates")} className="mt-8 text-[10px] tracking-[.16em] uppercase text-[#c4a262]">View all updates →</button></section>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">{data.developments.slice(0,3).map(d=><article key={d.name} className="border border-[#d8d7d0] bg-white p-6"><div className="flex justify-between"><span className="text-[10px] uppercase tracking-[.14em] text-[#6b7969]">{d.status}</span><span className="text-xs text-[#8a8e90]">{d.progress}%</span></div><h3 className="mt-5 text-lg font-medium text-[#121212]">{d.name}</h3><p className="mt-1 text-xs text-[#83888b]">{d.place} · {d.phase}</p><div className="mt-6 h-1 bg-[#e6e3dc]"><div className="h-full bg-[#b18c4d]" style={{width:`${d.progress}%`}} /></div></article>)}</div>
  </>;
}

function Developments({ developments }: { developments: PortalData["developments"] }) {
  const [selected, setSelected] = useState(0);
  const d = developments[Math.min(selected, developments.length - 1)];
  if (!d) return <PageTitle eyebrow="Live portfolio" title="No developments yet." copy="Developments will appear here as they are added to the platform." />;
  return <><PageTitle eyebrow="Live portfolio" title="Developments across Greater Manchester." copy="Track project phase, programme and headline value across every active Satis development." />
    <div className="grid overflow-hidden border border-[#d8d7d0] bg-white xl:grid-cols-[1.4fr_.8fr]">
      <div className="relative min-h-[520px] overflow-hidden bg-[#e8e5dd]">
        <svg viewBox="0 0 800 560" className="absolute inset-0 h-full w-full" aria-label="Stylised map of Greater Manchester"><rect width="800" height="560" fill="#e9e7e0"/><g fill="none" stroke="#c7c5be" strokeWidth="2"><path d="M-30 390 C130 330 205 385 340 310 S580 250 840 310"/><path d="M80 0 C180 140 260 200 245 570"/><path d="M620 -20 C560 110 470 200 490 580"/><path d="M0 160 C170 180 260 115 405 170 S650 190 820 90"/></g><g fill="#dad8d1" stroke="#c7c5be"><path d="M310 170 L500 150 610 245 570 380 390 420 250 330Z"/></g><g fontSize="13" fill="#8a8b87" letterSpacing="2"><text x="370" y="260">MANCHESTER</text><text x="250" y="470">ALTRINCHAM</text><text x="560" y="450">STOCKPORT</text><text x="85" y="130">BOLTON</text></g></svg>
        {developments.map((item,i)=><button key={item.name} onClick={()=>setSelected(i)} aria-label={`View ${item.name}`} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-md transition ${selected===i?"h-6 w-6 bg-[#121212]":"h-4 w-4 bg-[#b18c4d] hover:scale-125"}`} style={{left:`${item.x}%`,top:`${item.y}%`}} />)}
        <div className="absolute bottom-5 left-5 bg-white/95 px-4 py-3 text-[10px] tracking-[.12em] uppercase text-[#777d80]">● Active &nbsp;&nbsp; ◉ Selected</div>
      </div>
      <div className="p-7 sm:p-9"><p className="text-[10px] tracking-[.18em] uppercase text-[#8a6c3f]">Selected development</p><h2 className="mt-4 text-2xl font-medium text-[#121212]">{d.name}</h2><p className="mt-1 text-sm text-[#737a7e]">{d.place}</p><p className="mt-5 text-sm leading-6 text-[#687077]">{d.summary}</p><div className="my-8 border-y border-[#deddd7] py-6"><div className="flex justify-between text-xs"><span>Overall progress</span><b>{d.progress}%</b></div><div className="mt-3 h-1 bg-[#e2e0d9]"><div className="h-full bg-[#b18c4d]" style={{width:`${d.progress}%`}} /></div></div><dl className="grid grid-cols-2 gap-7 text-sm"><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Current phase</dt><dd className="mt-2">{d.phase}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Gross value</dt><dd className="mt-2">{d.value}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Programme</dt><dd className="mt-2 text-[#667b62]">{d.status}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Next report</dt><dd className="mt-2">{d.nextReport}</dd></div></dl><DemoAction label="View project report →" className="mt-9 w-full bg-[#121212] px-5 py-4 text-xs tracking-[.15em] uppercase text-white" /></div>
    </div></>;
}

function Market() {
  return <><PageTitle eyebrow="Greater Manchester" title="Market intelligence." copy="Our view of the indicators shaping residential and commercial real estate decisions across the city region." />
    <div className="mb-6 border-l-2 border-[#b18c4d] bg-[#eee9df] px-5 py-4 text-xs leading-5 text-[#62696d]">Internal research snapshot · Q2 2026. Figures are indicative for platform demonstration and should not be relied upon as investment advice.</div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{[
      {l:"Average house price",v:"£254,800",c:"+3.7%",p:"M0 40 L30 38 L55 30 L82 34 L110 20 L140 24 L180 8"},{l:"Prime office rent",v:"£45.00",c:"psf headline",p:"M0 42 L30 40 L60 39 L90 30 L120 28 L150 17 L180 12"},{l:"City centre vacancy",v:"6.2%",c:"Grade A supply",p:"M0 15 L35 18 L65 17 L100 25 L130 28 L155 39 L180 42"},{l:"Residential yield",v:"5.8%",c:"GM average",p:"M0 40 L30 35 L60 38 L90 25 L120 30 L150 20 L180 14"}
    ].map(x=><div key={x.l} className="border border-[#d8d7d0] bg-white p-6"><p className="text-[10px] tracking-[.14em] uppercase text-[#7c8386]">{x.l}</p><p className="mt-5 text-3xl font-medium text-[#121212]">{x.v}</p><p className="mt-1 text-xs text-[#6b7969]">{x.c}</p><div className="mt-5"><Sparkline points={x.p}/></div></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]"><section className="border border-[#d8d7d0] bg-white p-7"><p className="text-xs tracking-[.15em] uppercase text-[#737a7e]">Submarket comparison</p><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-[#d8d7d0] text-[10px] uppercase tracking-wider text-[#858b8e]"><tr>{["Location","House price","12m change","Rent pcm","Gross yield"].map(x=><th key={x} className="pb-3 font-normal">{x}</th>)}</tr></thead><tbody>{[["Manchester","£247,600","+4.1%","£1,420","5.9%"],["Salford","£228,300","+4.8%","£1,310","6.1%"],["Stockport","£304,900","+3.5%","£1,295","5.2%"],["Trafford","£386,200","+2.9%","£1,560","4.8%"]].map(r=><tr key={r[0]} className="border-b border-[#ebe9e3] last:border-0">{r.map((c,i)=><td key={c} className={`py-4 ${i===2?"text-[#63775e]":""}`}>{c}</td>)}</tr>)}</tbody></table></div></section><section className="bg-[#121212] p-7 text-white"><p className="text-[10px] tracking-[.18em] uppercase text-[#c4a262]">Satis view</p><h2 className="mt-5 text-2xl leading-8">Selective optimism in a supply-constrained market.</h2><p className="mt-5 text-sm leading-6 text-white/60">We remain focused on connected neighbourhoods where high-quality converted stock can meet resilient occupier demand.</p><div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-xs text-white/70"><p>01 &nbsp; Flight to quality continues</p><p>02 &nbsp; Rental demand remains resilient</p><p>03 &nbsp; Build-cost inflation is moderating</p></div></section></div>
    <div className="mt-6 text-[10px] leading-5 text-[#858b8e]">Suggested source set: HM Land Registry UK House Price Index, ONS Private Rent and House Prices, GMCA monitoring data, and quarterly agent research. Verify current figures before external use.</div>
  </>;
}

function InsightBody({ blocks }: { blocks: InsightBlock[] }) {
  return <div className="mt-10 border-t border-[#d8d7d0] pt-9">{blocks.map((block, i) => {
    if (block.type === "heading") return <h2 key={i} className="mt-10 text-xl font-medium tracking-tight text-[#121212] first:mt-0">{block.text}</h2>;
    if (block.type === "list") return <ul key={i} className="mt-5 space-y-3">{block.items.map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-[#4f585d]"><span aria-hidden="true" className="mt-[.65em] h-px w-5 shrink-0 bg-[#b18c4d]" />{item}</li>)}</ul>;
    return <p key={i} className="mt-5 text-base leading-8 text-[#4f585d] first:mt-0">{block.text}</p>;
  })}</div>;
}

function Insights({ insights }: { insights: PortalData["insights"] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = insights.find((x) => x.slug === openSlug);
  if (open) {
    return <article className="mx-auto max-w-3xl">
      <button onClick={() => setOpenSlug(null)} className="mb-8 text-[10px] tracking-[.16em] uppercase text-[#8a6c3f] hover:text-[#121212]">← All insights</button>
      <div className="h-2 w-24" style={{ backgroundColor: INSIGHT_THEME[open.theme] }} aria-hidden="true" />
      <p className="mt-6 text-[10px] tracking-[.16em] uppercase text-[#96723d]">{open.category} · {open.date} · {open.read} read</p>
      <h1 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-[#121212] sm:text-5xl">{open.title}</h1>
      <p className="mt-6 border-l-2 border-[#b18c4d] pl-5 text-lg leading-8 text-[#626a6e]">{open.summary}</p>
      <InsightBody blocks={open.body} />
      <button onClick={() => setOpenSlug(null)} className="mt-12 border border-[#d8d7d0] px-6 py-3 text-[10px] tracking-[.16em] uppercase text-[#8a6c3f] transition hover:border-[#b18c4d]">← Back to all insights</button>
    </article>;
  }
  return <><PageTitle eyebrow="Research & perspective" title="Insights for considered investment." copy="Research notes and perspectives from the Satis development and investment teams." /><div className="grid gap-6 lg:grid-cols-3">{insights.map((x)=><button type="button" onClick={() => setOpenSlug(x.slug)} key={x.slug} className="group flex min-h-[360px] flex-col border border-[#d8d7d0] bg-white p-7 text-left transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#121212]/5"><span className="mb-8 block h-28 w-full" style={{ backgroundColor: INSIGHT_THEME[x.theme] }} aria-hidden="true" /><span className="text-[10px] tracking-[.16em] uppercase text-[#96723d]">{x.category} · {x.date}</span><span className="mt-4 block text-xl font-medium leading-7 text-[#121212]">{x.title}</span><span className="mt-4 block text-sm leading-6 text-[#747b7f]">{x.summary}</span><span className="mt-auto flex w-full justify-between pt-6 text-[10px] uppercase tracking-wider"><span>{x.read} read</span><ArrowIcon/></span></button>)}</div></>;
}

function Updates({ updates }: { updates: PortalData["updates"] }) {
  return <><PageTitle eyebrow="From the ground" title="Site updates." copy="The latest programme, planning and construction news from across the portfolio." /><div className="space-y-4">{updates.map((u,i)=><article key={`${u.date}-${u.title}`} className="grid border border-[#d8d7d0] bg-white p-6 sm:grid-cols-[140px_1fr_auto] sm:items-start sm:gap-6"><div><span className="text-[10px] uppercase tracking-wider text-[#8a6c3f]">{u.date}</span><span className="mt-2 block text-xs text-[#7d8386]">Update {String(i+1).padStart(2,"0")}</span></div><div className="mt-4 sm:mt-0"><p className="text-[10px] uppercase tracking-wider text-[#7d8386]">{u.site}</p><h2 className="mt-2 text-xl font-medium text-[#121212]">{u.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#737a7e]">{u.body}</p></div><span className="mt-4 w-fit bg-[#eee9df] px-3 py-2 text-[10px] uppercase tracking-wider text-[#79613b] sm:mt-0">{u.tag}</span></article>)}</div></>;
}

function Financials({ data }: { data: PortalData }) {
  const bars = data.valueHistory.slice(-8);
  const max = Math.max(...bars.map((b) => b.value), 1);
  return <><PageTitle eyebrow="Portfolio reporting" title="Financials." copy="Consolidated performance and upcoming cash events for your Satis holdings." /><div className="grid gap-6 lg:grid-cols-3"><section className="border border-[#d8d7d0] bg-white p-7 lg:col-span-2"><div className="flex justify-between"><div><p className="text-xs uppercase tracking-wider text-[#777e82]">Investment performance</p><h2 className="mt-3 text-2xl text-[#121212]">{data.financialsHeadline.value} <span className="text-sm text-[#687a64]">{data.financialsHeadline.delta}</span></h2></div><span className="text-[10px] uppercase tracking-wider text-[#777e82]">GBP</span></div><div className="mt-8 grid h-64 grid-cols-8 items-end gap-3 border-b border-[#d8d7d0]">{bars.map((b)=><div key={b.label} className="group relative flex h-full items-end"><div className="w-full bg-[#b18c4d] opacity-80 transition group-hover:opacity-100" style={{height:`${Math.round((b.value/max)*100)}%`}} title={b.label}/></div>)}</div><div className="mt-3 flex justify-between text-[10px] text-[#858b8e]"><span>{bars[0]?.label}</span><span>{bars[bars.length-1]?.label}</span></div></section><section className="bg-[#121212] p-7 text-white"><p className="text-[10px] uppercase tracking-[.18em] text-[#c4a262]">Next cash events</p><div className="mt-6 space-y-6">{data.upcomingEvents.length === 0 && <p className="text-sm text-white/55">No forecast cash events.</p>}{data.upcomingEvents.map(x=><div key={`${x.date}-${x.type}`} className="border-b border-white/10 pb-5 last:border-0"><p className="text-[10px] text-white/40">{x.date}</p><div className="mt-2 flex justify-between text-sm"><span>{x.type}</span><span>{x.amount}</span></div></div>)}</div></section></div><section className="mt-6 border border-[#d8d7d0] bg-white p-7"><div className="flex justify-between"><h2 className="text-lg font-medium text-[#121212]">Holdings summary</h2><DemoAction label="Export CSV ↓" className="text-[10px] uppercase tracking-wider text-[#8a6c3f]" /></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-[#d8d7d0] text-[10px] uppercase tracking-wider text-[#858b8e]"><tr>{["Investment","Invested","Current value","Forecast IRR","Multiple","Status"].map(x=><th key={x} className="pb-3 font-normal">{x}</th>)}</tr></thead><tbody>{data.holdings.map((h)=><tr key={h.name} className="border-b border-[#ebe9e3]"><td className="py-4 font-medium">{h.name}</td><td>{h.invested}</td><td>{h.currentValue}</td><td className="text-[#63775e]">{h.forecastIrr}</td><td>{h.multiple}</td><td><span className="bg-[#edf0e9] px-2 py-1 text-[10px] uppercase text-[#63775e]">{h.status}</span></td></tr>)}</tbody></table></div></section><p className="mt-5 text-[10px] leading-5 text-[#858b8e]">Forecasts are based on current business plans and are not guaranteed. Values shown are illustrative demo data and do not constitute financial advice.</p></>;
}

function Documents({ documents }: { documents: PortalData["documents"] }) {
  return <><PageTitle eyebrow="Secure data room" title="Documents." copy="Reports, statements and project documents for your portfolio." /><div className="border border-[#d8d7d0] bg-white"><div className="grid grid-cols-[1fr_auto] border-b border-[#d8d7d0] px-6 py-4 text-[10px] uppercase tracking-wider text-[#858b8e] sm:grid-cols-[1fr_170px_130px]"><span>Document</span><span className="hidden sm:block">Published</span><span>Action</span></div>{documents.map(x=><div key={x.title} className="grid grid-cols-[1fr_auto] items-center border-b border-[#ebe9e3] px-6 py-5 last:border-0 sm:grid-cols-[1fr_170px_130px]"><div><p className="text-sm font-medium text-[#121212]">{x.title}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#858b8e]">PDF · {x.kind}</p></div><span className="hidden text-xs text-[#777e82] sm:block">{x.published}</span><DemoAction label="Download ↓" className="text-xs uppercase tracking-wider text-[#8a6c3f]" /></div>)}</div></>;
}

export function InvestorPortal({ data, logout }: { data: PortalData; logout: () => Promise<void> }) {
  const [active, setActive] = useState<Section>("overview");
  return <div className="min-h-[calc(100vh-5rem)] bg-[#f4f2ed] text-[#2a2a2a]"><div className="grid lg:grid-cols-[240px_1fr]"><Sidebar accountName={data.accountName} active={active} setActive={setActive} logout={logout} /><main className="min-w-0 px-5 py-9 sm:px-8 lg:px-10 lg:py-12 xl:px-14">{active==="overview"&&<Overview data={data} go={setActive}/>} {active==="developments"&&<Developments developments={data.developments}/>} {active==="market"&&<Market/>} {active==="insights"&&<Insights insights={data.insights}/>} {active==="updates"&&<Updates updates={data.updates}/>} {active==="financials"&&<Financials data={data}/>} {active==="documents"&&<Documents documents={data.documents}/>}</main></div></div>;
}
