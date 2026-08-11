import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import {
  formatNewsletterDate,
  getNewsletter,
  getNewsletters,
} from "@/lib/newsletters";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getNewsletters().map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const issue = getNewsletter(slug);
  if (!issue) return {};
  return {
    title: issue.title,
    description: issue.summary,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      type: "article",
      title: issue.title,
      description: issue.summary,
      publishedTime: issue.date,
    },
  };
}

export default async function NewsletterIssuePage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const issue = getNewsletter(slug);
  if (!issue) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.title,
    datePublished: issue.date,
    description: issue.summary,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/satis-logo-white.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/news/${issue.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
          <Reveal>
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted transition-colors hover:text-accent"
            >
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
              >
                ←
              </span>
              All updates
            </Link>
            <p className="mt-8 text-xs tracking-[0.25em] uppercase text-accent-text">
              {formatNewsletterDate(issue.date)}
            </p>
            <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
              {issue.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted lg:text-lg">
              {issue.summary}
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <article className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 lg:py-20">
          {issue.blocks.map((block, index) => {
            if (block.kind === "heading") {
              return (
                <h2
                  key={index}
                  className="mt-4 text-xl font-medium tracking-tight sm:text-2xl"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.kind === "list") {
              return (
                <ul key={index} className="flex flex-col gap-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] bg-accent"
                      />
                      <span className="text-base leading-relaxed text-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-base leading-relaxed text-muted">
                {block.text}
              </p>
            );
          })}

          <div className="mt-10 border-t border-border pt-8">
            <p className="text-sm text-muted">
              Want updates like this by email?{" "}
              <Link
                href="/news"
                className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                Join the newsletter.
              </Link>
            </p>
          </div>
        </article>
      </section>
    </>
  );
}
