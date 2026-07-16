# CHANGELOG

## v.0.2.0 (2026-07-13 ~ 2026-07-17)

### 📦 Version

- 项目版本从 0.1.0 升级到 0.2.0。
- 本发布窗口新增文章系统、导航与头像交互、每日头像和开发输出隔离均属于 `0.2.0` 已覆盖的 Minor 级别，版本保持不变。
- 本次 Cloudflare 部署链由 Pages/`next-on-pages` 迁移至 Workers/OpenNext，属于当前发布窗口已覆盖的 Minor 级变更，项目版本继续保持 `0.2.0`。

### 🎉 Feat

- 将 Tailwind CSS 样式体系完整迁移到 StyleX。
- 接入 StyleX 浅色/深色主题，并支持 Turbopack 构建时 CSS 提取。
- 使用本地 SVG 图标替换 Iconify Tailwind 图标，并为组件提供类型化 StyleX 样式接口。
- 为首页头像增加掘金风格的悬停旋转，使用 `250ms` 意图延迟和 `cubic-bezier(.34, 0, .84, 1)`，在 `1800ms` 内从 `60deg/s` 加速到 `900deg/s`。
- 首页头像改为基于 `Asia/Shanghai` 日期的每日确定性选择，同一天复用头像并缓存到次日零点，首选图片不可用时按稳定顺序回退。
- 新增 Git/MDX 文章系统，支持 frontmatter 校验、草稿预览、阅读时长、标题目录和相邻文章导航。
- 新增 `/articles` 文章列表与详情路由，支持 URL 搜索、标签组合筛选和响应式长文阅读布局。
- 新增文章 Metadata、`BlogPosting` JSON-LD、RSS 与 Sitemap，生产构建自动排除草稿文章。

### 🔄 Changed

- 将全局固定 `50%` 宽度和嵌套滚动改为响应式文档布局，保证文章锚点、粘性目录与浏览器滚动恢复正常工作。
- 顶部导航新增文章入口，并使用路径前缀保持文章详情页导航激活状态。
- 顶部导航改为与画布同色的粘性遮挡区域，保留长胶囊外观并统一正文、目录和标题锚点的安全偏移。
- 文章导航使用独立的展开书页图标，移除导航图标的多层缩放强调。
- 首页头像在鼠标移出后反向缓出至上一个完整旋转锚点，再次移入时从当前位置恢复正向加速。
- 扩展 StyleX 浅色/深色语义令牌，统一文章正文、边框、代码块和弱化文本的主题表现。
- 开发环境输出目录调整为 `.next-dev`，生产构建与启动继续使用 `.next`，避免两种运行模式并发覆盖产物。
- Cloudflare 部署方式由 Pages 的 `next-on-pages` 迁移为 Workers + `@opennextjs/cloudflare`，新增可复用的预览、部署和环境类型生成脚本。
- Next.js 及配套 ESLint 包从 `15.5.2` 升级到 `15.5.18`，满足 OpenNext 的最低兼容版本要求。
- 三个服务端 API Route 移除显式 Edge Runtime 声明，改由 OpenNext 在启用 `nodejs_compat` 的 Workers 运行时中适配执行。
- 为《夏日杂感》补充 AIGC 标识信息和 AI 生成内容声明。

### 🐛 Fix

- 移除文章筛选区域重复的底部分隔线，保留文章列表统一的行间边框与既有筛选间距。
- 导航定位解除对可读 Tailwind 类名的依赖。
- 下拉菜单动态间距改为可计算样式，保持运行时布局正确。
- 移除无效的远程 Geist 字体依赖，避免字体加载影响页面渲染。
- 将 Steam API 密钥和用户 ID 移至服务端环境变量，并改用 HTTPS 请求上游接口，避免在客户端模块中硬编码敏感配置。
- 为 Steam 接口补充响应类型、JSON 与状态校验，配置缺失和上游异常时分别返回明确的 `503`、`502` 响应。
- 强化随机头像接口的来源地址、内容类型和失败状态校验，使用流式响应并禁止缓存异常结果。
- 首页增加头像加载失败占位以及 Steam 数据加载、错误状态，避免接口异常阻断非 Steam 游戏内容展示。
- 修复 `next-themes` 与 StyleX 根据 `resolvedTheme` 生成不同首帧属性导致的 hydration mismatch。
- 在 React 水合前同步 StyleX 深色主题类，并为主题按钮提供稳定的服务端占位，避免整页挂载门和主题闪烁。
- 修复开发服务运行期间执行生产构建后，热更新持续写入缺失的 `.next/static/development` 并触发 `_buildManifest.js.tmp.*` ENOENT 的问题。

### 🧰 Chore

- 删除 Tailwind CSS、SCSS Modules、Iconify Tailwind、classnames 相关依赖与配置。
- 更新 README 和组件文档中的样式用法说明。
- 删除重复的 `/about` 页面及其独占样式，首页继续承担个人介绍与技术栈展示。
- 删除仅用于组件演示的 `/storybook` 页面、DropdownMenu 组件及相关图标与导出。
- 拆分 Steam 服务端请求模块，并清理未使用的头像客户端请求封装。
- 增加 MDX、frontmatter 与 Markdown AST 处理依赖，并补充 `lint`、`typecheck` 脚本。
- 更新 README，记录文章创建、草稿预览、Git 发布流程和 `NEXT_PUBLIC_SITE_URL` 配置。
- 同步 TypeScript include 配置以识别 `.next-dev/types`，并将 `/.next-dev/` 加入 Git 忽略规则。
- 将 `.next-dev/**` 加入 ESLint 全局忽略，避免 lint 扫描 Turbopack 开发产物。
- 新增 `open-next.config.ts` 与 `wrangler.jsonc`，配置 Worker 入口、静态资产绑定、Node.js 兼容标志和可观测性。
- 固定项目包管理器为 `pnpm@10.15.1`，移除作为运行时依赖安装的 pnpm，并忽略 `.open-next/`、`.wrangler/` 构建产物。
- 引入 `@opennextjs/cloudflare@1.20.1` 与 `wrangler@4.111.0`，由 pnpm 同步更新锁文件。

### ✅ Verify

- 文章列表分隔线修复通过 `pnpm.cmd typecheck`、`pnpm.cmd lint` 与 `git diff --check` 检查。
- TypeScript、ESLint、Stylelint、Turbopack 生产构建与 CodeGraph 同步全部通过。
- `package.json`、`pnpm-lock.yaml`、CHANGELOG 内容与全仓 `git diff --check` 检查通过。
- 当前完整工作区通过 Turbopack 生产构建，生成首页、404、三个 API、文章列表、已发布文章详情、RSS 与 Sitemap，且不包含 `/about`、`/storybook` 和草稿文章路由。
- 头像悬停加速与反向归位逻辑通过检查：悬停阶段保持 `0-900deg/s` 正向加速，移出阶段单调反向回到上一个完整旋转锚点。
- ESLint、TypeScript、`git diff --check` 与 Turbopack 生产构建通过。
- 开发与生产输出目录隔离配置通过验证，生产构建生成有效 `.next/BUILD_ID`，完成阶段未启动开发服务器且 3000 端口无监听。
- 启动开发环境生成 `.next-dev` 后，ESLint、TypeScript 与 `git diff --check` 再次通过。
- 构建产物确认主题按钮首帧使用稳定占位，水合前脚本逐个同步 StyleX 深色主题类。
- 生产构建仍提示 Browserslist 数据已过期，以及 Edge Runtime 会禁用对应页面静态生成；均为非阻塞提示。
- `pnpm.cmd typecheck`、`pnpm.cmd install --frozen-lockfile` 与 `git diff --check` 检查通过；排除 `.open-next/**`、`.wrangler/**` 生成目录后，项目源代码 ESLint 检查通过。
- OpenNext 生产构建通过，成功生成 `.open-next/worker.js`、12 个静态页面和三个动态 API Route。
- `wrangler deploy --dry-run` 通过，正确识别 41 个静态资产与 `ASSETS` binding，未执行真实上传或部署。
- Cloudflare 使用旧提交 `7ccf0c7` 构建时未安装 OpenNext 依赖；发布前需提交并推送本窗口的迁移文件，再触发 Workers Builds。
- 标准 `pnpm.cmd lint` 当前会扫描已生成的 `.open-next/` 代码并触发 ESLint 规则错误；该问题不影响 OpenNext 构建，但后续应将生成目录加入 ESLint 全局忽略。
