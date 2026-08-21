import type { Metadata } from "next";
import { NotFoundHero } from "@/components/NotFoundHero";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return <NotFoundHero />;
}
