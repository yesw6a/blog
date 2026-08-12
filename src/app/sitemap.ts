import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/config/site';
import {
  ARTICLE_CATEGORIES,
  getArticleCategoryHref,
} from '@/features/article/article.constants';
import { getPublishedArticleSummaries } from '@/features/article/article.repository';
import { getToolHref, TOOL_DEFINITIONS } from '@/features/toolbox/toolbox.registry';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticleSummaries();
  const latestArticleModified = articles.reduce<string | undefined>((latest, article) => {
    const modified = article.updatedAt || article.publishedAt;
    return !latest || Date.parse(modified) > Date.parse(latest) ? modified : latest;
  }, undefined);
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: article.updatedAt || article.publishedAt,
  }));
  const categoryLastModified = new Map(
    ARTICLE_CATEGORIES.map((category) => {
      const categoryArticles = articles.filter((article) => article.category === category);
      const lastModified = categoryArticles.reduce<string | undefined>((latest, article) => {
        const modified = article.updatedAt || article.publishedAt;
        return !latest || Date.parse(modified) > Date.parse(latest) ? modified : latest;
      }, undefined);
      return [category, lastModified] as const;
    }),
  );
  const categoryEntries: MetadataRoute.Sitemap = ARTICLE_CATEGORIES.flatMap((category) => {
    const lastModified = categoryLastModified.get(category);
    return lastModified
      ? [{ url: absoluteUrl(getArticleCategoryHref(category)), lastModified }]
      : [];
  });
  const toolEntries: MetadataRoute.Sitemap = TOOL_DEFINITIONS.map((tool) => ({
    url: absoluteUrl(getToolHref(tool.slug)),
  }));

  return [
    {
      url: absoluteUrl('/'),
      lastModified: latestArticleModified,
    },
    {
      url: absoluteUrl('/articles'),
      lastModified: latestArticleModified,
    },
    {
      url: absoluteUrl('/tools'),
    },
    ...categoryEntries,
    ...toolEntries,
    ...articleEntries,
  ];
}
