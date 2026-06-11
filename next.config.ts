import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: repoRoot,
  },
  async redirects() {
    return [
      {
        source: "/portfolio",
        destination: "/case-studies",
        permanent: true,
      },
      {
        source: "/pf/:slug",
        destination: "/portfolio/:slug",
        permanent: true,
      },
    ];
  },
  outputFileTracingExcludes: {
    "*": ["./local-wp/**", "./temp/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dameluthas.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
