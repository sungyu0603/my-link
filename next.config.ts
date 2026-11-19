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
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Allow network access in dev environment
  allowedDevOrigins: ['192.168.123.100', 'localhost', '127.0.0.1'],

  // 검색 로봇 수집 허용 (네이버 서치어드바이저 X-Robots-Tag noindex 덮어쓰기)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'all, index, follow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
