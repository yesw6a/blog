import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { rssFeedAlternates } from '@/config/site';
import ArticleArchive from '@/features/article/article-archive';
import { getArticlePageHref } from '@/features/article/article.constants';
import { getAllTags, getArticlePage, getPublishedArticlePageParams } from '@/features/article/article.repository';

type ArticlePaginationPageProps = {
  params: Promise<{ page: string }>;
};

export const dynamic = 'force-static';
export const dynamicParams = false;

const parsePage = (value: string) => (/^\d+$/.test(value) ? Number(value) : Number.NaN);

export async function generateStaticParams() {
  return getPublishedArticlePageParams();
}

export async function generateMetadata({ params }: ArticlePaginationPageProps): Promise<Metadata> {
  const page = parsePage((await params).page);
  if (!Number.isSafeInteger(page) || page < 2) return {};

  const canonical = getArticlePageHref(page);
  return {
    title: `文章 · 第 ${page} 页`,
    description: `文章归档第 ${page} 页，记录前端开发、工程实践与个人思考。`,
    alternates: { canonical, types: rssFeedAlternates },
  };
}

export default async function ArticlePaginationPage({ params }: ArticlePaginationPageProps) {
  const currentPage = parsePage((await params).page);
  if (!Number.isSafeInteger(currentPage) || currentPage < 2) notFound();

  const [page, tags] = await Promise.all([getArticlePage(currentPage), getAllTags()]);
  if (!page) notFound();

  return <ArticleArchive basePath="/articles" page={page} tags={tags} />;
}
