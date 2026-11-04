import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // AGENTS.md already points to installed-version docs; keep agent files curated.
  agentRules: false,
  distDir: process.env.QUALITY_TEST === '1' ? '.next-e2e' : '.next',
  typescript: process.env.QUALITY_TEST === '1'
    ? { tsconfigPath: '.cache/e2e/tsconfig.json' }
    : undefined,
  cacheComponents: true,
  // Preserve the existing Cache Components navigation model during this upgrade.
  partialPrefetching: false,
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
