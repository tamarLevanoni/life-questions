import type { MetadataRoute } from 'next';
import { searchStories } from '@/lib/server/stories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://life-questions.example';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/search`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const storyUrls: MetadataRoute.Sitemap = [];
    const seen = new Set<string>();
    const limit = 50;
    let page = 1;
    let received = 0;
    while (true) {
      const result = await searchStories({ limit, page });
      if (result.stories.length === 0) break;
      for (const story of result.stories) {
        if (seen.has(story.id)) continue;
        seen.add(story.id);
        storyUrls.push({ url: `${SITE_URL}/story/${story.id}`, changeFrequency: 'monthly', priority: 0.7 });
      }
      received += result.stories.length;
      if (received >= result.total || result.stories.length < limit) break;
      page += 1;
    }
    return [...staticUrls, ...storyUrls];
  } catch {
    return staticUrls;
  }
}
