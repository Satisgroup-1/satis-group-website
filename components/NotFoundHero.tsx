"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BlackHoleHeroSection } from "@/components/ui/blackhole-hero-section";

/** True while the viewport is narrow. Drives the layout swap below. */
function useNarrow(query = "(max-width: 767px)") {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setNarrow(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, [query]);
  return narrow;
}

/**
 * The 404, built around the picture rather than laid on top of it.
 *
 * The hole is pushed off centre with `focus`, so the busy half and the reading
 * half never overlap, and `scrim` darkens only the edge the copy sits on. A
 * flat overlay could not do that without greying the halo as well.
 *
 * A phone has no room to stand the two side by side, so there the whole thing
 * turns through 90°: hole low, copy high, veil from the top — and the ray
 * count drops, because a phone pays for every step.
 *
 * The disc runs on the brand gold rather than the stock orange, so the page
 * reads as part of the site instead of a borrowed demo.
 */
export function NotFoundHero() {
  const narrow = useNarrow();

  return (
    <section className="relative min-h-[92svh] w-full md:min-h-[720px]">
      <BlackHoleHeroSection
        focus={narrow ? [0.5, 0.76] : [0.72, 0.46]}
        scrim={narrow ? "top" : "left"}
        scrimStrength={0.9}
        distance={24}
        elevation={narrow ? -7 : -5.5}
        fov={narrow ? 58 : 42}
        glow={narrow ? 0.85 : 1}
        steps={narrow ? 200 : 300}
        resolution={narrow ? 0.6 : 0.7}
        hotColor="#FFF3DE"
        midColor="#D9A85E"
        coolColor="#6B4A18"
      >
        <div className="flex h-full min-h-[92svh] items-start px-6 pt-14 sm:px-10 md:min-h-[720px] md:items-center md:pt-0 lg:px-20">
          <div className="max-w-[34rem]">
            <span className="text-xs tracking-[0.35em] uppercase text-[#C9A05C]">
              404 · Page not found
            </span>

            {/* PageHero's h1, with white pinned for the black frame. The demo's
                own scale was lighter and larger — a display face this site does
                not use anywhere. The line break goes with it: at font-medium the
                copy breaks on its own, and a hard break set for the old metrics
                lands in the wrong place at these. */}
            <h1 className="mt-4 text-4xl font-medium tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              This page is due a redevelopment.
            </h1>

            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-white/60 md:mt-7">
              The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved
              somewhere new. The rest of the site is standing and fully
              occupied.
            </p>

            {/* The site's button pair — square, uppercase, letter-spaced, gold on
                hover — inverted for a hero that is black in either theme.
                `bg-foreground`/`border-border` would follow the theme and go
                invisible here, so the two neutrals are pinned to white and the
                hover lands on the on-dark cut of the accent. */}
            <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10">
              <Link
                href="/"
                className="border border-white bg-white px-6 py-3 text-xs tracking-[0.2em] uppercase text-black transition-colors duration-300 hover:border-[#C9A05C] hover:bg-[#C9A05C] hover:text-ink"
              >
                Back to home
              </Link>
              <Link
                href="/portfolio"
                className="border border-white/30 px-6 py-3 text-xs tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:border-[#C9A05C] hover:text-[#C9A05C]"
              >
                View the portfolio
              </Link>
            </div>
          </div>
        </div>
      </BlackHoleHeroSection>
    </section>
  );
}

export default NotFoundHero;
