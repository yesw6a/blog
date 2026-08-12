import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { rssFeedAlternates } from '@/config/site';
import ArticleArchive from '@/features/article/article-archive';
import {
  ARTICLE_CATEGORY_DESCRIPTIONS,
  ARTICLE_CATEGORY_LABELS,
  getArticleCategoryHref,
  isArticleCategory,
} from '@/features/article/article.constants';
import {
  getAllTags,
  getCategoryArticlePage,
  getPublishedCategories,
} from '@/features/article/article.repository';

type ArticleCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getPublishedCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: ArticleCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isArticleCategory(category)) return {};

  const title = ARTICLE_CATEGORY_LABELS[category];
  const description = ARTICLE_CATEGORY_DESCRIPTIONS[category];
  return {
    title,
    description,
    alternates: { canonical: getArticleCategoryHref(category), types: rssFeedAlternates },
  };
}

export default async function ArticleCategoryPage({ params }: ArticleCategoryPageProps) {
  const { category } = await params;
  if (!isArticleCategory(category)) notFound();

  const [page, tags] = await Promise.all([getCategoryArticlePage(category, 1), getAllTags()]);
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
