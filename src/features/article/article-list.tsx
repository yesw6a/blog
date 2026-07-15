import type { ArticleSummary } from './article.types';

import * as stylex from '@stylexjs/stylex';

import ArticleListItem from './article-list-item';
import { articleStyles } from './article.styles';

type ArticleListProps = {
  articles: ArticleSummary[];
};

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div role="status" {...stylex.props(articleStyles.emptyState)}>
        没有找到符合条件的文章。可以清除筛选后再试。
      </div>
    );
  }

  return (
    <ol {...stylex.props(articleStyles.articleList)}>
      {articles.map((article) => (
        <ArticleListItem key={article.slug} article={article} />
      ))}
    </ol>
  );
}
