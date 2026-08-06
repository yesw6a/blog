import type { ArticleFilter, ArticleSummary } from './article.types';

import { ARTICLE_PAGE_SIZE } from './article.constants';

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

export const parseArticlePage = (value?: string | null) => {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
};

export const paginateArticles = (articles: ArticleSummary[], requestedPage: number, pageSize = ARTICLE_PAGE_SIZE) => {
  const totalArticles = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    articles: articles.slice(start, start + pageSize),
    currentPage,
    pageSize,
    totalArticles,
    totalPages,
  };
};
