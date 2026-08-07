import type { ArticleSummary } from '@/features/article/article.types';

export type SearchDocumentType = 'page' | 'article' | 'section';
export type SearchDocumentScope = 'site' | 'article';

export interface SearchDocument {
  id: string;
  type: SearchDocumentType;
  scope: SearchDocumentScope;
  url: string;
  title: string;
  searchTitle: string;
  sectionTitle?: string;
  description: string;
  content: string;
  keywords: string[];
  tags: string[];
  articleSlug?: string;
  publishedAt?: string;
}

export interface SiteSearchIndexResponse {
  articles: ArticleSummary[];
  documents: SearchDocument[];
}

export interface SearchHighlightRange {
  start: number;
  end: number;
}

export interface SearchTextMatch {
  text: string;
  highlights: SearchHighlightRange[];
}

export interface SiteSearchResult {
  document: SearchDocument;
  title: SearchTextMatch;
  sectionTitle?: SearchTextMatch;
  excerpt?: SearchTextMatch;
  metadataMatches: SearchTextMatch[];
  score?: number;
}
