import { getArticlePageHref } from './article.constants';

export type ArticleBrowseMode = 'infinite' | 'pagination';

type ArticleBrowseHrefOptions = {
  basePath: string;
  browseMode: ArticleBrowseMode;
  page?: number;
  query?: string;
  tag?: string;
};

export const getArticleBrowseHref = ({ basePath, browseMode, page = 1, query, tag }: ArticleBrowseHrefOptions) => {
  const normalizedPage = Math.max(1, Math.trunc(page));
  const queryPagination = Boolean(query || tag);

  if (browseMode === 'pagination' && !queryPagination) {
    return getArticlePageHref(normalizedPage, basePath);
  }

  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (tag) params.set('tag', tag);
  if (browseMode === 'infinite') params.set('view', 'infinite');
  if (normalizedPage > 1) params.set('page', String(normalizedPage));

  const search = params.toString();
  return search ? `${basePath}?${search}` : basePath;
};
