# CHANGELOG

## v.0.2.0 (2026-07-13 ~ 2026-07-17)

### 📦 Version

- 项目版本从 0.1.0 升级到 0.2.0。

### 🎉 Feat

- 将 Tailwind CSS 样式体系完整迁移到 StyleX。
- 接入 StyleX 浅色/深色主题，并支持 Turbopack 构建时 CSS 提取。
- 使用本地 SVG 图标替换 Iconify Tailwind 图标，并为组件提供类型化 StyleX 样式接口。
- 为首页头像增加掘金风格的悬停旋转，使用 `250ms` 意图延迟和 `cubic-bezier(.34, 0, .84, 1)`，在 `1800ms` 内从 `60deg/s` 加速到 `900deg/s`。

### 🐛 Fix

- 导航定位解除对可读 Tailwind 类名的依赖。
- 下拉菜单动态间距改为可计算样式，保持运行时布局正确。
- 移除无效的远程 Geist 字体依赖，避免字体加载影响页面渲染。
- 将 Steam API 密钥和用户 ID 移至服务端环境变量，并改用 HTTPS 请求上游接口，避免在客户端模块中硬编码敏感配置。
- 为 Steam 接口补充响应类型、JSON 与状态校验，配置缺失和上游异常时分别返回明确的 `503`、`502` 响应。
- 强化随机头像接口的来源地址、内容类型和失败状态校验，使用流式响应并禁止缓存异常结果。
- 首页增加头像加载失败占位以及 Steam 数据加载、错误状态，避免接口异常阻断非 Steam 游戏内容展示。

### 🧰 Chore

- 删除 Tailwind CSS、SCSS Modules、Iconify Tailwind、classnames 相关依赖与配置。
- 更新 README 和组件文档中的样式用法说明。
- 删除重复的 `/about` 页面及其独占样式，首页继续承担个人介绍与技术栈展示。
- 删除仅用于组件演示的 `/storybook` 页面、DropdownMenu 组件及相关图标与导出。
- 拆分 Steam 服务端请求模块，并清理未使用的头像客户端请求封装。

### ✅ Verify

- TypeScript、ESLint、Stylelint、Turbopack 生产构建与 CodeGraph 同步全部通过。
- `package.json`、`pnpm-lock.yaml`、CHANGELOG 内容与全仓 `git diff --check` 检查通过。
- 当前完整工作区通过 Turbopack 生产构建，生成路由仅保留首页、404 与三个 API 路由，已不再包含 `/about` 和 `/storybook`。
- 头像贝塞尔加速与 Hermite 归正曲线数值采样通过，角速度保持在 `0-900deg/s`，无反转或速度超限。
- 生产构建仍提示 Browserslist 数据已过期，以及 Edge Runtime 会禁用对应页面静态生成；均为非阻塞提示。
