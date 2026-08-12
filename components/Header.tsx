"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/news", label: "News" },
  { href: "/investors", label: "Investors" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      {/* The real Satis mark sits on the right of the bar; navigation reads
          from the left. The white artwork swaps for a dark variant in light
          mode. */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative py-1 text-sm tracking-[0.15em] uppercase transition-colors hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <ThemeToggle />
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Satis Group home"
            className="relative block h-9 w-[100px]"
          >
            <Image
              src="/images/satis-logo-dark.png"
              alt="Satis Group"
              fill
              sizes="100px"
              className="object-contain object-right dark:hidden"
            />
            <Image
              src="/images/satis-logo-white.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="100px"
              className="hidden object-contain object-right dark:block"
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between md:hidden">
          <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="flex h-11 w-11 items-center justify-center"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 block h-px w-5 bg-foreground transition-transform ${
                  isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 bg-foreground transition-opacity ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 block h-px w-5 bg-foreground transition-transform ${
                  isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
          </div>
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Satis Group home"
            className="relative block h-8 w-[88px]"
          >
            <Image
              src="/images/satis-logo-dark.png"
              alt="Satis Group"
              fill
              sizes="88px"
              className="object-contain object-right dark:hidden"
            />
            <Image
              src="/images/satis-logo-white.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="88px"
              className="hidden object-contain object-right dark:block"
            />
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary (mobile)"
          className="border-t border-border md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`border-b border-border py-4 text-sm tracking-[0.15em] uppercase last:border-none ${
                    isActive
                      ? "border-l-2 border-l-accent pl-3 text-foreground"
                      : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
