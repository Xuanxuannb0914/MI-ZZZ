# Game Guide Hub

> 面向游戏攻略、Wiki、Build、AI 助手、社区资源与未来插件生态的生产级桌面平台。

## 当前状态

本仓库当前处于 **Alpha 1.0 / Zenless Zone Zero Workspace**
阶段。Desktop 端已经包含启动体验、游戏中心、绝区零工作区、角色/攻略/资讯/活动/每日养成/收藏/设置与本地全局搜索；业务数据使用可离线浏览的中文 Mock，未来可在不改变 UI 契约的前提下替换为服务端数据。

## 产品定位

Game Guide
Hub 是一个内容优先、键盘友好、可扩展的桌面工作台。它借鉴现代游戏启动器的沉浸感、协作产品的信息组织和专业工具的交互效率，但不复制任何产品的视觉资产或行为。

核心体验边界：

- 聚合可验证的攻略、Wiki、Build 与社区资源；
- 提供带来源引用、可审计且可降级的 AI 辅助能力；
- 支持离线阅读、深链接、多窗口与桌面系统集成；
- 以能力授权、版本兼容和进程隔离为基础演进插件生态；
- 为未来 Web、管理端和移动端复用契约、设计 Token 与领域知识。

## 文档导航

| 文档                                             | 负责回答                                           |
| ------------------------------------------------ | -------------------------------------------------- |
| [PROJECT_MASTER.md](./PROJECT_MASTER.md)         | 产品边界、质量目标、里程碑、风险和全局决策是什么？ |
| [ARCHITECTURE.md](./ARCHITECTURE.md)             | 系统如何分层、部署、扩展和回滚？                   |
| [FRONTEND.md](./FRONTEND.md)                     | Electron/React 客户端如何组织、通信和保障体验？    |
| [BACKEND.md](./BACKEND.md)                       | NestJS 服务、任务与实时能力如何设计？              |
| [UI_SYSTEM.md](./UI_SYSTEM.md)                   | 视觉 Token、组件、动效和无障碍规则是什么？         |
| [docs/architecture.md](./docs/architecture.md)   | 客户端路由、布局和场景生命周期如何组织？           |
| [docs/design-system.md](./docs/design-system.md) | 设计令牌与玻璃材质如何使用？                       |
| [docs/ui-guidelines.md](./docs/ui-guidelines.md) | 信息层级、视觉与动效规则是什么？                   |
| [docs/development.md](./docs/development.md)     | 如何运行、验证和扩展当前客户端与内容模型？         |
| [DATABASE.md](./DATABASE.md)                     | 数据所有权、迁移、索引、备份和一致性如何治理？     |
| [API_GUIDELINE.md](./API_GUIDELINE.md)           | REST、WebSocket、错误、分页和兼容性契约是什么？    |
| [CODING_RULE.md](./CODING_RULE.md)               | 代码边界、类型安全、工具职责和安全规则是什么？     |
| [NAMING_RULE.md](./NAMING_RULE.md)               | 文件、类型、接口、数据库和事件如何命名？           |
| [GIT_RULE.md](./GIT_RULE.md)                     | Git Flow、提交、发布和回滚如何执行？               |
| [TESTING_RULE.md](./TESTING_RULE.md)             | 测试层级、门禁、覆盖率和非功能验证是什么？         |
| [REVIEW_RULE.md](./REVIEW_RULE.md)               | 设计/代码/安全评审标准与责任如何定义？             |
| [PROMPT_GUIDELINE.md](./PROMPT_GUIDELINE.md)     | AI 辅助开发如何限定上下文、权限和验收？            |
| [CHANGELOG.md](./CHANGELOG.md)                   | 面向使用者的可见变更如何记录？                     |

## 决策优先级

发生冲突时按以下顺序裁决：安全与合规 > 数据完整性 > 对外契约兼容性 > 可访问性 > 正确性 > 可维护性 > 性能 > 视觉偏好。具体文档覆盖通用文档；已批准 ADR 覆盖历史说明，但必须同步回写受影响文档。

## 开发入口

根级命令统一为
`pnpm install`、`pnpm dev`、`pnpm build`、`pnpm test`、`pnpm lint`、`pnpm typecheck`、`pnpm e2e` 和
`pnpm clean`。安装、调试、贡献和故障处理见 [docs/development.md](./docs/development.md)。

本地 Web 预览默认地址为 `http://127.0.0.1:5173/#/startup`；启动流程为
`#/startup → #/games → #/zzz`。桌面端通过同一 Renderer 架构运行，Three.js 仅用于启动场景。

## 贡献

开始工作前阅读 [CODING_RULE.md](./CODING_RULE.md)、[GIT_RULE.md](./GIT_RULE.md)
与对应子系统文档。任何跨边界、新运行时依赖、数据库破坏性迁移、权限扩张或公共 API 变更都必须先提交 ADR/RFC。

## 许可证与治理

许可证、代码所有者、支持渠道、隐私政策和第三方内容授权尚待组织决策。相关决策完成前，不得公开分发二进制文件或采集真实用户数据。
