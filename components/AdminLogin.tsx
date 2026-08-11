"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const INPUT_CLASS =
  "w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-300 focus:border-accent";

export function AdminLogin() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {}
  );

  return (
    <form action={action} className="flex max-w-sm flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Username
        </span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className={INPUT_CLASS}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] uppercase text-muted">
          Password
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
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
        className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
