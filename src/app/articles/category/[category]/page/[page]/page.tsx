import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { rssFeedAlternates } from '@/config/site';
import ArticleArchive from '@/features/article/article-archive';
import {
  ARTICLE_CATEGORY_DESCRIPTIONS,
  ARTICLE_CATEGORY_LABELS,
  getArticleCategoryHref,
  getArticlePageHref,
  isArticleCategory,
} from '@/features/article/article.constants';
import {
  getAllTags,
  getCategoryArticlePage,
  getPublishedCategoryPageParams,
} from '@/features/article/article.repository';

type ArticleCategoryPaginationPageProps = {
  params: Promise<{ category: string; page: string }>;
};

export const dynamic = 'force-static';
export const dynamicParams = false;

const parsePage = (value: string) => (/^\d+$/.test(value) ? Number(value) : Number.NaN);

export async function generateStaticParams() {
  return getPublishedCategoryPageParams();
}

export async function generateMetadata({ params }: ArticleCategoryPaginationPageProps): Promise<Metadata> {
  const { category, page: rawPage } = await params;
  const page = parsePage(rawPage);
  if (!isArticleCategory(category) || !Number.isSafeInteger(page) || page < 2) return {};

  const title = ARTICLE_CATEGORY_LABELS[category];
  const basePath = getArticleCategoryHref(category);
  return {
    title: `${title} · 第 ${page} 页`,
    description: `${ARTICLE_CATEGORY_DESCRIPTIONS[category]}当前为第 ${page} 页。`,
    alternates: { canonical: getArticlePageHref(page, basePath), types: rssFeedAlternates },
  };
}

export default async function ArticleCategoryPaginationPage({ params }: ArticleCategoryPaginationPageProps) {
  const { category, page: rawPage } = await params;
  const currentPage = parsePage(rawPage);
  if (!isArticleCategory(category) || !Number.isSafeInteger(currentPage) || currentPage < 2) notFound();

  const [page, tags] = await Promise.all([getCategoryArticlePage(category, currentPage), getAllTags()]);
  if (!page || page.totalArticles === 0) notFound();

  return (
    <ArticleArchive
      basePath={getArticleCategoryHref(category)}
      description={ARTICLE_CATEGORY_DESCRIPTIONS[category]}
      page={page}
      selectedCategory={category}
      tags={tags}
      title={ARTICLE_CATEGORY_LABELS[category]}
    />
  );
}
