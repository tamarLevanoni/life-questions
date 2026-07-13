import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXTAUTH_URL ?? 'https://life-questions.example';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/profile', '/auth/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
