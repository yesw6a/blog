export const ARTICLE_PAGE_SIZE = 10;

export const ARTICLE_CATEGORIES = [
  'ai-frontier',
  'engineering-practice',
  'tools-productivity',
  'tech-industry',
  'technical-foundations',
  'essay-retrospective',
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  'ai-frontier': 'AI / 大模型前沿笔记',
  'engineering-practice': '前端 / 全栈工程实践',
  'tools-productivity': '技术工具与效率',
  'tech-industry': '技术产品与行业观察',
  'technical-foundations': '深度技术原理',
  'essay-retrospective': '技术随笔与复盘',
};

export const ARTICLE_RESERVED_SLUGS = new Set(['archive', 'page', 'search', 'tag']);

export const isArticleCategory = (value: unknown): value is ArticleCategory =>
  typeof value === 'string' && ARTICLE_CATEGORIES.some((category) => category === value);

export const getArticlePageHref = (page: number, basePath = '/articles') =>
  page <= 1 ? basePath : `${basePath}/page/${page}`;

export const getArticleTagHref = (tag: string) => `/articles/tag/${encodeURIComponent(tag)}`;
