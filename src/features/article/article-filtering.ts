import type { ArticleFilter, ArticleSummary } from './article.types';

export const filterArticles = (articles: ArticleSummary[], { query, tag }: ArticleFilter) => {
  const normalizedQuery = query?.trim().toLocaleLowerCase('zh-CN');

  return articles.filter((article) => {
    const matchesTag = !tag || article.tags.some((articleTag) => articleTag === tag);
    if (!matchesTag) return false;
    if (!normalizedQuery) return true;

    const searchable = [article.title, article.description, ...article.tags].join(' ').toLocaleLowerCase('zh-CN');
    return searchable.includes(normalizedQuery);
  });
};
