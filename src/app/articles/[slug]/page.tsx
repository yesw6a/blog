import type { Metadata } from 'next';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { absoluteUrl, siteConfig } from '@/config/site';
import ArticleContent from '@/features/article/article-content';
import ArticleTableOfContents from '@/features/article/article-table-of-contents';
import {
  getAdjacentArticles,
  getArticleBySlug,
  getPublishedArticleSummaries,
} from '@/features/article/article.repository';
import { articleStyles } from '@/features/article/article.styles';
import * as stylex from '@stylexjs/stylex';

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export async function generateStaticParams() {
  const articles = await getPublishedArticleSummaries();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const canonical = `/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical },
    authors: [{ name: siteConfig.author }],
    keywords: article.tags,
    robots: article.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      url: canonical,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, adjacent] = await Promise.all([getArticleBySlug(slug), getAdjacentArticles(slug)]);
  if (!article) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    keywords: article.tags.join(', '),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />

      <header {...stylex.props(articleStyles.detailHeader)}>
        <Link href="/articles" {...stylex.props(articleStyles.backLink)}>
          返回文章列表
        </Link>
        <h1 {...stylex.props(articleStyles.detailTitle)}>{article.title}</h1>
        <p {...stylex.props(articleStyles.detailDescription)}>{article.description}</p>
        <div {...stylex.props(articleStyles.detailMeta)}>
          <time dateTime={article.publishedAt}>发布于 {dateFormatter.format(new Date(article.publishedAt))}</time>
          {article.updatedAt ? (
            <time dateTime={article.updatedAt}>更新于 {dateFormatter.format(new Date(article.updatedAt))}</time>
          ) : null}
          <span>{article.readingTime} 分钟阅读</span>
          {article.draft ? <span {...stylex.props(articleStyles.draftBadge)}>草稿预览</span> : null}
        </div>
        <div aria-label="文章标签" {...stylex.props(articleStyles.detailTags)}>
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/articles?tag=${encodeURIComponent(tag)}`}
              {...stylex.props(articleStyles.detailTag)}
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <div {...stylex.props(articleStyles.articleGrid)}>
        <div>
          <ArticleContent source={article.source} />
          {adjacent.previous || adjacent.next ? (
            <nav aria-label="相邻文章" {...stylex.props(articleStyles.adjacentSection)}>
              <div {...stylex.props(articleStyles.adjacentGrid)}>
                {adjacent.previous ? (
                  <Link href={`/articles/${adjacent.previous.slug}`} {...stylex.props(articleStyles.adjacentLink)}>
                    <span {...stylex.props(articleStyles.adjacentLabel)}>上一篇</span>
                    <span {...stylex.props(articleStyles.adjacentTitle)}>{adjacent.previous.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {adjacent.next ? (
                  <Link href={`/articles/${adjacent.next.slug}`} {...stylex.props(articleStyles.adjacentLink)}>
                    <span {...stylex.props(articleStyles.adjacentLabel)}>下一篇</span>
                    <span {...stylex.props(articleStyles.adjacentTitle)}>{adjacent.next.title}</span>
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}
        </div>
        <ArticleTableOfContents headings={article.headings} />
      </div>
    </article>
  );
}
