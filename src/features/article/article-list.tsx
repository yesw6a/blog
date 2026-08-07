import type { ArticleBrowseMode } from './article-navigation';
import type { ArticleSearchMatch, ArticleSummary } from './article.types';

import * as stylex from '@stylexjs/stylex';

import ArticleListItem from './article-list-item';
import { articleStyles } from './article.styles';

type ArticleListProps = {
  articles: ArticleSummary[];
  browseMode?: ArticleBrowseMode;
  markPageStarts?: boolean;
  pageSize?: number;
  searchMatches?: Record<string, ArticleSearchMatch>;
};

export default function ArticleList({
  articles,
  browseMode = 'pagination',
  markPageStarts,
  pageSize = 10,
  searchMatches,
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div role="status" {...stylex.props(articleStyles.emptyState)}>
        没有找到符合条件的文章。可以清除筛选后再试。
      </div>
    );
  }

  return (
    <ol {...stylex.props(articleStyles.articleList)}>
      {articles.map((article, index) => (
        <ArticleListItem
          key={article.slug}
          article={article}
          browseMode={browseMode}
          itemId={markPageStarts && index % pageSize === 0 ? `article-page-${index / pageSize + 1}` : undefined}
          searchMatch={searchMatches?.[article.slug]}
        />
      ))}
    </ol>
  );
}
