import type { ArticlePageResult, ArticleSearchMatch } from './article.types';

import * as stylex from '@stylexjs/stylex';

import ArticleFilter from './article-filter';
import ArticleList from './article-list';
import ArticlePagination from './article-pagination';
import { articleStyles } from './article.styles';

type ArticleBrowserViewProps = {
  basePath: string;
  page: ArticlePageResult;
  query?: string;
  searchError?: boolean;
  searchLoading?: boolean;
  searchMatches?: Record<string, ArticleSearchMatch>;
  selectedTag?: string;
  selectedTagInPath?: boolean;
  tags: string[];
};

export default function ArticleBrowserView({
  basePath,
  page,
  query,
  searchError,
  searchLoading,
  searchMatches,
  selectedTag,
  selectedTagInPath,
  tags,
}: ArticleBrowserViewProps) {
  const filtering = Boolean(query || selectedTag);
  const countText = searchLoading
    ? '正在加载文章索引…'
    : searchError
      ? '文章索引加载失败'
      : filtering
        ? `找到 ${page.totalArticles} 篇文章`
        : `共 ${page.totalArticles} 篇文章 · 第 ${page.currentPage} / ${page.totalPages} 页`;

  return (
    <div>
      <header {...stylex.props(articleStyles.pageHeader)}>
        <h1 {...stylex.props(articleStyles.pageTitle)}>{selectedTag ? `#${selectedTag}` : '文章'}</h1>
        <p {...stylex.props(articleStyles.pageDescription)}>
          {selectedTag
            ? `收录标记为「${selectedTag}」的文章。`
            : '记录前端开发、工程实践，以及那些值得在写代码之外继续想一想的问题。'}
        </p>
        <span {...stylex.props(articleStyles.articleCount)} aria-live="polite">
          {countText}
        </span>
      </header>

      <ArticleFilter
        basePath={basePath}
        tags={tags}
        query={query}
        selectedTag={selectedTag}
        selectedTagInPath={selectedTagInPath}
      />
      {searchLoading ? (
        <div role="status" {...stylex.props(articleStyles.emptyState)}>
          正在加载静态搜索索引…
        </div>
      ) : searchError ? (
        <div role="alert" {...stylex.props(articleStyles.emptyState)}>
          搜索索引暂时无法加载，请稍后重试或清除筛选。
        </div>
      ) : (
        <>
          <ArticleList articles={page.articles} searchMatches={searchMatches} />
          <ArticlePagination
            basePath={basePath}
            currentPage={page.currentPage}
            totalPages={page.totalPages}
            mode={query || (selectedTag && !selectedTagInPath) ? 'query' : 'path'}
            queryParams={{ q: query, tag: selectedTagInPath ? undefined : selectedTag }}
          />
        </>
      )}
    </div>
  );
}
