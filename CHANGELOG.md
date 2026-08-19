# Changelog

本文件记录 Game Guide Hub 对用户、开发者、运维和兼容性有意义的变更。格式遵循
[Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本遵循
[Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### Added

- Alpha 1.0 绝区零工作区：新增攻略详情、资讯中心、全局本地搜索、收藏配队、最近浏览与完整设置控制台。
- 角色详情补充动作演示占位、攻略摘要、版本变更、分享链接与培养信息；活动中心新增主活动 Banner 与本地收藏。
- 新增共享 `Banner`、`ScrollArea` 组件，扩展 8px 令牌、玻璃层级和 reduced-motion / 平衡性能模式。
- 新增 `shared/search` 与 `shared/mock/teams`，为未来服务端搜索和队伍模块保留稳定数据契约。

- Phase 1 Enterprise Project Foundation：初始化 pnpm/Turborepo
  Monorepo、Desktop/API/Worker 运行时骨架、共享包、设计 Token、Radix UI
  primitives、Storybook、Vitest、Playwright、CI、Husky 与 Commitlint。
- 建立项目总纲、架构、前后端、设计系统、数据库、API、编码、命名、Git、测试、评审与 AI
  Prompt 工作流的文档基线。
- 定义面向 Desktop、API、Worker、共享包、未来 Web/Admin/Mobile 与插件 SDK 的 Monorepo 目标结构。
- 定义模块化单体、Electron 进程隔离、PostgreSQL 事实源、Redis/BullMQ 降级和可回滚发布策略。
- 定义明暗双主题、语义 Token、桌面布局、动效、Glass、图标与 WCAG 2.2 AA 基线。

### Changed

- Header 全局搜索改为统一本地索引，支持角色、攻略、活动、资讯、版本、音擎和驱动盘。
- 收藏状态扩展到角色、攻略、活动和配队，并通过 Zustand persist 保留在本地设备。
- 精简根目录文档结构：根级 15 份规范合并为 `docs/` 下 7 份文档（master / architecture / frontend /
  data-api / engineering / workflow / development），README 维护唯一入口索引；移除根级
  `STANDARDS.md` 单文件版，内容已全部并入 `docs/` 结构。

### Deprecated

- 无。

### Removed

- 无。

### Fixed

- 无。

### Security

- 文档基线要求 Electron sandbox/IPC allowlist、OIDC
  PKCE、最小权限、签名制品、Secret 扫描、SBOM 与提示注入防护。
- Electron 运行时升级到 `39.8.1+` 安全基线；CI 新增生产依赖高危漏洞与 peer dependency 门禁。

## 发布维护规则

- 发布时将 Unreleased 内容移动到 `## [X.Y.Z] - YYYY-MM-DD`；
- 仅记录用户/开发者/运维可感知变化，不记录每个内部 commit；
- Breaking change 在对应条目明确迁移、支持窗口和回滚；
- Security 条目在协调披露允许前不公开可利用细节；
- 版本链接在远程仓库 URL 确定后补充。
