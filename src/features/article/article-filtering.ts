import type { ArticleSummary } from './article.types';

import { ARTICLE_PAGE_SIZE } from './article.constants';

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

export const accumulateArticlePages = (
  articles: ArticleSummary[],
  requestedPage: number,
  pageSize = ARTICLE_PAGE_SIZE,
) => {
  const totalArticles = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);

  return {
    articles: articles.slice(0, currentPage * pageSize),
    currentPage,
    pageSize,
    totalArticles,
    totalPages,
  };
};
