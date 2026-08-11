import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SplashScreen } from "@/components/SplashScreen";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Satis Group | Property Redevelopment",
  description:
    "Satis Group redevelops residential and commercial property into places people want to live and work.",
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
      </head>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <ThemeProvider>
          <SplashScreen />
          <ScrollProgress />
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
