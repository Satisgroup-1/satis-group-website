import Link from "next/link";
import { PORTFOLIO } from "@/lib/portfolio-data";
import { PropertyCard } from "./PropertyCard";
import { Reveal } from "./Reveal";

export function PortfolioPreview() {
  const featured = PORTFOLIO.slice(0, 3);

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs tracking-[0.35em] uppercase text-accent">
                Selected work
              </span>
              <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
                Recent redevelopments
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase transition-colors hover:text-accent"
            >
              View all projects
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property, index) => (
            <Reveal key={property.slug} delay={index * 0.12}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
