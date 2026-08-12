export const articlePageSize = 10;

export const articleTopics = [
  { category: 'ai-frontier', code: 'T1', label: 'AI / 大模型前沿笔记', weight: 30, weeklyLimit: 3 },
  { category: 'engineering-practice', code: 'T2', label: '前端 / 全栈工程实践', weight: 20, weeklyLimit: 2 },
  { category: 'tools-productivity', code: 'T3', label: '技术工具与效率', weight: 15, weeklyLimit: 2 },
  { category: 'tech-industry', code: 'T4', label: '技术产品与行业观察', weight: 15, weeklyLimit: 2 },
  { category: 'technical-foundations', code: 'T5', label: '深度技术原理', weight: 10, weeklyLimit: 2 },
  { category: 'essay-retrospective', code: 'T6', label: '技术随笔与复盘', weight: 10, weeklyLimit: 2 },
];

export const articleCategories = new Set(articleTopics.map((topic) => topic.category));
export const reservedArticleSlugs = new Set(['archive', 'category', 'page', 'search', 'tag']);
