"use client";

import Link from "next/link";
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

/** Where "become an investor" goes: the investor-only enquiry form, which is
    separate from the general contact form. */
const BECOME_HREF = "/investors/enquire";

// What an account gives someone who has not invested yet. This is the pitch
// on the login page: the platform is worth signing up for before you commit.
const ACCOUNT_BENEFITS = [
  {
    title: "The investment memorandum",
    body: "Our strategy, track record and terms, in full, before you speak to anyone.",
  },
  {
    title: "Appraisals for every raise",
    body: "Costs, programme, sales values and sensitivities for each scheme we are raising against.",
  },
  {
    title: "Answers from the team",
    body: "Ask about any scheme and get a reply from the people delivering it.",
  },
];

export function InvestorLogin({ stats }: { stats: HeroStats }) {
  const [state, action, pending] = useActionState<InvestorLoginState, FormData>(
    investorLogin,
    {}
  );

  return (
    <div className="bg-[#000000] text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1500px] lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 p-14 lg:flex lg:flex-col lg:justify-between">
          <div className="relative text-xs tracking-[.32em] uppercase text-[#c3a164]">
            Satis Group investor platform
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
              A single view of your Satis Group investments, live developments and
              the Greater Manchester market. Prospective investors get an account
              too, with the memorandum and appraisals to review before committing.
            </p>
            <Link
              href={BECOME_HREF}
              className="shimmer-btn mt-9 inline-block bg-[#b18c4d] px-8 py-4 text-xs tracking-[.18em] uppercase transition hover:bg-[#c3a164]"
            >
              Become an investor →
            </Link>
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
                className="shimmer-btn flex w-full items-center justify-between bg-[#b18c4d] px-5 py-4 text-xs font-medium tracking-[.18em] uppercase transition hover:bg-[#c3a164] disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Enter platform"} <span>→</span>
              </button>
            </form>
            <div className="mt-7 flex justify-end text-xs text-white/45">
              <a
                href="mailto:info@satisgroup.co.uk"
                className="hover:text-white"
              >
                Need help?
              </a>
            </div>

            {/* The route for anyone without a login: as prominent as the
                sign-in button itself. */}
            <div className="mt-10 border border-[#b18c4d]/50 bg-[#b18c4d]/10 p-6">
              <p className="text-xs tracking-[.2em] uppercase text-[#c3a164]">
                No account yet?
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                You do not have to be an investor to have a login. Request access
                as a prospective investor and we will open a data room with the
                memorandum and the appraisals for our current raises.
              </p>
              <Link
                href={BECOME_HREF}
                className="mt-5 inline-block border border-[#c3a164] px-6 py-3.5 text-xs tracking-[.18em] uppercase text-[#c3a164] transition hover:bg-[#c3a164] hover:text-black"
              >
                Become an investor →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* The investment case, mirroring the About page's "Invest in Satis
          Group" section so prospective investors see it before signing in. */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-14 lg:py-28">
          <span className="text-xs tracking-[.3em] uppercase text-[#c3a164]">
            Invest in Satis Group
          </span>
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                A market with momentum.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/60">
                Manchester is a thriving city with a strong economy and a
                growing population. This has created a high demand for housing,
                resulting in a competitive rental market and the potential for
                attractive rental yields. The city has seen significant
                regeneration and development in recent years, with new
                infrastructure projects and cultural attractions attracting
                both residents and investors.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                A £38m pipeline and growing.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/60">
                We currently have a pipeline of £38m with 109,000 sq ft of both
                residential and commercial developments. Looking ahead, our
                growth plan is to scale significantly in the next 12 months by
                delivering our existing projects, adding new opportunities to
                the pipeline, and positioning Satis Group for sustainable
                long-term expansion.
              </p>
            </div>
          </div>

          <dl className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-3">
            {[
              { value: "40+", label: "Years of combined experience" },
              { value: "£38m", label: "Development pipeline" },
              { value: "109,000", label: "Sq ft residential & commercial" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#000000] p-8">
                <dt className="text-3xl font-medium tracking-tight text-[#c3a164]">
                  {stat.value}
                </dt>
                <dd className="mt-3 text-sm text-white/55">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 border-t border-white/10 pt-12">
            <span className="text-xs tracking-[.3em] uppercase text-[#c3a164]">
              What an account gives you
            </span>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {ACCOUNT_BENEFITS.map((benefit) => (
                <div key={benefit.title} className="border-t border-white/15 pt-5">
                  <h3 className="text-lg font-medium tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {benefit.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-white/10 pt-10">
            <p className="max-w-md text-sm leading-relaxed text-white/55">
              Once you invest, the same login carries your positions, your
              financials and a downloadable monthly report on every scheme you
              are in.
            </p>
            <Link
              href={BECOME_HREF}
              className="shimmer-btn bg-[#b18c4d] px-8 py-4 text-xs tracking-[.18em] uppercase transition hover:bg-[#c3a164]"
            >
              Become an investor →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
