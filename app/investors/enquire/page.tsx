import type { Metadata } from "next";
import { InvestorEnquiryForm } from "@/components/InvestorEnquiryForm";

export const metadata: Metadata = {
  title: "Become an investor",
  description:
    "Request an account on the Satis Group investor platform: the investment memorandum, appraisals for every current raise, and a call with the team.",
  alternates: { canonical: "/investors/enquire" },
};

export default function InvestorEnquirePage() {
  return <InvestorEnquiryForm />;
}
