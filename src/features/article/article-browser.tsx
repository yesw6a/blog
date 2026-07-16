'use client';

import type { ArticleSummary } from './article.types';

import { useSearchParams } from 'next/navigation';

import ArticleBrowserView from './article-browser-view';
import { filterArticles } from './article-filtering';

type ArticleBrowserProps = {
  articles: ArticleSummary[];
  tags: string[];
};

export default function ArticleBrowser({ articles, tags }: ArticleBrowserProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || undefined;
  const tag = searchParams.get('tag')?.trim() || undefined;
  const filteredArticles = filterArticles(articles, { query, tag });

  return (
    <ArticleBrowserView articles={articles} filteredArticles={filteredArticles} tags={tags} query={query} tag={tag} />
  );
}
