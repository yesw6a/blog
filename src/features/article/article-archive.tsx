import { Suspense } from 'react';

import type { ArticlePageResult } from './article.types';

import ArticleBrowser from './article-browser';
import ArticleBrowserView from './article-browser-view';

type ArticleArchiveProps = {
  basePath: string;
  page: ArticlePageResult;
  selectedTag?: string;
  tags: string[];
};

export default function ArticleArchive({ basePath, page, selectedTag, tags }: ArticleArchiveProps) {
  return (
    <Suspense
      fallback={
        <ArticleBrowserView
          basePath={basePath}
          page={page}
          selectedTag={selectedTag}
          selectedTagInPath={Boolean(selectedTag)}
          tags={tags}
        />
      }
    >
      <ArticleBrowser basePath={basePath} initialPage={page} selectedTag={selectedTag} tags={tags} />
    </Suspense>
  );
}
