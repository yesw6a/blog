# CHANGELOG

## v.0.2.0 (2026-07-13 ~ 2026-07-17)

### 📦 Version

- 项目版本从 0.1.0 升级到 0.2.0。

### 🎉 Feat

- 将 Tailwind CSS 样式体系完整迁移到 StyleX。
- 接入 StyleX 浅色/深色主题，并支持 Turbopack 构建时 CSS 提取。
- 使用本地 SVG 图标替换 Iconify Tailwind 图标，并为组件提供类型化 StyleX 样式接口。

### 🐛 Fix

- 导航定位解除对可读 Tailwind 类名的依赖。
- 下拉菜单动态间距改为可计算样式，保持运行时布局正确。
- 移除无效的远程 Geist 字体依赖，避免字体加载影响页面渲染。

### 🧰 Chore

- 删除 Tailwind CSS、SCSS Modules、Iconify Tailwind、classnames 相关依赖与配置。
- 更新 README 和组件文档中的样式用法说明。

### ✅ Verify

- TypeScript、ESLint、Stylelint、Turbopack 生产构建与 CodeGraph 同步全部通过。
- `package.json`、`pnpm-lock.yaml` 与本次新增的 CHANGELOG 内容检查通过；全仓 `git diff --check` 仍会报告用户原有 `.prettierignore`、Steam API 与 `text-keyword` 类型文件中的行尾空白，非本次版本更新引入。
