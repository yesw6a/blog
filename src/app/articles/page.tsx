import type { Metadata } from 'next';

import { rssFeedAlternates } from '@/config/site';
import ArticleArchive from '@/features/article/article-archive';
import { getAllTags, getArticlePage } from '@/features/article/article.repository';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '文章',
  description: '记录前端开发、工程实践与个人思考。',
  alternates: {
    canonical: '/articles',
    types: rssFeedAlternates,
  },
};

export default async function ArticlesPage() {
  const [page, tags] = await Promise.all([getArticlePage(1), getAllTags()]);
  if (!page) return null;

  return <ArticleArchive basePath="/articles" page={page} tags={tags} />;
}
