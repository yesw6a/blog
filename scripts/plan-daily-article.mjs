import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import matter from 'gray-matter';

import { articleTopics } from './article-content-config.mjs';

const projectRoot = process.cwd();
const articlesDirectory = path.join(projectRoot, 'content', 'articles');

function listMdxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listMdxFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.mdx') ? [entryPath] : [];
  });
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateText, days) {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDate(date);
}

function getMonday(dateText) {
  const date = new Date(`${dateText}T00:00:00.000Z`);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return formatDate(date);
}

function getTargetDate() {
  const dateArgument = process.argv.find((argument) => argument.startsWith('--date='));
  const value = dateArgument?.slice('--date='.length);
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    return value;
  }
  if (value) throw new Error(`无效日期：${value}，请使用 --date=YYYY-MM-DD。`);
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' });
}

function deterministicRandom(seed) {
  const digest = createHash('sha256').update(seed).digest('hex').slice(0, 8);
  return Number.parseInt(digest, 16) / 0xffffffff;
}

const targetDate = getTargetDate();
const previousDate = addDays(targetDate, -1);
const weekStart = getMonday(targetDate);
const files = listMdxFiles(articlesDirectory);
const articles = files
  .map((file) => matter(readFileSync(file, 'utf8')).data)
  .filter((data) => data.draft === false && data.category && data.publishedAt)
  .map((data) => ({
    category: data.category,
    publishedAt: (data.publishedAt instanceof Date ? data.publishedAt.toISOString() : String(data.publishedAt)).slice(
      0,
      10,
    ),
  }))
  .filter((article) => article.publishedAt <= targetDate);

const previousCategories = new Set(
  articles.filter((article) => article.publishedAt === previousDate).map((article) => article.category),
);
const weeklyCounts = new Map(articleTopics.map((topic) => [topic.category, 0]));
for (const article of articles) {
  if (article.publishedAt >= weekStart && article.publishedAt <= targetDate) {
    weeklyCounts.set(article.category, (weeklyCounts.get(article.category) ?? 0) + 1);
  }
}

const candidates = articleTopics.filter(
  (topic) => !previousCategories.has(topic.category) && (weeklyCounts.get(topic.category) ?? 0) < topic.weeklyLimit,
);

if (candidates.length === 0) {
  throw new Error('没有满足昨日去重与本周上限的候选主题，需要人工调整约束。');
}

const totalWeight = candidates.reduce((sum, topic) => sum + topic.weight, 0);
const draw = deterministicRandom(`${targetDate}:${files.length}`) * totalWeight;
let cursor = 0;
let selected = candidates.at(-1);
for (const topic of candidates) {
  cursor += topic.weight;
  if (draw < cursor) {
    selected = topic;
    break;
  }
}

console.log(`日更计划日期：${targetDate}`);
console.log(`统计周期：${weekStart} 至 ${targetDate}`);
console.log(`昨日已发布分类：${previousCategories.size ? [...previousCategories].join(', ') : '无'}`);
console.log('');
console.log('主题状态：');
for (const topic of articleTopics) {
  const count = weeklyCounts.get(topic.category) ?? 0;
  const reasons = [];
  if (previousCategories.has(topic.category)) reasons.push('与昨日重复');
  if (count >= topic.weeklyLimit) reasons.push('达到周上限');
  console.log(
    `- ${topic.code} ${topic.label} (${topic.category})：本周 ${count}/${topic.weeklyLimit}${
      reasons.length ? `，排除：${reasons.join('、')}` : '，可选'
    }`,
  );
}
console.log('');
console.log(`推荐主题：${selected.code} ${selected.label} (${selected.category})`);
console.log('如因重磅官方素材覆盖推荐，请在最终发布报告中记录覆盖原因。');
