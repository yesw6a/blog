import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import { rssFeedAlternates } from '@/config/site';
import ArticleArchive from '@/features/article/article-archive';
import { decodeArticleTagParam, getArticleTagHref } from '@/features/article/article.constants';
import { getAllTags, getTagArticlePage } from '@/features/article/article.repository';

type ArticleTagPageProps = {
  params: Promise<{ tag: string }>;
};

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateStaticParams() {
  const tags = await getAllTags({ includeDrafts: false });
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: ArticleTagPageProps): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeArticleTagParam(encodedTag);
  return {
    title: `#${tag} 相关文章`,
    description: `浏览标记为「${tag}」的文章。`,
    alternates: { canonical: getArticleTagHref(tag), types: rssFeedAlternates },
  };
}

export default async function ArticleTagPage({ params }: ArticleTagPageProps) {
  const { tag: encodedTag } = await params;
  const tag = decodeArticleTagParam(encodedTag);
  const [page, tags] = await Promise.all([getTagArticlePage(tag, 1), getAllTags()]);
  if (!page || page.totalArticles === 0) notFound();

  return <ArticleArchive basePath={getArticleTagHref(tag)} page={page} selectedTag={tag} tags={tags} />;
}
