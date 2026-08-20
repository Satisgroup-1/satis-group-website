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

// Preview deployments get a per-deployment hostname; using it keeps sitemap,
// canonical and Open Graph links pointing at the copy being reviewed instead
// of bouncing testers over to the live site.
const VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (!IS_LIVE_SITE && VERCEL_URL ? `https://${VERCEL_URL}` : PRODUCTION_URL);

export const SITE_NAME = "Satis Group";
