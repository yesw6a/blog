import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';

import type { AdjacentArticles, Article, ArticleFrontmatter, ArticleHeading, ArticleSummary } from './article.types';

import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const ARTICLES_DIRECTORY = path.join(process.cwd(), 'content', 'articles');
const ARTICLE_EXTENSION = '.mdx';
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

  return {
    title: requireString(data, 'title', filename),
    description: requireString(data, 'description', filename),
    publishedAt: requireDate(data, 'publishedAt', filename),
    updatedAt: optionalDate(data, 'updatedAt', filename),
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

const readArticle = async (filename: string): Promise<Article> => {
  const slug = filename.slice(0, -ARTICLE_EXTENSION.length);
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `[文章文件名错误] ${filename}: 文件名必须使用 ASCII kebab-case；公开文章推荐使用 YYYY-MM-DD-short-topic.mdx。`,
    );
  }

  const raw = await fs.readFile(path.join(ARTICLES_DIRECTORY, filename), 'utf8');
  const parsed = matter(raw);
  const frontmatter = parseFrontmatter(parsed.data, filename);

  return {
    ...frontmatter,
    slug,
    readingTime: calculateReadingTime(parsed.content),
    headings: extractHeadings(parsed.content),
    source: parsed.content,
  };
};

const loadArticles = cache(async (): Promise<Article[]> => {
  let entries;
  try {
    entries = await fs.readdir(ARTICLES_DIRECTORY, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`文章目录不存在：${ARTICLES_DIRECTORY}`);
    }
    throw error;
  }

  const unsupportedMarkdownFiles = entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLocaleLowerCase() === '.md')
    .map((entry) => entry.name)
    .toSorted();

  if (unsupportedMarkdownFiles.length > 0) {
    throw new Error(
      `[文章文件格式错误] content/articles 仅支持 .mdx 文件。请将以下文件重命名为 ASCII kebab-case 的 .mdx 文件；公开文章推荐使用 YYYY-MM-DD-short-topic.mdx，并补齐 title、description、publishedAt、tags 和 draft frontmatter：${unsupportedMarkdownFiles.join(', ')}`,
    );
  }

  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(ARTICLE_EXTENSION))
    .map((entry) => entry.name);
  const articles = await Promise.all(filenames.map(readArticle));

  return articles.toSorted((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
});

const toSummary = (article: Article): ArticleSummary => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  publishedAt: article.publishedAt,
  updatedAt: article.updatedAt,
  tags: article.tags,
  series: article.series,
  featured: article.featured,
  draft: article.draft,
  readingTime: article.readingTime,
});

export const getArticles = async ({ includeDrafts = process.env.NODE_ENV !== 'production' } = {}) => {
  const articles = await loadArticles();
  return articles.filter((article) => includeDrafts || !article.draft);
};

export const getArticleSummaries = async (options?: { includeDrafts?: boolean }) => {
  const articles = await getArticles(options);
  return articles.map(toSummary);
};

export const getPublishedArticles = async () => getArticles({ includeDrafts: false });

export const getPublishedArticleSummaries = async () => {
  const articles = await getPublishedArticles();
  return articles.map(toSummary);
};

export const getArticleBySlug = async (slug: string, options?: { includeDrafts?: boolean }) => {
  const articles = await getArticles(options);
  return articles.find((article) => article.slug === slug);
};

export const getAllTags = async (options?: { includeDrafts?: boolean }) => {
  const articles = await getArticleSummaries(options);
  return [...new Set(articles.flatMap((article) => article.tags))].toSorted((left, right) =>
    left.localeCompare(right, 'zh-CN'),
  );
};

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
