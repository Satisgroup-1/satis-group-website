import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/AdminLogin";
import { isAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Operations guide",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

type GuideSection = {
  id: string;
  title: string;
  intro?: string;
  items: { heading: string; body: string[] }[];
};

const SECTIONS: GuideSection[] = [
  {
    id: "quick-reference",
    title: "Quick reference",
    items: [
      {
        heading: "Where everything lives",
        body: [
          "/admin — newsletter studio (this area). /admin/platform — investor platform data studio: accounts, developments & SPVs, cap tables, returns, updates, insights, opportunities, import/export. /admin/guide — this operations guide.",
          "Public site: /portfolio (with per-site pages), /about, /news, /contact, /investors (the investor platform), /legal/* (terms, privacy, modern slavery).",
        ],
      },
      {
        heading: "Demo credentials — replace before real use",
        body: [
          "Admin sign-in and the demo investor account both use test / test. Before onboarding real investors: create real investor accounts in /admin/platform (passwords are hashed, never stored in plain text), then ask the development team to retire the demo account and set SATIS_ADMIN_SECRET and SATIS_INVESTOR_SECRET environment variables in the hosting platform.",
        ],
      },
    ],
  },
  {
    id: "news",
    title: "Publishing news",
    items: [
      {
        heading: "Composing an issue",
        body: [
          "Use the newsletter studio on /admin. Title, date (YYYY-MM-DD), a one-line summary and the body are required. Paragraphs are separated by blank lines; a line starting with \"## \" becomes a section heading; lines starting with \"- \" become a bullet list.",
          "Published issues appear immediately at /news and in the sitemap. To correct one, publish again with the same title and date after removing the original.",
        ],
      },
    ],
  },
  {
    id: "investors",
    title: "Investor platform management",
    intro:
      "Everything an investor sees is derived from the datasets in /admin/platform. Portfolio value is always share % × the SPV's equity value — update the vehicle, and every member's figures follow.",
    items: [
      {
        heading: "Adding an investor",
        body: [
          "Investors tab → Add or update investor. The account ID is derived from the name (or set your own); the email is their login. Passwords are scrypt-hashed on save.",
          "Then give them exposure on the Cap tables & returns tab: choose the development, their committed capital and their share % of the vehicle. The cap table for any SPV cannot exceed 100% — the form enforces this.",
        ],
      },
      {
        heading: "Keeping figures current",
        body: [
          "Site progress, phase and next-report dates live on the Developments & SPVs tab; the SPV equity value on the same form is what drives investor valuations — update it after each valuation cycle.",
          "Record quarterly portfolio valuations per investor (Investors tab) to extend their value-progression chart, and log capital calls, distributions and interest on the Cap tables & returns tab — paid distributions feed \"distributions to date\", forecast ones appear as next cash events.",
        ],
      },
      {
        heading: "Publishing to investors",
        body: [
          "Site updates and Insights tabs publish directly into the portal. The insight composer uses the same markdown-ish syntax as the newsletter studio, plus \"> \" for pull quotes; richer blocks (stat rows, tables, callouts) can be added through the JSON importer.",
          "Upcoming investments (the deal-flow page investors see) are managed on the Opportunities tab, including raise progress and status.",
        ],
      },
      {
        heading: "Investor login support",
        body: [
          "Forgotten password: open the investor on the Investors tab and enter a new password — saving re-hashes it; tell the investor their new credential over a trusted channel.",
          "\"Too many attempts\": sign-in throttles after 5 failed tries from one address; it clears after 15 minutes. Sessions last 24 hours, after which investors simply sign in again.",
          "Locked-out admin: the admin login is fixed (test/test until real credentials are configured) and throttles the same way.",
        ],
      },
    ],
  },
  {
    id: "hosting",
    title: "Editing on live hosting (important)",
    items: [
      {
        heading: "The read-only rule",
        body: [
          "On Vercel the deployed filesystem is read-only, so admin forms will refuse writes with an explanation. The durable workflow: press \"Export current dataset\" on the Import/export tab, make your changes to the JSON (or ask Claude to), commit the files in content/investors/ to the GitHub repository, and the next deployment serves them.",
          "In any writable environment (local, or a Claude session) the forms save directly and changes appear immediately.",
        ],
      },
    ],
  },
  {
    id: "content",
    title: "Updating website content",
    items: [
      {
        heading: "Where content lives",
        body: [
          "Portfolio cards: lib/portfolio-data.ts (name, location, status, card image, hover logo). Property pages: lib/property-pages.ts (hero, intro, specification, floors, gallery, agents, listings, microsite links). Images: public/images/. News: content/newsletters/. Investor platform: content/investors/.",
          "The simplest way to change any of it is to start a Claude Code session on the repository and describe the change — every page is data-driven, so edits are additions to these files rather than redesigns.",
        ],
      },
      {
        heading: "Adding a new development",
        body: [
          "Provide: name and brand, address, status, a hero photograph, the project logo (if branded), and any brochure PDF. Claude adds the card, the detail page, the map entry and the investor-platform SPV in one pass — the checklist it follows is: portfolio-data entry → property-pages entry → images optimised into public/images → developments.json with SPV values → cap-table positions.",
        ],
      },
    ],
  },
  {
    id: "agents",
    title: "Claude agents & skills",
    intro:
      "The repository carries a vendored catalogue of 100+ specialist skills in .claude/skills/ — playbooks Claude loads to work to a professional standard. In any Claude Code session on this repo, type /skill-name or just ask for the outcome.",
    items: [
      {
        heading: "The ones worth knowing",
        body: [
          "design-standards — UI quality review against tokens, contrast, hierarchy, spacing, mobile and consistency rules (used for the property-page polish).",
          "seo-audit-orchestration, seo-onpage, seo-technical — full SEO audits and fixes. accessibility-audit — WCAG review. code-review-web — bug/security review of changes. content-and-copy, brand-voice — writing in the house voice. cro-optimization — conversion review of enquiry paths.",
        ],
      },
      {
        heading: "How to use them",
        body: [
          "Ask in plain English: \"run an accessibility audit and fix what it finds\" or \"/design-standards review the contact page\". For bigger sweeps, ask Claude to run several skill-armed agents in parallel (e.g. SEO + accessibility + code review) and implement the findings — that is how the current site standards were set.",
        ],
      },
    ],
  },
  {
    id: "seo",
    title: "SEO & Google presence",
    intro:
      "The site ships with the on-page fundamentals: per-page titles and descriptions, canonical URLs on satisgroup.co.uk, Open Graph images, Organization and property JSON-LD, an auto-generated sitemap.xml and robots.txt.",
    items: [
      {
        heading: "When satisgroup.co.uk points at this site",
        body: [
          "1. In Vercel, add satisgroup.co.uk and www.satisgroup.co.uk as domains and follow the DNS instructions. 2. Keep NEXT_PUBLIC_SITE_URL set to https://www.satisgroup.co.uk (already the default). 3. If any URLs from the old site differ, ask Claude to add permanent redirects so existing Google results and backlinks keep working.",
        ],
      },
      {
        heading: "Google checklist (off-site, one-time)",
        body: [
          "Google Search Console: verify the domain, submit https://www.satisgroup.co.uk/sitemap.xml, and watch the coverage report for the first fortnight.",
          "Google Business Profile: claim or update the Satis Group listing (name, office address, phone, website, photography) — this is what controls the map panel when people search the company name.",
          "Consistency: use exactly the same company name, address and phone on the website footer, GBP, LinkedIn and portal listings (Rightmove/Zoopla agent pages) — consistency is a ranking signal for local results.",
        ],
      },
    ],
  },
];

export default async function AdminGuidePage() {
  const authed = await isAuthenticated();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Admin
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
          {authed ? "Operations guide." : "Sign in to continue."}
        </h1>

        {!authed ? (
          <div className="mt-10">
            <AdminLogin />
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              The standing operating procedures for running this website and
              the investor platform — day-to-day publishing, investor support,
              content changes, Claude agents &amp; skills, and search
              presence. Manage data in the{" "}
              <Link
                href="/admin/platform"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                platform studio
              </Link>{" "}
              and news in the{" "}
              <Link
                href="/admin"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                newsletter studio
              </Link>
              .
            </p>

            <nav aria-label="Guide contents" className="mt-10 flex flex-wrap gap-3">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="border border-border px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors hover:border-accent hover:text-accent"
                >
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="mt-16 flex max-w-3xl flex-col gap-16">
              {SECTIONS.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <span className="flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-accent-text">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
                    <span>{section.title}</span>
                  </span>
                  {section.intro && (
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {section.intro}
                    </p>
                  )}
                  <div className="mt-6 flex flex-col gap-8">
                    {section.items.map((item) => (
                      <div key={item.heading} className="border-t border-border pt-5">
                        <h2 className="text-base font-medium tracking-tight">
                          {item.heading}
                        </h2>
                        {item.body.map((paragraph, i) => (
                          <p
                            key={i}
                            className="mt-3 text-sm leading-relaxed text-muted"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
