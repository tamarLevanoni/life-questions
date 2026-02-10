import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hailuoai.video',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '/**',
      },
    ],
  },
  // Handle Hebrew characters in path
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
