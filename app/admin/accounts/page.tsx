import type { Metadata } from "next";
import Link from "next/link";
import { AdminAccounts } from "@/components/AdminAccounts";
import { AdminLogin } from "@/components/AdminLogin";
import {
  getAdminAccounts,
  isAuthenticated,
  isUsingDemoCredentials,
} from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin accounts",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  const authed = await isAuthenticated();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Admin
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
          {authed ? "Admin accounts." : "Sign in to continue."}
        </h1>

        {!authed ? (
          <div className="mt-10">
            <AdminLogin />
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Who can sign in to this admin area, and how to add someone.
              Investor logins are separate — manage those on the{" "}
              <Link
                href="/admin/platform"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Investors tab
              </Link>
              .{" "}
              <Link
                href="/admin"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Back to the admin home
              </Link>
              .
            </p>
            <div className="mt-12">
              <AdminAccounts
                usernames={getAdminAccounts().map((a) => a.username)}
                demoMode={isUsingDemoCredentials()}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
