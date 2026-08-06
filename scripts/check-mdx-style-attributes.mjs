import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { articleCategories, articlePageSize, reservedArticleSlugs } from './article-content-config.mjs';

const projectRoot = process.cwd();
const articlesDirectory = path.join(projectRoot, 'content', 'articles');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datedSlugPattern = /^(\d{4}-\d{2}-\d{2})-/;
const stringStyleAttribute = /\bstyle\s*=\s*(?:"[^"\r\n]*"|'[^'\r\n]*')/gi;
const aigcDeclaration = /内容由\s*AI\s*生成/;
const mdxParser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

function listContentFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listContentFiles(entryPath);
    return entry.isFile() ? [entryPath] : [];
  });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeDate(value) {
  if (!(typeof value === 'string' || value instanceof Date)) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function addViolation(collection, file, message, line, column) {
  collection.push({ file, message, line, column });
}

const allFiles = listContentFiles(articlesDirectory).sort();
const unsupportedMarkdownFiles = allFiles.filter((file) => path.extname(file).toLocaleLowerCase() === '.md');
const files = allFiles.filter((file) => file.endsWith('.mdx'));
const violations = [];
const seenSlugs = new Map();
const tagNames = new Set();
let publishedCount = 0;
let draftCount = 0;
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' });

for (const file of unsupportedMarkdownFiles) {
  addViolation(violations, path.relative(projectRoot, file).split(path.sep).join('/'), '文章目录只支持 .mdx 文件。');
}

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const relativeFile = path.relative(projectRoot, file).split(path.sep).join('/');
  const relativeArticleFile = path.relative(articlesDirectory, file);
  const filename = path.basename(file);
  const slug = filename.slice(0, -'.mdx'.length);
  const lines = source.split(/\r?\n/);

  if (!slugPattern.test(slug)) {
    addViolation(violations, relativeFile, '文件名必须使用 ASCII kebab-case。');
  }
  if (reservedArticleSlugs.has(slug)) {
    addViolation(violations, relativeFile, `${slug} 是系统保留路径。`);
  }
  if (seenSlugs.has(slug)) {
    addViolation(violations, relativeFile, `slug 与 ${seenSlugs.get(slug)} 重复。`);
  } else {
    seenSlugs.set(slug, relativeFile);
  }

  for (const [index, line] of lines.entries()) {
    stringStyleAttribute.lastIndex = 0;
    for (const match of line.matchAll(stringStyleAttribute)) {
      addViolation(violations, relativeFile, `不支持字符串形式的样式属性：${match[0]}`, index + 1);
    }
  }

  let parsed;
  let tree;
  let lineOffset = 0;

  try {
    parsed = matter(source);
    const contentStart = source.indexOf(parsed.content);
    lineOffset = contentStart > 0 ? source.slice(0, contentStart).split(/\r?\n/).length - 1 : 0;
    tree = mdxParser.parse(parsed.content);
  } catch (error) {
    const bodyLine = Number.isInteger(error?.line) ? error.line : error?.position?.start?.line;
    const column = Number.isInteger(error?.column) ? error.column : error?.position?.start?.column;
    addViolation(
      violations,
      relativeFile,
      error?.reason ?? error?.message ?? String(error),
      Number.isInteger(bodyLine) ? bodyLine + lineOffset : undefined,
      Number.isInteger(column) ? column : undefined,
    );
    continue;
  }

  const data = parsed.data;
  if (!isNonEmptyString(data.title)) addViolation(violations, relativeFile, 'title 必须是非空字符串。');
  if (!isNonEmptyString(data.description)) addViolation(violations, relativeFile, 'description 必须是非空字符串。');

  const publishedAt = normalizeDate(data.publishedAt);
  if (!publishedAt) {
    addViolation(violations, relativeFile, 'publishedAt 必须是有效日期。');
  }
  if (data.updatedAt !== undefined && !normalizeDate(data.updatedAt)) {
    addViolation(violations, relativeFile, 'updatedAt 必须是有效日期。');
  }

  if (data.series !== undefined && !isNonEmptyString(data.series)) {
    addViolation(violations, relativeFile, 'series 必须是非空字符串。');
  }
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    addViolation(violations, relativeFile, 'featured 必须是布尔值。');
  }

  if (!articleCategories.has(data.category)) {
    addViolation(violations, relativeFile, 'category 不在允许的分类集合中。');
  }

  const tags = data.tags;
  if (!Array.isArray(tags) || tags.length === 0 || tags.some((tag) => !isNonEmptyString(tag))) {
    addViolation(violations, relativeFile, 'tags 必须是非空字符串数组。');
  } else {
    const normalizedTags = tags.map((tag) => tag.trim());
    if (new Set(normalizedTags).size !== normalizedTags.length) {
      addViolation(violations, relativeFile, 'tags 不能包含重复值。');
    }
    for (const tag of normalizedTags) tagNames.add(tag);
  }

  if (typeof data.draft !== 'boolean') {
    addViolation(violations, relativeFile, 'draft 必须显式填写布尔值。');
  } else if (data.draft) {
    draftCount += 1;
  } else {
    publishedCount += 1;
  }

  const filenameDate = slug.match(datedSlugPattern)?.[1];
  const publishedDate = publishedAt?.slice(0, 10);
  if (publishedDate) {
    const [publishedYear, publishedMonth] = publishedDate.split('-');
    const expectedDirectory = path.join(publishedYear, publishedMonth);
    const actualDirectory = path.dirname(relativeArticleFile);
    if (actualDirectory !== expectedDirectory) {
      addViolation(
        violations,
        relativeFile,
        `文章目录必须是 content/articles/${publishedYear}/${publishedMonth}/，与 publishedAt 保持一致。`,
      );
    }
  }
  if (filenameDate && publishedDate && filenameDate !== publishedDate) {
    addViolation(violations, relativeFile, `文件名日期 ${filenameDate} 与 publishedAt ${publishedDate} 不一致。`);
  }
  if (data.draft === false && publishedDate && publishedDate > today) {
    addViolation(violations, relativeFile, '未来发布日期文章必须保持 draft: true。');
  }

  const hasAigcTag = Array.isArray(tags) && tags.some((tag) => tag === 'AIGC');
  const hasAigcMetadata = data.AIGC !== undefined;
  const hasAigcDeclaration = aigcDeclaration.test(parsed.content);
  const usesAigc = hasAigcTag || hasAigcMetadata || hasAigcDeclaration;
  if (usesAigc && !(hasAigcTag && hasAigcMetadata && hasAigcDeclaration)) {
    addViolation(violations, relativeFile, 'AIGC 文章必须同时包含 AIGC 标签、元数据块和正文可见声明。');
  }
  if (hasAigcMetadata) {
    const aigc = data.AIGC;
    if (
      typeof aigc !== 'object' ||
      aigc === null ||
      !isNonEmptyString(aigc.Label) ||
      !isNonEmptyString(aigc.ContentProducer)
    ) {
      addViolation(violations, relativeFile, 'AIGC 元数据必须包含非空的 Label 和 ContentProducer。');
    }
  }

  visit(tree, 'heading', (node) => {
    if (node.depth === 1) {
      addViolation(
        violations,
        relativeFile,
        '正文不得包含一级标题，页面标题由 Frontmatter title 生成。',
        node.position?.start?.line ? node.position.start.line + lineOffset : undefined,
      );
    }
  });
}

if (violations.length > 0) {
  console.error('Article content validation failed:');
  for (const violation of violations) {
    const location = [violation.file, violation.line, violation.column].filter(Boolean).join(':');
    console.error(`${location}: ${violation.message}`);
  }
  process.exitCode = 1;
} else {
  const pageCount = Math.max(1, Math.ceil(publishedCount / articlePageSize));
  console.log(`Content check passed: ${files.length} article MDX files parsed and validated.`);
  console.log(
    `Content stats: ${publishedCount} published, ${draftCount} drafts, ${pageCount} archive pages, ${tagNames.size} tags.`,
  );
}
