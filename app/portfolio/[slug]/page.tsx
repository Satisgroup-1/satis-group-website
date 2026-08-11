import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedStat } from "@/components/AnimatedStat";
import { FloorTabs } from "@/components/FloorTabs";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { Reveal } from "@/components/Reveal";
import { PROPERTY_PAGES, getPropertyPage } from "@/lib/property-pages";

export function generateStaticParams() {
  return PROPERTY_PAGES.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyPage(slug);
  if (!property) return {};
  return {
    title: `${property.name} | Satis Group`,
    description: `${property.tagline}, a Satis Group development in ${property.eyebrow.replace(" · ", ", ")}.`,
  };
}

function SectionHeading({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-accent">
      <span>{index}</span>
      <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default async function PropertyDetailPage({
  params,
}: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const property = getPropertyPage(slug);
  if (!property) notFound();

  let sectionCount = 1;
  const nextIndex = () => String(sectionCount++).padStart(2, "0");
  const introIndex = nextIndex();
  const featuresIndex = property.features ? nextIndex() : "";
  const specIndex = property.spec ? nextIndex() : "";
  const residencesIndex = property.residences ? nextIndex() : "";
  const floorsIndex = property.floors ? nextIndex() : "";
  const plansIndex = property.floorPlans ? nextIndex() : "";
  const locationIndex = property.locationSection ? nextIndex() : "";
  const galleryIndex = property.gallery ? nextIndex() : "";
  const enquireIndex = nextIndex();

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="relative h-[64vh] min-h-[440px] w-full overflow-hidden bg-surface">
          <Image
            src={property.heroImage}
            alt={property.name}
            fill
            preload
            sizes="100vw"
            className="object-cover"
            style={
              property.heroPosition
                ? { objectPosition: property.heroPosition }
                : undefined
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-10 lg:pb-16">
              <Reveal>
                <span className="text-xs tracking-[0.35em] uppercase text-white/75">
                  {property.eyebrow}
                </span>
                <h1 className="mt-4 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {property.name}
                </h1>
                <p className="mt-3 max-w-xl text-sm tracking-[0.1em] uppercase text-white/80">
                  {property.tagline}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb + status */}
      <div className="sticky top-20 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted transition-colors hover:text-accent"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              ←
            </span>
            All projects
          </Link>
          <span className="border border-accent px-3 py-1 text-[0.65rem] tracking-[0.2em] uppercase text-accent">
            {property.status}
          </span>
        </div>
      </div>

      {/* Intro */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-32">
          <Reveal className="flex flex-col justify-center gap-6">
            <SectionHeading index={introIndex} label="Welcome" />
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              {property.intro.heading}
            </h2>
            {property.intro.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-muted"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface lg:h-full lg:aspect-auto">
              <Image
                src={property.intro.image}
                alt={property.intro.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={
                  property.intro.imagePosition
                    ? { objectPosition: property.intro.imagePosition }
                    : undefined
                }
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-3 lg:px-10">
          {property.stats.map((stat, index) => (
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

      {/* Features */}
      {property.features && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <SectionHeading index={featuresIndex} label="Amenities" />
              <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
                {property.features.heading}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                {property.features.description}
              </p>
            </Reveal>
            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {property.features.items.map((item, index) => (
                <Reveal key={item} delay={Math.min(index * 0.05, 0.4)}>
                  <li className="group flex items-center gap-3 border-t border-border py-3 text-sm tracking-[0.1em] uppercase transition-colors duration-300 hover:border-accent">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 bg-accent transition-transform duration-300 group-hover:scale-150"
                    />
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Specification */}
      {property.spec && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <SectionHeading index={specIndex} label="Specification" />
              <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
                {property.spec.heading}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                {property.spec.description}
              </p>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {property.spec.groups.map((group, index) => (
                <Reveal key={group.title} delay={Math.min(index * 0.08, 0.4)}>
                  <div className="group border-t border-border pt-5 transition-colors duration-300 hover:border-accent">
                    <h3 className="text-sm font-medium tracking-[0.2em] uppercase">
                      {group.title}
                    </h3>
                    <ul className="mt-4 flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm leading-relaxed text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Residences */}
      {property.residences && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <SectionHeading index={residencesIndex} label="The Collection" />
              <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
                {property.residences.heading}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                {property.residences.description}
              </p>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {property.residences.items.map((residence, index) => (
                <Reveal key={residence.name} delay={index * 0.12}>
                  <article className="group flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                      <Image
                        src={residence.image}
                        alt={residence.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
                    </div>
                    <h3 className="mt-5 text-lg font-medium tracking-tight">
                      {residence.name}
                    </h3>
                    <dl className="mt-3 flex flex-col gap-2 text-sm">
                      <div className="flex justify-between gap-4 border-t border-border pt-2">
                        <dt className="text-muted">Size</dt>
                        <dd className="text-right">{residence.size}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-border pt-2">
                        <dt className="text-muted">Floor</dt>
                        <dd className="text-right">{residence.floor}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-border pt-2">
                        <dt className="text-muted">Status</dt>
                        <dd className="text-right text-accent">
                          {residence.status}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Apartment schedule with floor tabs */}
      {property.floors && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <SectionHeading index={floorsIndex} label={property.floors.heading} />
              <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
                {property.floors.description}
              </h2>
            </Reveal>
            <div className="mt-12">
              <FloorTabs
                schedule={property.floors.schedule}
                unitNoun={property.floors.unitNoun}
              />
            </div>
          </div>
        </section>
      )}

      {/* Floor plans */}
      {property.floorPlans && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <SectionHeading index={plansIndex} label="Floor Plans" />
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                Click a plan to view it in detail.
              </p>
            </Reveal>
            <div className="mt-10">
              <GalleryLightbox
                images={property.floorPlans.map((plan) => ({
                  src: plan.image,
                  alt: plan.name,
                }))}
                fit="contain"
                columnsClass="grid-cols-1 sm:grid-cols-3"
                aspectClass="aspect-square"
                captions
              />
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {property.locationSection && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <SectionHeading index={locationIndex} label="Location" />
              <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
                {property.locationSection.heading}
              </h2>
            </Reveal>
            <div className="mt-6 flex max-w-2xl flex-col gap-4">
              {property.locationSection.body.map((paragraph) => (
                <Reveal key={paragraph.slice(0, 32)}>
                  <p className="text-base leading-relaxed text-muted">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
              {property.locationSection.link && (
                <Reveal>
                  <a
                    href={property.locationSection.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    {property.locationSection.link.label} {"↗"}
                  </a>
                </Reveal>
              )}
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {property.locationSection.distances.map((distance, index) => (
                <Reveal key={distance.label} delay={Math.min(index * 0.07, 0.35)}>
                  <div className="group border-t border-border pt-4 transition-colors duration-300 hover:border-accent">
                    <AnimatedStat
                      value={distance.value}
                      className="text-xl font-medium tracking-tight"
                    />
                    <p className="mt-2 text-xs leading-relaxed tracking-[0.1em] uppercase text-muted">
                      {distance.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {property.gallery && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <Reveal>
              <SectionHeading index={galleryIndex} label="Gallery" />
            </Reveal>
            <div className="mt-10">
              <GalleryLightbox images={property.gallery} />
            </div>
          </div>
        </section>
      )}

      {/* Enquire */}
      <section>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <SectionHeading index={enquireIndex} label="Enquire" />
            <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Interested in {property.name}?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              {property.agent
                ? property.type === "Commercial"
                  ? "To arrange a viewing please contact our appointed agent, or get in touch with the Satis Group team."
                  : "For sales enquiries please contact our appointed agent, or get in touch with the Satis Group team."
                : property.listings
                  ? "Enquiries and viewings are handled directly by our appointed letting agents via the live listings."
                  : "Get in touch with the Satis Group team for more information or to arrange a viewing."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent"
              >
                Contact us
              </Link>
              <a
                href={property.micrositeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Visit {property.micrositeLabel} {"↗"}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col gap-8">
            {property.agent && (
              <div>
                <span className="text-xs tracking-[0.2em] uppercase text-accent">
                  {property.type === "Commercial" ? "Lettings Agent" : "Sales Agent"}
                </span>
                <p className="mt-2 text-sm leading-relaxed">
                  {property.agent.name}
                  <br />
                  <span className="text-muted">{property.agent.detail}</span>
                  {property.agent.phone && (
                    <>
                      <br />
                      <a
                        href={`tel:${property.agent.phone.replace(/\s/g, "")}`}
                        className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        {property.agent.phone}
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
            {property.listings && (
              <div className="flex flex-col gap-4">
                <span className="text-xs tracking-[0.2em] uppercase text-accent">
                  Live Listings
                </span>
                {property.listings.map((listing) => (
                  <a
                    key={listing.href}
                    href={listing.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border border-border p-5 transition-all duration-300 hover:border-accent"
                  >
                    <span className="text-sm font-medium tracking-tight">
                      {listing.label}
                    </span>
                    <p className="mt-1 text-sm text-muted">{listing.detail}</p>
                    <span className="mt-3 block text-xs tracking-[0.2em] uppercase text-accent">
                      View listing {"↗"}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
