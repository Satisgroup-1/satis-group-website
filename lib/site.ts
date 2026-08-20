// Canonical origin for absolute URLs (sitemap, robots, Open Graph,
// structured data). The default is the public satisgroup.co.uk domain the
// legal pages name; override with NEXT_PUBLIC_SITE_URL per environment.
//
// Vercel sets NEXT_PUBLIC_VERCEL_ENV to "production", "preview" or
// "development" on every deployment, so staging and per-branch previews can
// identify themselves without any extra configuration.
export const DEPLOY_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development";

// Only the production deployment is the real site: everything else is a
// staging or preview copy that must stay out of search results and must not
// claim the live canonical URLs.
export const IS_LIVE_SITE = DEPLOY_ENV === "production";

const PRODUCTION_URL = "https://www.satisgroup.co.uk";

// Keeping sitemap, canonical and Open Graph links on the deployment's own
// hostname stops a tester following a link out of staging and into the live
// site. Vercel gives a preview two hostnames: a per-commit one, and a branch
// alias that stays put across pushes. The branch alias is the one worth
// linking to, so it wins; the per-commit URL is the fallback.
const PREVIEW_HOST =
  process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (!IS_LIVE_SITE && PREVIEW_HOST ? `https://${PREVIEW_HOST}` : PRODUCTION_URL);

export const SITE_NAME = "Satis Group";
