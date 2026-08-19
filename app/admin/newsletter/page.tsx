import type { Metadata } from "next";
import Link from "next/link";
import { AdminHomeLink } from "@/components/AdminHomeLink";
import { AdminLogin } from "@/components/AdminLogin";
import { NewsletterComposer } from "@/components/NewsletterComposer";
import { isAuthenticated } from "@/lib/admin-auth";
import { formatNewsletterDate, getNewsletters } from "@/lib/newsletters";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: "Newsletter studio",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const authed = await isAuthenticated();
  const issues = authed ? getNewsletters() : [];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        {authed && <AdminHomeLink />}
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Admin
        </span>
        <h1 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
          {authed ? "Newsletter studio." : "Sign in to continue."}
        </h1>

        {!authed ? (
          <div className="mt-10">
            <AdminLogin />
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Issues publish straight to the news page.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_20rem]">
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-muted">
                  New issue
                </h2>
                <div className="mt-6 max-w-2xl">
                  <NewsletterComposer today={today} />
                </div>
              </div>
              <aside className="flex flex-col gap-8">
                <div>
                  <h2 className="text-xs tracking-[0.2em] uppercase text-muted">
                    Published issues
                  </h2>
                  <ul className="mt-4 flex flex-col">
                    {issues.map((issue) => (
                      <li key={issue.slug} className="border-t border-border py-3">
                        <Link
                          href={`/news/${issue.slug}`}
                          className="text-sm transition-colors hover:text-accent"
                        >
                          {issue.title}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {formatNewsletterDate(issue.date)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    className="border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    Sign out
                  </button>
                </form>
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
