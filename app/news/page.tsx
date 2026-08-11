import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Reveal } from "@/components/Reveal";
import { formatNewsletterDate, getNewsletters } from "@/lib/newsletters";

export const metadata: Metadata = {
  title: "News | Satis Group",
  description:
    "News from Satis Group: new redevelopments, acquisitions and openings, with a newsletter to stay in the loop.",
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
            <span className="text-xs tracking-[0.35em] uppercase text-accent">
              Sign up
            </span>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent">
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
