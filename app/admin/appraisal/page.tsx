import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/AdminLogin";
import { isAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Appraisal agent download",
  robots: { index: false, follow: false },
};

// Auth state lives in a cookie, so this page must render per-request.
export const dynamic = "force-dynamic";

// Stable public URLs: the Appraisalapplication repository publishes every
// version with these exact file names, so "latest" always points at the
// newest release.
const RELEASES = "https://github.com/Satisgroup-1/Appraisalapplication/releases";
const WINDOWS_URL = `${RELEASES}/latest/download/Satis-Appraisal-Setup.exe`;
const MAC_URL = `${RELEASES}/latest/download/Satis-Appraisal.dmg`;

const WINDOWS_STEPS = [
  "Click the Windows button above — the file Satis-Appraisal-Setup.exe saves to your Downloads folder.",
  "Open your Downloads folder and double-click Satis-Appraisal-Setup.exe.",
  "If Windows shows a blue “Windows protected your PC” message, click “More info” and then “Run anyway” — this appears because the app is distributed privately by Satis Group rather than through the Microsoft Store.",
  "Follow the installer: click Next, choose where to install (the suggested folder is fine), and click Install.",
  "When it finishes, Satis Appraisal appears in your Start menu like any other program.",
];

const MAC_STEPS = [
  "Click the Mac button above — the file Satis-Appraisal.dmg saves to your Downloads folder.",
  "Open your Downloads folder and double-click Satis-Appraisal.dmg, then drag the Satis Appraisal icon into the Applications folder shown next to it.",
  "Open your Applications folder, hold the Control key and click Satis Appraisal, then choose “Open” and confirm — this is only needed the first time, because the app is distributed privately by Satis Group rather than through the App Store.",
  "After that first launch it opens normally from Launchpad or the Applications folder.",
];

export default async function AdminAppraisalPage() {
  const authed = await isAuthenticated();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
          Admin
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
          {authed ? "Appraisal agent download." : "Sign in to continue."}
        </h1>

        {!authed ? (
          <div className="mt-10">
            <AdminLogin />
          </div>
        ) : (
          <>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              The Satis Appraisal agent is a desktop application for Windows
              and Mac. It imports floorplans of existing buildings, generates
              the ways they could be converted, checks every layout against UK
              minimum-space rules, and runs a full development appraisal of
              each option — mirroring the Satis Appraisal Model workbook.{" "}
              <Link
                href="/admin"
                className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              >
                Back to the admin home
              </Link>
              .
            </p>

            <div className="mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
              <a
                href={WINDOWS_URL}
                className="group flex flex-col border border-border p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
              >
                <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
                  Windows
                </span>
                <span className="mt-4 text-xl font-medium tracking-tight">
                  Download for Windows
                </span>
                <span className="mt-2 text-sm text-muted">
                  Satis-Appraisal-Setup.exe · Windows 10 or newer
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                  Download
                  <span aria-hidden="true" className="text-accent">
                    ↓
                  </span>
                </span>
              </a>
              <a
                href={MAC_URL}
                className="group flex flex-col border border-border p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
              >
                <span className="text-xs tracking-[0.35em] uppercase text-accent-text">
                  Mac
                </span>
                <span className="mt-4 text-xl font-medium tracking-tight">
                  Download for Mac
                </span>
                <span className="mt-2 text-sm text-muted">
                  Satis-Appraisal.dmg · Apple silicon &amp; Intel
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
                  Download
                  <span aria-hidden="true" className="text-accent">
                    ↓
                  </span>
                </span>
              </a>
            </div>

            <div className="mt-16 grid max-w-4xl grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-muted">
                  Installing on Windows
                </h2>
                <ol className="mt-5 flex flex-col gap-4">
                  {WINDOWS_STEPS.map((step, index) => (
                    <li key={index} className="flex gap-4 text-sm leading-relaxed">
                      <span className="text-accent-text">{index + 1}.</span>
                      <span className="text-muted">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h2 className="text-xs tracking-[0.2em] uppercase text-muted">
                  Installing on Mac
                </h2>
                <ol className="mt-5 flex flex-col gap-4">
                  {MAC_STEPS.map((step, index) => (
                    <li key={index} className="flex gap-4 text-sm leading-relaxed">
                      <span className="text-accent-text">{index + 1}.</span>
                      <span className="text-muted">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-16 max-w-2xl border-t border-border pt-8">
              <h2 className="text-xs tracking-[0.2em] uppercase text-muted">
                Good to know
              </h2>
              <ul className="mt-5 flex flex-col gap-3 text-sm leading-relaxed text-muted">
                <li>
                  The buttons above always give you the newest version — there
                  is nothing to configure. To reinstall or update, simply
                  download and run it again.
                </li>
                <li>
                  To use the AI floorplan reader (PDF and photo import), open
                  Settings inside the app and add an Anthropic API key; DXF
                  files and manual entry work without one.
                </li>
                <li>
                  Earlier versions remain available on the{" "}
                  <a
                    href={RELEASES}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border underline-offset-4 transition-colors hover:text-accent"
                  >
                    releases page
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  .
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
