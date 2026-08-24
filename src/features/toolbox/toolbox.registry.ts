import type { ToolCategory, ToolDefinition } from './toolbox.types';

export const TOOL_CATEGORY_LABELS: Record<ToolCategory, string> = {
  writing: '文本与写作',
  data: '数据与编码',
  time: '时间',
  visual: '视觉',
};

export const TOOL_DEFINITIONS = [
  {
    slug: 'json',
    name: 'JSON 格式化',
    description: '校验、格式化或压缩 JSON，并快速复制或下载结果。',
    category: 'data',
    keywords: ['JSON', '格式化', '校验', '压缩', '开发'],
    icon: 'code',
    dataPolicy: 'browser-local',
  },
  {
    slug: 'timestamp',
    name: '时间戳转换',
    description: '在 Unix 时间戳、本地时间、UTC 和 ISO 8601 之间转换。',
    category: 'time',
    keywords: ['Unix', 'timestamp', '时间戳', '日期', 'UTC', 'ISO'],
    icon: 'speed',
    dataPolicy: 'browser-local',
  },
  {
    slug: 'url-codec',
    name: 'URL 工具',
    description: '编码、解码 URL，并将查询参数整理成可读的 JSON。',
    category: 'data',
    keywords: ['URL', 'encode', 'decode', 'query', '查询参数'],
    icon: 'sourceCode',
    dataPolicy: 'browser-local',
  },
  {
    slug: 'base64',
    name: 'Base64 工具',
    description: '在 UTF-8 文本和 Base64 字符串之间安全转换。',
    category: 'data',
    keywords: ['Base64', 'UTF-8', '编码', '解码'],
    icon: 'checkCircle',
    dataPolicy: 'browser-local',
  },
  {
    slug: 'text-inspector',
    name: '文本检查器',
    description: '统计字符、汉字、单词、行数和字节数，并清理常见空白。',
    category: 'writing',
    keywords: ['文本', '字数', '字符', '单词', '行数', '字节', '空白'],
    icon: 'article',
    dataPolicy: 'browser-local',
  },
  {
    slug: 'color-contrast',
    name: '颜色与对比度',
    description: '解析 HEX 或 RGB 颜色，并检查 WCAG 文本对比度。',
    category: 'visual',
    keywords: ['颜色', 'HEX', 'RGB', 'WCAG', '对比度', '无障碍'],
    icon: 'palette',
    dataPolicy: 'browser-local',
  },
  {
    slug: 'ai-image-studio',
    name: 'AI 图像工作台',
    description: '使用 SceneMeld 桌面客户端，通过自备兼容 Endpoint 进行对话生图、图生图和分镜创作。',
    category: 'visual',
    keywords: ['AI 生图', '文生图', '图生图', '分镜', '参考图', 'SceneMeld', 'gpt-image-2', '桌面客户端'],
    icon: 'imageSparkle',
    dataPolicy: 'desktop-direct',
  },
] as const satisfies readonly ToolDefinition[];

export type ToolSlug = (typeof TOOL_DEFINITIONS)[number]['slug'];

export const getToolBySlug = (slug: string) => TOOL_DEFINITIONS.find((tool) => tool.slug === slug);

export const getToolHref = (slug: string) => `/tools/${slug}`;
