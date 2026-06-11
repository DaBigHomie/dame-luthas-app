import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
