import type { ArticleIndexResponse } from './article.types';

const ARTICLE_INDEX_URL = '/article-index.json';

let articleIndexPromise: Promise<ArticleIndexResponse> | undefined;

export const fetchArticleIndex = async () => {
  if (!articleIndexPromise) {
    articleIndexPromise = fetch(ARTICLE_INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Article index request failed: ${response.status}`);
        return response.json() as Promise<ArticleIndexResponse>;
      })
      .catch((error) => {
        articleIndexPromise = undefined;
        throw error;
      });
  }

  return articleIndexPromise;
};
