import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedStat } from "@/components/AnimatedStat";
import { BuildingRedevelopmentGraphic } from "@/components/BuildingRedevelopmentGraphic";
import { PortfolioPreview } from "@/components/PortfolioPreview";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PROCESS = [
  {
    step: "01",
    title: "Acquire",
    body: "We find neglected buildings with good bones across Manchester and the North West.",
  },
  {
    step: "02",
    title: "Design",
    body: "Every scheme starts from the building's own character, never a template.",
  },
  {
    step: "03",
    title: "Build",
    body: "Delivered in-house to the highest standard, from planning to completion.",
  },
  {
    step: "04",
    title: "Sell",
    body: "Most schemes are brought to market on completion; where we retain a building, we manage it ourselves.",
  },
];

const STATS = [
  { value: "60+", label: "Properties redeveloped across the North West" },
  { value: "£120m", label: "In gross development value delivered" },
  { value: "40", label: "Years of combined industry experience" },
];

export default function Home() {
  return (
    <>
      <BuildingRedevelopmentGraphic>
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Property Redevelopment
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-medium leading-[1.1] tracking-tight [@media(max-height:800px)]:text-2xl sm:text-4xl lg:text-5xl lg:[@media(max-height:800px)]:text-4xl">
          We turn overlooked buildings into places people want to be.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted [@media(max-height:800px)]:mt-3 lg:text-base">
          Satis Group is a property development company based in Manchester,
          specialising in the meticulous renovation of neglected buildings,
          transforming them into stylish contemporary homes and adaptable
          commercial spaces.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 [@media(max-height:800px)]:mt-4">
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
        </div>
      </BuildingRedevelopmentGraphic>

      <PortfolioPreview />

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              How we work
            </span>
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              From neglected to lived-in.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.1}>
                <div className="group relative overflow-hidden border-t border-border pt-6 transition-colors duration-300 hover:border-accent">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -top-5 text-7xl font-medium tracking-tighter text-accent opacity-[0.07] transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-[0.14]"
                  >
                    {item.step}
                  </span>
                  <span className="text-xs tracking-[0.25em] text-accent">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-3 lg:px-10 lg:py-32">
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
    </>
  );
}
