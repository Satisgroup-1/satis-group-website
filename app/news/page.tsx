import type { Metadata } from "next";
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

export default function NewsPage() {
  const issues = getNewsletters();

  return (
    <>
      <PageHero
        eyebrow="News"
        title="Stay ahead of what we build next."
        description="Occasional updates on new acquisitions, redevelopments underway, and finished projects. No spam, unsubscribe any time."
      />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              Sign up
            </span>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Awards & recognition — the full list, summarised on About */}
      <section id="awards" className="scroll-mt-28 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              Awards &amp; recognition
            </span>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h2 className="max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">
                Recognised across the industry.
              </h2>
              <span className="text-sm tracking-[0.05em] text-muted">
                <span className="text-2xl font-medium text-accent">
                  {ACCOLADES.length}
                </span>{" "}
                accolades &amp; counting
              </span>
            </div>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              {AWARD_COUNT} national awards for our buildings and our people,
              cover features in the property press, and seats on the judging
              panels that decide the rest.
            </p>
          </Reveal>

          <div className="mt-14 flex flex-col">
            {ACCOLADES.map((item, index) => (
              <Reveal key={item.title} delay={Math.min(index * 0.07, 0.3)}>
                <div className="group grid grid-cols-1 gap-2 border-t border-border py-8 transition-colors duration-300 hover:border-accent sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8 lg:grid-cols-[minmax(0,16rem)_1fr_auto]">
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
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              Past updates
            </span>
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              What we&rsquo;ve been up to.
            </h2>
          </Reveal>
          <div className="mt-12 flex flex-col">
            {issues.length === 0 && (
              <p className="text-sm text-muted">
                No updates published yet. Check back soon.
              </p>
            )}
            {issues.map((issue, index) => (
              <Reveal key={issue.slug} delay={Math.min(index * 0.08, 0.3)}>
                <Link
                  href={`/news/${issue.slug}`}
                  className="group flex flex-col gap-2 border-t border-border py-8 transition-colors duration-300 hover:border-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-medium tracking-tight transition-colors group-hover:text-accent">
                      {issue.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {issue.summary}
                    </p>
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
