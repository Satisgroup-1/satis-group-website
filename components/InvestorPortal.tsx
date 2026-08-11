"use client";

import { useState } from "react";

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

const developments = [
  { name: "22 St John Street", place: "Manchester M3", x: 48, y: 41, status: "On programme", progress: 76, value: "£18.4m", phase: "Fit-out" },
  { name: "Barnett House", place: "Manchester M1", x: 59, y: 51, status: "On programme", progress: 58, value: "£14.8m", phase: "Construction" },
  { name: "Chester House", place: "Altrincham", x: 43, y: 76, status: "Ahead", progress: 89, value: "£11.2m", phase: "Completion" },
  { name: "Barrington Road", place: "Altrincham", x: 38, y: 82, status: "On programme", progress: 34, value: "£9.6m", phase: "Structure" },
  { name: "Court House", place: "Stockport", x: 69, y: 74, status: "Planning", progress: 18, value: "£22.1m", phase: "Pre-construction" },
  { name: "Davenport", place: "Stockport", x: 73, y: 81, status: "On programme", progress: 47, value: "£13.5m", phase: "Construction" },
];

const updates = [
  { date: "08 Aug 2026", site: "22 St John Street", title: "Show apartment released", body: "Final joinery is complete and the first show apartment has been handed over to the sales team.", tag: "Milestone" },
  { date: "04 Aug 2026", site: "Barnett House", title: "Envelope works complete", body: "The building is now weather-tight. First-fix MEP is progressing across levels two to five.", tag: "Construction" },
  { date: "29 Jul 2026", site: "Court House", title: "Planning submission validated", body: "The full planning submission has been validated by Stockport Council and consultation is under way.", tag: "Planning" },
  { date: "22 Jul 2026", site: "Chester House", title: "Practical completion forecast confirmed", body: "The project team has reconfirmed practical completion for September following the latest programme review.", tag: "Programme" },
];

const insights = [
  { category: "Market note", date: "6 Aug 2026", title: "The case for character-led offices", copy: "Why constrained Grade A supply and flight-to-quality are creating an opening for thoughtfully repositioned heritage stock.", read: "6 min" },
  { category: "Research", date: "24 Jul 2026", title: "Greater Manchester living", copy: "Five demand signals shaping rental resilience across the city region—from graduate retention to transport-led regeneration.", read: "9 min" },
  { category: "Investment view", date: "11 Jul 2026", title: "Finding value beyond the core", copy: "A closer look at Altrincham and Stockport as connected, amenity-rich submarkets with long-term potential.", read: "7 min" },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function Sparkline({ points, color = "#b6904f" }: { points: string; color?: string }) {
  return (
    <svg viewBox="0 0 180 52" className="h-12 w-full" aria-hidden="true">
      <path d={`${points} L180 52 L0 52 Z`} fill={color} opacity=".08" />
      <polyline points={points.replace(/[ML]/g, "")} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (email === "test" && password === "test") {
      setError("");
      onLogin();
    } else {
      setError("The email or password you entered is incorrect.");
    }
  }
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#000000] text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1500px] lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 p-14 lg:flex lg:flex-col lg:justify-between">
          <div className="relative text-xs tracking-[.32em] uppercase text-[#c3a164]">Satis investor platform</div>
          <div className="relative max-w-2xl pb-12">
            <p className="mb-6 text-sm tracking-[.22em] uppercase text-[#c3a164]">Clarity at every stage</p>
            <h1 className="text-6xl font-medium leading-[1.02] tracking-[-.045em]">Property intelligence,<br />built around you.</h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-white/60">A single view of your Satis investments, live developments and the Greater Manchester market.</p>
          </div>
          <div className="relative grid grid-cols-3 gap-8 border-t border-white/15 pt-7 text-sm text-white/55">
            <span><b className="mb-1 block text-2xl font-medium text-white">6</b>Live developments</span>
            <span><b className="mb-1 block text-2xl font-medium text-white">£89.6m</b>Combined GDV</span>
            <span><b className="mb-1 block text-2xl font-medium text-white">76%</b>On programme</span>
          </div>
        </section>
        <section className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <p className="text-xs tracking-[.28em] uppercase text-[#c3a164]">Private access</p>
            <h2 className="mt-4 text-4xl font-medium tracking-tight">Welcome back.</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">Sign in to access your investor dashboard and reporting.</p>
            <form onSubmit={submit} className="mt-10 space-y-6">
              <label className="block"><span className="mb-2 block text-xs tracking-[.16em] uppercase text-white/55">Email</span><input name="email" autoComplete="email" inputMode="email" className="w-full border border-white/20 bg-white/[.04] px-4 py-4 outline-none transition focus:border-[#c3a164]" /></label>
              <label className="block"><span className="mb-2 block text-xs tracking-[.16em] uppercase text-white/55">Password</span><input name="password" type="password" autoComplete="current-password" className="w-full border border-white/20 bg-white/[.04] px-4 py-4 outline-none transition focus:border-[#c3a164]" /></label>
              {error && <p role="alert" className="text-sm text-[#e1a68e]">{error}</p>}
              <button className="flex w-full items-center justify-between bg-[#b18c4d] px-5 py-4 text-xs font-medium tracking-[.18em] uppercase transition hover:bg-[#c3a164]">Enter platform <span>→</span></button>
            </form>
            <div className="mt-7 flex justify-between text-xs text-white/45"><span>Demo email: test · Password: test</span><button className="hover:text-white">Need help?</button></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, logout }: { active: Section; setActive: (s: Section) => void; logout: () => void }) {
  return (
    <aside className="border-r border-[#d8d7d0] bg-[#121212] text-white lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)]">
      <div className="border-b border-white/10 px-6 py-6"><p className="text-[10px] tracking-[.28em] uppercase text-[#c4a262]">Investor account</p><p className="mt-2 text-sm">The Hartwell Partnership</p></div>
      <nav className="flex overflow-x-auto p-3 lg:block lg:space-y-1 lg:p-4" aria-label="Investor platform">
        {navItems.map((item) => <button key={item.id} onClick={() => setActive(item.id)} className={`flex min-w-max items-center gap-3 px-4 py-3 text-left text-xs tracking-[.08em] transition lg:w-full ${active === item.id ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}><span className="w-5 text-center text-[#c4a262]">{item.icon}</span>{item.label}</button>)}
      </nav>
      <div className="hidden absolute bottom-0 left-0 right-0 border-t border-white/10 p-5 lg:block"><button onClick={logout} className="text-xs tracking-[.14em] uppercase text-white/45 hover:text-white">← Sign out</button></div>
    </aside>
  );
}

function PageTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <header className="mb-9"><p className="text-[10px] tracking-[.25em] uppercase text-[#96723d]">{eyebrow}</p><h1 className="mt-3 text-3xl font-medium tracking-[-.025em] text-[#121212] sm:text-4xl">{title}</h1>{copy && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687077]">{copy}</p>}</header>;
}

function Overview({ go }: { go: (s: Section) => void }) {
  return <>
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><PageTitle eyebrow="Portfolio overview" title="Good morning, James." copy="Here’s what’s happening across your Satis portfolio." /><div className="mb-9 text-right text-xs text-[#7c8285]"><span className="mb-1 block uppercase tracking-[.16em]">Last updated</span>11 August 2026 · 08:30</div></div>
    <div className="grid gap-px overflow-hidden border border-[#d8d7d0] bg-[#d8d7d0] sm:grid-cols-2 xl:grid-cols-4">
      {[{l:"Portfolio value",v:"£4.82m",d:"+8.4% since inception"},{l:"Capital invested",v:"£3.65m",d:"Across 4 active holdings"},{l:"Forecast IRR",v:"17.8%",d:"+0.6% vs. business plan"},{l:"Distributions to date",v:"£428k",d:"Next forecast: Q4 2026"}].map((x,i)=><div key={x.l} className="bg-white p-6"><div className="flex justify-between text-[10px] tracking-[.16em] uppercase text-[#777e82]"><span>{x.l}</span><span>0{i+1}</span></div><p className="mt-6 text-3xl font-medium tracking-tight text-[#121212]">{x.v}</p><p className="mt-2 text-xs text-[#617260]">{x.d}</p></div>)}
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
      <section className="border border-[#d8d7d0] bg-white p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs tracking-[.15em] uppercase text-[#747b7f]">Portfolio performance</p><h2 className="mt-2 text-xl font-medium text-[#121212]">Value progression</h2></div><span className="border border-[#d8d7d0] px-3 py-2 text-[10px] uppercase tracking-wider">All time</span></div><div className="mt-10 h-56"><svg viewBox="0 0 700 220" className="h-full w-full" aria-label="Portfolio value chart"><g stroke="#e5e3dc" strokeWidth="1">{[20,70,120,170,220].map(y=><line key={y} x1="0" x2="700" y1={y} y2={y}/>)}</g><path d="M0 194 C80 188 105 170 160 172 S260 142 315 148 S410 100 465 112 S565 78 700 42" fill="none" stroke="#b18c4d" strokeWidth="3"/><path d="M0 194 C80 188 105 170 160 172 S260 142 315 148 S410 100 465 112 S565 78 700 42 L700 220 L0 220Z" fill="#b18c4d" opacity=".08"/></svg></div><div className="flex justify-between text-[10px] text-[#858b8e]"><span>Q1 2023</span><span>Q1 2024</span><span>Q1 2025</span><span>Q3 2026</span></div></section>
      <section className="bg-[#121212] p-7 text-white"><p className="text-[10px] tracking-[.18em] uppercase text-[#c4a262]">Latest activity</p><div className="mt-6 space-y-6">{updates.slice(0,3).map((u,i)=><div key={u.title} className={i<2?"border-b border-white/10 pb-6":""}><p className="text-[10px] uppercase tracking-wider text-white/40">{u.date} · {u.site}</p><p className="mt-2 text-sm">{u.title}</p></div>)}</div><button onClick={()=>go("updates")} className="mt-8 text-[10px] tracking-[.16em] uppercase text-[#c4a262]">View all updates →</button></section>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">{developments.slice(0,3).map(d=><article key={d.name} className="border border-[#d8d7d0] bg-white p-6"><div className="flex justify-between"><span className="text-[10px] uppercase tracking-[.14em] text-[#6b7969]">{d.status}</span><span className="text-xs text-[#8a8e90]">{d.progress}%</span></div><h3 className="mt-5 text-lg font-medium text-[#121212]">{d.name}</h3><p className="mt-1 text-xs text-[#83888b]">{d.place} · {d.phase}</p><div className="mt-6 h-1 bg-[#e6e3dc]"><div className="h-full bg-[#b18c4d]" style={{width:`${d.progress}%`}} /></div></article>)}</div>
  </>;
}

function Developments() {
  const [selected, setSelected] = useState(0);
  const d = developments[selected];
  return <><PageTitle eyebrow="Live portfolio" title="Developments across Greater Manchester." copy="Track project phase, programme and headline value across every active Satis development." />
    <div className="grid overflow-hidden border border-[#d8d7d0] bg-white xl:grid-cols-[1.4fr_.8fr]">
      <div className="relative min-h-[520px] overflow-hidden bg-[#e8e5dd]">
        <svg viewBox="0 0 800 560" className="absolute inset-0 h-full w-full" aria-label="Stylised map of Greater Manchester"><rect width="800" height="560" fill="#e9e7e0"/><g fill="none" stroke="#c7c5be" strokeWidth="2"><path d="M-30 390 C130 330 205 385 340 310 S580 250 840 310"/><path d="M80 0 C180 140 260 200 245 570"/><path d="M620 -20 C560 110 470 200 490 580"/><path d="M0 160 C170 180 260 115 405 170 S650 190 820 90"/></g><g fill="#dad8d1" stroke="#c7c5be"><path d="M310 170 L500 150 610 245 570 380 390 420 250 330Z"/></g><g fontSize="13" fill="#8a8b87" letterSpacing="2"><text x="370" y="260">MANCHESTER</text><text x="250" y="470">ALTRINCHAM</text><text x="560" y="450">STOCKPORT</text><text x="85" y="130">BOLTON</text></g></svg>
        {developments.map((item,i)=><button key={item.name} onClick={()=>setSelected(i)} aria-label={`View ${item.name}`} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-md transition ${selected===i?"h-6 w-6 bg-[#121212]":"h-4 w-4 bg-[#b18c4d] hover:scale-125"}`} style={{left:`${item.x}%`,top:`${item.y}%`}} />)}
        <div className="absolute bottom-5 left-5 bg-white/95 px-4 py-3 text-[10px] tracking-[.12em] uppercase text-[#777d80]">● Active &nbsp;&nbsp; ◉ Selected</div>
      </div>
      <div className="p-7 sm:p-9"><p className="text-[10px] tracking-[.18em] uppercase text-[#8a6c3f]">Selected development</p><h2 className="mt-4 text-2xl font-medium text-[#121212]">{d.name}</h2><p className="mt-1 text-sm text-[#737a7e]">{d.place}</p><div className="my-8 border-y border-[#deddd7] py-6"><div className="flex justify-between text-xs"><span>Overall progress</span><b>{d.progress}%</b></div><div className="mt-3 h-1 bg-[#e2e0d9]"><div className="h-full bg-[#b18c4d]" style={{width:`${d.progress}%`}} /></div></div><dl className="grid grid-cols-2 gap-7 text-sm"><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Current phase</dt><dd className="mt-2">{d.phase}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Gross value</dt><dd className="mt-2">{d.value}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Programme</dt><dd className="mt-2 text-[#667b62]">{d.status}</dd></div><div><dt className="text-[10px] uppercase tracking-wider text-[#858b8e]">Next report</dt><dd className="mt-2">30 Sep 2026</dd></div></dl><button className="mt-9 w-full bg-[#121212] px-5 py-4 text-xs tracking-[.15em] uppercase text-white">View project report →</button></div>
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

function Insights() { return <><PageTitle eyebrow="Research & perspective" title="Insights for considered investment." copy="Research notes and perspectives from the Satis development and investment teams." /><div className="grid gap-6 lg:grid-cols-3">{insights.map((x,i)=><article key={x.title} className="group flex min-h-[360px] flex-col border border-[#d8d7d0] bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#121212]/5"><div className={`mb-8 h-28 ${i===0?"bg-[#1f1f1f]":i===1?"bg-[#b7ab92]":"bg-[#7f8b7a]"} relative overflow-hidden`}></div><p className="text-[10px] tracking-[.16em] uppercase text-[#96723d]">{x.category} · {x.date}</p><h2 className="mt-4 text-xl font-medium leading-7 text-[#121212]">{x.title}</h2><p className="mt-4 text-sm leading-6 text-[#747b7f]">{x.copy}</p><div className="mt-auto flex justify-between pt-6 text-[10px] uppercase tracking-wider"><span>{x.read} read</span><ArrowIcon/></div></article>)}</div></> }

function Updates() { return <><PageTitle eyebrow="From the ground" title="Site updates." copy="The latest programme, planning and construction news from across the portfolio." /><div className="space-y-4">{updates.map((u,i)=><article key={u.title} className="grid border border-[#d8d7d0] bg-white p-6 sm:grid-cols-[140px_1fr_auto] sm:items-start sm:gap-6"><div><span className="text-[10px] uppercase tracking-wider text-[#8a6c3f]">{u.date}</span><span className="mt-2 block text-xs text-[#7d8386]">Update {String(i+1).padStart(2,"0")}</span></div><div className="mt-4 sm:mt-0"><p className="text-[10px] uppercase tracking-wider text-[#7d8386]">{u.site}</p><h2 className="mt-2 text-xl font-medium text-[#121212]">{u.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#737a7e]">{u.body}</p></div><span className="mt-4 w-fit bg-[#eee9df] px-3 py-2 text-[10px] uppercase tracking-wider text-[#79613b] sm:mt-0">{u.tag}</span></article>)}</div></> }

function Financials() { return <><PageTitle eyebrow="Portfolio reporting" title="Financials." copy="Consolidated performance and upcoming cash events for your Satis holdings." /><div className="grid gap-6 lg:grid-cols-3"><section className="border border-[#d8d7d0] bg-white p-7 lg:col-span-2"><div className="flex justify-between"><div><p className="text-xs uppercase tracking-wider text-[#777e82]">Investment performance</p><h2 className="mt-3 text-2xl text-[#121212]">£4.82m <span className="text-sm text-[#687a64]">+£1.17m</span></h2></div><span className="text-[10px] uppercase tracking-wider text-[#777e82]">GBP</span></div><div className="mt-8 grid h-64 grid-cols-8 items-end gap-3 border-b border-[#d8d7d0]">{[38,44,51,49,63,70,78,92].map((h,i)=><div key={i} className="group relative flex h-full items-end"><div className="w-full bg-[#b18c4d] opacity-80 transition group-hover:opacity-100" style={{height:`${h}%`}}/></div>)}</div><div className="mt-3 flex justify-between text-[10px] text-[#858b8e]"><span>Q4 2024</span><span>Q3 2026</span></div></section><section className="bg-[#121212] p-7 text-white"><p className="text-[10px] uppercase tracking-[.18em] text-[#c4a262]">Next cash events</p><div className="mt-6 space-y-6">{[["30 Sep","Capital call","£125,000"],["15 Nov","Forecast distribution","£86,500"],["20 Dec","Interest payment","£31,200"]].map(x=><div key={x[1]} className="border-b border-white/10 pb-5 last:border-0"><p className="text-[10px] text-white/40">{x[0]}</p><div className="mt-2 flex justify-between text-sm"><span>{x[1]}</span><span>{x[2]}</span></div></div>)}</div></section></div><section className="mt-6 border border-[#d8d7d0] bg-white p-7"><div className="flex justify-between"><h2 className="text-lg font-medium text-[#121212]">Holdings summary</h2><button className="text-[10px] uppercase tracking-wider text-[#8a6c3f]">Export CSV ↓</button></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-[#d8d7d0] text-[10px] uppercase tracking-wider text-[#858b8e]"><tr>{["Investment","Invested","Current value","Forecast IRR","Multiple","Status"].map(x=><th key={x} className="pb-3 font-normal">{x}</th>)}</tr></thead><tbody>{developments.slice(0,4).map((d,i)=><tr key={d.name} className="border-b border-[#ebe9e3]"><td className="py-4 font-medium">{d.name}</td><td>£{["1.20m","0.95m","0.80m","0.70m"][i]}</td><td>£{["1.62m","1.20m","1.13m","0.87m"][i]}</td><td className="text-[#63775e]">{["19.2%","16.4%","18.8%","15.9%"][i]}</td><td>{["1.35x","1.26x","1.41x","1.24x"][i]}</td><td><span className="bg-[#edf0e9] px-2 py-1 text-[10px] uppercase text-[#63775e]">Active</span></td></tr>)}</tbody></table></div></section><p className="mt-5 text-[10px] leading-5 text-[#858b8e]">Forecasts are based on current business plans and are not guaranteed. Values shown are illustrative demo data and do not constitute financial advice.</p></> }

function Documents() { return <><PageTitle eyebrow="Secure data room" title="Documents." copy="Reports, statements and project documents for your portfolio." /><div className="border border-[#d8d7d0] bg-white"><div className="grid grid-cols-[1fr_auto] border-b border-[#d8d7d0] px-6 py-4 text-[10px] uppercase tracking-wider text-[#858b8e] sm:grid-cols-[1fr_170px_130px]"><span>Document</span><span className="hidden sm:block">Published</span><span>Action</span></div>{[["Q2 2026 Portfolio Report","Quarterly report","31 Jul 2026"],["22 St John Street Valuation","Valuation","18 Jul 2026"],["2025–26 Tax Statement","Tax document","30 Jun 2026"],["Barnett House Progress Report 07","Project report","24 Jun 2026"],["Investor Account Statement","Statement","31 Mar 2026"]].map(x=><div key={x[0]} className="grid grid-cols-[1fr_auto] items-center border-b border-[#ebe9e3] px-6 py-5 last:border-0 sm:grid-cols-[1fr_170px_130px]"><div><p className="text-sm font-medium text-[#121212]">{x[0]}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#858b8e]">PDF · {x[1]}</p></div><span className="hidden text-xs text-[#777e82] sm:block">{x[2]}</span><button className="text-xs uppercase tracking-wider text-[#8a6c3f]">Download ↓</button></div>)}</div></> }

export function InvestorPortal() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState<Section>("overview");
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  return <div className="min-h-[calc(100vh-5rem)] bg-[#f4f2ed] text-[#2a2a2a]"><div className="grid lg:grid-cols-[240px_1fr]"><Sidebar active={active} setActive={setActive} logout={()=>setLoggedIn(false)} /><main className="min-w-0 px-5 py-9 sm:px-8 lg:px-10 lg:py-12 xl:px-14">{active==="overview"&&<Overview go={setActive}/>} {active==="developments"&&<Developments/>} {active==="market"&&<Market/>} {active==="insights"&&<Insights/>} {active==="updates"&&<Updates/>} {active==="financials"&&<Financials/>} {active==="documents"&&<Documents/>}</main></div></div>;
}
