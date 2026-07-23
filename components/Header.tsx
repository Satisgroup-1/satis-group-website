"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex flex-col leading-none"
        >
          <span className="text-xl font-medium tracking-[0.35em] uppercase">
            Satis
          </span>
          <span className="mt-1 text-[0.6rem] tracking-[0.45em] uppercase text-muted">
            Group
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
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

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-9 w-9 items-center justify-center"
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
      </div>

      {isMenuOpen && (
        <nav className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`border-b border-border py-4 text-sm tracking-[0.15em] uppercase last:border-none ${
                    isActive ? "text-foreground" : "text-muted"
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
