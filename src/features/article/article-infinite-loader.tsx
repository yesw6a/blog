'use client';

import { useEffect, useRef } from 'react';

import Link from 'next/link';
import { textLinkStyles } from '@/styles/text-link.styles';
import * as stylex from '@stylexjs/stylex';

import { articleBrowseControlStyles } from './article-browse-controls.styles';

type ArticleInfiniteLoaderProps = {
  error?: boolean;
  hasMore: boolean;
  loading?: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  paginationHref?: string;
  totalArticles: number;
  visibleArticles: number;
};

export default function ArticleInfiniteLoader({
  error,
  hasMore,
  loading,
  onLoadMore,
  onRetry,
  paginationHref,
  totalArticles,
  visibleArticles,
}: ArticleInfiniteLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestedAtCountRef = useRef(-1);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || error || !hasMore || typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || requestedAtCountRef.current === visibleArticles) return;
        requestedAtCountRef.current = visibleArticles;
        onLoadMore();
      },
      { rootMargin: '320px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [error, hasMore, loading, onLoadMore, visibleArticles]);

  if (loading) {
    return (
      <div role="status" aria-live="polite" {...stylex.props(articleBrowseControlStyles.loader)}>
        <span {...stylex.props(articleBrowseControlStyles.loaderMessage)}>正在准备更多文章…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" {...stylex.props(articleBrowseControlStyles.loader)}>
        <span {...stylex.props(articleBrowseControlStyles.loaderMessage, articleBrowseControlStyles.loaderError)}>
          文章索引加载失败，已保留当前可见内容。
        </span>
        <button type="button" onClick={onRetry} {...stylex.props(articleBrowseControlStyles.actionButton)}>
          重试
        </button>
        {paginationHref ? (
          <Link
            href={paginationHref}
            scroll={false}
            {...stylex.props(articleBrowseControlStyles.fallbackLink, textLinkStyles.hitArea)}
          >
            改用分页
          </Link>
        ) : null}
      </div>
    );
  }

  if (!hasMore) {
    return (
      <div role="status" aria-live="polite" {...stylex.props(articleBrowseControlStyles.loader)}>
        <span {...stylex.props(articleBrowseControlStyles.loaderMessage)}>已加载全部 {totalArticles} 篇文章</span>
      </div>
    );
  }

  const handleLoadMore = () => {
    if (requestedAtCountRef.current === visibleArticles) return;
    requestedAtCountRef.current = visibleArticles;
    onLoadMore();
  };

  return (
    <div ref={sentinelRef} {...stylex.props(articleBrowseControlStyles.loader)}>
      <button type="button" onClick={handleLoadMore} {...stylex.props(articleBrowseControlStyles.actionButton)}>
        加载更多
      </button>
      <span aria-live="polite" {...stylex.props(articleBrowseControlStyles.loaderMessage)}>
        已显示 {visibleArticles} / {totalArticles} 篇
      </span>
    </div>
  );
}
