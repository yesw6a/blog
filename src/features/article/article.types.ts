export interface ArticleFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  series?: string;
  featured: boolean;
  draft: boolean;
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

export interface ArticleFilter {
  query?: string;
  tag?: string;
}

export interface AdjacentArticles {
  previous?: ArticleSummary;
  next?: ArticleSummary;
}
