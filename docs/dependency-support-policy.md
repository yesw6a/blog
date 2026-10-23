# 依赖版本支持政策

## 1. 为什么需要这份文档

2026-10-22 的生产构建失败不是代码回归，而是依赖大版本过保：

```text
ERROR Next.js version 15.5.18 is not supported by the Next.js team.
```

OpenNext 在构建前会调用 `checkNextVersionSupport()`（`@opennextjs/aws` 的 `dist/build/helper.js`），该函数只取**主版本号**，与硬编码的发布日期表比较，判断「发布日 + 2 年」是否已过：

- `NEXT_RELEASE_DATES = { 16: "2025-10-21", 15: "2024-10-21", ... }`
- 不支持时直接 `process.exit(1)`，除非显式传入 `--dangerouslyUseUnsupportedNextVersion`

因为检查只看主版本，**升级补丁号无法通过该门禁**：Next 15 的支持窗口在 2026-10-21 结束，之后任何 `15.5.x` 都会失败。这类故障可被静态预测，因此用巡检脚本提前暴露，而不是等它在某次推送后突然变红。

## 2. 支持期口径

Next.js 官方支持策略：每个主版本自发布日起支持 **2 年**。本仓库采用同一口径：

| 主版本 | 发布日期 | 支持截止 |
| --- | --- | --- |
| 14 | 2023-10-26 | 2025-10-26 |
| 15 | 2024-10-21 | 2026-10-21 |
| 16 | 2025-10-21 | 2027-10-21 |

新主版本发布后，需要同步更新 `scripts/check-dependency-support.mjs` 里的 `nextReleaseDates` 表；脚本在遇到未知主版本时会以失败退出，避免"表没更新所以没人发现"。

## 3. 巡检命令

```bash
pnpm deps:policy
```

- 剩余 **≥ 90 天**：打印剩余天数，退出码 `0`
- 剩余 **< 90 天**：打印告警，退出码 `1`（视为需要排期升级）
- **已过期**：打印过期日，退出码 `1`
- 版本号无法解析或发布日期表缺少该主版本：打印原因，退出码 `1`

建议与 `pnpm typecheck`、`pnpm lint`、`pnpm content:check` 一起，在每次发布前手动执行一次。当前仓库没有 CI workflow，构建由 Cloudflare Workers Builds 在推送后触发，因此这项检查暂时是**发布纪律**的一部分，而不是自动化关卡。

## 4. 升级流程

1. 先跑 `pnpm deps:policy` 确认剩余窗口，确定目标主版本。
2. 依赖成组升级，不要只动 `next`：`next`、`eslint-config-next`、`@next/eslint-plugin-next` 同版本；`react` / `react-dom` / `@types/react` / `@types/react-dom` 跟随 Next 内置的 React 版本。
3. 版本线迁移与编程模型迁移分开做。例如 Next 16 的 Cache Components 属于缓存语义变更，应当独立立项，不与版本升级混在同一次发布里。
4. 升级后核对产物，而不是只看"构建通过"：
   - 用升级前后的 `.next/prerender-manifest.json` 比对预渲染路由清单，确认没有路由从静态退化为动态
   - 检查 `.next/static/**/*.css` 是否存在 `@stylex` 残留，并比对唯一 `.x*` 规则数量（StyleX 提取断裂时构建可能仍然成功）
5. 记录到 `CHANGELOG.md`，并更新本文档第 2 节的表格。

## 5. 构建命令归仓约定

生产构建/部署的入口固定为仓库脚本，Cloudflare Workers Builds 后台只允许保留一行转发命令：

| 后台设置 | 值 |
| --- | --- |
| Build command | `pnpm build:cf` |
| Deploy command | `pnpm deploy:cf` |

`build:cf` = `opennextjs-cloudflare build`，`deploy:cf` = `opennextjs-cloudflare deploy`。

约束：

- 不得用普通 `next build` 配合直接 `wrangler deploy` 取代 OpenNext CLI，否则 `.open-next/cache` 不会进入静态资源。
- 构建行为（参数、缓存策略、跳过项）必须体现在仓库脚本里，可评审、可回滚；后台不得承载额外参数。
- 不要长期依赖 `--dangerouslyUseUnsupportedNextVersion`。它只用于"当天必须发布"的受控止血，且止血时必须同步升级到该主版本的最新补丁，并在下次合并中移除该 flag。

## 6. 当前状态

- Next.js：`16.4.2`（主版本 16，支持至 2027-10-21）
- React / React DOM：`19.3.1`
- `sharp`：由 `pnpm.overrides` 固定为 `0.35.5`（`0.34.x` 无 CVE-2026-96889 修复版）
- 版本巡检：`pnpm deps:policy`
