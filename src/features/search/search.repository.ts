import 'server-only';

import { cache } from 'react';

import type { SearchDocument, SiteSearchIndexResponse } from './search.types';

import { getPublishedArticleSearchData } from '@/features/article/article.repository';
import { HOME_CONTENT, HOME_DESCRIPTION_TEXT, SITE_SERVICES, TECHNOLOGY_STACK } from '@/features/home/home.content';
import { getToolHref, TOOL_CATEGORY_LABELS, TOOL_DEFINITIONS } from '@/features/toolbox/toolbox.registry';

const joinNames = (items: ReadonlyArray<{ name: string }>) => items.map((item) => item.name).join('、');

const createStaticSearchDocuments = (): SearchDocument[] => [
  {
    id: 'page:home',
    type: 'page',
    scope: 'site',
    url: `/#${HOME_CONTENT.aboutAnchorId}`,
    title: HOME_CONTENT.name,
    searchTitle: `${HOME_CONTENT.name} 关于本站`,
    sectionTitle: '关于本站',
    description: HOME_DESCRIPTION_TEXT,
    content: `${HOME_DESCRIPTION_TEXT} 网站构建于 ${joinNames(TECHNOLOGY_STACK)}，运行于 ${joinNames(SITE_SERVICES)}。`,
    keywords: [
      '首页',
      '关于',
      '个人站',
      '博客',
      'AIGC',
      ...TECHNOLOGY_STACK.map(({ name }) => name),
      ...SITE_SERVICES.map(({ name }) => name),
    ],
    tags: [],
  },
  {
    id: 'page:articles',
    type: 'page',
    scope: 'site',
    url: '/articles',
    title: '文章归档',
    searchTitle: '文章归档 全部文章',
    sectionTitle: '全部文章',
    description: HOME_CONTENT.articleArchiveDescription,
    content: '浏览全部公开文章，按标题、正文、标签和写作主题查找内容。',
    keywords: ['文章', '归档', '全部文章', '标签', '写作主题'],
    tags: [],
  },
  {
    id: 'page:tools',
    type: 'page',
    scope: 'site',
    url: '/tools',
    title: '工具箱',
    searchTitle: '工具箱 浏览器本地开发工具',
    sectionTitle: '全部工具',
    description: '处理文本、数据、时间和写作内容的浏览器本地工具。',
    content: TOOL_DEFINITIONS.map(({ name, description }) => `${name} ${description}`).join(' '),
    keywords: ['工具箱', '开发工具', '本地工具', ...TOOL_DEFINITIONS.flatMap(({ keywords }) => keywords)],
    tags: [],
  },
  ...TOOL_DEFINITIONS.map(
    (tool): SearchDocument => ({
      id: `page:tool:${tool.slug}`,
      type: 'page',
      scope: 'site',
      url: getToolHref(tool.slug),
      title: tool.name,
      searchTitle: `${tool.name} ${TOOL_CATEGORY_LABELS[tool.category]}`,
      sectionTitle: TOOL_CATEGORY_LABELS[tool.category],
      description: tool.description,
      content: `${tool.description} 所有输入内容仅在浏览器本地处理。`,
      keywords: [...tool.keywords],
      tags: [TOOL_CATEGORY_LABELS[tool.category]],
    }),
  ),
];

const loadSiteSearchIndex = cache(async (): Promise<SiteSearchIndexResponse> => {
  const articleData = await getPublishedArticleSearchData();

  return {
    articles: articleData.articles,
    documents: [...createStaticSearchDocuments(), ...articleData.documents],
  };
});

export const getSiteSearchIndex = async () => loadSiteSearchIndex();
