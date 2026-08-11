"use client";

import { useActionState, useState } from "react";
import {
  deleteCashEvent,
  deleteDevelopment,
  deleteHolding,
  deleteInsight,
  deleteInvestor,
  deleteUpdate,
  importSnapshot,
  saveCashEvent,
  saveDevelopment,
  saveHolding,
  saveInsight,
  saveInvestor,
  saveUpdate,
  saveValueHistoryPoint,
  type PlatformActionState,
} from "@/app/admin/platform/actions";

// Server-assembled, display-safe rows (no password hashes reach the client).
export type AdminPlatformData = {
  investors: {
    id: string;
    name: string;
    contactName: string;
    email: string;
    joined: string;
    value: string;
    holdings: number;
  }[];
  developments: {
    id: string;
    name: string;
    place: string;
    phase: string;
    status: string;
    progress: number;
    value: string;
  }[];
  holdings: {
    investorId: string;
    investorName: string;
    developmentId: string;
    developmentName: string;
    invested: string;
    currentValue: string;
    forecastIrr: string;
    status: string;
  }[];
  cashEvents: {
    key: string;
    investorName: string;
    date: string;
    type: string;
    amount: string;
    status: string;
  }[];
  updates: { key: string; date: string; site: string; title: string; tag: string }[];
  insights: { slug: string; category: string; date: string; title: string; read: string }[];
};

type Tab = "investors" | "developments" | "holdings" | "updates" | "insights" | "data";

type StateAction = (
  prev: PlatformActionState,
  formData: FormData
) => Promise<PlatformActionState>;

const INPUT =
  "w-full border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const LABEL =
  "flex flex-col gap-2 text-[10px] tracking-[.14em] uppercase text-muted";

function Result({ state }: { state: PlatformActionState }) {
  if (state.error)
    return (
      <p role="alert" className="text-sm text-clay">
        {state.error}
      </p>
    );
  if (state.success)
    return (
      <p role="status" className="text-sm text-sage">
        {state.success}
      </p>
    );
  return null;
}

function Submit({ pending, children }: { pending: boolean; children: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit bg-ink px-6 py-3 text-xs tracking-[.15em] uppercase text-ink-foreground transition-colors hover:bg-accent disabled:opacity-50"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

/** Inline delete form; errors (e.g. integrity guards) surface next to it. */
function DeleteButton({
  action,
  fields,
  label = "Remove",
}: {
  action: StateAction;
  fields: Record<string, string>;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="text-right">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        disabled={pending}
        className="text-[10px] tracking-[.1em] uppercase text-clay transition-colors hover:text-foreground disabled:opacity-50"
      >
        {pending ? "…" : label}
      </button>
      {state.error && (
        <p role="alert" className="mt-1 max-w-44 text-[10px] leading-4 text-clay">
          {state.error}
        </p>
      )}
    </form>
  );
}

function InvestorsTab({ data }: { data: AdminPlatformData }) {
  const [investorState, investorAction, investorPending] = useActionState(
    saveInvestor,
    {}
  );
  const [valueState, valueAction, valuePending] = useActionState(
    saveValueHistoryPoint,
    {}
  );
  return (
    <div className="grid gap-10 xl:grid-cols-[1.15fr_.85fr]">
      <div>
        <h3 className="text-xs tracking-[.16em] uppercase text-muted">
          Investor accounts
        </h3>
        <ul className="mt-4 space-y-3">
          {data.investors.map((inv) => (
            <li key={inv.id} className="border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium">{inv.name}</h4>
                  <p className="mt-1 text-sm text-muted">
                    {inv.contactName} · {inv.email}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    ID {inv.id} · joined {inv.joined}
                  </p>
                </div>
                <DeleteButton action={deleteInvestor} fields={{ id: inv.id }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs text-muted">
                <span>
                  <b className="block text-lg font-medium text-foreground">
                    {inv.value}
                  </b>
                  Portfolio value
                </span>
                <span>
                  <b className="block text-lg font-medium text-foreground">
                    {inv.holdings}
                  </b>
                  Holdings
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-8">
        <form
          action={investorAction}
          className="space-y-4 border border-border bg-surface p-5"
        >
          <h3 className="text-sm font-medium">Add or update investor</h3>
          <p className="text-xs leading-5 text-muted">
            Re-using an existing account ID updates that investor; leave ID
            blank to derive it from the account name. Passwords are hashed
            with scrypt before they are stored.
          </p>
          <label className={LABEL}>
            Account / entity name
            <input className={INPUT} name="name" required />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={LABEL}>
              Contact first name
              <input className={INPUT} name="contactName" required />
            </label>
            <label className={LABEL}>
              Account ID (optional)
              <input className={INPUT} name="id" placeholder="hartwell" />
            </label>
          </div>
          <label className={LABEL}>
            Login email
            <input className={INPUT} name="email" required />
          </label>
          <label className={LABEL}>
            Password (blank keeps the current one)
            <input className={INPUT} name="password" type="password" autoComplete="new-password" />
          </label>
          <Result state={investorState} />
          <Submit pending={investorPending}>Save investor</Submit>
        </form>
        <form
          action={valueAction}
          className="space-y-4 border border-border bg-surface p-5"
        >
          <h3 className="text-sm font-medium">Record quarterly valuation</h3>
          <p className="text-xs leading-5 text-muted">
            Drives the value-progression chart and financial bars in the
            investor&rsquo;s portal.
          </p>
          <label className={LABEL}>
            Investor
            <select className={INPUT} name="investorId" required>
              {data.investors.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={LABEL}>
              Period label
              <input className={INPUT} name="label" placeholder="Q3 2026" required />
            </label>
            <label className={LABEL}>
              Portfolio value
              <input className={INPUT} name="value" placeholder="£4.82m" required />
            </label>
          </div>
          <Result state={valueState} />
          <Submit pending={valuePending}>Record valuation</Submit>
        </form>
      </div>
    </div>
  );
}

function DevelopmentsTab({ data }: { data: AdminPlatformData }) {
  const [state, action, pending] = useActionState(saveDevelopment, {});
  return (
    <div className="grid gap-10 xl:grid-cols-[1.15fr_.85fr]">
      <div>
        <h3 className="text-xs tracking-[.16em] uppercase text-muted">
          Developments
        </h3>
        <ul className="mt-4 space-y-3">
          {data.developments.map((d) => (
            <li
              key={d.id}
              className="flex items-start justify-between gap-4 border border-border p-5"
            >
              <div>
                <h4 className="font-medium">{d.name}</h4>
                <p className="mt-1 text-xs text-muted">
                  {d.place} · {d.phase} · {d.progress}% · {d.value} · {d.status}
                </p>
                <p className="mt-1 text-xs text-muted">ID {d.id}</p>
              </div>
              <DeleteButton action={deleteDevelopment} fields={{ id: d.id }} />
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="h-fit space-y-4 border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">Add or update development</h3>
        <p className="text-xs leading-5 text-muted">
          Re-using an existing ID updates that development in place.
        </p>
        <label className={LABEL}>
          Name
          <input className={INPUT} name="name" required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Location
            <input className={INPUT} name="place" placeholder="Manchester M3" required />
          </label>
          <label className={LABEL}>
            ID (optional)
            <input className={INPUT} name="id" placeholder="court-house" />
          </label>
          <label className={LABEL}>
            Status
            <input className={INPUT} name="status" placeholder="On programme" />
          </label>
          <label className={LABEL}>
            Phase
            <input className={INPUT} name="phase" placeholder="Construction" />
          </label>
          <label className={LABEL}>
            Progress %
            <input className={INPUT} name="progress" type="number" min="0" max="100" />
          </label>
          <label className={LABEL}>
            Gross value (GDV)
            <input className={INPUT} name="gdv" placeholder="£12.5m" required />
          </label>
          <label className={LABEL}>
            Map X %
            <input className={INPUT} name="x" type="number" min="0" max="100" />
          </label>
          <label className={LABEL}>
            Map Y %
            <input className={INPUT} name="y" type="number" min="0" max="100" />
          </label>
        </div>
        <label className={LABEL}>
          Next report date
          <input className={INPUT} name="nextReport" placeholder="2026-09-30" required />
        </label>
        <label className={LABEL}>
          Summary
          <textarea className={`${INPUT} min-h-24`} name="summary" />
        </label>
        <Result state={state} />
        <Submit pending={pending}>Save development</Submit>
      </form>
    </div>
  );
}

function HoldingsTab({ data }: { data: AdminPlatformData }) {
  const [holdingState, holdingAction, holdingPending] = useActionState(
    saveHolding,
    {}
  );
  const [eventState, eventAction, eventPending] = useActionState(
    saveCashEvent,
    {}
  );
  return (
    <div className="space-y-12">
      <div className="grid gap-10 xl:grid-cols-[1.15fr_.85fr]">
        <div>
          <h3 className="text-xs tracking-[.16em] uppercase text-muted">
            Holdings
          </h3>
          <ul className="mt-4 space-y-3">
            {data.holdings.map((h) => (
              <li
                key={`${h.investorId}-${h.developmentId}`}
                className="flex items-start justify-between gap-4 border border-border p-5"
              >
                <div>
                  <h4 className="font-medium">
                    {h.investorName} · {h.developmentName}
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    {h.invested} invested · {h.currentValue} current ·{" "}
                    {h.forecastIrr} IRR · {h.status}
                  </p>
                </div>
                <DeleteButton
                  action={deleteHolding}
                  fields={{
                    investorId: h.investorId,
                    developmentId: h.developmentId,
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
        <form
          action={holdingAction}
          className="h-fit space-y-4 border border-border bg-surface p-5"
        >
          <h3 className="text-sm font-medium">Assign or update holding</h3>
          <p className="text-xs leading-5 text-muted">
            Portfolio value, invested capital, weighted IRR and the equity
            multiple are computed from these figures.
          </p>
          <label className={LABEL}>
            Investor
            <select className={INPUT} name="investorId" required>
              {data.investors.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name}
                </option>
              ))}
            </select>
          </label>
          <label className={LABEL}>
            Development
            <select className={INPUT} name="developmentId" required>
              {data.developments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={LABEL}>
              Invested
              <input className={INPUT} name="invested" placeholder="£1.2m" required />
            </label>
            <label className={LABEL}>
              Current value
              <input className={INPUT} name="currentValue" placeholder="£1.62m" required />
            </label>
            <label className={LABEL}>
              Forecast IRR %
              <input className={INPUT} name="forecastIrr" placeholder="19.2" required />
            </label>
            <label className={LABEL}>
              Status
              <select className={INPUT} name="status">
                {["Active", "Realised", "Exited"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <Result state={holdingState} />
          <Submit pending={holdingPending}>Save holding</Submit>
        </form>
      </div>
      <div className="grid gap-10 xl:grid-cols-[1.15fr_.85fr]">
        <div>
          <h3 className="text-xs tracking-[.16em] uppercase text-muted">
            Project returns &amp; cash events
          </h3>
          <ul className="mt-4 space-y-3">
            {data.cashEvents.map((e) => (
              <li
                key={e.key}
                className="flex items-start justify-between gap-4 border border-border p-5"
              >
                <div>
                  <h4 className="font-medium">
                    {e.type} · {e.amount}
                  </h4>
                  <p className="mt-1 text-xs text-muted">
                    {e.investorName} · {e.date} · {e.status}
                  </p>
                </div>
                <DeleteButton action={deleteCashEvent} fields={{ key: e.key }} />
              </li>
            ))}
          </ul>
        </div>
        <form
          action={eventAction}
          className="h-fit space-y-4 border border-border bg-surface p-5"
        >
          <h3 className="text-sm font-medium">Record cash event</h3>
          <p className="text-xs leading-5 text-muted">
            Paid distributions and interest feed &ldquo;distributions to
            date&rdquo;; forecast events appear under next cash events.
          </p>
          <label className={LABEL}>
            Investor
            <select className={INPUT} name="investorId" required>
              {data.investors.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={LABEL}>
              Type
              <select className={INPUT} name="type">
                {[
                  "Distribution",
                  "Forecast distribution",
                  "Capital call",
                  "Interest payment",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className={LABEL}>
              Status
              <select className={INPUT} name="status">
                <option>Forecast</option>
                <option>Paid</option>
              </select>
            </label>
            <label className={LABEL}>
              Date
              <input className={INPUT} name="date" placeholder="2026-09-30" required />
            </label>
            <label className={LABEL}>
              Amount
              <input className={INPUT} name="amount" placeholder="£125,000" required />
            </label>
          </div>
          <label className={LABEL}>
            Related development (optional)
            <select className={INPUT} name="developmentId">
              <option value="">—</option>
              {data.developments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <Result state={eventState} />
          <Submit pending={eventPending}>Record event</Submit>
        </form>
      </div>
    </div>
  );
}

function UpdatesTab({ data }: { data: AdminPlatformData }) {
  const [state, action, pending] = useActionState(saveUpdate, {});
  return (
    <div className="grid gap-10 xl:grid-cols-[1.15fr_.85fr]">
      <div>
        <h3 className="text-xs tracking-[.16em] uppercase text-muted">
          Site updates
        </h3>
        <ul className="mt-4 space-y-3">
          {data.updates.map((u) => (
            <li
              key={u.key}
              className="flex items-start justify-between gap-4 border border-border p-5"
            >
              <div>
                <p className="text-[10px] tracking-[.12em] uppercase text-accent-text">
                  {u.date} · {u.site} · {u.tag}
                </p>
                <h4 className="mt-2 font-medium">{u.title}</h4>
              </div>
              <DeleteButton action={deleteUpdate} fields={{ key: u.key }} />
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="h-fit space-y-4 border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">Publish site update</h3>
        <label className={LABEL}>
          Development
          <select className={INPUT} name="developmentId" required>
            {data.developments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Date
            <input className={INPUT} name="date" placeholder="2026-08-11" required />
          </label>
          <label className={LABEL}>
            Category
            <input className={INPUT} name="tag" placeholder="Construction" />
          </label>
        </div>
        <label className={LABEL}>
          Title
          <input className={INPUT} name="title" required />
        </label>
        <label className={LABEL}>
          Update
          <textarea className={`${INPUT} min-h-28`} name="body" required />
        </label>
        <Result state={state} />
        <Submit pending={pending}>Publish update</Submit>
      </form>
    </div>
  );
}

function InsightsTab({ data }: { data: AdminPlatformData }) {
  const [state, action, pending] = useActionState(saveInsight, {});
  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_1fr]">
      <div>
        <h3 className="text-xs tracking-[.16em] uppercase text-muted">
          Published insights
        </h3>
        <ul className="mt-4 space-y-3">
          {data.insights.map((i) => (
            <li
              key={i.slug}
              className="flex items-start justify-between gap-4 border border-border p-5"
            >
              <div>
                <p className="text-[10px] tracking-[.12em] uppercase text-accent-text">
                  {i.category} · {i.date} · {i.read}
                </p>
                <h4 className="mt-2 font-medium">{i.title}</h4>
                <p className="mt-1 text-xs text-muted">Slug: {i.slug}</p>
              </div>
              <DeleteButton action={deleteInsight} fields={{ slug: i.slug }} />
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="h-fit space-y-4 border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">Compose insight article</h3>
        <p className="text-xs leading-5 text-muted">
          Separate blocks with a blank line. Start a line with
          &ldquo;##&nbsp;&rdquo; for a section heading and use
          &ldquo;-&nbsp;&rdquo; lines for bullet lists. Re-using a slug
          updates the existing article.
        </p>
        <label className={LABEL}>
          Title
          <input className={INPUT} name="title" required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Category
            <input className={INPUT} name="category" placeholder="Market note" />
          </label>
          <label className={LABEL}>
            Date
            <input className={INPUT} name="date" placeholder="2026-08-11" required />
          </label>
          <label className={LABEL}>
            Read time
            <input className={INPUT} name="read" placeholder="6 min" />
          </label>
          <label className={LABEL}>
            Card colour
            <select className={INPUT} name="theme">
              <option value="dark">Charcoal</option>
              <option value="sand">Sand</option>
              <option value="sage">Sage</option>
            </select>
          </label>
        </div>
        <label className={LABEL}>
          Slug (optional)
          <input className={INPUT} name="slug" placeholder="derived-from-title" />
        </label>
        <label className={LABEL}>
          Summary
          <textarea className={`${INPUT} min-h-20`} name="summary" required />
        </label>
        <label className={LABEL}>
          Article body
          <textarea className={`${INPUT} min-h-64`} name="body" required />
        </label>
        <Result state={state} />
        <Submit pending={pending}>Publish insight</Submit>
      </form>
    </div>
  );
}

function DataTab({ data }: { data: AdminPlatformData }) {
  const [state, action, pending] = useActionState(importSnapshot, {});
  const counts: [string, number][] = [
    ["Investors", data.investors.length],
    ["Developments", data.developments.length],
    ["Holdings", data.holdings.length],
    ["Cash events", data.cashEvents.length],
    ["Updates", data.updates.length],
    ["Insights", data.insights.length],
  ];
  return (
    <div className="max-w-3xl space-y-8">
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
        {counts.map(([label, value]) => (
          <div key={label} className="bg-background p-4">
            <b className="text-2xl font-medium">{value}</b>
            <span className="mt-1 block text-[10px] tracking-[.12em] uppercase text-muted">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href="/api/investor-data"
          className="border border-border px-5 py-3 text-xs tracking-[.14em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Export current dataset ↓
        </a>
        <p className="text-xs text-muted">
          Downloads every dataset as one JSON snapshot — the same shape the
          importer accepts.
        </p>
      </div>
      <form action={action} className="space-y-4 border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">Bulk import</h3>
        <p className="text-xs leading-5 text-muted">
          Upload or paste a JSON object keyed by dataset (investors,
          developments, holdings, cash-events, updates, documents, insights).
          Only the datasets present are replaced. Investor records may include
          a plaintext <code>password</code> field — it is scrypt-hashed on
          import and never stored.
        </p>
        <label className={LABEL}>
          JSON file
          <input
            className={`${INPUT} normal-case tracking-normal`}
            name="dataset"
            type="file"
            accept="application/json,.json"
          />
        </label>
        <label className={LABEL}>
          …or paste JSON
          <textarea
            className={`${INPUT} min-h-40 font-mono text-xs normal-case tracking-normal`}
            name="json"
            placeholder='{"investors": [...], "holdings": [...]}'
          />
        </label>
        <Result state={state} />
        <Submit pending={pending}>Validate &amp; import</Submit>
      </form>
      <p className="text-xs leading-5 text-muted">
        On read-only hosting (e.g. Vercel) writes are rejected with an
        explanation — edit the JSON files in{" "}
        <code>content/investors/</code> and commit them instead. The export
        above always reflects what this deployment is serving.
      </p>
    </div>
  );
}

export function AdminPlatform({ data }: { data: AdminPlatformData }) {
  const [tab, setTab] = useState<Tab>("investors");
  const tabs: [Tab, string, number][] = [
    ["investors", "Investors", data.investors.length],
    ["developments", "Developments", data.developments.length],
    ["holdings", "Holdings & returns", data.holdings.length + data.cashEvents.length],
    ["updates", "Site updates", data.updates.length],
    ["insights", "Insights", data.insights.length],
    ["data", "Import / export", 0],
  ];
  return (
    <section className="border border-border">
      <nav
        className="flex overflow-x-auto border-b border-border"
        aria-label="Investor platform data"
      >
        {tabs.map(([id, name, count]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`min-w-max border-r border-border px-5 py-4 text-xs tracking-[.08em] transition-colors ${
              tab === id
                ? "bg-ink text-ink-foreground"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {name}
            {count > 0 && <span className="ml-2 opacity-60">{count}</span>}
          </button>
        ))}
      </nav>
      <div className="p-5 sm:p-8">
        {tab === "investors" && <InvestorsTab data={data} />}
        {tab === "developments" && <DevelopmentsTab data={data} />}
        {tab === "holdings" && <HoldingsTab data={data} />}
        {tab === "updates" && <UpdatesTab data={data} />}
        {tab === "insights" && <InsightsTab data={data} />}
        {tab === "data" && <DataTab data={data} />}
      </div>
    </section>
  );
}
