import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Eyebrow } from "@/components/Eyebrow";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Investors | Satis Group",
  description:
    "The Satis Group investor centre: our track record, how investment with us works, and access to our proprietary investor platform.",
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

export default function InvestorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Investors"
        title="Invest in buildings worth reviving."
        description={[
          "Satis Group partners with private and institutional investors on residential and commercial redevelopment across the North West. Reviving the past, building the future — with capital deployed into buildings that have already proved they belong.",
          "Our proprietary investor platform gives partners a live view of every scheme: deal flow, appraisals, reporting and documents, all in one place.",
        ]}
      />

      {/* Track record */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 sm:grid-cols-3 lg:px-10">
          {TRACK_RECORD.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1}>
              <AnimatedStat
                value={stat.value}
                className="text-4xl font-medium tracking-tight text-accent"
              />
              <p className="mt-3 text-sm tracking-[0.05em] text-ink-foreground/70">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The platform */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal>
            <Eyebrow index="01" label="The Platform" />
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              One place to see everything we build.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Access is by invitation, for investors we work with. Once
              you&rsquo;re in, every scheme we run is open to you in detail.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_FEATURES.map((feature, index) => (
              <Reveal key={feature.title} delay={Math.min(index * 0.08, 0.4)}>
                <div className="group border-t border-border pt-5 transition-colors duration-300 hover:border-accent">
                  <h3 className="text-sm font-medium tracking-[0.2em] uppercase">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Request access */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal>
            <Eyebrow index="02" label="Request Access" />
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              Interested in investing with Satis?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Tell us a little about yourself and the kind of opportunities
              you&rsquo;re looking for, and we&rsquo;ll be in touch about
              platform access.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact?topic=Investment"
                className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent"
              >
                Request platform access
              </Link>
              <Link
                href="/portfolio"
                className="border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                See our track record
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
