import type { Metadata } from "next";
import Link from "next/link";
import { BlueprintGrid } from "@/components/BlueprintGrid";

export const metadata: Metadata = {
  title: "Page not found | Satis Group",
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-muted/40"
      >
        <BlueprintGrid className="h-full w-full" />
      </div>
      <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col items-start justify-center px-6 py-24 lg:px-10">
        <span className="text-xs tracking-[0.35em] uppercase text-accent">
          404 · Page not found
        </span>
        <h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
          This page is due a redevelopment.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved
          somewhere new. The rest of the site is standing and fully occupied.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="border border-foreground bg-foreground px-6 py-3 text-xs tracking-[0.2em] uppercase text-background transition-colors duration-300 hover:border-accent hover:bg-accent"
          >
            Back to home
          </Link>
          <Link
            href="/portfolio"
            className="border border-border px-6 py-3 text-xs tracking-[0.2em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            View the portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
