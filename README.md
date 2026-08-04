# 兮兮的个人站

## 技术栈与服务

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [StyleX](https://stylexjs.com/)
- [Cloudflare](https://www.cloudflare.com/)

样式由 StyleX 静态提取，通过 `next-themes` 支持浅色、深色和跟随系统主题。开发与生产构建使用 Turbopack。

## 文章发布

文章存放在 `content/articles/`，文件名会直接成为文章地址。完整写作、命名、发布和 AIGC 规则见 [文章写作规则](docs/article-writing-rules.md)。

```text
content/articles/2026-07-17-article-writing-rules.mdx
→ /articles/2026-07-17-article-writing-rules
```

公开文章推荐使用 `YYYY-MM-DD-short-topic.mdx`，并填写必要 frontmatter：

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

- `draft: true` 的文章只在开发环境可见，不会进入生产文章路由、RSS 或 Sitemap。
- 完成写作后将 `draft` 改为 `false`，提交 Git 即可发布。
- 文件名、必填字段、日期和标签会在构建时校验；内容不合法会阻止发布。
- 仓库内 MDX 被视为可信代码，不要直接放入未经检查的外部投稿。

生产环境应设置 `NEXT_PUBLIC_SITE_URL`，供 canonical、RSS、Sitemap 和 JSON-LD 生成绝对地址：

```env
NEXT_PUBLIC_SITE_URL=https://example.com
```

## 网站统计

生产环境使用 Cloudflare Web Analytics 统计页面访问。先在 Cloudflare 控制台为站点启用 Web Analytics 并获取 Site Token，然后在执行生产构建或部署命令前设置：

```env
NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN=your-site-token
```

`NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` 是浏览器端公开配置，必须在 Next.js 构建阶段可用。未配置 Token 或在开发环境运行时，统计脚本不会加载。

部署后可在浏览器网络面板中检查 `beacon.min.js` 和 `/cdn-cgi/rum` 请求，并分别访问首页、文章列表和文章详情页，确认 Cloudflare Web Analytics 面板能够记录页面浏览。还应通过站内链接进行一次客户端路由跳转，确认跳转后的页面也会被统计。

## 检查命令

```bash
pnpm lint
pnpm typecheck
pnpm build
```
