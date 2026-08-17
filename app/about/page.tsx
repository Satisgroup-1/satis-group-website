import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/Eyebrow";
import { FrameCorners } from "@/components/FrameCorners";
import { InvestmentChart } from "@/components/InvestmentChart";
import { PageHero } from "@/components/PageHero";
import { ParallaxSkyline } from "@/components/ParallaxSkyline";
import { Reveal } from "@/components/Reveal";
import { ACCOLADES, AWARD_COUNT } from "@/lib/accolades";
import { StatMeter } from "@/components/StatMeter";
import { TeamGrid, type TeamMember } from "@/components/TeamGrid";
import { ValuesGrid } from "@/components/ValuesGrid";

export const metadata: Metadata = {
  title: "About: property developers in Manchester",
  alternates: { canonical: "/about" },
  description:
    "Satis Group is a Manchester-based property development company specialising in the meticulous renovation of neglected buildings across Greater Manchester and the North West.",
};

const VALUES = [
  {
    title: "Built to a standard",
    body: "Most schemes are built for sale, and we build them to the standard we would want as the long-term owner.",
  },
  {
    title: "Considered design",
    body: "Every redevelopment starts from the building's own character, not a template we repeat everywhere.",
  },
  {
    title: "Straightforward delivery",
    body: "Clear timelines, honest budgets, and a small team who stay on a project from acquisition to completion.",
  },
];

// Firm-level facts for the stats band. Portfolio scale (GDV / sq ft / units)
// lives in the InvestmentChart lower down, so the two don't duplicate.
const STATS = [
  { value: "40+", label: "Years of combined experience" },
  { value: "10", label: "Developments delivered and underway" },
  { value: "100%", label: "Delivered in-house" },
];

const PARTNERS = [
  {
    name: "Invest in Satis Group",
    role: "Investment",
    body: "Our proprietary investor platform, giving partners access to the Satis Group development pipeline.",
  },
  {
    name: "Satis Group Sales",
    role: "In-house Sales",
    body: "Residential sales enquiries are handled directly by our own team, so buyers deal with the developer.",
  },
  {
    name: "Rightmove",
    role: "Lettings Listings",
    body: "Our rental homes are listed and let through the UK's largest property portal.",
  },
  {
    name: "SpareRoom",
    role: "Room Lettings",
    body: "En-suite rooms at developments like Barrington House are let through SpareRoom.",
  },
];

// Bios and roles taken from the Satis Group marketing team bios.
const DIRECTORS: TeamMember[] = [
  {
    name: "Shiro Rauniar",
    role: "Funding",
    bio: "Shiro has extensive experience across the full spectrum of the real estate industry, including residential development, conversions, new-build schemes and high-spec retrofit projects. With a strong focus on people management, he builds and leads high-performing teams while overseeing funding strategy, investor relations and risk management to deliver strong partnerships and long-term value.",
    image: "/images/team/shiro.png",
  },
  {
    name: "Tom Morley",
    role: "Acquisition & Exit",
    bio: "Tom specialises in property development and investment, leading projects through the full delivery lifecycle to ensure efficient execution and high-quality outcomes. He heads up acquisitions, due diligence and exit strategy, playing a key role in identifying opportunities and maximising returns through his hands-on approach and strong commercial insight.",
    image: "/images/team/tom-v4.jpg",
  },
  {
    name: "Shaunak Rauniar",
    role: "Operations",
    bio: "Shaunak oversees the operational delivery of all departments across the business, ensuring consistency and efficiency at every stage of development. Focused on driving growth and maintaining high standards, he works closely with the directors to support the full project lifecycle and translate strategy into successful execution.",
    image: "/images/team/shaun.png",
  },
];

const TEAM: TeamMember[] = [
  {
    name: "James Bostock",
    role: "Project Manager",
    bio: "Chartered Building Surveyor (MRICS), specialising in the delivery of complex refurbishment and development schemes. James brings national experience across commercial, residential, leisure, retail, civic and healthcare projects, ensuring high-quality, timely and cost-effective outcomes.",
    image: "/images/team/james.jpg",
  },
  {
    name: "Megan Humphreys",
    role: "Executive Assistant",
    bio: "Providing high-level support to the directors, ensuring efficient operations, seamless coordination and organisational excellence. Megan brings extensive experience supporting senior leaders across property development, health tech and quality improvement, with strengths in programme management, business development and cross-team collaboration.",
    image: "/images/team/megan.png",
  },
  {
    name: "Lorna Baker",
    role: "Accounts",
    bio: "An AAT-qualified accounts professional, Lorna keeps every project and company account in order, from book-keeping and VAT returns through to management reports and completion statements. She brings experience across credit control, reconciliations and company secretarial work.",
    image: "/images/team/lorna.jpg",
  },
];

const FOUNDER_ROLES = [
  { role: "Funding", name: "Shiro Rauniar" },
  { role: "Acquisition & Exit", name: "Tom Morley" },
  { role: "Operations", name: "Shaunak Rauniar" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Satis Group"
        title="A trusted partner."
        description="Satis Group is a property development company based in Manchester, specialising in the meticulous renovation of neglected buildings, transforming them into stylish contemporary homes and adaptable commercial spaces."
        backdrop={<ParallaxSkyline />}
        compact
      />

      {/* Our story — deliberately compact: the founders and team follow
          straight after, and should surface early on the page. */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-20">
          <Reveal className="group relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface lg:h-full lg:aspect-auto">
              <Image
                src="/images/about-plaque.jpg"
                alt="Gold plaque reading “Another development by Satis Group”"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                style={{ objectPosition: "center 45%" }}
              />
            </div>
            <FrameCorners />
          </Reveal>
          <Reveal delay={0.15} className="flex flex-col justify-center gap-6">
            <Eyebrow index="01" label="Our story" />
            <p className="text-xl font-medium leading-snug tracking-tight sm:text-2xl">
              Satis Group was founded to prove that redevelopment doesn&rsquo;t
              have to mean starting from scratch.
            </p>
            <p className="text-base leading-relaxed text-muted">
              We look for buildings with good bones in the wrong condition:
              tired offices, disused yards, terraces neglected for years. We
              give them a use that fits how people want to live and work today.
              Every project is managed in-house from acquisition and planning
              through to construction and sale, in strategic locations across
              Manchester and the North West.
            </p>
            <p className="border-l-2 border-accent pl-4 text-base leading-relaxed">
              Redeveloping properties into places people want to live and
              work.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-3 lg:px-10">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="sm:border-l sm:border-ink-foreground/15 sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
            >
              <StatMeter
                index={`0${index + 1}`}
                value={stat.value}
                label={stat.label}
                delay={index * 0.1}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Our Founders: content and photo taken from the SATIS Company &
          Projects PDF, page 4. */}
      <section id="people" className="scroll-mt-24 border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28">
          <Reveal className="group relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface lg:h-full lg:aspect-auto">
              <Image
                src="/images/team/founders-v2.jpg"
                alt="The three Satis Group founders outside 22 St John Street"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 z-20 bg-background/90 px-3 py-1.5 text-[0.6rem] tracking-[0.25em] uppercase backdrop-blur">
                The founders
              </span>
            </div>
            <FrameCorners />
          </Reveal>
          <Reveal delay={0.12} className="flex flex-col justify-center gap-6">
            <Eyebrow index="02" label="Our founders" />
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Forty years of combined experience.
            </h2>
            <p className="text-base leading-relaxed text-muted">
              With over 40 years of combined experience in the industry, we
              have the knowledge and expertise to transform spaces into
              exceptional residential properties. Our team works seamlessly
              together to create high-quality homes and workspace that meet
              the highest standards of quality.
            </p>
            <ul className="mt-2 flex flex-col">
              {FOUNDER_ROLES.map((founder) => (
                <li
                  key={founder.name}
                  className="group flex items-baseline justify-between gap-3 border-t border-border py-4 transition-colors duration-300 hover:border-accent"
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] bg-accent transition-transform duration-300 group-hover:scale-150"
                    />
                    <span className="text-[0.65rem] tracking-[0.25em] uppercase text-accent-text">
                      {founder.role}
                    </span>
                  </span>
                  <span className="text-sm">{founder.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <Reveal>
            <Eyebrow index="03" label="Our team" />
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              A small team, on every project.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              With nearly 40 years of combined industry experience, our team
              works together to create high-quality homes and workspaces to
              the very highest standards. Tap or hover a photo to read each
              bio.
            </p>
          </Reveal>

          <Reveal>
            <h3 className="mt-16 border-t border-border pt-8 text-xs tracking-[0.3em] uppercase text-muted">
              Directors
            </h3>
          </Reveal>
          <div className="mt-8">
            <TeamGrid members={DIRECTORS} />
          </div>

          <Reveal>
            <h3 className="mt-20 border-t border-border pt-8 text-xs tracking-[0.3em] uppercase text-muted">
              Team
            </h3>
          </Reveal>
          <div className="mt-8">
            <TeamGrid members={TEAM} />
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow index="04" label="Investment opportunities" />
              <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                A market with momentum.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Manchester is a thriving city with a strong economy and a
                growing population. This has created a high demand for housing,
                resulting in a competitive rental market and the potential for
                attractive rental yields. The city has seen significant
                regeneration and development in recent years, with new
                infrastructure projects and cultural attractions attracting
                both residents and investors.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Eyebrow label="The Satis Group future" />
              <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
                A £38m pipeline and growing.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                We currently have a pipeline of £38m with 109,000 sq ft of both
                residential and commercial developments. Looking ahead, our
                growth plan is to scale significantly in the next 12 months by
                delivering our existing projects, adding new opportunities to
                the pipeline, and positioning Satis Group for sustainable
                long-term expansion.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-20">
              <h3 className="text-xs tracking-[0.3em] uppercase text-muted">
                Portfolio at a glance
              </h3>
              <div className="mt-8">
                <InvestmentChart />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Investor call-to-action banner, from the website sketch */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center lg:px-10">
          <Reveal>
            <span className="inline-block bg-accent px-4 py-2 text-xs tracking-[0.3em] uppercase text-black">
              Get full access to our latest investment opportunities
            </span>
            <p className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
              Invest in Satis Group.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/investors"
              className="group inline-flex items-center gap-3 border border-accent-strong bg-accent-strong px-8 py-3 text-xs tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-transparent hover:text-accent-text dark:border-accent dark:bg-accent dark:text-ink dark:hover:bg-transparent dark:hover:text-accent"
            >
              Investors
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <Reveal>
            <Eyebrow index="05" label="How we work" />
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              Principles we build by.
            </h2>
          </Reveal>
          <ValuesGrid values={VALUES} />
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <Reveal>
            <Eyebrow index="06" label="Partnerships" />
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
              Who we work with.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Every Satis Group development is delivered alongside trusted partners,
              from investment through to sales and lettings.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNERS.map((partner, index) => (
              <Reveal key={partner.name} delay={Math.min(index * 0.08, 0.3)}>
                <div className="group relative flex h-full flex-col overflow-hidden border border-border bg-background p-6 transition-colors duration-300 hover:border-accent">
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-0 h-10 w-10 origin-top-right scale-0 bg-accent/10 transition-transform duration-300 group-hover:scale-100"
                    style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                  />
                  <span className="text-lg font-medium tracking-[0.08em]">
                    {partner.name}
                  </span>
                  <span className="mt-1 text-[0.65rem] tracking-[0.25em] uppercase text-accent-text">
                    {partner.role}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {partner.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & recognition — summary; the full list lives on News */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
            <Reveal>
              <Eyebrow index="07" label="Awards & recognition" />
              <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">
                Award winners, and judges of the awards.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
                Our buildings and our people have been recognised nationally:
                {" "}{AWARD_COUNT} competition wins to date, among them a five-star
                UK Property Award for 22 St John and Rising Star of the Year at
                the North West Homebuilder Awards. Our work has been the cover
                feature of Your Property Network, and Satis Group directors sit
                on the judging panel of the Property Investors Awards,
                assessing the field as well as competing in it.
              </p>
              <Link
                href="/news#awards"
                className="group mt-8 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-colors hover:text-accent"
              >
                See every award &amp; feature
                <span
                  aria-hidden="true"
                  className="text-accent transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex gap-12 border-t border-border pt-8 lg:border-none lg:pt-0">
                <div>
                  <span className="text-4xl font-medium tracking-tight text-accent">
                    {AWARD_COUNT}
                  </span>
                  <p className="mt-2 text-sm text-muted">Awards won</p>
                </div>
                <div>
                  <span className="text-4xl font-medium tracking-tight text-accent">
                    {ACCOLADES.length}
                  </span>
                  <p className="mt-2 text-sm text-muted">
                    Accolades &amp; counting
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
