import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';

import type {
  AdjacentArticles,
  Article,
  ArticleFrontmatter,
  ArticleHeading,
  ArticlePageResult,
  ArticleSummary,
} from './article.types';

import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { ARTICLE_PAGE_SIZE, ARTICLE_RESERVED_SLUGS, isArticleCategory } from './article.constants';

const ARTICLES_DIRECTORY = path.join(process.cwd(), 'content', 'articles');
const ARTICLE_EXTENSION = '.mdx';
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ArticleIndexRecord = {
  sourcePath: string;
  summary: ArticleSummary;
};

const requireString = (data: Record<string, unknown>, key: string, filename: string) => {
  const value = data[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`[文章元数据错误] ${filename}: ${key} 必须是非空字符串。`);
  }
  return value.trim();
};

const optionalString = (data: Record<string, unknown>, key: string, filename: string) => {
  const value = data[key];
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') {
    throw new Error(`[文章元数据错误] ${filename}: ${key} 必须是字符串。`);
  }
  return value.trim();
};

const optionalBoolean = (data: Record<string, unknown>, key: string, filename: string) => {
  const value = data[key];
  if (value === undefined || value === null) return false;
  if (typeof value !== 'boolean') {
    throw new Error(`[文章元数据错误] ${filename}: ${key} 必须是布尔值。`);
  }
  return value;
};

const normalizeDate = (value: string | Date, key: string, filename: string) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`[文章元数据错误] ${filename}: ${key} 必须是有效日期。`);
  }
  return date.toISOString();
};

const requireDate = (data: Record<string, unknown>, key: string, filename: string) => {
  const value = data[key];
  if (!(typeof value === 'string' || value instanceof Date)) {
    throw new Error(`[文章元数据错误] ${filename}: ${key} 必须是有效日期。`);
  }
  return normalizeDate(value, key, filename);
};

const optionalDate = (data: Record<string, unknown>, key: string, filename: string) => {
  const value = data[key];
  if (value === undefined || value === null || value === '') return undefined;
  if (!(typeof value === 'string' || value instanceof Date)) {
    throw new Error(`[文章元数据错误] ${filename}: ${key} 必须是有效日期。`);
  }
  return normalizeDate(value, key, filename);
};

const parseFrontmatter = (data: Record<string, unknown>, filename: string): ArticleFrontmatter => {
  const rawTags = data.tags;
  if (!Array.isArray(rawTags) || rawTags.length === 0 || rawTags.some((tag) => typeof tag !== 'string')) {
    throw new Error(`[文章元数据错误] ${filename}: tags 必须是非空字符串数组。`);
  }
  const tags = [...new Set(rawTags.map((tag) => tag.trim()))];
  if (tags.some((tag) => tag.length === 0)) {
    throw new Error(`[文章元数据错误] ${filename}: tags 不能包含空字符串。`);
  }

  if (!isArticleCategory(data.category)) {
    throw new Error(`[文章元数据错误] ${filename}: category 不在允许的分类集合中。`);
  }

  return {
    title: requireString(data, 'title', filename),
    description: requireString(data, 'description', filename),
    publishedAt: requireDate(data, 'publishedAt', filename),
    updatedAt: optionalDate(data, 'updatedAt', filename),
    category: data.category,
    tags,
    series: optionalString(data, 'series', filename),
    featured: optionalBoolean(data, 'featured', filename),
    draft: optionalBoolean(data, 'draft', filename),
  };
};

const nodeText = (node: any): string => {
  if (typeof node?.value === 'string') return node.value;
  if (!Array.isArray(node?.children)) return '';
  return node.children.map(nodeText).join('');
};

const extractHeadings = (source: string): ArticleHeading[] => {
  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse(source);
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];

  visit(tree, 'heading', (node: any) => {
    if (node.depth !== 2 && node.depth !== 3) return;
    const text = nodeText(node).trim();
    if (!text) return;
    headings.push({ depth: node.depth, id: slugger.slug(text), text });
  });

  return headings;
};

const calculateReadingTime = (source: string) => {
  const readableText = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return Math.max(1, Math.ceil(readableText.length / 400));
};

const listArticleFiles = async (directory: string): Promise<string[]> => {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`文章目录不存在：${ARTICLES_DIRECTORY}`);
    }
    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listArticleFiles(entryPath);
      if (!entry.isFile()) return [];
      if (path.extname(entry.name).toLocaleLowerCase() === '.md') {
        throw new Error(`[文章文件格式错误] 仅支持 .mdx 文件：${path.relative(ARTICLES_DIRECTORY, entryPath)}`);
      }
      return entry.name.endsWith(ARTICLE_EXTENSION) ? [entryPath] : [];
    }),
  );

  return files.flat();
};

const readArticleIndexRecord = async (sourcePath: string): Promise<ArticleIndexRecord> => {
  const filename = path.basename(sourcePath);
  const slug = filename.slice(0, -ARTICLE_EXTENSION.length);
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `[文章文件名错误] ${filename}: 文件名必须使用 ASCII kebab-case；公开文章推荐使用 YYYY-MM-DD-short-topic.mdx。`,
    );
  }
  if (ARTICLE_RESERVED_SLUGS.has(slug)) {
    throw new Error(`[文章文件名错误] ${filename}: ${slug} 是系统保留路径。`);
  }

  const raw = await fs.readFile(sourcePath, 'utf8');
  const parsed = matter(raw);
  const frontmatter = parseFrontmatter(parsed.data, filename);

  return {
    sourcePath,
    summary: {
      ...frontmatter,
      slug,
      readingTime: calculateReadingTime(parsed.content),
    },
  };
};

const loadArticleIndex = cache(async (): Promise<ArticleIndexRecord[]> => {
  const files = await listArticleFiles(ARTICLES_DIRECTORY);
  const records = await Promise.all(files.map(readArticleIndexRecord));
  const slugs = new Set<string>();

  for (const record of records) {
    if (slugs.has(record.summary.slug)) {
      throw new Error(`[文章文件名错误] 存在重复 slug：${record.summary.slug}`);
    }
    slugs.add(record.summary.slug);
  }

  return records.toSorted((left, right) => {
    const dateDifference = Date.parse(right.summary.publishedAt) - Date.parse(left.summary.publishedAt);
    return dateDifference || left.summary.slug.localeCompare(right.summary.slug, 'en');
  });
});

const isPublicArticle = (article: ArticleSummary) => {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' });
  return !article.draft && article.publishedAt.slice(0, 10) <= today;
};

const getIndexRecords = async ({ includeDrafts = process.env.NODE_ENV !== 'production' } = {}) => {
  const records = await loadArticleIndex();
  return records.filter((record) => includeDrafts || isPublicArticle(record.summary));
};

const createPageResult = (articles: ArticleSummary[], page: number, pageSize = ARTICLE_PAGE_SIZE) => {
  const totalArticles = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return undefined;

  const start = (page - 1) * pageSize;
  return {
    articles: articles.slice(start, start + pageSize),
    currentPage: page,
    pageSize,
    totalArticles,
    totalPages,
  } satisfies ArticlePageResult;
};

export const getArticleSummaries = async (options?: { includeDrafts?: boolean }) => {
  const records = await getIndexRecords(options);
  return records.map((record) => record.summary);
};

export const getPublishedArticleSummaries = async () => getArticleSummaries({ includeDrafts: false });

export const getArticlePage = async (page: number, options?: { includeDrafts?: boolean; pageSize?: number }) => {
  const articles = await getArticleSummaries(options);
  return createPageResult(articles, page, options?.pageSize);
};

export const getPublishedArticlePage = async (page: number, pageSize = ARTICLE_PAGE_SIZE) => {
  const articles = await getPublishedArticleSummaries();
  return createPageResult(articles, page, pageSize);
};

export const getTagArticlePage = async (
  tag: string,
  page: number,
  options?: { includeDrafts?: boolean; pageSize?: number },
) => {
  const articles = await getArticleSummaries(options);
  return createPageResult(
    articles.filter((article) => article.tags.includes(tag)),
    page,
    options?.pageSize,
  );
};

export const getPublishedTagArticlePage = async (tag: string, page: number, pageSize = ARTICLE_PAGE_SIZE) => {
  const articles = await getPublishedArticleSummaries();
  return createPageResult(
    articles.filter((article) => article.tags.includes(tag)),
    page,
    pageSize,
  );
};

export const getAllTags = async (options?: { includeDrafts?: boolean }) => {
  const articles = await getArticleSummaries(options);
  const tagCounts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return [...tagCounts.entries()]
    .toSorted(([leftTag, leftCount], [rightTag, rightCount]) => {
      const countDifference = rightCount - leftCount;
      return countDifference || leftTag.localeCompare(rightTag, 'zh-CN');
    })
    .map(([tag]) => tag);
};

export const getPublishedArticlePageParams = async () => {
  const articles = await getPublishedArticleSummaries();
  const totalPages = Math.ceil(articles.length / ARTICLE_PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ page: String(index + 2) }));
};

export const getPublishedTagPageParams = async () => {
  const articles = await getPublishedArticleSummaries();
  const tagCounts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  return [...tagCounts.entries()].flatMap(([tag, count]) =>
    Array.from({ length: Math.max(0, Math.ceil(count / ARTICLE_PAGE_SIZE) - 1) }, (_, index) => ({
      tag,
      page: String(index + 2),
    })),
  );
};

const loadArticleBySlug = cache(async (slug: string, includeDrafts: boolean): Promise<Article | undefined> => {
  const records = await getIndexRecords({ includeDrafts });
  const record = records.find((candidate) => candidate.summary.slug === slug);
  if (!record) return undefined;

  const raw = await fs.readFile(record.sourcePath, 'utf8');
  const parsed = matter(raw);
  return {
    ...record.summary,
    headings: extractHeadings(parsed.content),
    source: parsed.content,
  };
});

export const getArticleBySlug = async (slug: string, options?: { includeDrafts?: boolean }) =>
  loadArticleBySlug(slug, options?.includeDrafts ?? process.env.NODE_ENV !== 'production');

export const getAdjacentArticles = async (
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<AdjacentArticles> => {
  const articles = await getArticleSummaries(options);
  const currentIndex = articles.findIndex((article) => article.slug === slug);
  if (currentIndex < 0) return {};

  return {
    next: currentIndex > 0 ? articles[currentIndex - 1] : undefined,
    previous: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : undefined,
  };
};
