# 文章内容与静态归档架构

## 1. 目标

文章系统以 Git 仓库中的 MDX 文件作为唯一权威内容源，在构建期生成详情页、分页列表、标签页、搜索索引、RSS 和 sitemap。生产访问不依赖数据库，也不需要请求时查询内容服务。

## 2. 数据流

```text
content/articles/**/*.mdx
  ├─ 轻量元数据索引
  │   ├─ /articles
  │   ├─ /articles/page/N
  │   ├─ /articles/tag/[tag]
  │   ├─ /articles/tag/[tag]/page/N
  │   ├─ /article-search-index.json
  │   ├─ /rss.xml
  │   └─ /sitemap.xml
  └─ 按 slug 读取单篇正文
      └─ /articles/[slug]
```

派生索引可以在每次构建中重新生成，不手工编辑、不作为内容备份。

## 3. 轻量索引与正文边界

轻量索引保存列表和导航所需数据：

- slug
- title
- description
- publishedAt / updatedAt
- category
- tags / series / featured / draft
- readingTime
- 构建期内部 sourcePath

索引阶段不提取文章标题 AST，也不长期保留全部正文源代码。详情页通过 slug 找到 sourcePath，只读取目标 MDX，再生成正文和目录标题。

该边界保证列表、标签、RSS、sitemap 和相邻文章只处理摘要；新增一篇文章时，内容解析量随文章总数线性增长。

## 4. 目录和 URL

- 扫描根目录：`content/articles`。
- 扫描方式：递归。
- 物理目录：`content/articles/YYYY/MM/*.mdx`。
- 年月目录必须与 Frontmatter `publishedAt` 一致，并由内容检查强制校验。
- 公开 slug：文件 basename，不包含年月目录。
- slug 在整个文章树中全局唯一。

年月目录只用于管理内容，不参与分页和公开 URL。移动父目录不会改变 URL，但 basename 变化会改变公开地址，必须配套重定向。

## 5. 公开文章判定

生产环境中的公开文章必须同时满足：

- `draft === false`
- `publishedAt` 不晚于构建时间
- Frontmatter、slug、AIGC 和 MDX 全部通过内容检查

开发环境可以读取草稿，但静态生产参数只由公开文章生成。

## 6. 排序与分页

- 首排序：`publishedAt` 降序。
- 第二排序：slug 升序，确保同日期文章顺序稳定。
- 每页固定 10 篇。
- 第一页：`/articles`。
- 后续页：`/articles/page/N`。
- 静态页使用 `generateStaticParams`，未知页码返回 404。
- 每个归档页面使用自己的 canonical。

新增文章会让倒序编号页的内容发生位移，这是编号分页的固有行为。后续可以增加 `/articles/YYYY/MM` 月份归档，提供更稳定的深层入口，而无需改变索引接口。

源文件不得按编号分页拆分。`/articles/page/N` 是从完整元数据索引按每页 10 篇切分得到的构建产物；如果按页存放源文件，每新增一篇文章都会迫使后续文件跨目录移动，并让内容目录与展示排序错误耦合。

## 7. 标签

标签页采用静态路径：

```text
/articles/tag/[tag]
/articles/tag/[tag]/page/N
```

标签值来自 Frontmatter，路由参数使用 URL 编码。站内标签链接统一使用静态路径。旧的 `/articles?tag=...` 由客户端搜索索引兼容，但不再作为站内主要链接。

## 8. 搜索

默认归档页只向浏览器传递当前页摘要，不传递完整文章索引。

用户输入 `?q=` 或访问旧 `?tag=` 链接时，客户端按需请求：

```text
/article-search-index.json
```

该 JSON 只包含公开摘要，不包含正文。搜索结果在客户端过滤并分页；普通静态归档、标签页和详情页不需要这次请求。

## 9. RSS 与 sitemap

- sitemap 保持详情页为主要索引目标，归档页面通过站内真实链接被发现，避免随着标签组合无意义膨胀。
- RSS 只输出最新 50 篇文章，防止长期增长后响应无限扩大。

## 10. 内容检查

`pnpm.cmd content:check` 是构建前的统一内容门禁，验证：

- 递归目录中的 `.mdx` 文件格式。
- 物理 `YYYY/MM` 目录与 `publishedAt` 年月一致。
- slug 语法、唯一性和保留路径。
- Frontmatter 必填字段和分类枚举。
- 日期、草稿和未来发布约束。
- tags 空值和重复值。
- AIGC 标签、元数据和正文声明一致性。
- MDX 语法、字符串 style 和重复 H1。

检查成功时输出文章、草稿、分页和标签统计。

## 11. 日更计划

`pnpm.cmd content:plan -- --date=YYYY-MM-DD` 只读扫描 MDX，计算：

- 前一日已发布分类。
- 当前自然周各分类数量与上限。
- 排除不合规分类后的候选集合。
- 使用日期种子生成的可复现加权推荐。

重磅官方素材可以人工覆盖推荐，但覆盖原因必须进入发布报告，且文章仍计入周统计。

## 12. 扩展与监控

随着文章数量增长，持续观察：

- 生产构建耗时。
- 静态页面和资源文件数量。
- 搜索索引压缩后体积。
- 标签总数与低质量孤立标签。
- 每次发布引起的分页页面变更量。

达到平台限制前优先增加月份归档、构建缓存或静态生成器优化，而不是把 MDX 迁移到数据库。
