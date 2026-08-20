import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Eyebrow } from "@/components/Eyebrow";
import { HeroVideoBackdrop } from "@/components/HeroVideoBackdrop";
import { InvestmentChart } from "@/components/InvestmentChart";
import { PageHero } from "@/components/PageHero";
import { PortfolioPreview } from "@/components/PortfolioPreview";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const STATS = [
  { value: "60+", label: "Properties redeveloped across the North West" },
  { value: "£120m", label: "In gross development value delivered" },
  { value: "40", label: "Years of combined industry experience" },
];

export default function Home() {
  return (
    <>
      <PageHero
        eyebrow="Property Redevelopment"
        title="We turn overlooked buildings into places people want to be."
        description="Satis Group is a property development company based in Manchester, specialising in the meticulous renovation of neglected buildings, transforming them into stylish contemporary homes and adaptable commercial spaces."
        backdrop={<HeroVideoBackdrop />}
        actions={
          <>
            <Link
              href="/portfolio"
              className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent"
            >
              View portfolio
            </Link>
            <Link
              href="/contact"
              className="border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Get in touch
            </Link>
          </>
        }
      />

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-3 lg:px-10 lg:py-14">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1}>
              <AnimatedStat
                value={stat.value}
                className="text-4xl font-medium tracking-tight text-accent lg:text-5xl"
              />
              <p className="mt-3 text-sm tracking-[0.05em] text-ink-foreground/70">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <PortfolioPreview />

      {/* Investment: moved here from the About page */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow label="Investment opportunities" />
              <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                A market with momentum.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Manchester is a thriving city with a strong economy and a
                growing population. This has created a high demand for housing,
                resulting in a competitive rental market and the potential for
                attractive rental yields. The city has seen significant
                regeneration and development in recent years, with new
                infrastructure projects and cultural attractions attracting
                both residents and investors.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Eyebrow label="The Satis Group future" />
              <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                A £38m pipeline and growing.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                We currently have a pipeline of £38m with 109,000 sq ft of both
                residential and commercial developments. Looking ahead, our
                growth plan is to scale significantly in the next 12 months by
                delivering our existing projects, adding new opportunities to
                the pipeline, and positioning Satis Group for sustainable
                long-term expansion.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-16">
              <h3 className="text-xs tracking-[0.3em] uppercase text-muted">
                Portfolio at a glance
              </h3>
              <div className="mt-8">
                <InvestmentChart />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Investor call-to-action banner, moved here from the About page */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center lg:px-10">
          <Reveal>
            <span className="inline-block bg-accent px-4 py-2 text-xs tracking-[0.3em] uppercase text-black">
              Get full access to our latest investment opportunities
            </span>
            <p className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Invest in Satis Group.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/investors"
              className="group inline-flex items-center gap-3 border border-accent-strong bg-accent-strong px-8 py-3 text-xs tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-transparent hover:text-accent-text dark:border-accent dark:bg-accent dark:text-ink dark:hover:bg-transparent dark:hover:text-accent"
            >
              Investors
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
