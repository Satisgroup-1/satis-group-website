import type { Metadata } from "next";
import { InvestorPortal } from "@/components/InvestorPortal";

export const metadata: Metadata = {
  title: "Investor platform",
  alternates: { canonical: "/investors" },
  description:
    "Portfolio performance, Greater Manchester market intelligence, development updates and investor reporting from Satis Group.",
};

export default function InvestorsPage() {
  return <InvestorPortal />;
}
