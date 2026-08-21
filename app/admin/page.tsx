import type { Metadata } from "next";
import {
  AdminSegmentGrid,
  type AdminSegment,
} from "@/components/AdminSegmentGrid";
import { AdminLogin } from "@/components/AdminLogin";
import { Eyebrow } from "@/components/Eyebrow";
import {
  isAuthenticated,
  isUsingDemoCredentials,
  isUsingFallbackSecret,
} from "@/lib/admin-auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

const SEGMENTS: AdminSegment[] = [
  {
    href: "/admin/newsletter",
    title: "Newsletter",
    body: "Compose and publish news issues, and review everything already live on the site.",
  },
  {
    href: "/admin/newsletter/subscribers",
    title: "Newsletter signup list",
    body: "Everyone who has signed up through the website — added automatically when the form is submitted. Search it, unsubscribe or delete an address, and download it as a CSV.",
  },
  {
    href: "/admin/platform",
    title: "Investors",
    body: "Manage investor accounts, developments and SPV cap tables, project returns, insights and upcoming raises — with bulk import and export.",
  },
  {
    href: "/admin/accounts",
    title: "Admin accounts",
    body: "See who can sign in here, and add a new admin account — generates the credential entry to paste into the hosting environment.",
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
        <Eyebrow label="Admin" />
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
            {(isUsingFallbackSecret() || isUsingDemoCredentials()) && (
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted">
                {isUsingDemoCredentials() &&
                  "Signed in with the public demo credentials (test/test) — set SATIS_ADMIN_USERS in the hosting environment to switch to real accounts (generate entries under Admin accounts below). "}
                {isUsingFallbackSecret() &&
                  "Running on the built-in demo signing secret — set SATIS_ADMIN_SECRET in the hosting environment to make sessions unforgeable."}
              </p>
            )}
            <AdminSegmentGrid segments={SEGMENTS} />
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
