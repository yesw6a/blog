# 文章写作规则

本文档是文章写作、命名、发布和 AIGC 标识的统一规则来源。文章系统以仓库内可信 MDX 文件为内容源，文件名会直接成为公开文章地址。

## 文章位置与 URL

文章存放在 `content/articles/`，只支持 `.mdx` 文件：

```text
content/articles/2026-07-17-article-writing-rules.mdx
→ /articles/2026-07-17-article-writing-rules
```

文件名即 slug。已发布文章不要随意重命名；如果必须改 slug，需要在同一次变更中补重定向规则，避免旧链接失效。

## 文件命名风格

公开文章推荐使用：

```text
YYYY-MM-DD-short-topic.mdx
```

示例：

```text
2026-07-17-aigc-disclosure-guide.mdx
2026-07-17-git-mdx-blog-workflow.mdx
2026-07-17-article-writing-rules.mdx
```

硬性规则：

- 只能使用小写 ASCII 字母、数字和连字符。
- 只能使用 `.mdx` 扩展名。
- 不使用中文、空格、下划线、camelCase、大写字母或标点符号。

推荐规则：

- 日期与 `publishedAt` 保持一致。
- 日期后使用 2 到 6 个英文主题词，不要逐字翻译完整中文标题。
- 文件名表达主题即可，标题留给 frontmatter 的 `title`。
- 草稿流程、模板或内部验证文章可以不带日期前缀，但必须保持 kebab-case，并保持 `draft: true`。

## Frontmatter

每篇文章需要以下 frontmatter：

```mdx
---
title: 文章标题
description: 用于文章列表和 SEO 的摘要
publishedAt: 2026-07-17
tags:
  - Next.js
  - MDX
draft: true
---
```

字段规则：

- `title`：页面标题和 SEO 标题，必须是非空字符串。
- `description`：文章列表摘要和搜索描述，必须是非空字符串。
- `publishedAt`：发布日期，必须是有效日期。
- `updatedAt`：可选，内容实质更新时填写。
- `tags`：非空字符串数组，用于筛选和发现相关文章。
- `series`：可选，文章系列名称。
- `featured`：可选布尔值，用于标记精选文章。
- `draft`：布尔值。`true` 只在开发环境可见，`false` 才进入生产构建。

## 写作与发布流程

1. 在 `content/articles/` 创建符合命名规则的 `.mdx` 文件。
2. 填写必要 frontmatter，并先保持 `draft: true`。
3. 编写正文，检查标题层级、链接、表格、图片和代码块。
4. 本地预览草稿，确认正文、标签和阅读体验。
5. 发布前将 `draft` 改为 `false`。
6. 运行检查命令并提交 Git。

## AIGC 规则

AI 生成或大量 AI 辅助写作的文章，需要同时满足以下要求：

- `tags` 中加入 `AIGC`，方便在文章列表和标签筛选中识别。
- 如果生成平台提供 `AIGC:` 标识信息，在 frontmatter 中原样保留。
- 正文末尾添加可见声明，例如 `（内容由AI生成，仅供参考）`。
- 不让 AI 伪造个人经历、事实来源、日期、引文或第三方评价。
- 无法核验的内容按随笔、幻想或观点处理，不写成事实报道。
- 发布前人工复核标题、摘要、标签、正文事实和最终语气。

示例：

```mdx
tags:
  - 随笔
  - AIGC
draft: false
AIGC:
  Label: '1'
  ContentProducer: 001191440300708461136T1XGW3
```

正文末尾：

```mdx
_（内容由AI生成，仅供参考）_
```

## 内容与 MDX 安全

- 仓库内 MDX 被视为可信代码，不要直接放入未经检查的外部投稿。
- 不在正文中提交密钥、令牌、个人隐私或不可公开的第三方信息。
- 引用事实、数据或他人观点时，优先补充来源链接。
- 图片需要具备明确用途和可读的 `alt` 文本。
- 代码块应标注语言，并确认示例能独立表达意图。

## 发布检查清单

- [ ] 文件名符合 ASCII kebab-case，公开文章优先使用 `YYYY-MM-DD-short-topic.mdx`。
- [ ] `title`、`description`、`publishedAt`、`tags` 和 `draft` 已填写。
- [ ] `publishedAt` 与文件名日期一致，或已有明确原因。
- [ ] 正文标题层级从 `##` 开始，不重复页面主标题。
- [ ] 链接、图片、表格和代码块已检查。
- [ ] AIGC 文章已加入 `AIGC` 标签、保留标识信息并添加声明。
- [ ] 发布前已将 `draft` 改为 `false`。
- [ ] 已运行 `pnpm.cmd typecheck`、`pnpm.cmd lint` 和必要的构建检查。
