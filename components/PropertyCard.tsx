import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/portfolio-data";

export function PropertyCard({ property }: { property: Property }) {
  const typeChipClass =
    property.type === "Residential"
      ? "bg-sage text-white dark:text-ink"
      : "bg-ink text-ink-foreground";

  return (
    <Link href={`/portfolio/${property.slug}`} className="group flex flex-col">
      <article className="flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <Image
            src={property.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={
              property.imagePosition
                ? { objectPosition: property.imagePosition }
                : undefined
            }
          />
          <span
            className={`absolute left-4 top-4 px-3 py-1 text-[0.65rem] tracking-[0.2em] uppercase ${typeChipClass}`}
          >
            {property.type}
          </span>
          <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </div>
        <div className="mt-5 flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-medium tracking-tight">
              {property.name}
            </h3>
            <span className="shrink-0 text-xs tracking-[0.1em] uppercase text-accent-text">
              {property.status}
            </span>
          </div>
          <span className="text-sm tracking-[0.05em] text-muted">
            {property.location}
          </span>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {property.blurb}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground">
            View development
            <span
              aria-hidden="true"
              className="text-accent transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}
