import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Reveal } from "@/components/Reveal";
import { formatNewsletterDate, getNewsletters } from "@/lib/newsletters";
import { ACCOLADES, AWARD_COUNT } from "@/lib/accolades";

export const metadata: Metadata = {
  title: "News & development updates",
  alternates: { canonical: "/news" },
  description:
    "News from Satis Group: new redevelopments, acquisitions and openings, plus every award, press feature and judging appointment.",
};

// Thumbnail per update, matched on the issue slug so new issues degrade
// gracefully (no image, text-only row) until a match is added here.
const UPDATE_IMAGES: Array<{ match: string; src: string; alt: string }> = [
  {
    match: "chester-house",
    src: "/images/hazelgate/exterior-v4.jpg",
    alt: "Hazelgate (Chester House), Hazel Grove",
  },
  {
    match: "22stjohn",
    src: "/images/22stjohn/building.jpg",
    alt: "22 St John, Manchester",
  },
  {
    match: "courthouse-topping-out",
    src: "/images/courthouse/hero-v2.jpg",
    alt: "The Courthouse, Macclesfield",
  },
  {
    match: "barrington",
    src: "/images/barrington/hero.jpg",
    alt: "Barrington House, Altrincham",
  },
  {
    match: "courthouse-launch",
    src: "/images/courthouse/kitchen.jpg",
    alt: "A kitchen at The Courthouse",
  },
  {
    match: "hazelgate",
    src: "/images/hazelgate/living-kitchen.jpg",
    alt: "Living space at Hazelgate",
  },
  {
    match: "stockport",
    src: "/images/qube/hero.jpg",
    alt: "QUBE, Stockport town centre",
  },
  {
    match: "uk-property-award",
    src: "/images/22stjohn/building.jpg",
    alt: "22 St John, Manchester",
  },
  {
    match: "your-property-network",
    src: "/images/22stjohn/offices.jpg",
    alt: "Private offices at 22 St John",
  },
  {
    match: "rising-star",
    src: "/images/team/founders-v2.jpg",
    alt: "The Satis Group founders",
  },
  {
    match: "insider-property-disruptors",
    src: "/images/about-plaque.jpg",
    alt: "Another development by Satis Group",
  },
  {
    match: "property-investors-awards",
    src: "/images/team/founders-v2.jpg",
    alt: "The Satis Group founders",
  },
];

function updateImage(slug: string) {
  return UPDATE_IMAGES.find((entry) => slug.includes(entry.match));
}

export default function NewsPage() {
  const issues = getNewsletters();

  return (
    <>
      <PageHero
        eyebrow="News"
        title="Stay ahead of what we redevelop next."
        description="Occasional updates on new acquisitions, redevelopments underway, and finished projects. No spam, unsubscribe any time."
        compact
      />
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-14">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              Sign up
            </span>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
          </Reveal>
          <Reveal delay={0.12} className="hidden lg:block">
            <div className="relative aspect-[5/2] overflow-hidden bg-surface">
              <Image
                src="/images/22stjohn/building.jpg"
                alt="22 St John, Manchester, a Satis Group redevelopment"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "center 70%" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Awards & recognition — the full list, summarised on About */}
      <section id="awards" className="scroll-mt-28 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              Awards &amp; recognition
            </span>
            <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">
              Recognised across the industry.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              {AWARD_COUNT} national awards for our buildings and our people, a
              cover feature in the property press, and a seat on the panel that
              judges the rest.
            </p>
          </Reveal>

          <div className="mt-10 flex flex-col">
            {ACCOLADES.map((item, index) => (
              <Reveal key={item.title} delay={Math.min(index * 0.07, 0.3)}>
                <div className="group grid grid-cols-1 gap-2 border-t border-border py-6 transition-colors duration-300 hover:border-accent sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8 lg:grid-cols-[auto_minmax(0,14rem)_1fr_auto] lg:items-center">
                  {item.image ? (
                    <span
                      className={`relative hidden h-16 w-24 shrink-0 overflow-hidden lg:block ${
                        item.image.dark ? "bg-ink" : "bg-surface"
                      }`}
                    >
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </span>
                  ) : (
                    <span aria-hidden="true" className="hidden lg:block lg:h-16 lg:w-24" />
                  )}
                  <div className="flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="text-accent transition-transform duration-500 ease-out group-hover:rotate-[72deg] group-hover:scale-125"
                    >
                      ✦
                    </span>
                    <h3 className="text-lg font-medium tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <div className="pl-8 lg:pl-0">
                    <p className="text-sm tracking-[0.02em]">{item.detail}</p>
                    <p className="mt-1 text-sm text-muted">{item.subject}</p>
                  </div>
                  <span className="pl-8 text-[0.6rem] tracking-[0.25em] uppercase text-accent lg:pl-0 lg:text-right">
                    {item.kind}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              Past updates
            </span>
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              What we&rsquo;ve been up to.
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-col">
            {issues.length === 0 && (
              <p className="text-sm text-muted">
                No updates published yet. Check back soon.
              </p>
            )}
            {issues.map((issue, index) => {
              // An article's own frontmatter image wins over the slug map.
              const image = issue.image?.src
                ? { src: issue.image.src, alt: issue.image.alt }
                : updateImage(issue.slug);
              return (
                <Reveal key={issue.slug} delay={Math.min(index * 0.08, 0.3)}>
                  <Link
                    href={`/news/${issue.slug}`}
                    className="group flex flex-col gap-4 border-t border-border py-6 transition-colors duration-300 hover:border-accent sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                  >
                    <div className="flex items-center gap-5 sm:gap-6">
                      {image && (
                        <span className="relative hidden h-20 w-28 shrink-0 overflow-hidden bg-surface sm:block">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="112px"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </span>
                      )}
                      <div className="max-w-2xl">
                        <h3 className="text-xl font-medium tracking-tight transition-colors group-hover:text-accent">
                          {issue.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {issue.summary}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-xs tracking-[0.15em] uppercase text-muted">
                        {formatNewsletterDate(issue.date)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-accent transition-transform duration-300 group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
