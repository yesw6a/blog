import type { ArticleBrowseMode } from './article-navigation';
import type { ArticlePageResult, ArticleSearchMatch } from './article.types';

import * as stylex from '@stylexjs/stylex';

import { articleBrowseControlStyles } from './article-browse-controls.styles';
import ArticleBrowseModeSwitch from './article-browse-mode-switch';
import ArticleFilter from './article-filter';
import ArticleInfiniteLoader from './article-infinite-loader';
import ArticleList from './article-list';
import ArticlePagination from './article-pagination';
import { articleStyles } from './article.styles';

type ArticleBrowserViewProps = {
  basePath: string;
  browseMode?: ArticleBrowseMode;
  collectionBlocking?: boolean;
  collectionError?: boolean;
  collectionLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRetry?: () => void;
  page: ArticlePageResult;
  paginationHref?: string;
  query?: string;
  searchMatches?: Record<string, ArticleSearchMatch>;
  selectedTag?: string;
  selectedTagInPath?: boolean;
  switchHref?: string;
  tags: string[];
};

export default function ArticleBrowserView({
  basePath,
  browseMode = 'pagination',
  collectionBlocking,
  collectionError,
  collectionLoading,
  hasMore,
  onLoadMore = () => undefined,
  onRetry = () => undefined,
  page,
  paginationHref = basePath,
  query,
  searchMatches,
  selectedTag,
  selectedTagInPath,
  switchHref = `${basePath}?view=infinite`,
  tags,
}: ArticleBrowserViewProps) {
  const filtering = Boolean(query || selectedTag);
  const infiniteMode = browseMode === 'infinite';
  const countText =
    collectionBlocking && collectionLoading
      ? '正在加载文章索引…'
      : collectionBlocking && collectionError
        ? '文章索引加载失败'
        : infiniteMode
          ? `已显示 ${page.articles.length} / ${page.totalArticles} 篇文章`
          : filtering
            ? `找到 ${page.totalArticles} 篇文章 · 第 ${page.currentPage} / ${page.totalPages} 页`
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
      </header>

      <ArticleFilter
        basePath={basePath}
        browseMode={browseMode}
        tags={tags}
        query={query}
        selectedTag={selectedTag}
        selectedTagInPath={selectedTagInPath}
      />

      <div {...stylex.props(articleBrowseControlStyles.toolbar)}>
        <span aria-live="polite" {...stylex.props(articleBrowseControlStyles.resultCount)}>
          {countText}
        </span>
        <ArticleBrowseModeSwitch checked={infiniteMode} href={switchHref} />
      </div>

      {collectionBlocking && collectionLoading ? (
        <div role="status" {...stylex.props(articleStyles.emptyState)}>
          正在加载文章索引…
        </div>
      ) : collectionBlocking && collectionError ? (
        <ArticleInfiniteLoader
          error
          hasMore={false}
          onLoadMore={onLoadMore}
          onRetry={onRetry}
          paginationHref={infiniteMode ? paginationHref : undefined}
          totalArticles={page.totalArticles}
          visibleArticles={0}
        />
      ) : (
        <>
          <ArticleList
            articles={page.articles}
            browseMode={browseMode}
            markPageStarts={infiniteMode}
            pageSize={page.pageSize}
            searchMatches={searchMatches}
          />
          {infiniteMode ? (
            <ArticleInfiniteLoader
              error={collectionError}
              hasMore={Boolean(hasMore)}
              loading={collectionLoading}
              onLoadMore={onLoadMore}
              onRetry={onRetry}
              paginationHref={paginationHref}
              totalArticles={page.totalArticles}
              visibleArticles={page.articles.length}
            />
          ) : (
            <ArticlePagination
              basePath={basePath}
              currentPage={page.currentPage}
              totalPages={page.totalPages}
              mode={query || (selectedTag && !selectedTagInPath) ? 'query' : 'path'}
              queryParams={{ q: query, tag: selectedTagInPath ? undefined : selectedTag }}
            />
          )}
        </>
      )}
    </div>
  );
}
