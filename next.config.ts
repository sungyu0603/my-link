import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
    ],
  },
  // Allow network access in dev environment
  allowedDevOrigins: ['192.168.123.100', 'localhost', '127.0.0.1'],
};

export default nextConfig;
