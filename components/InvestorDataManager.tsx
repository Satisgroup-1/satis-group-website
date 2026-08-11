"use client";

import { useActionState } from "react";
import {
  importInvestorData,
  type ImportInvestorDataState,
} from "@/app/admin/actions";

export function InvestorDataManager({
  summary,
}: {
  summary: { users: number; portfolios: number; developments: number; articles: number; updatedAt: string };
}) {
  const [state, action, pending] = useActionState<ImportInvestorDataState, FormData>(
    importInvestorData,
    {}
  );
  return (
    <section className="border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-accent">Investor data</p>
          <h2 className="mt-3 text-2xl font-medium">Platform data import.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Upload a complete JSON dataset to manage investor profiles, portfolios,
            holdings, developments, updates, documents and insight articles.
          </p>
        </div>
        <a href="/api/investor-data" className="border border-border px-4 py-3 text-xs tracking-[.14em] uppercase hover:border-accent hover:text-accent">
          Export current JSON ↓
        </a>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {Object.entries({ Users: summary.users, Portfolios: summary.portfolios, Developments: summary.developments, Insights: summary.articles }).map(([label, value]) => (
          <div key={label} className="bg-background p-4"><b className="text-2xl font-medium">{value}</b><span className="mt-1 block text-[10px] tracking-wider uppercase text-muted">{label}</span></div>
        ))}
      </div>
      <form action={action} className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-2 text-xs tracking-wider uppercase text-muted">
          JSON dataset
          <input name="dataset" type="file" accept="application/json,.json" required className="border border-border bg-background p-3 text-sm normal-case tracking-normal" />
        </label>
        <button type="submit" disabled={pending} className="bg-ink px-6 py-4 text-xs tracking-[.16em] uppercase text-ink-foreground disabled:opacity-50">
          {pending ? "Validating…" : "Validate & import"}
        </button>
      </form>
      {state.error && <p role="alert" className="mt-4 text-sm text-clay">{state.error}</p>}
      {state.success && <p role="status" className="mt-4 text-sm text-sage">{state.success}</p>}
      <p className="mt-5 text-xs leading-5 text-muted">Last dataset update: {new Date(summary.updatedAt).toLocaleString("en-GB")}. Imports write to <code>data/investor-platform.json</code>; use a persistent volume or database adapter in serverless production.</p>
    </section>
  );
}
