import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { rssFeedAlternates } from '@/config/site';
import ArticleArchive from '@/features/article/article-archive';
import { decodeArticleTagParam, getArticlePageHref, getArticleTagHref } from '@/features/article/article.constants';
import { getAllTags, getPublishedTagPageParams, getTagArticlePage } from '@/features/article/article.repository';

type ArticleTagPaginationPageProps = {
  params: Promise<{ page: string; tag: string }>;
};

export const dynamic = 'force-static';
export const dynamicParams = true;

const parsePage = (value: string) => (/^\d+$/.test(value) ? Number(value) : Number.NaN);

export async function generateStaticParams() {
  return getPublishedTagPageParams();
}

export async function generateMetadata({ params }: ArticleTagPaginationPageProps): Promise<Metadata> {
  const { page: rawPage, tag: encodedTag } = await params;
  const page = parsePage(rawPage);
  if (!Number.isSafeInteger(page) || page < 2) return {};

  const tag = decodeArticleTagParam(encodedTag);
  const basePath = getArticleTagHref(tag);
  return {
    title: `#${tag} · 第 ${page} 页`,
    description: `标记为「${tag}」的文章归档第 ${page} 页。`,
    alternates: { canonical: getArticlePageHref(page, basePath), types: rssFeedAlternates },
  };
}

export default async function ArticleTagPaginationPage({ params }: ArticleTagPaginationPageProps) {
  const { page: rawPage, tag: encodedTag } = await params;
  const currentPage = parsePage(rawPage);
  if (!Number.isSafeInteger(currentPage) || currentPage < 2) notFound();

  const tag = decodeArticleTagParam(encodedTag);
  const [page, tags] = await Promise.all([getTagArticlePage(tag, currentPage), getAllTags()]);
  if (!page || page.totalArticles === 0) notFound();

  return <ArticleArchive basePath={getArticleTagHref(tag)} page={page} selectedTag={tag} tags={tags} />;
}
