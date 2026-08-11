import type { Metadata } from "next";
import { AnimatedStat } from "@/components/AnimatedStat";
import { InvestorGate } from "@/components/InvestorGate";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Investors | Satis Group",
  description:
    "The Satis Group investor centre: sign in to our proprietary investor platform, request access or reset your password.",
};

const TRACK_RECORD = [
  { value: "60+", label: "Properties redeveloped across the UK" },
  { value: "£120m", label: "In gross development value delivered" },
  { value: "40", label: "Years of combined industry experience" },
];

const PLATFORM_FEATURES = [
  {
    title: "Live deal flow",
    body: "Current and upcoming Satis schemes, with appraisals, timelines and entry points, before they reach the open market.",
  },
  {
    title: "Portfolio reporting",
    body: "Quarterly performance across your holdings: build progress, lettings, sales and distributions, in one place.",
  },
  {
    title: "Document room",
    body: "Offer documents, development appraisals and legal packs for every opportunity, ready when you are.",
  },
  {
    title: "Direct line",
    body: "Message the team behind each scheme directly, and follow the answers everyone else asked.",
  },
];

// The investor centre inverts the site's palette: everything on this page
// sits on the ink background used elsewhere only for footers and stat bands.
export default function InvestorsPage() {
  return (
    <div className="bg-ink text-ink-foreground">
      {/* Login splash: fills the viewport below the header so the gate is
          the first and only thing an arriving investor sees. */}
      <section className="flex min-h-[calc(100vh-5rem)] items-center border-b border-ink-foreground/15">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_auto] lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent">
              Investors
            </span>
            <h1 className="mt-4 max-w-xl text-4xl font-medium tracking-tight sm:text-5xl">
              The Satis investor platform.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-foreground/70">
              Reviving the past, building the future — in partnership with
              private and institutional investors. Our proprietary platform
              gives partners a live view of every scheme: deal flow,
              appraisals, reporting and documents, in one place.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {TRACK_RECORD.map((stat) => (
                <div key={stat.label}>
                  <AnimatedStat
                    value={stat.value}
                    className="text-2xl font-medium tracking-tight text-accent"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-ink-foreground/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            <InvestorGate />
          </Reveal>
        </div>
      </section>

      {/* What's behind the login */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal>
            <span className="flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-accent">
              <span>01</span>
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
              <span>The Platform</span>
            </span>
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              One place to see everything we build.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-foreground/70">
              Access is by invitation, for investors we work with. Once
              you&rsquo;re in, every scheme we run is open to you in detail.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_FEATURES.map((feature, index) => (
              <Reveal key={feature.title} delay={Math.min(index * 0.08, 0.4)}>
                <div className="group border-t border-ink-foreground/20 pt-5 transition-colors duration-300 hover:border-accent">
                  <h3 className="text-sm font-medium tracking-[0.2em] uppercase">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-foreground/60">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
