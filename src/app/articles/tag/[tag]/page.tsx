import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import ArticleArchive from '@/features/article/article-archive';
import { getArticleTagHref } from '@/features/article/article.constants';
import { getAllTags, getTagArticlePage } from '@/features/article/article.repository';

type ArticleTagPageProps = {
  params: Promise<{ tag: string }>;
};

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags({ includeDrafts: false });
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: ArticleTagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} 相关文章`,
    description: `浏览标记为「${tag}」的文章。`,
    alternates: { canonical: getArticleTagHref(tag) },
  };
}

export default async function ArticleTagPage({ params }: ArticleTagPageProps) {
  const { tag } = await params;
  const [page, tags] = await Promise.all([getTagArticlePage(tag, 1), getAllTags()]);
  if (!page || page.totalArticles === 0) notFound();

  return <ArticleArchive basePath={getArticleTagHref(tag)} page={page} selectedTag={tag} tags={tags} />;
}
