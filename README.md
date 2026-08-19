# Game Guide Hub

> 面向游戏攻略、Wiki、Build、AI 助手、社区资源与未来插件生态的生产级桌面平台。

## 当前状态

本仓库当前处于 **Alpha 1.0 / Zenless Zone Zero Workspace**
阶段。Desktop 端已经包含启动体验、游戏中心、绝区零工作区，角色/攻略/资讯/活动/每日养成/收藏/设置与本地全局搜索，以及星穹铁道本地抽卡记录提取（仅读取本地缓存并复制到剪贴板，无任何网络上传）。业务数据使用可离线浏览的中文 Mock，未来可在不改变 UI 契约的前提下替换为服务端数据。

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

| 文档                                           | 负责回答                                     |
| ---------------------------------------------- | -------------------------------------------- |
| [docs/master.md](./docs/master.md)             | 产品边界、质量目标、里程碑、风险和全局决策？ |
| [docs/architecture.md](./docs/architecture.md) | 系统如何分层、部署、扩展和回滚？             |
| [docs/frontend.md](./docs/frontend.md)         | 前端与设计系统、组件、动效和无障碍如何组织？ |
| [docs/data-api.md](./docs/data-api.md)         | 数据库治理与 REST/WebSocket 契约是什么？     |
| [docs/engineering.md](./docs/engineering.md)   | 编码、命名、测试与评审规范是什么？           |
| [docs/workflow.md](./docs/workflow.md)         | Git 流程与 AI 辅助开发如何执行？             |
| [docs/development.md](./docs/development.md)   | 如何运行、验证和扩展当前客户端与内容模型？   |
| [CHANGELOG.md](./CHANGELOG.md)                 | 面向使用者的可见变更如何记录？               |

## 决策优先级

发生冲突时按以下顺序裁决：安全与合规 > 数据完整性 > 对外契约兼容性 > 可访问性 > 正确性 > 可维护性 > 性能 > 视觉偏好。具体文档覆盖通用文档；已批准 ADR 覆盖历史说明，但必须同步回写受影响文档。

## 开发入口

根级命令统一为
`pnpm install`、`pnpm dev`、`pnpm build`、`pnpm test`、`pnpm lint`、`pnpm typecheck`、`pnpm e2e` 和
`pnpm clean`。安装、调试、贡献和故障处理见 [docs/development.md](./docs/development.md)。

本地 Web 预览默认地址为 `http://127.0.0.1:5173/#/startup`；启动流程为
`#/startup → #/games → #/zzz`。桌面端通过同一 Renderer 架构运行，Three.js 仅用于启动场景。

## 贡献

开始工作前阅读 [docs/engineering.md](./docs/engineering.md)、[docs/workflow.md](./docs/workflow.md)
与对应子系统文档。任何跨边界、新运行时依赖、数据库破坏性迁移、权限扩张或公共 API 变更都必须先提交 ADR/RFC。

## 许可证与治理

许可证、代码所有者、支持渠道、隐私政策和第三方内容授权尚待组织决策。相关决策完成前，不得公开分发二进制文件或采集真实用户数据。
