import type { NextConfig } from "next";

// Baseline security headers. A full Content-Security-Policy needs nonce
// work for the theme init script, so only frame-ancestors is enforced here;
// stage a fuller CSP via Content-Security-Policy-Report-Only when ready.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

// Vercel sets VERCEL_ENV on every deployment; anything other than
// "production" is a staging or preview copy of the live site.
const isLiveSite = process.env.VERCEL_ENV === "production";

// robots.txt is advisory and does not cover assets or Open Graph images, so
// staging deployments carry the header form too.
const noIndexHeaders = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // The admin importer and PDF uploads exceed the 1 MB server-action
      // default. Uploads are capped at 4MB in lib/investor-files.ts because
      // Vercel rejects request bodies past ~4.5MB regardless of this value;
      // the headroom here covers multipart overhead.
      bodySizeLimit: "6mb",
    },
  },
  // Uploaded investor PDFs are read from disk at request time, which output
  // tracing cannot see — include them in the download route's bundle.
  outputFileTracingIncludes: {
    "/investors/files/[name]": ["./content/investors/files/**/*"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: isLiveSite
          ? securityHeaders
          : [...securityHeaders, ...noIndexHeaders],
      },
    ];
  },
  async redirects() {
    // The newsletter section became /news; keep old links working.
    return [
      {
        source: "/newsletter",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/newsletter/:slug",
        destination: "/news/:slug",
        permanent: true,
      },
      // Mayor Street was corrected to Meyer Street.
      {
        source: "/portfolio/mayor-street",
        destination: "/portfolio/meyer-street",
        permanent: true,
      },
      // Petersgate House was renamed QUBE.
      {
        source: "/portfolio/petersgate-house",
        destination: "/portfolio/qube",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
