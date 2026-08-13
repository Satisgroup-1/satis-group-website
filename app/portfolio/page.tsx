import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Property development portfolio, North West",
  alternates: { canonical: "/portfolio" },
  description:
    "A selection of residential and commercial redevelopments delivered by Satis Group across the North West.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projects, past and present."
        description="A selection of the residential and commercial redevelopments we've delivered across the North West."
      />
      <PortfolioGrid />
    </>
  );
}
