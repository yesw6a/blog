'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ArticleBrowseMode } from './article-navigation';
import type { ArticlePageResult, ArticleSearchResult } from './article.types';

import { useSearchParams } from 'next/navigation';

import ArticleBrowserView from './article-browser-view';
import { accumulateArticlePages, paginateArticles, parseArticlePage } from './article-filtering';
import { fetchArticleIndex } from './article-index';
import { getArticleBrowseHref } from './article-navigation';
import { searchArticles } from './article-search';

type ArticleBrowserProps = {
  basePath: string;
  initialPage: ArticlePageResult;
  selectedTag?: string;
  tags: string[];
};

type ArticleCollection = ArticleSearchResult & {
  pageSize: number;
};

export default function ArticleBrowser({ basePath, initialPage, selectedTag, tags }: ArticleBrowserProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || undefined;
  const legacyTag = selectedTag ? undefined : searchParams.get('tag')?.trim() || undefined;
  const effectiveTag = selectedTag ?? legacyTag;
  const requestedPage = parseArticlePage(searchParams.get('page'));
  const browseMode: ArticleBrowseMode = searchParams.get('view') === 'infinite' ? 'infinite' : 'pagination';
  const infiniteMode = browseMode === 'infinite';
  const needsCollection = Boolean(query || legacyTag || infiniteMode);
  const blockingCollection = Boolean(query || legacyTag);
  const [collection, setCollection] = useState<ArticleCollection>();
  const [collectionError, setCollectionError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const progressKey = `${query ?? ''}\u0000${effectiveTag ?? ''}\u0000${requestedPage}`;
  const [infiniteProgress, setInfiniteProgress] = useState({ key: '', page: 1 });
  const visiblePage = infiniteProgress.key === progressKey ? infiniteProgress.page : requestedPage;
  const scrolledAnchorRef = useRef('');

  useEffect(() => {
    if (!needsCollection) {
      setCollection(undefined);
      setCollectionError(false);
      return;
    }

    let cancelled = false;
    setCollection(undefined);
    setCollectionError(false);

    const request = query
      ? searchArticles(query, effectiveTag).then((result) => ({ ...result, pageSize: initialPage.pageSize }))
      : fetchArticleIndex().then((index) => ({
          articles: effectiveTag
            ? index.articles.filter((article) => article.tags.includes(effectiveTag))
            : index.articles,
          matches: {},
          pageSize: index.pageSize,
        }));

    request
      .then((result) => {
        if (!cancelled) setCollection(result);
      })
      .catch(() => {
        if (!cancelled) setCollectionError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveTag, initialPage.pageSize, needsCollection, query, reloadKey]);

  const page = useMemo(() => {
    if (!collection) return initialPage;
    return infiniteMode
      ? accumulateArticlePages(collection.articles, visiblePage, collection.pageSize)
      : paginateArticles(collection.articles, requestedPage, collection.pageSize);
  }, [collection, infiniteMode, initialPage, requestedPage, visiblePage]);

  const loadMore = useCallback(() => {
    setInfiniteProgress((current) => {
      const currentPage = current.key === progressKey ? current.page : requestedPage;
      return { key: progressKey, page: currentPage + 1 };
    });
  }, [progressKey, requestedPage]);

  const retry = useCallback(() => setReloadKey((current) => current + 1), []);
  const queryTag = selectedTag ? undefined : effectiveTag;
  const paginationHref = getArticleBrowseHref({
    basePath,
    browseMode: 'pagination',
    page: page.currentPage,
    query,
    tag: queryTag,
  });
  const switchHref = infiniteMode
    ? paginationHref
    : getArticleBrowseHref({
        basePath,
        browseMode: 'infinite',
        page: page.currentPage,
        query,
        tag: queryTag,
      });
  const collectionLoading = needsCollection && !collection && !collectionError;

  useEffect(() => {
    if (!infiniteMode) {
      scrolledAnchorRef.current = '';
      return;
    }
    if (!collection || collectionLoading || requestedPage <= 1) return;
    if (scrolledAnchorRef.current === progressKey) return;

    const anchor = document.getElementById(`article-page-${requestedPage}`);
    if (!anchor) return;
    scrolledAnchorRef.current = progressKey;
    anchor.scrollIntoView({ block: 'start' });
  }, [collection, collectionLoading, infiniteMode, progressKey, requestedPage]);

  return (
    <ArticleBrowserView
      basePath={basePath}
      browseMode={browseMode}
      collectionBlocking={blockingCollection}
      collectionError={needsCollection && collectionError}
      collectionLoading={collectionLoading}
      hasMore={infiniteMode && Boolean(collection) && page.currentPage < page.totalPages}
      onLoadMore={loadMore}
      onRetry={retry}
      page={page}
      paginationHref={paginationHref}
      tags={tags}
      query={query}
      selectedTag={effectiveTag}
      selectedTagInPath={Boolean(selectedTag)}
      searchMatches={query ? collection?.matches : undefined}
      switchHref={switchHref}
    />
  );
}
