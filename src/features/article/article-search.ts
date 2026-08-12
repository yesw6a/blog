import type { SearchTextMatch } from '@/features/search/search.types';
import type { ArticleCategory } from './article.constants';
import type { ArticleSearchMatch, ArticleSearchResult, ArticleSummary } from './article.types';

import { fetchSiteSearchIndex, searchSite } from '@/features/search/search';

const mergeTextMatches = (current: SearchTextMatch, next: SearchTextMatch): SearchTextMatch => {
  if (current.text !== next.text) return current;

  const highlights = [...current.highlights, ...next.highlights]
    .sort((left, right) => left.start - right.start || left.end - right.end)
    .reduce<SearchTextMatch['highlights']>((merged, range) => {
      const previous = merged.at(-1);
      if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
      else merged.push({ ...range });
      return merged;
    }, []);

  return { text: current.text, highlights };
};

const mergeMetadataMatches = (current: SearchTextMatch[], next: SearchTextMatch[]) => {
  const merged = new Map(current.map((match) => [match.text, match]));
  for (const match of next) {
    const existing = merged.get(match.text);
    merged.set(match.text, existing ? mergeTextMatches(existing, match) : match);
  }
  return [...merged.values()];
};

type ArticleSearchFilters = {
  category?: ArticleCategory;
  tag?: string;
};

const matchesFilters = (article: ArticleSummary, filters: ArticleSearchFilters) =>
  (!filters.category || article.category === filters.category) &&
  (!filters.tag || article.tags.includes(filters.tag));

export const searchArticles = async (
  query?: string,
  filters: ArticleSearchFilters = {},
): Promise<ArticleSearchResult> => {
  if (!query) {
    const index = await fetchSiteSearchIndex();
    return {
      articles: index.articles.filter((article) => matchesFilters(article, filters)),
      matches: {},
    };
  }

  const index = await fetchSiteSearchIndex();
  const results = await searchSite(query, { scope: 'article' });
  const articlesBySlug = new Map(index.articles.map((article) => [article.slug, article]));
  const articles: ArticleSummary[] = [];
  const matches: Record<string, ArticleSearchMatch> = {};

  for (const result of results) {
    const item = result.document;
    const slug = item.articleSlug;
    if (!slug) continue;

    const existing = matches[slug];
    if (existing) {
      existing.title = mergeTextMatches(existing.title, result.title);
      existing.metadataMatches = mergeMetadataMatches(existing.metadataMatches, result.metadataMatches);
      continue;
    }

    const article = articlesBySlug.get(slug);
    if (!article || !matchesFilters(article, filters)) continue;

    articles.push(article);
    matches[slug] = {
      url: item.url,
      title: result.title,
      sectionTitle: result.sectionTitle,
      excerpt: result.excerpt,
      metadataMatches: result.metadataMatches,
    } satisfies ArticleSearchMatch;
  }

  return { articles, matches };
};
