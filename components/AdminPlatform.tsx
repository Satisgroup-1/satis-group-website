"use client";

import { useActionState, useState } from "react";
import {
  deleteCapPosition,
  deleteCashEvent,
  deleteDevelopment,
  deleteInsight,
  deleteInvestor,
  deleteOpportunity,
  deleteUpdate,
  importSnapshot,
  saveCapPosition,
  saveCashEvent,
  saveDevelopment,
  saveInsight,
  saveInvestor,
  saveOpportunity,
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
    tier: string;
    value: string;
    positions: number;
  }[];
  developments: {
    id: string;
    name: string;
    place: string;
    address: string;
    phase: string;
    status: string;
    progress: number;
    value: string;
    spvName: string;
    equityValue: string;
  }[];
  capPositions: {
    developmentId: string;
    developmentName: string;
    holder: string;
    /** Set when the holder is a registered platform account. */
    investorId?: string;
    committed: string;
    /** Raw values so inline edits can resubmit the untouched fields. */
    committedRaw: number;
    sharePercentRaw: number;
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
  updates: {
    key: string;
    date: string;
    period?: string;
    site: string;
    title: string;
    tag: string;
    tasks: number;
    file?: string;
  }[];
  insights: { slug: string; category: string; date: string; title: string; read: string }[];
  opportunities: {
    id: string;
    name: string;
    place: string;
    status: string;
    targetRaise: string;
    raisedPercent: number;
    closesOn: string;
  }[];
};

type Tab =
  | "investors"
  | "developments"
  | "captables"
  | "updates"
  | "insights"
  | "opportunities"
  | "data";

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
                  <p className="mt-2 inline-block bg-surface px-2 py-1 text-[10px] tracking-[.12em] uppercase text-accent-text">
                    {inv.tier === "invested"
                      ? "Invested"
                      : "Prospective investor"}
                  </p>
                </div>
                <DeleteButton action={deleteInvestor} fields={{ id: inv.id }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs text-muted">
                <span>
                  <b className="block text-lg font-medium text-foreground">
                    {inv.value}
                  </b>
                  Portfolio value (from cap tables)
                </span>
                <span>
                  <b className="block text-lg font-medium text-foreground">
                    {inv.positions}
                  </b>
                  SPV positions
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
            Account type
            <select className={INPUT} name="tier" defaultValue="prospective">
              <option value="prospective">
                Prospective — data room, raises and research
              </option>
              <option value="invested">
                Invested — positions, financials and monthly reports
              </option>
            </select>
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
            Drives the value-progression chart and its 1Y/3Y/5Y/Max horizons
            in the investor&rsquo;s portal.
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
    <div className="grid gap-10 xl:grid-cols-[1.05fr_.95fr]">
      <div>
        <h3 className="text-xs tracking-[.16em] uppercase text-muted">
          Developments &amp; SPVs
        </h3>
        <ul className="mt-4 space-y-3">
          {data.developments.map((d) => (
            <li
              key={d.id}
              className="flex items-start justify-between gap-4 border border-border p-5"
            >
              <div>
                <h4 className="font-medium">{d.name}</h4>
                <p className="mt-1 text-xs text-muted">{d.address}</p>
                <p className="mt-1 text-xs text-muted">
                  {d.phase} · {d.progress}% · GDV {d.value} · {d.status}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {d.spvName} · equity {d.equityValue} · ID {d.id}
                </p>
              </div>
              <DeleteButton action={deleteDevelopment} fields={{ id: d.id }} />
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="h-fit space-y-4 border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">Add or update development</h3>
        <p className="text-xs leading-5 text-muted">
          Re-using an existing ID updates that development in place. The SPV
          figures drive every linked investor&rsquo;s portfolio value.
        </p>
        <label className={LABEL}>
          Name
          <input className={INPUT} name="name" required />
        </label>
        <label className={LABEL}>
          Full address (shown on the map)
          <input className={INPUT} name="address" placeholder="22 St John Street, Manchester M3 4EB" required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Area label
            <input className={INPUT} name="place" placeholder="Manchester M3" required />
          </label>
          <label className={LABEL}>
            ID (optional)
            <input className={INPUT} name="id" placeholder="court-house" />
          </label>
          <label className={LABEL}>
            Latitude
            <input className={INPUT} name="lat" placeholder="53.4796" required />
          </label>
          <label className={LABEL}>
            Longitude
            <input className={INPUT} name="lng" placeholder="-2.2516" required />
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
        </div>
        <label className={LABEL}>
          Next report date
          <input className={INPUT} name="nextReport" placeholder="2026-09-30" required />
        </label>
        <label className={LABEL}>
          Summary
          <textarea className={`${INPUT} min-h-20`} name="summary" />
        </label>
        <p className="pt-1 text-[10px] tracking-[.14em] uppercase text-accent-text">
          SPV / cap-table basis
        </p>
        <label className={LABEL}>
          SPV name
          <input className={INPUT} name="spvName" placeholder="Satis (Court House) Ltd" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Current equity value
            <input className={INPUT} name="equityValue" placeholder="£5.05m" required />
          </label>
          <label className={LABEL}>
            Total committed
            <input className={INPUT} name="totalCommitted" placeholder="£4.75m" required />
          </label>
          <label className={LABEL}>
            Senior debt
            <input className={INPUT} name="seniorDebt" placeholder="£11.8m" required />
          </label>
          <label className={LABEL}>
            Site forecast IRR %
            <input className={INPUT} name="siteIrr" placeholder="14.8" required />
          </label>
        </div>
        <Result state={state} />
        <Submit pending={pending}>Save development</Submit>
      </form>
    </div>
  );
}

type CapPosition = AdminPlatformData["capPositions"][number];

function formatMoneyShort(value: number): string {
  if (value >= 1_000_000)
    return `£${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}m`;
  if (value >= 1_000) return `£${Math.round(value / 1_000)}k`;
  return `£${value}`;
}

/** One cap-table line: share % editable in place, everything else fixed. */
function CapPositionRow({ position }: { position: CapPosition }) {
  const [state, action, pending] = useActionState(saveCapPosition, {});
  return (
    <li className="px-5 py-3">
      <form action={action} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="developmentId" value={position.developmentId} />
        {position.investorId ? (
          <input type="hidden" name="investorId" value={position.investorId} />
        ) : (
          <input type="hidden" name="holder" value={position.holder} />
        )}
        <input type="hidden" name="committed" value={position.committedRaw} />
        <input type="hidden" name="status" value={position.status} />
        <span className="min-w-0 flex-1 basis-48">
          <span className="block truncate text-sm font-medium">
            {position.holder}
            {position.investorId && (
              <span className="ml-2 bg-accent px-1.5 py-0.5 align-middle text-[9px] uppercase tracking-wider text-ink">
                Account
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            {position.committed} committed · {position.status}
          </span>
        </span>
        <label className="flex items-center gap-1 text-xs text-muted">
          <input
            name="sharePercent"
            type="number"
            step="0.01"
            min="0.01"
            max="100"
            required
            defaultValue={position.sharePercentRaw}
            className={`${INPUT} w-24 py-2`}
            aria-label={`Share % for ${position.holder}`}
          />
          %
        </label>
        <button
          type="submit"
          disabled={pending}
          className="border border-border px-3 py-2 text-[10px] tracking-[.15em] uppercase transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <DeleteButton
          action={deleteCapPosition}
          fields={{
            developmentId: position.developmentId,
            holder: position.holder,
          }}
        />
        <Result state={state} />
      </form>
    </li>
  );
}

/** Adds a registered platform account to one development's cap table. */
function CapAddAccountForm({
  developmentId,
  investors,
}: {
  developmentId: string;
  investors: AdminPlatformData["investors"];
}) {
  const [state, action, pending] = useActionState(saveCapPosition, {});
  return (
    <form action={action} className="border-t border-border bg-surface px-5 py-4">
      <p className="text-[10px] tracking-[.15em] uppercase text-muted">
        Add account to this table
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input type="hidden" name="developmentId" value={developmentId} />
        <select
          name="investorId"
          required
          className={`${INPUT} w-auto min-w-44 flex-1 py-2`}
          aria-label="Platform account"
          defaultValue=""
        >
          <option value="" disabled>
            Choose an account…
          </option>
          {investors.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {inv.name} ({inv.email})
            </option>
          ))}
        </select>
        <input
          name="committed"
          placeholder="Committed, e.g. £250k"
          required
          className={`${INPUT} w-40 py-2`}
          aria-label="Committed capital"
        />
        <label className="flex items-center gap-1 text-xs text-muted">
          <input
            name="sharePercent"
            type="number"
            step="0.01"
            min="0.01"
            max="100"
            placeholder="Share"
            required
            className={`${INPUT} w-24 py-2`}
            aria-label="Share percent"
          />
          %
        </label>
        <button
          type="submit"
          disabled={pending}
          className="border border-foreground bg-foreground px-4 py-2 text-[10px] tracking-[.15em] uppercase text-background transition-colors hover:border-accent hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-4 text-muted">
        Picking an account already on the table updates its line. External
        (non-account) holders are added with the form on the right.
      </p>
      <Result state={state} />
    </form>
  );
}

/** One development's cap table as a collapsible dropdown. */
function CapTableGroup({
  development,
  positions,
  investors,
}: {
  development: AdminPlatformData["developments"][number];
  positions: CapPosition[];
  investors: AdminPlatformData["investors"];
}) {
  const allocated = positions.reduce((sum, p) => sum + p.sharePercentRaw, 0);
  const committed = positions.reduce((sum, p) => sum + p.committedRaw, 0);
  return (
    <details className="group border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-medium">
            {development.name}
            <span className="ml-2 text-xs font-normal text-muted">
              {development.spvName}
            </span>
          </span>
          <span className="mt-1 block text-xs text-muted">
            {positions.length} holder{positions.length === 1 ? "" : "s"} ·{" "}
            {Number(allocated.toFixed(2))}% allocated ·{" "}
            {formatMoneyShort(committed)} committed
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-accent transition-transform duration-200 group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <ul className="divide-y divide-border border-t border-border">
        {positions.length === 0 && (
          <li className="px-5 py-3 text-xs text-muted">
            No holders yet — add the first below.
          </li>
        )}
        {positions.map((p) => (
          <CapPositionRow
            key={`${p.developmentId}-${p.investorId ?? p.holder}`}
            position={p}
          />
        ))}
      </ul>
      <CapAddAccountForm developmentId={development.id} investors={investors} />
    </details>
  );
}

function CapTablesTab({ data }: { data: AdminPlatformData }) {
  const [positionState, positionAction, positionPending] = useActionState(
    saveCapPosition,
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
            SPV cap tables
          </h3>
          <p className="mt-2 text-xs leading-5 text-muted">
            One dropdown per development. Edit a share % in place, add a
            registered account to the table, or remove a line.
          </p>
          <div className="mt-4 space-y-3">
            {data.developments.map((d) => (
              <CapTableGroup
                key={d.id}
                development={d}
                positions={data.capPositions.filter(
                  (p) => p.developmentId === d.id
                )}
                investors={data.investors}
              />
            ))}
          </div>
        </div>
        <form
          action={positionAction}
          className="h-fit space-y-4 border border-border bg-surface p-5"
        >
          <h3 className="text-sm font-medium">Add or update cap-table position</h3>
          <p className="text-xs leading-5 text-muted">
            Portfolio value = share % × SPV equity value; committed capital is
            the cost basis. Positions per SPV cannot exceed 100%. Pick a
            platform investor or name an external holder.
          </p>
          <label className={LABEL}>
            Development / SPV
            <select className={INPUT} name="developmentId" required>
              {data.developments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.spvName}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={LABEL}>
              Platform investor
              <select className={INPUT} name="investorId" defaultValue="">
                <option value="">— external holder —</option>
                {data.investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={LABEL}>
              External holder name
              <input className={INPUT} name="holder" placeholder="Satis Group (GP)" />
            </label>
            <label className={LABEL}>
              Committed
              <input className={INPUT} name="committed" placeholder="£1.2m" required />
            </label>
            <label className={LABEL}>
              Share %
              <input className={INPUT} name="sharePercent" placeholder="30" required />
            </label>
          </div>
          <label className={LABEL}>
            Status
            <select className={INPUT} name="status">
              {["Active", "Realised", "Exited"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <Result state={positionState} />
          <Submit pending={positionPending}>Save position</Submit>
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
          Monthly project reports
        </h3>
        <ul className="mt-4 space-y-3">
          {data.updates.map((u) => (
            <li
              key={u.key}
              className="flex items-start justify-between gap-4 border border-border p-5"
            >
              <div>
                <p className="text-[10px] tracking-[.12em] uppercase text-accent-text">
                  {u.period ?? u.date} · {u.site} · {u.tag}
                </p>
                <h4 className="mt-2 font-medium">{u.title}</h4>
                <p className="mt-1 text-xs text-muted">
                  {u.tasks} task{u.tasks === 1 ? "" : "s"} ·{" "}
                  {u.file ? "report uploaded" : "no report file yet"}
                </p>
              </div>
              <DeleteButton action={deleteUpdate} fields={{ key: u.key }} />
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="h-fit space-y-4 border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">Publish monthly report</h3>
        <p className="text-xs leading-5 text-muted">
          Investors see these under &ldquo;Monthly reports&rdquo;. Add a file
          path to make the full report downloadable, and list the tasks so they
          can ask about any single item.
        </p>
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
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Period
            <input className={INPUT} name="period" placeholder="August 2026" />
          </label>
          <label className={LABEL}>
            Report file (optional)
            <input
              className={INPUT}
              name="file"
              placeholder="/investor-reports/august-2026.pdf"
            />
          </label>
        </div>
        <label className={LABEL}>
          Title
          <input className={INPUT} name="title" required />
        </label>
        <label className={LABEL}>
          Summary
          <textarea className={`${INPUT} min-h-28`} name="body" required />
        </label>
        <label className={LABEL}>
          Tasks (one per line: Title — detail — status)
          <textarea
            className={`${INPUT} min-h-28`}
            name="tasks"
            placeholder="Superstructure — Frame at level three — On programme"
          />
        </label>
        <Result state={state} />
        <Submit pending={pending}>Publish report</Submit>
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
          Separate blocks with a blank line. &ldquo;##&nbsp;&rdquo; starts a
          section heading, &ldquo;-&nbsp;&rdquo; lines become a bullet list,
          and &ldquo;&gt;&nbsp;&rdquo; starts a pull quote (finish it with a
          &ldquo;—&nbsp;Name&rdquo; line for the attribution). Stat rows,
          tables and callouts can be added via the JSON importer. Re-using a
          slug updates the existing article.
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

function OpportunitiesTab({ data }: { data: AdminPlatformData }) {
  const [state, action, pending] = useActionState(saveOpportunity, {});
  return (
    <div className="grid gap-10 xl:grid-cols-[1fr_1fr]">
      <div>
        <h3 className="text-xs tracking-[.16em] uppercase text-muted">
          Upcoming investments
        </h3>
        <ul className="mt-4 space-y-3">
          {data.opportunities.map((o) => (
            <li
              key={o.id}
              className="flex items-start justify-between gap-4 border border-border p-5"
            >
              <div>
                <p className="text-[10px] tracking-[.12em] uppercase text-accent-text">
                  {o.status} · {o.place} · closes {o.closesOn}
                </p>
                <h4 className="mt-2 font-medium">{o.name}</h4>
                <p className="mt-1 text-xs text-muted">
                  Target {o.targetRaise} · {o.raisedPercent}% committed · ID {o.id}
                </p>
              </div>
              <DeleteButton action={deleteOpportunity} fields={{ id: o.id }} />
            </li>
          ))}
        </ul>
      </div>
      <form action={action} className="h-fit space-y-4 border border-border bg-surface p-5">
        <h3 className="text-sm font-medium">Add or update opportunity</h3>
        <p className="text-xs leading-5 text-muted">
          Re-using an existing ID updates that opportunity. Highlights: one
          per line.
        </p>
        <label className={LABEL}>
          Name
          <input className={INPUT} name="name" required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Location
            <input className={INPUT} name="place" placeholder="Stockport" required />
          </label>
          <label className={LABEL}>
            ID (optional)
            <input className={INPUT} name="id" placeholder="qube-stockport" />
          </label>
        </div>
        <label className={LABEL}>
          Address
          <input className={INPUT} name="address" placeholder="St Petersgate, Stockport SK1" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className={LABEL}>
            Status
            <select className={INPUT} name="status">
              <option>Open</option>
              <option>Coming soon</option>
              <option>Fully subscribed</option>
            </select>
          </label>
          <label className={LABEL}>
            Closes on
            <input className={INPUT} name="closesOn" placeholder="2026-10-31" required />
          </label>
          <label className={LABEL}>
            Target raise
            <input className={INPUT} name="targetRaise" placeholder="£3.2m" required />
          </label>
          <label className={LABEL}>
            Raised to date
            <input className={INPUT} name="raisedToDate" placeholder="£2.1m" />
          </label>
          <label className={LABEL}>
            Min commitment
            <input className={INPUT} name="minCommitment" placeholder="£50k" required />
          </label>
          <label className={LABEL}>
            Target IRR %
            <input className={INPUT} name="targetIrr" placeholder="18.5" required />
          </label>
          <label className={LABEL}>
            Target multiple
            <input className={INPUT} name="targetMultiple" placeholder="1.6x" />
          </label>
          <label className={LABEL}>
            Horizon
            <input className={INPUT} name="horizon" placeholder="30 months" />
          </label>
        </div>
        <label className={LABEL}>
          Structure
          <input className={INPUT} name="structure" placeholder="Ordinary shares in Satis (QUBE) Ltd" />
        </label>
        <label className={LABEL}>
          Summary
          <textarea className={`${INPUT} min-h-20`} name="summary" required />
        </label>
        <label className={LABEL}>
          Highlights (one per line)
          <textarea className={`${INPUT} min-h-28`} name="highlights" />
        </label>
        <Result state={state} />
        <Submit pending={pending}>Save opportunity</Submit>
      </form>
    </div>
  );
}

function DataTab({ data }: { data: AdminPlatformData }) {
  const [state, action, pending] = useActionState(importSnapshot, {});
  const counts: [string, number][] = [
    ["Investors", data.investors.length],
    ["Developments", data.developments.length],
    ["Cap-table lines", data.capPositions.length],
    ["Cash events", data.cashEvents.length],
    ["Updates", data.updates.length],
    ["Insights", data.insights.length],
    ["Opportunities", data.opportunities.length],
  ];
  return (
    <div className="max-w-3xl space-y-8">
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
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
          developments, cap-tables, cash-events, updates, documents,
          insights, opportunities). Only the datasets present are replaced.
          Cap tables are validated so no SPV exceeds 100%. Investor records
          may include a plaintext <code>password</code> field — it is
          scrypt-hashed on import and never stored.
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
            placeholder='{"investors": [...], "cap-tables": [...]}'
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
    ["developments", "Developments & SPVs", data.developments.length],
    ["captables", "Cap tables & returns", data.capPositions.length + data.cashEvents.length],
    ["updates", "Monthly reports", data.updates.length],
    ["insights", "Insights", data.insights.length],
    ["opportunities", "Opportunities", data.opportunities.length],
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
        {tab === "captables" && <CapTablesTab data={data} />}
        {tab === "updates" && <UpdatesTab data={data} />}
        {tab === "insights" && <InsightsTab data={data} />}
        {tab === "opportunities" && <OpportunitiesTab data={data} />}
        {tab === "data" && <DataTab data={data} />}
      </div>
    </section>
  );
}
