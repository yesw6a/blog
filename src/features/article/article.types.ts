import type { SearchTextMatch } from '@/features/search/search.types';
import type { ArticleCategory } from './article.constants';

export interface ArticleFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  seoImage?: string;
  category: ArticleCategory;
  tags: string[];
  series?: string;
  featured: boolean;
  draft: boolean;
  rss: boolean;
}

export interface ArticleHeading {
  depth: 2 | 3;
  id: string;
  text: string;
}

export interface ArticleSummary extends ArticleFrontmatter {
  slug: string;
  readingTime: number;
}

export interface Article extends ArticleSummary {
  source: string;
  headings: ArticleHeading[];
}

export interface ArticlePageResult {
  articles: ArticleSummary[];
  currentPage: number;
  pageSize: number;
  totalArticles: number;
  totalPages: number;
}

export interface ArticleSearchMatch {
  url: string;
  title: SearchTextMatch;
  sectionTitle?: SearchTextMatch;
  excerpt?: SearchTextMatch;
  metadataMatches: SearchTextMatch[];
}

export interface ArticleSearchResult {
  articles: ArticleSummary[];
  matches: Record<string, ArticleSearchMatch>;
}

export interface ArticleIndexResponse {
  articles: ArticleSummary[];
  pageSize: number;
}

export interface AdjacentArticles {
  previous?: ArticleSummary;
  next?: ArticleSummary;
}
