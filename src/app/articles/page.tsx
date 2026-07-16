import { Suspense } from 'react';

import type { Metadata } from 'next';

import ArticleBrowser from '@/features/article/article-browser';
import ArticleBrowserView from '@/features/article/article-browser-view';
import { getAllTags, getArticleSummaries } from '@/features/article/article.repository';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '文章',
  description: '记录前端开发、工程实践与个人思考。',
  alternates: {
    canonical: '/articles',
  },
};

export default async function ArticlesPage() {
  const [articles, tags] = await Promise.all([getArticleSummaries(), getAllTags()]);

  return (
    <Suspense fallback={<ArticleBrowserView articles={articles} filteredArticles={articles} tags={tags} />}>
      <ArticleBrowser articles={articles} tags={tags} />
    </Suspense>
  );
}
