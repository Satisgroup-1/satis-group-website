import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SplashScreen } from "@/components/SplashScreen";
import { TermsGate } from "@/components/TermsGate";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/ThemeProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Satis Group: property redevelopment in the North West",
    template: "%s | Satis Group",
  },
  description:
    "Satis Group acquires, redevelops and manages residential and commercial property across the North West. 60+ properties redeveloped and £120m in development value delivered.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

// Facts sourced from the legal pages (RA Developments (NW) Limited details)
// and the public assets already on the site.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "RA Developments (NW) Limited",
  url: SITE_URL,
  logo: `${SITE_URL}/images/satis-logo-white.png`,
  email: "info@satisgroup.co.uk",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Peel House, 30 The Downs",
    addressLocality: "Altrincham",
    addressRegion: "Cheshire",
    postalCode: "WA14 2PX",
    addressCountry: "GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <MotionProvider>
            <SplashScreen />
            <TermsGate />
            <ScrollProgress />
            <Header />
            <main id="main" className="flex flex-1 flex-col">
              {children}
            </main>
            <Footer />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
