"use client";

import { useActionState } from "react";
import {
  createAdminAccountEntry,
  type CreateAccountState,
} from "@/app/admin/accounts/actions";

const INPUT_CLASS =
  "w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-300 focus:border-accent";

const LABEL_CLASS = "text-xs tracking-[0.2em] uppercase text-muted";

export function AdminAccounts({
  usernames,
  demoMode,
}: {
  usernames: string[];
  demoMode: boolean;
}) {
  const [state, action, pending] = useActionState<CreateAccountState, FormData>(
    createAdminAccountEntry,
    {}
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-xs tracking-[0.35em] uppercase text-accent-text">
        Current accounts
      </h2>
      {demoMode ? (
        <p className="mt-4 text-sm leading-6 text-muted">
          No real accounts are configured — the site is running on the public
          demo credentials (test/test). Create the first account below and set
          the result as SATIS_ADMIN_USERS in the hosting environment; the demo
          pair stops working the moment that variable exists.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {usernames.map((username) => (
            <li key={username} className="border border-border px-4 py-3">
              {username}
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-14 text-xs tracking-[0.35em] uppercase text-accent-text">
        Add an account
      </h2>
      <p className="mt-4 text-sm leading-6 text-muted">
        Accounts are stored in the hosting environment, not on this site, so
        adding one is a two-step job: generate the credential entry here, then
        paste it into Vercel. Re-using an existing email generates a
        replacement entry — that is also how a password is reset.
      </p>

      <form action={action} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className={LABEL_CLASS}>Email</span>
          <input
            name="username"
            type="email"
            autoComplete="off"
            required
            className={INPUT_CLASS}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={LABEL_CLASS}>
            Password — leave blank to generate one
          </span>
          <input
            name="password"
            type="text"
            autoComplete="off"
            minLength={12}
            className={INPUT_CLASS}
          />
        </label>
        {state.error && (
          <p role="alert" className="text-sm text-clay">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="self-start border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent disabled:opacity-60"
        >
          {pending ? "Generating…" : "Generate credential entry"}
        </button>
      </form>

      {state.envValue && (
        <div className="mt-10 border border-accent/40 p-6">
          <h3 className="text-sm font-medium">
            {state.replaced
              ? `Replacement entry for ${state.username}`
              : `Account entry for ${state.username}`}
          </h3>
          {state.password && (
            <p className="mt-3 text-sm leading-6">
              Generated password (shown once — record it now):{" "}
              <code className="break-all border border-border px-2 py-1 text-xs">
                {state.password}
              </code>
            </p>
          )}
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
            <li>
              In Vercel open the project → Settings → Environment Variables →
              edit <code>SATIS_ADMIN_USERS</code> (create it if missing).
            </li>
            <li>Replace its value with the full value below.</li>
            <li>
              Redeploy — environment changes only apply to new deployments.
            </li>
          </ol>
          <p className={`mt-6 ${LABEL_CLASS}`}>New SATIS_ADMIN_USERS value</p>
          <textarea
            readOnly
            value={state.envValue}
            rows={5}
            onFocus={(event) => event.currentTarget.select()}
            className={`mt-2 ${INPUT_CLASS} font-mono text-xs`}
          />
          <p className="mt-3 text-xs leading-relaxed text-muted">
            The value contains only one-way password hashes, and includes every
            existing account — pasting it wholesale keeps them all working. To
            remove an account instead, delete its email=… entry from the
            variable and redeploy.
          </p>
        </div>
      )}
    </div>
  );
}
