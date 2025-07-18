import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  images: {
    domains: ['localhost']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
