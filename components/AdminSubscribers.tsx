"use client";

import { useActionState, useMemo, useState } from "react";
import {
  addSubscriberManually,
  deleteSubscriber,
  resubscribeSubscriber,
  unsubscribeSubscriber,
  type SubscriberActionState,
} from "@/app/admin/newsletter/subscribers/actions";

// Display-safe rows assembled on the server.
export type SubscriberRow = {
  email: string;
  name?: string;
  source: string;
  status: "subscribed" | "unsubscribed";
  /** Pre-formatted for display. */
  signedUp: string;
  /** ISO timestamp, used for the CSV export. */
  signedUpAt: string;
};

const INPUT =
  "w-full border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const LABEL =
  "flex flex-col gap-2 text-[10px] tracking-[.14em] uppercase text-muted";

type Filter = "subscribed" | "unsubscribed" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "subscribed", label: "Subscribed" },
  { id: "unsubscribed", label: "Unsubscribed" },
  { id: "all", label: "Everyone" },
];

function Result({ state }: { state: SubscriberActionState }) {
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

/** Inline single-address form; its own result surfaces beside the row. */
function RowAction({
  action,
  email,
  label,
  busyLabel = "…",
}: {
  action: (
    prev: SubscriberActionState,
    formData: FormData
  ) => Promise<SubscriberActionState>;
  email: string;
  label: string;
  busyLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction}>
      <input type="hidden" name="email" value={email} />
      <button
        type="submit"
        disabled={pending}
        className="text-[10px] tracking-[.1em] uppercase text-muted transition-colors hover:text-accent disabled:opacity-50"
      >
        {pending ? busyLabel : label}
      </button>
      {state.error && (
        <p role="alert" className="mt-1 max-w-44 text-[10px] leading-4 text-clay">
          {state.error}
        </p>
      )}
    </form>
  );
}

function toCsv(rows: SubscriberRow[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = [
    ["Email", "Name", "Status", "Source", "Signed up"].join(","),
    ...rows.map((row) =>
      [
        row.email,
        row.name ?? "",
        row.status,
        row.source,
        row.signedUpAt,
      ]
        .map(escape)
        .join(",")
    ),
  ];
  return lines.join("\r\n");
}

export function AdminSubscribers({ rows }: { rows: SubscriberRow[] }) {
  const [addState, addAction, addPending] = useActionState(
    addSubscriberManually,
    {}
  );
  const [filter, setFilter] = useState<Filter>("subscribed");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      subscribed: rows.filter((row) => row.status === "subscribed").length,
      unsubscribed: rows.filter((row) => row.status === "unsubscribed").length,
      all: rows.length,
    }),
    [rows]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!needle) return true;
      return (
        row.email.includes(needle) ||
        (row.name?.toLowerCase().includes(needle) ?? false)
      );
    });
  }, [rows, filter, query]);

  const download = () => {
    const blob = new Blob([toCsv(visible)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `satis-newsletter-subscribers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-10 xl:grid-cols-[1.2fr_.8fr]">
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex gap-8" data-guide="counts">
            <span className="text-xs text-muted">
              <b className="block text-2xl font-medium text-foreground">
                {counts.subscribed}
              </b>
              Subscribed
            </span>
            <span className="text-xs text-muted">
              <b className="block text-2xl font-medium text-foreground">
                {counts.unsubscribed}
              </b>
              Unsubscribed
            </span>
          </div>
          <button
            type="button"
            data-guide="download"
            onClick={download}
            disabled={visible.length === 0}
            className="border border-border px-5 py-3 text-[10px] tracking-[.15em] uppercase transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Filter the signup list"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
                className={`border px-4 py-2 text-[10px] tracking-[.15em] uppercase transition-colors ${
                  filter === option.id
                    ? "border-accent text-accent-text"
                    : "border-border text-muted hover:border-accent"
                }`}
              >
                {option.label} ({counts[option.id]})
              </button>
            ))}
          </div>
          <label className="ml-auto flex-1 sm:max-w-64">
            <span className="sr-only">Search the signup list</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or email"
              className={INPUT}
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="mt-8 border border-border px-5 py-8 text-sm text-muted">
            {rows.length === 0
              ? "Nobody has signed up yet. Addresses appear here automatically as soon as someone uses the signup form on the news page."
              : "No signups match that search."}
          </p>
        ) : (
          <ul
            data-guide="signups"
            className="mt-8 divide-y divide-border border-t border-b border-border"
          >
            {visible.map((row) => (
              <li
                key={row.email}
                className="flex flex-wrap items-start justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    {row.name ? `${row.name} · ` : ""}
                    {row.email}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {row.signedUp} · {row.source}
                    {row.status === "unsubscribed" && " · unsubscribed"}
                  </p>
                </div>
                <div className="flex items-start gap-5">
                  {row.status === "subscribed" ? (
                    <RowAction
                      action={unsubscribeSubscriber}
                      email={row.email}
                      label="Unsubscribe"
                    />
                  ) : (
                    <RowAction
                      action={resubscribeSubscriber}
                      email={row.email}
                      label="Resubscribe"
                    />
                  )}
                  <RowAction
                    action={deleteSubscriber}
                    email={row.email}
                    label="Delete"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        action={addAction}
        className="h-fit space-y-4 border border-border bg-surface p-5"
      >
        <h3 className="text-sm font-medium">Add someone by hand</h3>
        <p className="text-xs leading-5 text-muted">
          For people who ask to be added away from the website — at an event,
          by phone or over email. Signups from the website land in the list on
          their own.
        </p>
        <label className={LABEL}>
          Email
          <input className={INPUT} name="email" type="email" required />
        </label>
        <label className={LABEL}>
          Name (optional)
          <input className={INPUT} name="name" type="text" />
        </label>
        <button
          type="submit"
          disabled={addPending}
          className="w-fit bg-ink px-6 py-3 text-xs tracking-[.15em] uppercase text-ink-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          {addPending ? "Adding…" : "Add to list"}
        </button>
        <Result state={addState} />
      </form>
    </div>
  );
}
