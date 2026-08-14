# 总体架构

| 属性     | 值                                           |
| -------- | -------------------------------------------- |
| 状态     | Baseline v1.0                                |
| 所有者   | Architecture Guild                           |
| 适用范围 | Monorepo、运行时边界、部署、扩展性与插件平台 |

## 1. 架构风格

系统采用 **模块化单体后端 + 多进程桌面客户端 + 异步 Worker**。领域按 bounded context 组织；后端在同一代码库和初始部署单元内保持事务与运维简单，Worker 独立扩缩容。此方案保留 Clean Architecture 的依赖方向，不承担早期微服务的网络、数据一致性和部署成本。

```text
Desktop Renderer -> Preload Contract -> Electron Main -> OS capabilities
       |
       +---------- HTTPS / WSS ----------> API (NestJS)
                                               |
                         +---------------------+------------------+
                         |                     |                  |
                    PostgreSQL              Redis            Object Store
                         ^                     ^
                         |                     |
                      Worker <------------ BullMQ
```

## 2. 目标目录架构

以下是 Foundation 通过后应创建的完整目标树。`future/` 标记不代表立即生成项目，只表示约定位置与边界。

```text
game-guide-hub/
├─ apps/
│  ├─ desktop/
│  │  ├─ src/
│  │  │  ├─ main/                 # Electron 主进程；窗口、更新、协议、OS 能力
│  │  │  ├─ preload/              # 版本化、最小化、类型安全 IPC bridge
│  │  │  └─ renderer/             # React 应用
│  │  │     ├─ app/               # Bootstrap、providers、router、shell
│  │  │     ├─ features/          # 垂直功能切片
│  │  │     ├─ entities/          # 可复用领域展示模型，不含服务端规则
│  │  │     ├─ widgets/           # 页面级组合区块
│  │  │     └─ shared/            # 仅本应用共享；assets/config/testing
│  │  ├─ resources/               # 图标、权限说明、安装器资源
│  │  ├─ tests/                   # Electron 集成与 E2E fixtures
│  │  └─ package.json
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ bootstrap/            # 进程启动与全局适配器
│  │  │  ├─ modules/              # identity/catalog/knowledge/builds/...
│  │  │  ├─ platform/             # DB、cache、queue、telemetry 等适配器
│  │  │  └─ common/               # 极小的跨模块基础原语
│  │  ├─ test/
│  │  └─ package.json
│  ├─ worker/                      # BullMQ 消费者；复用后端 application contracts
│  ├─ storybook/                   # UI 包与关键组合的文档/视觉测试宿主
│  └─ future/
│     ├─ web/                      # 未来公开网站
│     ├─ admin/                    # 未来运营/治理工具
│     └─ mobile/                   # 未来移动客户端
├─ packages/
│  ├─ ui/                          # 无业务语义的 React primitives/components
│  ├─ theme/                       # 设计 Token、主题选择、系统偏好与对比/透明度适配
│  ├─ icons/                       # 统一 Lucide 封装与授权品牌资产
│  ├─ hooks/                       # 跨 React 应用、无领域耦合 hooks
│  ├─ utils/                       # 纯函数；禁止成为杂物间
│  ├─ contracts/                   # OpenAPI/AsyncAPI schemas 与事件元数据
│  ├─ api-client/                  # 自动生成客户端；禁止手改 generated/
│  ├─ observability/               # 日志字段、追踪和指标约定
│  ├─ feature-flags/               # 类型化 flag 契约与适配器
│  ├─ plugin-sdk/                  # 未来：能力 API、manifest schema、测试工具
│  ├─ types/                       # 仅平台级基础类型；禁止业务/API 类型
│  ├─ testing/                     # fixtures/builders/mocks，无生产依赖
│  └─ config/
│     ├─ eslint/
│     ├─ biome/
│     ├─ prettier/
│     ├─ typescript/
│     ├─ tailwind/
│     ├─ vitest/
│     └─ playwright/
├─ infrastructure/
│  ├─ compose/                     # 本地依赖；不得作为生产 IaC
│  ├─ migrations/                  # 运维脚本与数据回填入口
│  ├─ deployment/                  # 环境声明；provider 决定后细化
│  ├─ monitoring/                  # dashboard、alert、SLO definitions
│  └─ security/                    # threat models、SBOM/policy 配置
├─ docs/
│  ├─ adr/
│  ├─ rfc/
│  ├─ runbooks/
│  ├─ diagrams/
│  └─ product/
├─ scripts/                        # 可复现仓库任务；薄封装、可测试
├─ .github/                        # workflows、templates、CODEOWNERS
├─ .ai/                            # 仅 AI 工具配置与本地自动化元数据
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

WHY：`apps` 是可部署/可运行单元，`packages` 是有明确消费者和 API 的复用单元，`infrastructure`
是环境与运维资产，`docs` 是长期决策记录。禁止按技术类型在仓库根部堆放
`components/`、`services/`、`helpers/`。

`packages/types` 只承载平台基础类型（Result、Brand、基础运行时接口）；业务模型、Prisma 类型、Nest DTO、API request/response 和实体定义必须留在所属模块。API 契约未来进入独立的
`packages/contracts`，不与基础类型混用。

### 2.1 文档架构

根级 15 份规范是新成员和自动化工具的稳定入口；`README.md` 维护索引。详细决策进入
`docs/adr/`，跨团队提案进入 `docs/rfc/`，可执行故障/发布步骤进入 `docs/runbooks/`，图源与导出图进入
`docs/diagrams/`，需求与术语进入
`docs/product/`。同一内容只设一个事实源，其余文档使用链接而不是复制。每份长期文档声明状态、owner 和更新日期/版本；代码变更若使文档失真，文档更新与代码必须在同一 PR 完成。

## 3. 依赖规则

```text
UI primitives -> 无业务依赖
Feature UI -> entities + ui + api-client + approved shared packages
Desktop main -> preload contracts + platform adapters（不依赖 renderer）
API interface -> application -> domain
Infrastructure adapters -------------> application ports / domain
Domain -> 仅语言标准库与经批准的领域原语
```

- 功能之间不得通过内部路径导入；跨功能只通过公共 `index.ts` 契约或应用层事件；
- `packages/*` 不得依赖 `apps/*`；生产包不得依赖 `packages/testing`；
- 后端模块不得读取其他模块 Prisma repository 或表；通过 application service/port/event 协作；
- 领域层不得出现 NestJS、Prisma、BullMQ、HTTP 或 Electron 类型；
- 循环依赖、深层 import、未声明依赖由 ESLint 与依赖图 CI 阻断；
- 只有至少两个真实消费者且 API 稳定时才抽共享包，防止“共享”成为耦合中心。

## 4. 后端模块内部模板

```text
modules/<context>/
├─ domain/          # entity/value-object/domain service/event/port
├─ application/     # use case、command/query、transaction boundary
├─ interface/       # HTTP/WS/queue handlers 与 DTO mapping
├─ infrastructure/  # Prisma/Redis/provider adapters
├─ testing/         # 模块测试 builders
└─ <context>.module.ts
```

严格依赖方向是 interface/infrastructure -> application ->
domain。DDD 只用于规则丰富、身份明确的核心域；简单查询、配置和 CRUD 采用清晰 application service，避免形式主义。

## 5. 客户端运行时边界

| 进程     | 权限                                | 禁止事项                                |
| -------- | ----------------------------------- | --------------------------------------- |
| Renderer | DOM、受控 Web API、Preload contract | Node、文件系统、任意 shell、令牌持久化  |
| Preload  | 参数校验、IPC 映射、能力版本协商    | 业务逻辑、通用 `ipcRenderer` 暴露       |
| Main     | 窗口、协议、更新、系统凭据、通知    | 渲染不可信 HTML、绕过授权的通用文件访问 |

所有 IPC channel 采用 `<namespace>:<version>:<verb>`，请求和返回均运行时校验，携带 correlation ID；长任务通过取消令牌和进度事件完成，不阻塞 main loop。

## 6. 数据与消息一致性

- 单模块强一致写入使用 PostgreSQL 事务；跨模块副作用通过 transactional outbox 发布；
- BullMQ 是至少一次投递，job ID/业务幂等键避免重复效果；重试使用指数退避和抖动；
- Redis 不保存不可恢复状态；缓存使用 cache-aside、版本化 key、TTL 抖动和 single-flight 防击穿；
- WebSocket 只推送事件/失效提示，客户端收到后按需通过 API 重取事实状态；
- 审计日志与业务日志分离，审计记录不可由普通业务流程覆盖。

## 7. 部署拓扑

初始生产拓扑包括静态签名 Desktop 制品、无状态 API 副本、独立 Worker 副本、托管 PostgreSQL、Redis 和对象存储/CDN。API 与 Worker 使用相同源版本但不同启动入口和扩缩容策略。

环境分为 local、test、staging、production；配置遵循环境变量/secret provider 注入，启动时校验。禁止通过 `NODE_ENV`
之外的隐式分支改变业务规则；环境差异必须显式配置并有 schema。

### 扩缩容触发指标

- API：CPU、event-loop lag、并发连接、P95 延迟；
- Worker：队列等待时间、backlog、失败率和外部配额；
- PostgreSQL：连接、慢查询、IO、锁等待、表/索引膨胀；
- Redis：内存、eviction、命中率、blocked clients；
- WebSocket：连接数、消息率、广播延迟与断线重连率。

达到阈值后先优化查询/模型与容量，再决定读副本、分区或服务拆分。服务拆分必须具备独立 SLO、数据所有权、团队所有权和成本收益。

## 8. 插件架构（未来）

插件不是 Node 依赖，也不得进入 Electron main 进程。平台采用：签名 manifest + 插件 ID/版本 + 声明式贡献点 + 能力授权 + 隔离执行环境 +
host-mediated API。

首批贡献点仅考虑命令、内容面板、数据解析器和只读上下文菜单；网络、文件、剪贴板、通知和账号信息是独立权限。每次安装展示权限差异，运行时可撤销。SDK 遵循 SemVer，Host 提供最小/最大 API 版本协商、超时、配额、崩溃隔离和 kill switch。引入前必须 ADR 选择 Web Worker、Utility Process 或 WASM 隔离方案并完成威胁模型。

## 9. 可观测性

OpenTelemetry 是跨进程关联标准。日志为结构化 JSON，公共字段包括 timestamp、level、service、version、environment、traceId、spanId、requestId、userPseudoId、eventName；禁止敏感数据。指标使用 RED（Rate/Errors/Duration）与 USE（Utilization/Saturation/Errors）。

每个生产能力必须有：健康检查、SLO、告警所有者、Runbook、部署标记和可追踪版本。Desktop 崩溃报告需用户知情、脱敏且支持禁用。

## 10. 发布与回滚

- API 使用向后兼容的 expand/migrate/contract 数据迁移；旧客户端在支持窗口内继续工作；
- Desktop 采用签名、分阶段更新（内部→小比例→全量），以崩溃率/启动失败自动熔断；
- 新功能先部署暗路径，再由服务端特性开关分群启用；flag 必须有 owner 和到期日；
- 回滚优先禁用 flag 或回滚无状态应用；数据库优先 forward-fix，不依赖危险 down migration；
- 每个 release 记录制品哈希、SBOM、迁移版本、兼容矩阵与回滚步骤。

## 11. 必需 ADR 清单

1. 运行时和包管理器版本固定策略；
2. Electron 构建、签名、自动更新与发布渠道；
3. OIDC Provider、桌面回调与令牌存储；
4. OpenAPI/AsyncAPI 生成工具与运行时校验方案；
5. OpenTelemetry、错误报告和隐私策略；
6. 对象存储、CDN 与媒体处理；
7. 搜索从 PostgreSQL FTS 迁移专用引擎的阈值；
8. 插件隔离、签名、审核和撤销模型。
