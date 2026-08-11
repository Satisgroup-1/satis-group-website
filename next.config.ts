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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // The admin investor-data importer accepts JSON uploads larger than
      // the 1 MB server-action default.
      bodySizeLimit: "5mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
