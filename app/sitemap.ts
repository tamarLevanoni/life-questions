import type { MetadataRoute } from 'next';
import { searchStories } from '@/lib/server/stories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://life-questions.example';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const result = await searchStories({ limit: 1000, page: 1 });
    const storyUrls = result.stories.map((s) => ({
      url: `${SITE_URL}/story/${s.id}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    return [...staticUrls, ...storyUrls];
  } catch {
    return staticUrls;
  }
}
