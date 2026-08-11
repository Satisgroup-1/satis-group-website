import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/news", label: "News" },
  { href: "/investors", label: "Investors" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/modern-slavery", label: "Modern Slavery Statement" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="flex flex-col">
          <Image
            src="/images/satis-logo-white.png"
            alt="Satis Group"
            width={141}
            height={51}
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-foreground/70">
            Reviving the past. Building the future.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.25em] uppercase text-accent">
            Site
          </span>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-[0.1em] uppercase text-ink-foreground/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs tracking-[0.25em] uppercase text-accent">
            Contact
          </span>
          <a
            href="mailto:info@satisgroup.co.uk"
            className="text-sm tracking-[0.05em] text-ink-foreground/80 transition-colors hover:text-accent"
          >
            info@satisgroup.co.uk
          </a>
          <span className="text-sm tracking-[0.05em] text-ink-foreground/60">
            Cheshire, United Kingdom
          </span>
        </div>
      </div>

      <div className="border-t border-ink-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-6 py-6 text-xs tracking-[0.1em] uppercase text-ink-foreground/50 lg:flex-row lg:px-10">
          <span>&copy; {new Date().getFullYear()} Satis Group. All rights reserved.</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <span>Developing across the North West</span>
        </div>
      </div>
    </footer>
  );
}
