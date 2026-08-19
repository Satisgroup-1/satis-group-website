import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PROPERTY_PAGES } from "@/lib/property-pages";
import { getNewsletters } from "@/lib/newsletters";
import { LEGAL_PAGES } from "@/lib/legal-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/news`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/investors`, changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${SITE_URL}/investors/enquire`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];
  const properties: MetadataRoute.Sitemap = PROPERTY_PAGES.map((property) => ({
    url: `${SITE_URL}/portfolio/${property.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const news: MetadataRoute.Sitemap = getNewsletters().map((issue) => ({
    url: `${SITE_URL}/news/${issue.slug}`,
    lastModified: new Date(issue.date),
    changeFrequency: "yearly",
    priority: 0.4,
  }));
  const legal: MetadataRoute.Sitemap = LEGAL_PAGES.map((page) => ({
    url: `${SITE_URL}/legal/${page.slug}`,
    changeFrequency: "yearly",
    priority: 0.2,
  }));
  return [...staticRoutes, ...properties, ...news, ...legal];
}
