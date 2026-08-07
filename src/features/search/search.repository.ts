import 'server-only';

import { cache } from 'react';

import type { SearchDocument, SiteSearchIndexResponse } from './search.types';

import { getPublishedArticleSearchData } from '@/features/article/article.repository';
import { HOME_CONTENT, HOME_DESCRIPTION_TEXT, SITE_SERVICES, TECHNOLOGY_STACK } from '@/features/home/home.content';

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
];

const loadSiteSearchIndex = cache(async (): Promise<SiteSearchIndexResponse> => {
  const articleData = await getPublishedArticleSearchData();

  return {
    articles: articleData.articles,
    documents: [...createStaticSearchDocuments(), ...articleData.documents],
  };
});

export const getSiteSearchIndex = async () => loadSiteSearchIndex();
