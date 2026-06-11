import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: repoRoot,
  },
  async rewrites() {
    return [
      {
        source: "/wp-content/:path*",
        destination: "/api/wp-content/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "dameluthas-com-restore.local",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "dameluthas.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
