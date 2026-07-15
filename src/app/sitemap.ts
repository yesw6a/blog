import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/config/site';
import { getPublishedArticleSummaries } from '@/features/article/article.repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticleSummaries();
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: absoluteUrl('/articles'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...articleEntries,
  ];
}
