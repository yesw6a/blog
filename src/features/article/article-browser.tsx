'use client';

import { useEffect, useMemo, useState } from 'react';

import type { ArticlePageResult, ArticleSearchResult } from './article.types';

import { useSearchParams } from 'next/navigation';

import ArticleBrowserView from './article-browser-view';
import { paginateArticles, parseArticlePage } from './article-filtering';
import { searchArticles } from './article-search';

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
  const [searchResult, setSearchResult] = useState<ArticleSearchResult>();
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    if (!needsSearchIndex) {
      setSearchResult(undefined);
      setSearchError(false);
      return;
    }

    let cancelled = false;
    setSearchResult(undefined);
    setSearchError(false);

    searchArticles(query, effectiveTag)
      .then((result) => {
        if (!cancelled) setSearchResult(result);
      })
      .catch(() => {
        if (!cancelled) setSearchError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveTag, needsSearchIndex, query]);

  const filteredPage = useMemo(() => {
    if (!needsSearchIndex || !searchResult) return initialPage;
    return paginateArticles(searchResult.articles, requestedPage);
  }, [initialPage, needsSearchIndex, requestedPage, searchResult]);

  return (
    <ArticleBrowserView
      basePath={basePath}
      page={filteredPage}
      tags={tags}
      query={query}
      selectedTag={effectiveTag}
      selectedTagInPath={Boolean(selectedTag)}
      searchLoading={needsSearchIndex && !searchResult && !searchError}
      searchError={needsSearchIndex && searchError}
      searchMatches={query ? searchResult?.matches : undefined}
    />
  );
}
