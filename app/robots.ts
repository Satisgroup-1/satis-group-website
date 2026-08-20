import type { MetadataRoute } from "next";
import { IS_LIVE_SITE, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Staging and preview deployments are copies of the live site: letting them
  // be crawled would duplicate every page against satisgroup.co.uk.
  if (!IS_LIVE_SITE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
