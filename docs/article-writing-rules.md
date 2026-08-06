# 文章写作规则

本文档是文章文件格式、Frontmatter、MDX 写法和 AIGC 标识的唯一规则来源。日常执行顺序见 `content/sop.md`，静态生成机制见 `docs/article-content-architecture.md`。

## 1. 内容源、目录与 URL

文章系统只把仓库内可信的 `.mdx` 文件视为权威内容源。根目录为：

```text
content/articles/
```

扫描器支持递归目录。所有文章必须按 `publishedAt` 的年月组织：

```text
content/articles/2026/08/2026-08-07-static-pagination.mdx
```

目录只承担内容管理职责，不进入公开 URL。不得按 `page-1`、`page-2` 等编号分页组织源文件；分页页面由构建过程根据文章排序自动生成。

公开 URL 只使用文件 basename，不包含物理目录：

```text
content/articles/2026/08/2026-08-07-static-pagination.mdx
→ /articles/2026-08-07-static-pagination
```

生成的文章索引、搜索索引、分页页面和构建文件均为派生数据，不得手工维护或作为第二内容源。

## 2. 文件名与 slug

公开文章使用：

```text
YYYY-MM-DD-short-topic.mdx
```

硬性规则：

- 只能使用小写 ASCII 字母、数字和连字符。
- 只能使用 `.mdx` 扩展名。
- slug 在全部子目录中必须唯一。
- 不使用中文、空格、下划线、camelCase、大写字母或其他标点。
- `page`、`tag`、`archive`、`search` 是系统保留路径，不能作为 slug。
- 日期前缀必须与 `publishedAt` 的日期一致。
- 文件所在的 `YYYY/MM` 目录必须与 `publishedAt` 的年月一致。
- 已公开文章不得随意更改 basename；必须改 slug 时，要在同一次代码变更中提供重定向。

草稿、模板或内部验证文章可以不带日期前缀，但仍须保持 ASCII kebab-case 和 `draft: true`。

## 3. Frontmatter

新文章模板：

```mdx
---
title: 文章标题
description: 用于文章列表、搜索索引和 SEO 的摘要
publishedAt: 2026-08-07
category: engineering-practice
tags:
  - Next.js
  - MDX
draft: true
rss: true
---
```

字段规则：

- `title`：必填，非空字符串，作为页面 H1 和 SEO 标题。
- `description`：必填，非空字符串，用于列表、搜索、Open Graph 和结构化数据。
- `publishedAt`：必填，有效日期；静态站不会在运行时自动发布未来文章。
- `updatedAt`：可选，仅在正文发生实质更新时填写。
- `category`：必填，必须来自下表的稳定语义值。
- `tags`：必填，非空且不重复的字符串数组，用于静态标签页和搜索。
- `series`：可选，文章系列名称。
- `featured`：可选布尔值，用于精选展示。
- `draft`：必填布尔值；`true` 不进入生产静态页面，`false` 才允许发布。
- `rss`：必填布尔值；公开文章为 `true` 时进入 RSS，为 `false` 时仍公开但不进入 RSS。

### 3.1 分类值

| 编码 | `category`              | 含义                |
| ---- | ----------------------- | ------------------- |
| T1   | `ai-frontier`           | AI / 大模型前沿笔记 |
| T2   | `engineering-practice`  | 前端 / 全栈工程实践 |
| T3   | `tools-productivity`    | 技术工具与效率      |
| T4   | `tech-industry`         | 技术产品与行业观察  |
| T5   | `technical-foundations` | 深度技术原理        |
| T6   | `essay-retrospective`   | 技术随笔与复盘      |

`category` 用于编辑统计和归档，`tags` 用于更细粒度的公开发现。不要通过标签猜测分类，也不要创建含义重复的新分类值。

## 4. 草稿、日期与发布

- 创建文章时先使用 `draft: true`。
- 发布前人工确认日期、分类、摘要、来源、正文和 `rss` 收录意图，再改为 `draft: false`。
- `draft: false` 的未来日期文章会被内容检查拒绝。
- 静态部署不会在日期到达时自动让文章上线；需要在发布日重新构建和部署。
- 多篇文章可使用同一发布日期，但静态排序会用 slug 作为第二排序键。
- `rss: false` 只控制订阅源收录，不是访问控制，也无法撤回阅读器已经缓存的内容。

## 5. AIGC 规则

AI 生成或大量 AI 辅助写作的文章必须同时具备以下三项：

1. `tags` 中包含 `AIGC`。
2. Frontmatter 中包含平台提供的 `AIGC` 元数据，至少具有非空的 `Label` 和 `ContentProducer`。
3. 正文末尾包含可见声明：`_（内容由AI生成，仅供参考）_`。

示例：

```mdx
tags:

- 工程实践
- AIGC
  draft: false
  rss: true
  AIGC:
  Label: '1'
  ContentProducer: 001191440300708461136T1XGW3

---

正文内容。

_（内容由AI生成，仅供参考）_
```

如果平台提供更多 AIGC 字段，应原样保留。缺少三项中的任意一项都会导致内容检查失败。

AI 不得伪造个人经历、事实来源、日期、引语、产品表现或第三方评价。无法核验的内容必须明确写成观点、随笔或虚构表达。

## 6. 正文结构与资料

- 页面 H1 由 Frontmatter `title` 生成，正文不得再写 `# 一级标题`。
- 正文章节从 `##` 开始，子章节使用 `###`。
- 不强制每天使用相同开场、章节数量或结尾结构。
- T1 至 T5 的重要事实、数据、版本和引语必须提供来源链接。
- 技术实操文章应标明关键依赖或产品版本，避免示例脱离上下文。
- 图片必须具有明确用途和可读的 `alt` 文本。
- 代码块应标注语言，并确认示例能够独立表达意图。
- 资料整理和可核验信息应占主要部分；观察与反思不能冒充事实。

## 7. MDX 安全

- 优先使用 Markdown 原生标题、列表、引用、表格、代码块和强调。
- 不提交密钥、令牌、隐私信息或不可公开的第三方数据。
- 不使用字符串形式的 HTML `style="..."` 或 `style='...'`。
- 不在 JSX 标签内部嵌套 Markdown 强调符号。
- 普通强调使用 `**重点内容**`。
- 确需彩色粗体时使用合法的 React 对象语法，并检查明暗主题和对比度：

```mdx
<strong style={{ color: '#ff6b35' }}>重点内容</strong>
```

- JSX 写法存在疑问时，删除 JSX 并改用纯 Markdown。

## 8. 发布前检查清单

- [ ] 文件路径位于与 `publishedAt` 一致的 `content/articles/YYYY/MM/`，扩展名为 `.mdx`。
- [ ] basename 符合 ASCII kebab-case，且没有使用保留 slug。
- [ ] `title`、`description`、`publishedAt`、`category`、`tags`、`draft`、`rss` 已正确填写。
- [ ] 文件名日期与 `publishedAt` 一致。
- [ ] 正文从 `##` 开始，没有重复页面 H1。
- [ ] 链接、图片、表格和代码块已检查。
- [ ] AIGC 文章的标签、元数据和正文声明完整一致。
- [ ] 事实、数据和引语已人工核验。
- [ ] 发布时 `draft: false`，且发布日期不晚于当前日期。
- [ ] 已确认该文章是否应通过 `rss` 进入订阅源。
- [ ] 已按 `content/sop.md` 完成全部自动检查、构建和发布报告。
