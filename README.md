# 兮兮的个人站

## 技术栈与服务

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [StyleX](https://stylexjs.com/)
- [Cloudflare](https://www.cloudflare.com/)

样式由 StyleX 静态提取，通过 `next-themes` 支持浅色、深色和跟随系统主题。开发与生产构建使用 Turbopack。

## 文章发布

文章存放在 `content/articles/`，文件名会直接成为文章地址，因此必须使用 kebab-case：

```text
content/articles/building-a-git-mdx-blog.mdx
→ /articles/building-a-git-mdx-blog
```

每篇文章需要以下 frontmatter：

```mdx
---
title: 文章标题
description: 用于文章列表和 SEO 的摘要
publishedAt: 2026-07-14
tags:
  - Next.js
  - MDX
draft: true
---
```

- `draft: true` 的文章只在开发环境可见，不会进入生产文章路由、RSS 或 Sitemap。
- 完成写作后将 `draft` 改为 `false`，提交 Git 即可发布。
- 文件名、必填字段、日期和标签会在构建时校验；内容不合法会阻止发布。
- 仓库内 MDX 被视为可信代码，不要直接放入未经检查的外部投稿。

生产环境应设置 `NEXT_PUBLIC_SITE_URL`，供 canonical、RSS、Sitemap 和 JSON-LD 生成绝对地址：

```env
NEXT_PUBLIC_SITE_URL=https://example.com
```

## 检查命令

```bash
pnpm lint
pnpm typecheck
pnpm build
```
