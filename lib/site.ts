// Canonical origin for absolute URLs (sitemap, robots, Open Graph,
// structured data). The default is the public satisgroup.co.uk domain the
// legal pages name; override with NEXT_PUBLIC_SITE_URL per environment.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.satisgroup.co.uk";

export const SITE_NAME = "Satis Group";
