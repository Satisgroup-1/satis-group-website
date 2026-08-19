import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLogin } from "@/components/AdminLogin";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  getGuideChapter,
  orderedChapters,
  type GuideCallout,
  type GuideScreenshot,
  type GuideStep,
} from "@/lib/admin-guide";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getGuideChapter(slug);
  return {
    title: chapter ? `${chapter.title} — Operations guide` : "Operations guide",
    robots: { index: false, follow: false },
  };
}

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

// The annotation colour baked into the screenshots; legend badges match it.
const MARKER_BADGE =
  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b3400c] text-xs font-bold text-white";

const CALLOUT_STYLES: Record<
  GuideCallout["tone"],
  { label: string; border: string; title: string }
> = {
  tip: { label: "Tip", border: "border-border", title: "text-accent-text" },
  warning: { label: "Take care", border: "border-clay/50", title: "text-clay" },
  check: { label: "Check", border: "border-sage/60", title: "text-sage" },
  term: { label: "Plain English", border: "border-border", title: "text-accent-text" },
};

function Callout({ callout }: { callout: GuideCallout }) {
  const style = CALLOUT_STYLES[callout.tone];
  return (
    <div className={`border ${style.border} bg-surface p-5`}>
      <p className={`text-[10px] tracking-[.2em] uppercase ${style.title}`}>
        {style.label}
      </p>
      <p className="mt-2 text-sm font-medium tracking-tight">{callout.title}</p>
      {callout.body.map((paragraph, i) => (
        <p key={i} className="mt-2 text-sm leading-relaxed text-muted">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Screenshot({ screenshot }: { screenshot: GuideScreenshot }) {
  return (
    <figure className="border border-border bg-surface p-3 sm:p-4">
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        width={Math.round(screenshot.width / 2)}
        height={Math.round(screenshot.height / 2)}
        sizes="(min-width: 1024px) 48rem, 100vw"
        className="h-auto w-full border border-border bg-white"
      />
      {screenshot.caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">
          {screenshot.caption}
        </figcaption>
      )}
      {screenshot.markers && screenshot.markers.length > 0 && (
        <figcaption className="mt-4">
          <p className="text-[10px] tracking-[.2em] uppercase text-accent-text">
            In this screenshot
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {screenshot.markers.map((marker) => (
              <li key={marker.n} className="flex items-start gap-3">
                <span className={MARKER_BADGE} aria-hidden="true">
                  {marker.n}
                </span>
                <span className="text-sm leading-6 text-muted">
                  <span className="sr-only">Marker {marker.n}: </span>
                  {marker.text}
                </span>
              </li>
            ))}
          </ul>
        </figcaption>
      )}
    </figure>
  );
}

function Step({ step, index }: { step: GuideStep; index: number }) {
  return (
    <section id={`step-${index + 1}`} className="scroll-mt-28 border-t border-border pt-8">
      <span className="flex items-center gap-3 text-xs tracking-[.35em] uppercase text-accent-text">
        <span>Step {String(index + 1).padStart(2, "0")}</span>
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
      </span>
      <h2 className="mt-3 text-xl font-medium tracking-tight">{step.title}</h2>
      {step.body?.map((paragraph, i) => (
        <p key={i} className="mt-4 text-sm leading-7 text-muted">
          {paragraph}
        </p>
      ))}
      {step.substeps && (
        <ol className="mt-5 flex flex-col gap-3">
          {step.substeps.map((substep, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center border border-border text-xs text-accent-text">
                {String.fromCharCode(97 + i)}
              </span>
              <span className="text-sm leading-6 text-muted">{substep}</span>
            </li>
          ))}
        </ol>
      )}
      {step.screenshot && (
        <div className="mt-6">
          <Screenshot screenshot={step.screenshot} />
        </div>
      )}
      {step.callouts && (
        <div className="mt-6 flex flex-col gap-4">
          {step.callouts.map((callout, i) => (
            <Callout key={i} callout={callout} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function AdminGuideChapterPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const all = orderedChapters();
  const position = all.findIndex((entry) => entry.chapter.slug === slug);
  if (position === -1) notFound();

  const { chapter, number } = all[position];
  const previous = position > 0 ? all[position - 1] : undefined;
  const next = position < all.length - 1 ? all[position + 1] : undefined;
  const authed = await isAuthenticated();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        {!authed ? (
          <>
            <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
              Admin
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
              Sign in to continue.
            </h1>
            <div className="mt-10">
              <AdminLogin />
            </div>
          </>
        ) : (
          <div className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-xs tracking-[0.2em] uppercase text-muted">
              <Link
                href="/admin/guide"
                className="transition-colors hover:text-accent"
              >
                Operations guide
              </Link>
              <span aria-hidden="true"> / </span>
              <span className="text-accent-text">{chapter.group}</span>
            </nav>

            <span className="mt-8 flex items-center gap-3 text-xs tracking-[.35em] uppercase text-accent-text">
              <span>{String(number).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
              <span>{chapter.group}</span>
            </span>
            <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              {chapter.title}
            </h1>
            {chapter.lede.map((paragraph, i) => (
              <p key={i} className="mt-4 text-sm leading-7 text-muted">
                {paragraph}
              </p>
            ))}

            {(chapter.time || chapter.youNeed) && (
              <dl className="mt-8 flex flex-col gap-4 border border-border bg-surface p-5 sm:flex-row sm:gap-10">
                {chapter.time && (
                  <div>
                    <dt className="text-[10px] tracking-[.2em] uppercase text-accent-text">
                      Time
                    </dt>
                    <dd className="mt-1 text-sm text-muted">{chapter.time}</dd>
                  </div>
                )}
                {chapter.youNeed && (
                  <div>
                    <dt className="text-[10px] tracking-[.2em] uppercase text-accent-text">
                      You will need
                    </dt>
                    <dd className="mt-1">
                      <ul className="flex list-disc flex-col gap-1 pl-4 text-sm text-muted">
                        {chapter.youNeed.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            )}

            {chapter.steps.length > 1 && (
              <nav aria-label="In this chapter" className="mt-8">
                <p className="text-[10px] tracking-[.2em] uppercase text-accent-text">
                  In this chapter
                </p>
                <ol className="mt-3 flex flex-col gap-1.5">
                  {chapter.steps.map((step, i) => (
                    <li key={i}>
                      <a
                        href={`#step-${i + 1}`}
                        className="group inline-flex items-baseline gap-3 text-sm text-muted transition-colors hover:text-accent"
                      >
                        <span className="text-xs tracking-[.15em] text-accent-text">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="underline decoration-border underline-offset-4 group-hover:decoration-accent">
                          {step.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="mt-12 flex flex-col gap-12">
              {chapter.steps.map((step, i) => (
                <Step key={i} step={step} index={i} />
              ))}
            </div>

            {chapter.faqs && (
              <section className="mt-16">
                <span className="flex items-center gap-3 text-xs tracking-[.35em] uppercase text-accent-text">
                  <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
                  <span>{chapter.faqsTitle ?? "Questions"}</span>
                </span>
                <div className="mt-6 flex flex-col gap-8">
                  {chapter.faqs.map((faq) => (
                    <div key={faq.q} className="border-t border-border pt-5">
                      <h2 className="text-base font-medium tracking-tight">
                        {faq.q}
                      </h2>
                      {faq.a.map((paragraph, i) => (
                        <p key={i} className="mt-3 text-sm leading-relaxed text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <nav
              aria-label="Guide chapters"
              className="mt-16 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
            >
              {previous ? (
                <Link
                  href={`/admin/guide/${previous.chapter.slug}`}
                  className="group border border-border p-5 transition-colors hover:border-accent"
                >
                  <span className="text-[10px] tracking-[.2em] uppercase text-muted">
                    ← Previous
                  </span>
                  <span className="mt-2 block text-sm font-medium tracking-tight transition-colors group-hover:text-accent">
                    {previous.chapter.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
              {next ? (
                <Link
                  href={`/admin/guide/${next.chapter.slug}`}
                  className="group border border-border p-5 text-right transition-colors hover:border-accent"
                >
                  <span className="text-[10px] tracking-[.2em] uppercase text-muted">
                    Next →
                  </span>
                  <span className="mt-2 block text-sm font-medium tracking-tight transition-colors group-hover:text-accent">
                    {next.chapter.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
            </nav>

            <p className="mt-10 text-xs text-muted">
              <Link
                href="/admin/guide"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Back to the guide contents
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
