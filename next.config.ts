import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    externalDir: true,
  },
};

export default nextConfig;