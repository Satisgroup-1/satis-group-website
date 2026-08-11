"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createNewsletter,
  type CreateNewsletterState,
} from "@/app/admin/actions";

const INPUT_CLASS =
  "w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-300 focus:border-accent";

export function NewsletterComposer({ today }: { today: string }) {
  const [state, action, pending] = useActionState<
    CreateNewsletterState,
    FormData
  >(createNewsletter, {});

  return (
    <form action={action} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Title
        </span>
        <input
          name="title"
          type="text"
          required
          placeholder="The Courthouse launches in Macclesfield"
          className={INPUT_CLASS}
        />
      </label>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-muted">
            Date
          </span>
          <input
            name="date"
            type="date"
            required
            defaultValue={today}
            className={INPUT_CLASS}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Summary
        </span>
        <input
          name="summary"
          type="text"
          required
          placeholder="One line shown in the archive list."
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Body
        </span>
        <textarea
          name="body"
          required
          rows={12}
          placeholder={
            "Plain paragraphs of text.\n\n## A section heading\n\n- Bullet points\n- work too"
          }
          className={`${INPUT_CLASS} resize-y font-mono text-xs leading-relaxed`}
        />
        <span className="text-xs leading-relaxed text-muted">
          Paragraphs are separated by blank lines. Start a line with
          &ldquo;## &rdquo; for a section heading, or &ldquo;- &rdquo; for
          bullet points.
        </span>
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-clay">
          {state.error}
        </p>
      )}
      {state.createdSlug && (
        <p className="border border-border p-4 text-sm">
          Issue published.{" "}
          <Link
            href={`/news/${state.createdSlug}`}
            className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            View {state.createdSlug} {"→"}
          </Link>
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Publishing…" : "Publish issue"}
        </button>
      </div>
    </form>
  );
}
