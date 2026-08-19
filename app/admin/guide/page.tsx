import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/AdminLogin";
import { isAuthenticated } from "@/lib/admin-auth";
import { GUIDE_GROUPS, orderedChapters } from "@/lib/admin-guide";

export const metadata: Metadata = {
  title: "Operations guide",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

const GROUP_INTROS: Record<string, string> = {
  "Getting started": "Read this first — ten minutes, once.",
  Publishing: "News for the public site; reports and research for investors.",
  "Investor platform":
    "Accounts, holdings, figures and support — the day-to-day of running the portal.",
  "Website & hosting":
    "How changes reach the live site, and how to change anything with Claude.",
  Reference: "Checklists and look-ups you will come back to.",
};

export default async function AdminGuidePage() {
  const authed = await isAuthenticated();
  const chapters = orderedChapters();

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
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              Step-by-step, illustrated instructions for running this website
              and the investor platform — written for someone with no technical
              background. Every walkthrough uses numbered steps and annotated
              screenshots of the real screens, and flags every button that
              changes something.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              New here? Start with{" "}
              <Link
                href="/admin/guide/signing-in"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Signing in and finding your way around
              </Link>
              , then read{" "}
              <Link
                href="/admin/guide/platform-tour"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                How the investor platform fits together
              </Link>{" "}
              — everything else can be looked up when needed.
            </p>

            <div className="mt-8 max-w-2xl border border-border bg-surface p-5">
              <p className="text-[10px] tracking-[.2em] uppercase text-accent-text">
                The two rules that cover everything
              </p>
              <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted">
                <li>
                  <b className="font-medium text-foreground">
                    Nothing changes until you press Save or Publish
                  </b>{" "}
                  — browsing and reading can never break anything.
                </li>
                <li>
                  <b className="font-medium text-foreground">
                    Every change goes through the repository
                  </b>{" "}
                  — on the live site the platform studio commits saves for you
                  (allow a minute for the redeploy), and anything that refuses
                  to save goes via the routine in “Making changes stick on
                  live hosting”.
                </li>
              </ul>
            </div>

            <div className="mt-16 flex max-w-4xl flex-col gap-14">
              {GUIDE_GROUPS.map((group, groupIndex) => {
                const groupChapters = chapters.filter(
                  (entry) => entry.chapter.group === group
                );
                if (groupChapters.length === 0) return null;
                return (
                  <section key={group}>
                    <span className="flex items-center gap-3 text-xs tracking-[.35em] uppercase text-accent-text">
                      <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
                      <span>{group}</span>
                    </span>
                    <p className="mt-3 text-sm text-muted">
                      {GROUP_INTROS[group]}
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {groupChapters.map(({ chapter, number }) => (
                        <Link
                          key={chapter.slug}
                          href={`/admin/guide/${chapter.slug}`}
                          className="group flex flex-col border border-border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
                        >
                          <span className="text-xs tracking-[.2em] uppercase text-accent-text">
                            {String(number).padStart(2, "0")}
                          </span>
                          <h2 className="mt-3 text-base font-medium tracking-tight">
                            {chapter.title}
                          </h2>
                          <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                            {chapter.summary}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[.2em] uppercase text-muted">
                            {chapter.time ?? "Reference"}
                            <span
                              aria-hidden="true"
                              className="text-accent transition-transform duration-300 group-hover:translate-x-1.5"
                            >
                              →
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <p className="mt-16 max-w-2xl border-t border-border pt-6 text-sm leading-7 text-muted">
              Manage data in the{" "}
              <Link
                href="/admin/platform"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                platform studio
              </Link>
              , news in the{" "}
              <Link
                href="/admin/newsletter"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                newsletter studio
              </Link>
              , and download the appraisal app from the{" "}
              <Link
                href="/admin/appraisal"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                appraisal page
              </Link>{" "}
              (it carries its own install walkthrough).{" "}
              <Link
                href="/admin"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Back to the admin home
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </section>
  );
}
