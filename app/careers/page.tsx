import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Careers | Satis Group",
  description:
    "Join a small, hands-on property development team working across the North West.",
};

const REASONS = [
  {
    title: "Small team, real ownership",
    body: "Everyone at Satis stays on a project from acquisition to completion. You see the whole job, not one slice of it.",
  },
  {
    title: "A growing pipeline",
    body: "With £38m and 109,000 sq ft of developments ahead, there is genuine room to grow with the business.",
  },
  {
    title: "Work you can walk past",
    body: "Our projects are buildings people live and work in across the North West. The results are visible and lasting.",
  },
];

// Update this list as roles open; an empty list shows the speculative
// application panel only.
const OPEN_ROLES: Array<{
  title: string;
  type: string;
  location: string;
  summary: string;
}> = [
  {
    title: "Site Manager",
    type: "Full time",
    location: "Cheshire / North West",
    summary:
      "Run day-to-day delivery on one of our residential conversion sites, coordinating trades and keeping quality high.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build places people want to be."
        description="We're a small, hands-on team redeveloping property across the North West, and we're always interested in meeting good people."
      />

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent">
              Why Satis
            </span>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {REASONS.map((reason, index) => (
              <Reveal key={reason.title} delay={index * 0.1}>
                <div className="group border-t border-border pt-6 transition-colors duration-300 hover:border-accent">
                  <h3 className="text-lg font-medium tracking-tight">
                    {reason.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {reason.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.35em] uppercase text-accent">
              Open roles
            </span>
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              Current openings.
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-col">
            {OPEN_ROLES.length === 0 && (
              <p className="max-w-xl text-base leading-relaxed text-muted">
                We have no advertised vacancies right now, but we are always
                interested in hearing from good people. Send us a speculative
                application below.
              </p>
            )}
            {OPEN_ROLES.map((role, index) => (
              <Reveal key={role.title} delay={Math.min(index * 0.08, 0.3)}>
                <Link
                  href="/contact?topic=Careers"
                  className="group flex flex-col gap-2 border-t border-border py-8 transition-colors duration-300 hover:border-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-medium tracking-tight transition-colors group-hover:text-accent">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {role.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 text-xs tracking-[0.15em] uppercase text-muted">
                    <span>{role.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{role.location}</span>
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

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center lg:px-10">
          <Reveal>
            <span className="text-xs tracking-[0.3em] uppercase text-accent">
              Don&rsquo;t see your role?
            </span>
            <p className="mt-3 max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
              Tell us what you&rsquo;d bring to the team.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">
              Use the careers contact form, or email us directly at{" "}
              <a
                href="mailto:info@satisgroup.co.uk"
                className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                info@satisgroup.co.uk
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/contact?topic=Careers"
              className="inline-block border border-accent bg-accent px-8 py-3 text-xs tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-transparent hover:text-accent"
            >
              Contact about careers →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
