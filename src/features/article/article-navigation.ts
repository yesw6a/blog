import { getArticlePageHref } from './article.constants';

export type ArticleBrowseMode = 'infinite' | 'pagination';

const ARTICLE_BROWSE_MODE_STORAGE_KEY = 'article-browse-mode:v1';

let cachedArticleBrowseModePreference: ArticleBrowseMode | null | undefined;

type ArticleBrowseHrefOptions = {
  basePath: string;
  browseMode: ArticleBrowseMode;
  page?: number;
  query?: string;
  tag?: string;
};

export const parseArticleBrowseMode = (value: string | null | undefined): ArticleBrowseMode | undefined =>
  value === 'infinite' || value === 'pagination' ? value : undefined;

export const readArticleBrowseModePreference = (): ArticleBrowseMode | undefined => {
  if (cachedArticleBrowseModePreference !== undefined) {
    return cachedArticleBrowseModePreference ?? undefined;
  }

  if (typeof window === 'undefined') return undefined;

  try {
    const preference = parseArticleBrowseMode(window.localStorage.getItem(ARTICLE_BROWSE_MODE_STORAGE_KEY));
    cachedArticleBrowseModePreference = preference ?? null;
    return preference;
  } catch {
    cachedArticleBrowseModePreference = null;
    return undefined;
  }
};

export const writeArticleBrowseModePreference = (browseMode: ArticleBrowseMode) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(ARTICLE_BROWSE_MODE_STORAGE_KEY, browseMode);
    cachedArticleBrowseModePreference = browseMode;
  } catch {
    cachedArticleBrowseModePreference = null;
  }
};

export const getArticleBrowseHref = ({ basePath, browseMode, page = 1, query, tag }: ArticleBrowseHrefOptions) => {
  const normalizedPage = Math.max(1, Math.trunc(page));
  const queryPagination = Boolean(query || tag);
  const pathname =
    browseMode === 'pagination' && !queryPagination ? getArticlePageHref(normalizedPage, basePath) : basePath;

  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (tag) params.set('tag', tag);
  params.set('view', browseMode);
  if ((browseMode === 'infinite' || queryPagination) && normalizedPage > 1) {
    params.set('page', String(normalizedPage));
  }

  const search = params.toString();
  return `${pathname}?${search}`;
};
