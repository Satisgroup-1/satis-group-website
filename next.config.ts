import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "5mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
    ];
  },
};

export default nextConfig;
