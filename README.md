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
rss: true
---
```

- `draft: true` 的文章只在开发环境可见，不会进入生产文章路由、RSS 或 Sitemap。
- `rss` 必须显式填写；公开文章设置为 `false` 时仍可正常访问和搜索，但不会进入 RSS。
- 完成写作后将 `draft` 改为 `false`，提交 Git 即可发布。
- 文件名、必填字段、日期和标签会在构建时校验；内容不合法会阻止发布。
- 仓库内 MDX 被视为可信代码，不要直接放入未经检查的外部投稿。

生产环境应设置 `NEXT_PUBLIC_SITE_URL`，供 canonical、RSS、Sitemap 和 JSON-LD 生成绝对地址：

```env
NEXT_PUBLIC_SITE_URL=https://example.com
```

## 网站统计

生产环境使用 [BSZ 不蒜子统计平台](https://bsz.dusays.com/) 记录并在页脚展示独立访客和累计访问量。

- 本地 `next dev` 不会上报访问数据。
- 客户端路由变化时只会上报当前站点来源和 pathname，不会发送查询参数或 URL hash。
- 浏览器会在本地保存 bsz 返回的匿名身份令牌，用于计算 UV；清理站点存储后可能被识别为新的访客。
- 数据由 bsz 公共服务维护，统计口径和可用性以该服务为准。

部署后分别访问首页、文章列表和文章详情页，并进行一次站内路由跳转。浏览器网络面板中应出现发往 `https://bsz.dusays.com:9001/api` 的 `POST` 请求，页脚随后显示非负的 UV/PV 数据。

## 每日头像缓存

每日头像使用 Cloudflare R2 保存，不依赖数据库。首次部署前创建并绑定 `blog-avatars` bucket：

```bash
pnpm exec wrangler r2 bucket create blog-avatars
```

应用仓库内的 30 天自动清理规则：

```bash
pnpm exec wrangler r2 bucket lifecycle set blog-avatars --file cloudflare/r2-avatar-lifecycle.json
```

应用会优先读取当天的 R2 对象；当天对象不存在时下载并写入，失败时回退到最近可用的历史头像。旧版带扩展名的 `daily/YYYY-MM-DD.*` 对象仍可继续读取。

## 检查命令

```bash
pnpm lint
pnpm typecheck
pnpm build
```
