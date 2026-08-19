import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedStat } from "@/components/AnimatedStat";
import { BuildingRedevelopmentGraphic } from "@/components/BuildingRedevelopmentGraphic";
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

      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-24">
          <Reveal className="flex flex-col gap-6">
            <p className="text-xl font-medium leading-snug tracking-tight sm:text-2xl">
              Satis Group was founded to prove that redevelopment doesn&rsquo;t
              have to mean starting from scratch.
            </p>
            <p className="text-base leading-relaxed text-muted">
              We look for buildings with good potential in the wrong condition:
              tired offices, disused yards, terraces neglected for years. We
              give them a use that fits how people want to live and work today.
              Every project is managed in-house from acquisition and planning
              through to construction and sale, in strategic locations across
              Manchester and the North West.
            </p>
            <p className="border-l-2 border-accent pl-4 text-base leading-relaxed">
              Redeveloping properties into places people want to live and work.
            </p>
          </Reveal>
        </div>
      </section>

      <PortfolioPreview />
    </>
  );
}
