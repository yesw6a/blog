import type { ArticleSummary } from './article.types';

import * as stylex from '@stylexjs/stylex';

import ArticleFilter from './article-filter';
import ArticleList from './article-list';
import { articleStyles } from './article.styles';

type ArticleBrowserViewProps = {
  articles: ArticleSummary[];
  filteredArticles: ArticleSummary[];
  tags: string[];
  query?: string;
  tag?: string;
};

export default function ArticleBrowserView({ articles, filteredArticles, tags, query, tag }: ArticleBrowserViewProps) {
  return (
    <div>
      <header {...stylex.props(articleStyles.pageHeader)}>
        <h1 {...stylex.props(articleStyles.pageTitle)}>文章</h1>
        <p {...stylex.props(articleStyles.pageDescription)}>
          记录前端开发、工程实践，以及那些值得在写代码之外继续想一想的问题。
        </p>
        <span {...stylex.props(articleStyles.articleCount)} aria-live="polite">
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
