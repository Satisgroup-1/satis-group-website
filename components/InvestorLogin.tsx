"use client";

import { useActionState } from "react";
import {
  investorLogin,
  type InvestorLoginState,
} from "@/app/investors/actions";

type HeroStats = {
  developments: string;
  gdv: string;
  onProgramme: string;
};

export function InvestorLogin({ stats }: { stats: HeroStats }) {
  const [state, action, pending] = useActionState<InvestorLoginState, FormData>(
    investorLogin,
    {}
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#000000] text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1500px] lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 p-14 lg:flex lg:flex-col lg:justify-between">
          <div className="relative text-xs tracking-[.32em] uppercase text-[#c3a164]">
            Satis investor platform
          </div>
          <div className="relative max-w-2xl pb-12">
            <p className="mb-6 text-sm tracking-[.22em] uppercase text-[#c3a164]">
              Clarity at every stage
            </p>
            <h1 className="text-6xl font-medium leading-[1.02] tracking-[-.045em]">
              Property intelligence,
              <br />
              built around you.
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-white/60">
              A single view of your Satis investments, live developments and
              the Greater Manchester market.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-8 border-t border-white/15 pt-7 text-sm text-white/55">
            <span>
              <b className="mb-1 block text-2xl font-medium text-white">
                {stats.developments}
              </b>
              Live developments
            </span>
            <span>
              <b className="mb-1 block text-2xl font-medium text-white">
                {stats.gdv}
              </b>
              Combined GDV
            </span>
            <span>
              <b className="mb-1 block text-2xl font-medium text-white">
                {stats.onProgramme}
              </b>
              On or ahead of programme
            </span>
          </div>
        </section>
        <section className="flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <p className="text-xs tracking-[.28em] uppercase text-[#c3a164]">
              Private access
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-tight">
              Welcome back.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Sign in to access your investor dashboard and reporting.
            </p>
            <form action={action} className="mt-10 space-y-6">
              <label className="block">
                <span className="mb-2 block text-xs tracking-[.16em] uppercase text-white/55">
                  Email
                </span>
                <input
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  className="w-full border border-white/20 bg-white/[.04] px-4 py-4 outline-none transition focus:border-[#c3a164]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs tracking-[.16em] uppercase text-white/55">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full border border-white/20 bg-white/[.04] px-4 py-4 outline-none transition focus:border-[#c3a164]"
                />
              </label>
              {state.error && (
                <p role="alert" className="text-sm text-[#e1a68e]">
                  {state.error}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-between bg-[#b18c4d] px-5 py-4 text-xs font-medium tracking-[.18em] uppercase transition hover:bg-[#c3a164] disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Enter platform"} <span>→</span>
              </button>
            </form>
            <div className="mt-7 flex justify-between text-xs text-white/45">
              <span>Demo email: test · Password: test</span>
              <a
                href="mailto:info@satisgroup.co.uk"
                className="hover:text-white"
              >
                Need help?
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
