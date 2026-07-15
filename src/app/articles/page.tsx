import type { Metadata } from 'next';

import ArticleFilter from '@/features/article/article-filter';
import ArticleList from '@/features/article/article-list';
import { filterArticles, getAllTags, getArticleSummaries } from '@/features/article/article.repository';
import { articleStyles } from '@/features/article/article.styles';
import * as stylex from '@stylexjs/stylex';

export const metadata: Metadata = {
  title: '文章',
  description: '记录前端开发、工程实践与个人思考。',
  alternates: {
    canonical: '/articles',
  },
};

type ArticlesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const query = firstParam(params.q)?.trim();
  const tag = firstParam(params.tag)?.trim();
  const [articles, tags] = await Promise.all([getArticleSummaries(), getAllTags()]);
  const filteredArticles = filterArticles(articles, { query, tag });

  return (
    <div>
      <header {...stylex.props(articleStyles.pageHeader)}>
        <h1 {...stylex.props(articleStyles.pageTitle)}>文章</h1>
        <p {...stylex.props(articleStyles.pageDescription)}>
          记录前端开发、工程实践，以及那些值得在写代码之外继续想一想的问题。
        </p>
        <span {...stylex.props(articleStyles.articleCount)}>
          {filteredArticles.length === articles.length
            ? `共 ${articles.length} 篇文章`
            : `找到 ${filteredArticles.length} 篇文章`}
        </span>
      </header>

      <ArticleFilter tags={tags} query={query} selectedTag={tag} />
      <ArticleList articles={filteredArticles} />
    </div>
  );
}
