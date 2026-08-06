# CHANGELOG

## v.0.3.0 (2026-08-03 ~ 2026-08-07)

### 📦 Version

- 项目版本从 `0.2.3` 升级到 `0.3.0`。
- 本发布窗口在新增文章、MDX 构建错误修复和发布前内容校验加固之外，新增可配置的网站访问统计能力，整体属于向后兼容的 Minor 级功能更新。
- 后续补充的网站图标设计与生成流程属于向后兼容的 Patch 级视觉改进，未超过本窗口已覆盖的 Minor 级别，版本继续保持 `0.3.0`。
- 本次文章标签折叠属于向后兼容的功能增强，文章阅读样式优化属于 Patch 级视觉改进，均未超过本窗口已覆盖的 Minor 级别，版本继续保持 `0.3.0`。
- 本次全局页脚备案链接属于向后兼容的 Patch 级站点信息增强，未超过本窗口已覆盖的 Minor 级别，版本继续保持 `0.3.0`。
- 本次文章目录当前位置提示属于向后兼容的 Minor 级阅读功能增强，未超过本窗口已覆盖的 Minor 级别，版本继续保持 `0.3.0`。
- 本次目录锚点平滑滚动、活动指示器位移动画和长目录跟随可见属于向后兼容的阅读体验增强，未超过本窗口已覆盖的 Minor 级别，版本继续保持 `0.3.0`。
- 本次隐藏文章目录原生滚动条属于向后兼容的 Patch 级视觉修复，未超过本窗口已覆盖的 Minor 级别，版本继续保持 `0.3.0`。
- 本次首页内容化重构、R2 每日头像缓存和 bsz 访问统计迁移均属于向后兼容的 Minor 级功能调整，未超过本窗口从 `0.2.3` 升至 `0.3.0` 已覆盖的级别，版本继续保持 `0.3.0`。

### 🎉 Added

- 发布 3 篇 AI 资料整理与感悟文章，主题涵盖多智能体协作、AI 数学证明与开源模型产业链，以及 OpenRouter 模型调用趋势。
- 新增 bsz 全站 UV/PV 统计组件，在生产环境随客户端路由变化上报 pathname，并在页脚展示中文格式的独立访客与累计访问量。
- 新增由 `C` 与真实“兮”字轮廓组成的站点图标，并同步提供 SVG、Apple Touch Icon 与多尺寸 favicon。
- 文章标签较多时新增“更多标签 / 收起标签”交互，移动端默认显示 6 个、桌面端显示 10 个，并保证当前筛选标签始终可见及键盘状态可识别。
- 全局页脚新增“萌ICP备20268082号”外部备案链接，支持移动端自然换行、44px 触控高度、悬停反馈与键盘焦点状态，并补充新窗口链接安全属性。
- 全局页脚新增“独立访客 / 累计访问”公开数据行，使用制表数字、中文数字格式和稳定占位降低 bsz 异步加载造成的布局偏移。
- 首页新增内容优先的个人介绍、最近文章与主要写作主题区域，主题数量由已发布文章标签自动统计，并为移动端、键盘焦点和减少动画偏好提供适配。
- 每日头像新增 Cloudflare R2 持久化缓存、条件写入、ETag/304 响应、最近可用对象回退和 30 天生命周期清理。
- 文章详情页目录新增 Scrollspy 当前位置提示，随 H2/H3 阅读进度更新活动项，并通过强调色、字重、左侧指示线与 `aria-current="location"` 提供可见且可访问的状态反馈。
- 文章目录锚点新增原生平滑滚动，长目录会在当前章节离开可视范围时仅滚动目录容器，并在减少动画偏好下回退为即时滚动。

### 🔄 Changed

- 将 `content:check` 扩展为逐篇使用项目同款 Markdown、MDX 与 GFM 解析器校验文章语法，同时保留字符串形式 `style` 属性检查，并在失败时报告文件、行号和列号。
- 补充自动写作的 MDX 安全规则，优先使用纯 Markdown 或语义化 `<strong>`，并明确任何检查失败时禁止 commit 和 push。
- 在全局页脚统一挂载 bsz 统计组件，只发送站点来源与 pathname，并通过本地匿名身份令牌保持 UV 统计连续性。
- 将站点图标调整为低饱和珍珠灰与银蓝 Liquid Glass 近似风格，保留玻璃 `C` 元素，并从项目内置中文字体提取准确的“兮”字路径。
- 新增无第三方图像依赖的图标生成脚本，通过 4 倍超采样输出 180px PNG 以及包含 16/32/48px 图像帧的 ICO。
- 文章标签改为按使用频率降序排列，同频时按中文 locale 排序，使折叠状态优先展示更常用的主题。
- 收敛长文章标题字号并调整摘要、元信息和详情标签节奏，同时统一 MDX 强调文本、章节分隔线、引用与图片的 StyleX 阅读样式。
- 首页由依赖客户端 Steam 请求的交互页面改为构建期静态内容页，直接展示最新文章与高频主题，减少首屏客户端状态和外部数据依赖。
- 每日头像从 D1 元数据与 R2 对象的双存储改为纯 R2，实现对既有 `daily/YYYY-MM-DD.*` 对象的兼容读取，并移除项目全部 D1 binding、migration 与统计 API。
- 网站统计从 Cloudflare Web Analytics 与自建 D1 全面迁移到 bsz，删除已不再使用的构建期 Token、服务端统计逻辑和远端 `blog-stats` 数据库。
- 将文章目录活动线从每项独立伪元素改为单一可移动指示器，通过可中断的 `transform` 与透明度过渡平滑表达章节切换，同时保留活动颜色、字重和 `aria-current` 语义。

### 🐛 Fixed

- 将 8 月 2 日和 8 月 3 日文章中脆弱的 `<span>` 与 Markdown 粗体混写统一改为合法的语义化 `<strong>`，修复 Cloudflare 在收集 `/articles/[slug]` 页面数据时因 JSX 标签缺少 `>` 而构建失败的问题。
- 隐藏文章目录独立滚动容器的浏览器原生滚动条，同时保留长目录的滚轮、触控板、触摸与程序化滚动能力，避免系统滚动轨道破坏目录的紧凑视觉。

### ✅ Verify

- `pnpm.cmd content:check`、`pnpm.cmd typecheck`、`pnpm.cmd lint`、`pnpm.cmd build` 与 `git diff --check` 检查通过。
- `pnpm.cmd exec opennextjs-cloudflare build` 通过，并成功生成 `.open-next/worker.js`。
- 图标生成脚本通过 ESLint；Apple Touch Icon 尺寸确认为 `180×180`，ICO 确认包含 `16×16`、`32×32` 与 `48×48` 三帧，Next.js 生产构建正确生成 `/icon.svg` 与 `/apple-icon.png`。
- 文章阅读与标签折叠改动通过目标文件 Prettier、`pnpm.cmd content:check`、`pnpm.cmd typecheck`、`pnpm.cmd lint`、`pnpm.cmd build` 与 `git diff --check`；生产构建成功生成 36 个静态页面。
- 页脚备案链接改动通过目标文件 Prettier、`pnpm.cmd typecheck`、`pnpm.cmd lint`、`pnpm.cmd build` 与 `git diff --check`；生产构建成功生成 36 个静态页面。
- 首页、bsz 统计与纯 R2 头像改动通过 `pnpm.cmd cf-typegen`、目标文件 Prettier、`pnpm.cmd typecheck`、`pnpm.cmd lint`、`pnpm.cmd build` 与 `git diff --check`；生产构建成功生成 36 个静态页面，路由清单中不再包含旧统计 API。
- Cloudflare R2 `blog-avatars` bucket 已验证可用，`daily/` 前缀的 30 天对象生命周期规则已启用。
- Cloudflare 远程 `blog-stats` D1 数据库 `42eb95d7-1b28-4bb7-9b10-408aaaedb349` 已永久删除，并通过远端 D1 列表确认不存在。
- 本次未重新完成 OpenNext 专用打包：Windows 上既有进程占用 `.open-next` 目录，构建在清理旧产物阶段因 `EPERM` 中止；项目发布继续由 GitHub CI/CD 触发。
- OpenNext 在 Windows 上仍提示推荐使用 WSL，Browserslist 数据仍提示过期；两项均为非阻塞警告。
- 文章目录当前位置提示通过目标文件 Prettier、`pnpm.cmd typecheck`、`pnpm.cmd lint` 与 `git diff --check`；本地 3000 端口仍由 `next start` 提供修改前的旧 `.next` 产物，需重新执行生产构建并重启后才能进行浏览器视觉复验。
- 文章目录平滑滚动改动通过目标文件 Prettier、`pnpm.cmd typecheck`、`pnpm.cmd lint` 与 `git diff --check`；未重新运行生产构建或浏览器视觉验证，仍需停止旧 `next start`、重新构建并启动后复验动效。
- 文章目录滚动条修复通过目标文件 Prettier、`pnpm.cmd typecheck`、`pnpm.cmd lint` 与 `git diff --check`；未重新运行生产构建或浏览器视觉验证，部署后需使用长目录确认滚动条不可见且目录仍可滚动。

## v.0.2.2 (2026-07-27 ~ 2026-07-31)

### 📦 Version

- 项目版本从 `0.2.1` 升级到 `0.2.2`。
- 本发布窗口包含新增文章内容、MDX 预渲染修复和构建前内容校验，均属于向后兼容的 Patch 级改进。

### 🎉 Added

- 发布 8 篇新文章，涵盖智能成本、开源模型、多智能体协作、模型密集发布、AI 安全与 Agent 落地等主题。
- 新增无依赖的 MDX 内容校验器，扫描文章中的字符串形式 `style` 属性，并在失败时输出文件路径与行号。

### 🔄 Changed

- 生产构建在执行 Next.js Turbopack 编译前先运行 `content:check`，让不受支持的 MDX 样式写法更早失败。
- 补充文章写作规则与发布检查清单，优先推荐 Markdown 语义或已注册的 MDX 组件，并要求检查主题适配、文字对比度与可访问性。

### 🐛 Fixed

- 将《Agent无处不在的那一天》中 8 处 HTML 字符串样式改为语义化 Markdown 强调，修复 React 在静态预渲染时因 `style` 属性类型错误导致的生产构建失败。

### ✅ Verify

- `pnpm.cmd content:check`、`pnpm.cmd typecheck`、`pnpm.cmd lint` 与 `pnpm.cmd build` 检查通过。
- 目标文章已成功完成静态预渲染；生产构建仍提示 Browserslist 数据已过期，该提示不阻塞构建。

## v.0.2.1 (2026-07-20 ~ 2026-07-24)

### 📦 Version

- 项目版本从 `0.2.0` 升级到 `0.2.1`。
- 本发布窗口包含文章写作规范、主题配色恢复、相邻文章卡片布局与字体渲染修复，均属于向后兼容的 Patch 级改进。
- 后续补充的文章目录浮动、列表切换性能、筛选布局、导航过渡和暗色主题配色调整仍属于 Patch 级改进，版本继续保持 `0.2.1`。

### 🎉 Added

- 新增统一的文章写作规则文档，集中说明文件命名、frontmatter、AIGC 标识、内容安全和发布检查清单。

### 🔄 Changed

- 公开文章推荐采用 `YYYY-MM-DD-short-topic.mdx` 命名，并在 README、草稿工作流和文章仓库错误提示中统一引用该规范。
- 浅色主题保留冷蓝强调色，暗色主题改用 `SteamAPI` 风格的紫色强调与操作令牌，并让首页 `SteamAPI` 链接显式跟随主题色。
- 将文章目录的粘性定位提升到目录侧栏，并限制视口内最大高度与独立滚动，保证长目录持续可用。
- 文章列表导航增加预取与无布局偏移的加载状态，搜索和标签筛选改为客户端 History 更新，减少页面切换等待感。

### 🐛 Fixed

- 移除相邻文章翻页卡片的垂直两端分布，使文章标题保持顶部对齐。
- 完善本地可变字体的 `100 900` 字重范围和字体格式声明，禁用合成字形，并将系统字体控件的非标准 `650` 字重调整为 `600`，减少浏览器 100% 缩放下的文字边缘毛刺。
- 为筛选生效状态使用独立样式，移除文章数量样式携带的顶部外边距，修复“清除筛选”按钮的垂直位置异常。
- 移除依赖 DOM 测量和 `findIndex` 的导航指示器计算，改用稳定的 StyleX 状态样式，修复 Turbopack 静态求值失败及切换时出现蓝点的问题。

### ✅ Verify

- `pnpm.cmd typecheck`、`pnpm.cmd lint` 与 `git diff --check` 检查通过。
- 当前完整工作区通过 `pnpm.cmd typecheck`、`pnpm.cmd lint` 与 `pnpm.cmd build`；暗色紫色文字在主背景上的对比度为 `6.71:1`。
- `pnpm.cmd exec stylelint src/app/globals.css` 仍报告 `src/app/globals.css:70` 原有的属性顺序问题；该问题与本发布窗口的字体改动无关。
- 生产构建仍提示 Browserslist 数据已过期，该提示不阻塞构建。
- 未启动本地开发服务器；文章页目录、列表切换、筛选按钮、导航过渡、暗色主题和字体边缘仍需在浏览器 100% 缩放下进行视觉复验。

## v.0.2.0 (2026-07-13 ~ 2026-07-17)

### 📦 Version

- 项目版本从 0.1.0 升级到 0.2.0。
- 本发布窗口新增文章系统、导航与头像交互、每日头像和开发输出隔离均属于 `0.2.0` 已覆盖的 Minor 级别，版本保持不变。
- 本次 Cloudflare 部署链由 Pages/`next-on-pages` 迁移至 Workers/OpenNext，属于当前发布窗口已覆盖的 Minor 级变更，项目版本继续保持 `0.2.0`。
- 本次文章生产环境修复、静态筛选调整和内容契约校验均属于 Patch 级变更，未超过当前窗口已覆盖的 Minor 级别，版本继续保持 `0.2.0`。
- 本次 OpenNext 静态增量缓存修复属于 Patch 级变更，未超过当前窗口已覆盖的 Minor 级别，项目版本继续保持 `0.2.0`。

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
- 将 `/articles` 改为构建期静态生成，搜索与标签筛选由客户端根据 `q`、`tag` URL 参数完成，避免 Cloudflare Worker 请求阶段读取本地文章目录。
- 将《夏日杂感》和《剑气长城的夏日剑心》规范为 ASCII kebab-case 的 `.mdx` 文件，并补齐文章 frontmatter，同时保留正文与 AIGC 元数据。

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
- 修复 `/articles` 在 OpenNext Cloudflare 生产环境动态渲染时访问 Node 文件系统并触发服务端异常的问题。
- 为 OpenNext Cloudflare 启用静态资产增量缓存，并限制文章详情仅接受构建期生成的 slug，避免部署后 Worker 回退读取本地文件系统导致文章相关静态路由返回 `500`。
- 修复客户端切换文章筛选参数后搜索输入框仍保留旧值的问题。

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
- 为文章仓库增加不受支持的 `.md` 文件校验，构建时提示改用 ASCII kebab-case `.mdx` 并补齐必要 frontmatter。
- 将 `.open-next/**` 与 `.wrangler/**` 加入 ESLint 全局忽略，避免生成产物干扰源代码检查。

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
- OpenNext 生产构建通过，成功生成 `.open-next/worker.js`、14 个静态页面和三个动态 API Route。
- `wrangler deploy --dry-run` 通过，正确识别 41 个静态资产与 `ASSETS` binding，未执行真实上传或部署。
- Cloudflare 使用旧提交 `7ccf0c7` 构建时未安装 OpenNext 依赖；发布前需提交并推送本窗口的迁移文件，再触发 Workers Builds。
- 文章生产修复通过 `pnpm.cmd typecheck`、`pnpm.cmd lint`、`pnpm.cmd build`、`pnpm.cmd exec opennextjs-cloudflare build` 与 `git diff --check` 检查。
- 构建产物确认 `/articles` 为静态页面，《夏日杂感》《剑气长城的夏日剑心》和既有公开文章均生成 SSG 路由，草稿文章未进入生产 prerender 清单。
- 隔离 OpenNext 构建确认已生成静态增量缓存文件，编译后的配置使用 `cf-static-assets-incremental-cache`。
- OpenNext 在 Windows 上仍提示建议使用 WSL，Browserslist 数据也提示过期；两项均为非阻塞警告。
