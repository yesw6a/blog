'use client';

import { useEffect, useMemo, useState } from 'react';

import type { ArticlePageResult, ArticleSearchIndexResponse, ArticleSummary } from './article.types';

import { useSearchParams } from 'next/navigation';

import ArticleBrowserView from './article-browser-view';
import { filterArticles, paginateArticles, parseArticlePage } from './article-filtering';

type ArticleBrowserProps = {
  basePath: string;
  initialPage: ArticlePageResult;
  selectedTag?: string;
  tags: string[];
};

export default function ArticleBrowser({ basePath, initialPage, selectedTag, tags }: ArticleBrowserProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || undefined;
  const legacyTag = selectedTag ? undefined : searchParams.get('tag')?.trim() || undefined;
  const effectiveTag = selectedTag ?? legacyTag;
  const requestedPage = parseArticlePage(searchParams.get('page'));
  const needsSearchIndex = Boolean(query || legacyTag);
  const [searchArticles, setSearchArticles] = useState<ArticleSummary[]>();
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    if (!needsSearchIndex || searchArticles) return;

    const controller = new AbortController();
    setSearchError(false);

    fetch('/article-search-index.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        return response.json() as Promise<ArticleSearchIndexResponse>;
      })
      .then((response) => setSearchArticles(response.articles))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setSearchError(true);
      });

    return () => controller.abort();
  }, [effectiveTag, needsSearchIndex, query, searchArticles]);

  const filteredPage = useMemo(() => {
    if (!needsSearchIndex || !searchArticles) return initialPage;
    return paginateArticles(filterArticles(searchArticles, { query, tag: effectiveTag }), requestedPage);
  }, [effectiveTag, initialPage, needsSearchIndex, query, requestedPage, searchArticles]);

  return (
    <ArticleBrowserView
      basePath={basePath}
      page={filteredPage}
      tags={tags}
      query={query}
      selectedTag={effectiveTag}
      selectedTagInPath={Boolean(selectedTag)}
      searchLoading={needsSearchIndex && !searchArticles && !searchError}
      searchError={needsSearchIndex && searchError}
    />
  );
}
