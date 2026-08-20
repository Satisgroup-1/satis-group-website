import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/AdminLogin";
import {
  AdminSubscribers,
  type SubscriberRow,
} from "@/components/AdminSubscribers";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  formatSubscribedAt,
  getSubscribers,
} from "@/lib/newsletter-subscribers";
import { logout } from "../../actions";

export const metadata: Metadata = {
  title: "Newsletter signup list",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, and the list changes whenever someone signs
// up, so this page must render per-request.
export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const authed = await isAuthenticated();
  const rows: SubscriberRow[] = authed
    ? getSubscribers().map((subscriber) => ({
        email: subscriber.email,
        ...(subscriber.name ? { name: subscriber.name } : {}),
        source: subscriber.source,
        status: subscriber.status,
        signedUp: formatSubscribedAt(subscriber.subscribedAt),
        signedUpAt: subscriber.subscribedAt,
      }))
    : [];

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Admin
        </span>
        <h1 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
          {authed ? "Newsletter signup list." : "Sign in to continue."}
        </h1>

        {!authed ? (
          <div className="mt-10">
            <AdminLogin />
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Everyone who has signed up through the website, newest first.
              Names are added automatically the moment someone submits the
              form on the{" "}
              <Link
                href="/news"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                news page
              </Link>
              .{" "}
              <Link
                href="/admin/newsletter"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Back to the newsletter studio
              </Link>
              .
            </p>
            <div className="mt-12">
              <AdminSubscribers rows={rows} />
            </div>
            <form action={logout} className="mt-14">
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
