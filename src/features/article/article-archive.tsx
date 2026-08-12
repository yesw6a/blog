import { Suspense } from 'react';

import type { ArticleCategory } from './article.constants';
import type { ArticlePageResult } from './article.types';

import ArticleBrowser from './article-browser';
import ArticleBrowserView from './article-browser-view';

type ArticleArchiveProps = {
  basePath: string;
  description?: string;
  page: ArticlePageResult;
  selectedCategory?: ArticleCategory;
  selectedTag?: string;
  tags: string[];
  title?: string;
};

export default function ArticleArchive({
  basePath,
  description,
  page,
  selectedCategory,
  selectedTag,
  tags,
  title,
}: ArticleArchiveProps) {
  return (
    <Suspense
      fallback={
        <ArticleBrowserView
          basePath={basePath}
          description={description}
          page={page}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          selectedTagInPath={Boolean(selectedTag)}
          tags={tags}
          title={title}
        />
      }
    >
      <ArticleBrowser
        basePath={basePath}
        description={description}
        initialPage={page}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        tags={tags}
        title={title}
      />
    </Suspense>
  );
}
