import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Property development portfolio, Manchester",
  alternates: { canonical: "/portfolio" },
  description:
    "Residential and commercial redevelopments delivered and under way with Satis Group across Manchester and the North West.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projects: past, present &amp; future."
        description="Residential and commercial redevelopments across Manchester and the North West: schemes we have completed, sites on site now, and those still to come."
      />
      <PortfolioGrid />
    </>
  );
}
