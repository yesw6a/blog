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

export const ARTICLE_CATEGORY_DESCRIPTIONS: Record<ArticleCategory, string> = {
  'ai-frontier': '追踪大模型、智能体与人工智能前沿进展，关注能力演进及其实际影响。',
  'engineering-practice': '记录前端、全栈开发与工程化实践中的方案、取舍和复盘。',
  'tools-productivity': '介绍开发工具、工作流与效率方法，关注可复用的实际经验。',
  'tech-industry': '观察技术产品、公司与产业变化，梳理事件背后的长期信号。',
  'technical-foundations': '拆解模型、系统与软件工程中的关键技术原理。',
  'essay-retrospective': '收录技术之外的随笔、阅读、生活观察与阶段复盘。',
};

export const ARTICLE_INDEXABLE_TAG_MIN_COUNT = 3;

const ARTICLE_NOINDEX_TAGS = new Set(['AIGC']);

export const ARTICLE_RESERVED_SLUGS = new Set(['archive', 'category', 'page', 'search', 'tag']);

export const isArticleCategory = (value: unknown): value is ArticleCategory =>
  typeof value === 'string' && ARTICLE_CATEGORIES.some((category) => category === value);

export const getArticlePageHref = (page: number, basePath = '/articles') =>
  page <= 1 ? basePath : `${basePath}/page/${page}`;

export const getArticleCategoryHref = (category: ArticleCategory) => `/articles/category/${category}`;

export const getArticleTagHref = (tag: string) => `/articles/tag/${tag}`;

export const isArticleTagIndexable = (tag: string, articleCount: number) =>
  articleCount >= ARTICLE_INDEXABLE_TAG_MIN_COUNT && !ARTICLE_NOINDEX_TAGS.has(tag.toLocaleUpperCase('en-US'));

export const decodeArticleTagParam = (tag: string) => {
  try {
    return decodeURIComponent(tag);
  } catch {
    return tag;
  }
};
