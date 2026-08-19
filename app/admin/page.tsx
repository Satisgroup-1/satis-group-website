import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/AdminLogin";
import { isAuthenticated, isUsingFallbackSecret } from "@/lib/admin-auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

const SEGMENTS = [
  {
    href: "/admin/newsletter",
    title: "Newsletter",
    body: "Compose and publish news issues, and review everything already live on the site.",
  },
  {
    href: "/admin/platform",
    title: "Investors",
    body: "Manage investor accounts, developments and SPV cap tables, project returns, insights and upcoming raises — with bulk import and export.",
  },
  {
    href: "/admin/guide",
    title: "Instructions",
    body: "The operations guide: step-by-step, illustrated walkthroughs of every admin task — publishing, investor accounts and figures, login support, content changes and the SEO checklist. Written for non-technical readers.",
  },
  {
    href: "/admin/appraisal",
    title: "Appraisal agent download",
    body: "Download the Satis Appraisal desktop application for Windows or Mac, with step-by-step install instructions.",
  },
];

export default async function AdminPage() {
  const authed = await isAuthenticated();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Admin
        </span>
        <h1 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
          {authed ? "Satis Group control room." : "Sign in to continue."}
        </h1>

        {!authed ? (
          <div className="mt-10">
            <AdminLogin />
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Everything for running the website and investor platform, in one
              place.
            </p>
            {isUsingFallbackSecret() && (
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted">
                Running on the built-in demo signing secret. Before real
                credentials replace test/test, set SATIS_ADMIN_SECRET in the
                hosting environment.
              </p>
            )}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {SEGMENTS.map((segment, index) => (
                <Link
                  key={segment.href}
                  href={segment.href}
                  className="group flex flex-col border border-border p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
                >
                  <span className="flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-accent-text">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-xl font-medium tracking-tight">
                    {segment.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {segment.body}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                    Open
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
            <form action={logout} className="mt-12">
              <button
                type="submit"
                className="border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
