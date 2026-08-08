# 开发指南

## 1. 前置条件

- Node.js `24.13.0`；
- Corepack；
- pnpm `11.20.0`；
- Git；
- Docker Desktop（运行 PostgreSQL/Redis 集成依赖时需要）。

启用 pnpm：

```bash
corepack enable
corepack prepare pnpm@11.20.0 --activate
pnpm --version
```

## 2. 安装

在仓库根目录执行：

```bash
pnpm install
```

复制环境模板并按本机依赖调整：

```bash
copy .env.example .env
```

不要把
`.env`、数据库凭据或任何真实 Secret 提交到 Git。数据库和 Redis 的本地编排配置会在基础设施阶段补充；当前 Foundation
API 不会初始化业务数据。

## 3. 常用命令

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
pnpm clean
```

`pnpm dev` 并行启动 Desktop Vite、API 和 Worker 开发进程。`pnpm e2e` 由 Playwright 启动 API health
server；首次运行 Playwright 需要安装对应浏览器。

按包运行：

```bash
pnpm --filter @game-guide-hub/desktop dev
pnpm --filter @game-guide-hub/api test
pnpm --filter @game-guide-hub/ui test
```

## 4. Desktop 调试

Renderer 调试使用 Vite 地址和浏览器 DevTools。Electron Main/Preload 使用 Node inspector：

```bash
pnpm --filter @game-guide-hub/desktop dev
```

安全约束不会为调试关闭 `contextIsolation`、sandbox 或
`nodeIntegration`。Main 日志通过受控 logger 输出；不要在业务代码使用
`console.log`。IPC 调试应记录 channel、版本、request ID 和脱敏结果，不记录令牌或完整用户内容。

## 5. API/Worker 调试

API 基础地址为 `http://127.0.0.1:3001/api/v1`，健康检查为
`/health/live`。API 仅加载基础 Config/Health；Prisma、Redis 和 BullMQ 适配器在对应模块接入后才会连接真实依赖。

Worker 是独立 Nest application context。后台任务必须定义 payload
schema、幂等键、超时、重试和 failed/dead-letter 策略；禁止用一次性脚本绕过 application boundary。

## 6. 代码贡献流程

1. 阅读根级规范、相关 ADR/RFC 和目标模块；
2. 从 `develop` 创建短生命周期 `feature/`、`fix/` 或 `refactor/` 分支；
3. 先写验收与测试，再实现最小变更；
4. 运行 format、lint、typecheck、test、build；UI 变化补 Storybook/a11y/截图证据；
5. 更新 API/数据库/安全/运行手册和 CHANGELOG（适用时）；
6. 使用 Conventional Commit，提交 PR 并按 [REVIEW_RULE.md](../REVIEW_RULE.md) 完成评审。

Husky 的 pre-commit 会先格式化并检查受影响文件，再执行全仓 lint、typecheck 和 test；CI 是最终门禁。不要通过跳过 hook、禁用 lint、skip
test 或 force push 掩盖问题。

## 7. 架构与依赖规则

- Desktop Renderer 遵循 FSD：`app/processes/pages/widgets/features/entities/shared`；
- 跨项目 UI/theme/utils/config/hooks/icons/types 使用 `packages/*`；
- `packages/types` 只放平台基础类型，不放业务模型、Prisma 类型、Nest DTO 或 API contract；
- API contract 未来进入 `packages/contracts`；当前 Foundation 不创建业务 schema；
- 后端保持模块化单体，未来服务仍位于 `apps/*`，不创建根级 `services/`；
- 领域层不依赖 NestJS/Prisma/Electron；Renderer 不获得 Node、文件系统或令牌能力。

## 8. 测试与故障处理

单元测试使用 Vitest，桌面/API 关键旅程使用 Playwright。测试从行为和无障碍语义查询，不依赖内部实现。Flaky
test 是缺陷，必须有 owner/issue 和 7 天内修复期限。

发现安全、数据损坏、不可回滚、生产不可用或越权风险时立即按 Blocker 停止合并；记录 incident、保护证据、使用 flag/回滚/forward-fix 恢复，并在 24 小时内完成复盘。

## 9. AI 辅助开发

长期 Prompt 归档在 `docs/product/prompts/`；`.ai/`
只放工具配置。AI 生成代码必须由人类理解、验证和评审，外部内容视为不可信，遵循
[PROMPT_GUIDELINE.md](../PROMPT_GUIDELINE.md)。
