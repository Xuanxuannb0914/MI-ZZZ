# 系统架构

| 属性     | 值                               |
| -------- | -------------------------------- |
| 状态     | Baseline v1.0                    |
| 所有者   | Architecture Guild               |
| 适用范围 | Monorepo、运行时边界、部署与后端 |

## 1. 架构风格与总体图

系统采用 **模块化单体后端 + 多进程桌面客户端 + 异步 Worker**。领域按 bounded
context 组织；后端在同一代码库和初始部署单元内保持事务与运维简单，Worker 独立扩缩容。此方案保留 Clean
Architecture 的依赖方向，不承担早期微服务的网络、数据一致性和部署成本。

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

后端以 NestJS **模块化单体**
起步，API 与 Worker 为两个部署进程。模块化单体允许核心写入保持本地事务、降低观测和运维复杂度；领域模块与端口适配器又保留未来按证据拆分的能力。

禁止以“未来可能扩展”为理由提前拆微服务。拆分必须同时满足：独立数据所有权、独立 SLO/扩缩容、明确团队 owner、可接受的一致性模型和可量化收益。

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

`packages/types` 只承载平台基础类型（Result、Brand、基础运行时接口）；业务模型、Prisma 类型、Nest
DTO、API request/response 和实体定义必须留在所属模块。API 契约未来进入独立的
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

## 4. 后端模块组织与模块地图

### 4.1 模块内部模板

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
domain。DDD 只用于规则丰富、身份明确的核心域；简单查询、配置和 CRUD 采用清晰 application
service，避免形式主义。

### 4.2 模块地图与所有权

| 模块                    | 拥有的数据/能力                            | 可发布事件示例                    |
| ----------------------- | ------------------------------------------ | --------------------------------- |
| Identity                | user、credential link、session、role/grant | `identity.user.registered.v1`     |
| Catalog                 | game、platform、release、patch、taxonomy   | `catalog.patch.published.v1`      |
| Knowledge               | guide/wiki、revision、source、review       | `knowledge.revision.published.v1` |
| Builds                  | build、variant、compatibility、snapshot    | `builds.build.published.v1`       |
| Search                  | 索引投影、查询、ranking metadata           | `search.index.updated.v1`         |
| Assistant               | conversation、citation、usage、feedback    | `assistant.response.completed.v1` |
| Community               | resource、trust signal、report             | `community.resource.reported.v1`  |
| Notification            | preference、delivery、receipt              | `notification.requested.v1`       |
| Media                   | asset metadata、ownership、processing      | `media.asset.ready.v1`            |
| Plugin Registry（未来） | manifest、publisher、review、revocation    | `plugin.version.revoked.v1`       |

事件名只是命名和版本示例，不代表 Foundation 已实现业务逻辑。

## 5. 后端请求生命周期与模块职责

### 5.1 模块内部职责

- **Domain**：实体、值对象、不变量、领域服务、领域事件和 repository port；不依赖框架；
- **Application**：use case、授权协调、事务边界、command/query、port；
- **Interface**：Controller、Gateway、Queue processor、DTO 和协议映射；
- **Infrastructure**：Prisma repository、Redis cache、外部 AI/媒体/邮件 adapter。

Controller 只做协议解析、验证、身份上下文和响应映射。Repository 不包含业务决策。跨模块调用通过对方 application
facade；不得跨模块 join 私有表。复杂读取可由明确所有权的 read model 提供。

### 5.2 请求生命周期

```text
Gateway/Controller
  -> schema validation
  -> authentication
  -> authorization/policy
  -> application use case
  -> domain + repository ports
  -> transaction/outbox
  -> presenter / RFC 9457 error
```

每个请求具备 request ID、trace
context、超时和取消信号。全局 interceptor/filter 只处理横切关注点，不隐藏业务控制流。输入限制 body
size、字段长度、数组大小和查询复杂度。

### 5.3 错误、重试与幂等

错误分为 validation、authentication、authorization、not-found、conflict、rate-limit、dependency、internal；对外按
[API_GUIDELINE.md](./data-api.md) 返回稳定 code。未知异常统一 500 并关联 error ID。

仅对瞬态故障重试；重试有上限、总时间预算和 jitter，禁止层层重试放大流量。创建/支付式高影响写入（如未来能力）支持
`Idempotency-Key`；幂等记录绑定用户、路由与请求摘要，并设置明确保留期。

### 5.4 完成门禁

模块依赖检查、单元/集成/契约/E2E、安全测试通过；OpenAPI 同步；迁移与回滚计划批准；日志指标追踪和告警可用；负载预算满足；数据分类、权限、幂等、超时和降级路径明确。任何未定义 owner 的后台任务不得上线。

## 6. 认证与授权

认证基于 OIDC/OAuth 2.1 Authorization Code +
PKCE；具体 Provider 由 ADR 决定。API 校验 issuer、audience、signature、expiry 和 token
type。刷新令牌轮换与复用检测由 Identity 负责。

授权采用 deny-by-default 的 policy/permission，资源级检查位于 application boundary。Controller
guard 可做粗粒度检查，但不能替代对象级授权。管理员接口单独路由、权限、审计和速率限制；禁止以客户端隐藏按钮当授权。

### 6.1 安全基线

TLS only；Helmet/CSP（适用于 HTTP 内容）、严格 CORS
allowlist、速率限制、输入验证、参数化查询、上传内容类型/大小/恶意文件检查。内部管理端点与公开 API 分离。Secrets 由 secret
manager 注入并轮换，禁止进入 Git、镜像或日志。

SSRF 防护需解析后校验协议、主机/IP、重定向和 DNS
rebinding；用户 URL 抓取在隔离网络执行。Webhook（未来）必须签名、防重放、限时。依赖和容器镜像需扫描、SBOM 与签名。

## 7. 数据与消息一致性

- 单模块强一致写入使用 PostgreSQL 事务；跨模块副作用通过 transactional outbox 发布；
- BullMQ 是至少一次投递，job ID/业务幂等键避免重复效果；重试使用指数退避和抖动；
- Redis 不保存不可恢复状态；缓存使用 cache-aside、版本化 key、TTL 抖动和 single-flight 防击穿；
- WebSocket 只推送事件/失效提示，客户端收到后按需通过 API 重取事实状态；
- 审计日志与业务日志分离，审计记录不可由普通业务流程覆盖。

## 8. PostgreSQL 与 Prisma

- Prisma Client 仅在 infrastructure 层使用，通过 request/application transaction context 协调事务；
- 每个模块拥有明确表前缀/映射与 repository，不直接暴露 Prisma model 到 API；
- 查询必须显式 select 所需字段，分页且有稳定排序；禁止无界列表和循环 N+1；
- 原生 SQL 仅用于 Prisma 无法清晰表达且有基准证据的查询，必须参数化、封装并测试；
- 迁移遵循 [DATABASE.md](./data-api.md) 的 expand/migrate/contract 和生产审批流程。

## 9. Redis 与缓存

Redis 用于短期缓存、限流计数、分布式协调、WebSocket adapter 与 BullMQ。它不是事实源。

Key 格式：`ggh:<env>:<domain>:<purpose>:<version>:<identity>`。每类 key 声明 owner、TTL、最大大小和失效方式；TTL 加随机抖动。缓存 value 使用版本化 schema，敏感数据默认不缓存。删除/更新事实后采用事件驱动失效，短 TTL 作为最终保护。

Redis 不可用时：核心读写绕过缓存继续访问 PostgreSQL；限流按端点风险 fail-open 或 fail-closed；队列型功能进入明确降级并告警。该策略必须按能力记录。

## 10. BullMQ 作业规范

Job payload 只含稳定 ID 与最少上下文，不携带大文档、令牌或完整用户数据。名称采用
`<domain>.<action>.v<major>`。每个 processor 定义：

- 幂等键和重复执行结果；
- timeout、attempts、指数退避与 jitter；
- concurrency、rate limit 与上游配额；
- progress 语义、失败分类、补偿与人工重放；
- retention、dead-letter/failed set 与告警阈值；
- payload schema 的向后兼容窗口。

数据库写入与入队需要 transactional outbox，禁止“先提交数据库再尽力 enqueue”的双写。

## 11. WebSocket

WebSocket 用于通知、协作状态和长任务进度，不替代 REST 事实读取。连接使用短期专用 ticket 或安全 token 协商，校验 origin/客户端版本；按用户、会话和主题授权 room。

事件包含
`id`、`type`、`version`、`occurredAt`、`correlationId`、`sequence?`、`data`。客户端必须处理重复、乱序、断线和版本未知；重连采用带抖动的指数退避，通过 cursor/REST
snapshot 补偿丢失事件。背压时合并低价值进度事件并断开持续慢消费者。

## 12. 客户端运行时边界与 Renderer 目录职责

### 12.1 进程运行时边界

| 进程     | 权限                                | 禁止事项                                |
| -------- | ----------------------------------- | --------------------------------------- |
| Renderer | DOM、受控 Web API、Preload contract | Node、文件系统、任意 shell、令牌持久化  |
| Preload  | 参数校验、IPC 映射、能力版本协商    | 业务逻辑、通用 `ipcRenderer` 暴露       |
| Main     | 窗口、协议、更新、系统凭据、通知    | 渲染不可信 HTML、绕过授权的通用文件访问 |

所有 IPC channel 采用 `<namespace>:<version>:<verb>`，请求和返回均运行时校验，携带 correlation
ID；长任务通过取消令牌和进度事件完成，不阻塞 main loop。

### 12.2 Renderer 目录职责

- `app/`：Provider、路由、布局、全局状态。
- `pages/`：路由页面与页面专属组合，不承载跨页面基础组件。
- `widgets/`：应用壳层与可复用的大型界面区域。
- `entities/`：角色、攻略等领域展示模型。
- `shared/content/`：Mock 内容的唯一聚合入口；新增内容先进入领域模型与 `shared/mock`
  数据，再由页面组合。
- `shared/`：场景、内容聚合、搜索、通用 UI 和无业务语义工具。

页面组合业务能力；实体保存领域展示模型；共享层不得包含业务状态。只有至少两个真实消费者时才抽离到
`packages/*`。

## 13. 客户端路由与场景生命周期

### 13.1 运行时边界

```text
/startup -> /games -> /zzz
   |          |        |
WebGL 场景   游戏选择   持久工作区壳层
LandingLayout         MainLayout
```

启动页和游戏中心只存在于 `LandingLayout`。选择游戏后，`StartupProvider`
将应用标记为就绪，启动路由树被整体卸载；绝区零页面只由 `MainLayout` 与 `AppShell` 承载。

### 13.2 路由

- 平台：`/startup`、`/games`。
- 工作区：`/zzz`、`/zzz/guides`、`/zzz/agents`、`/zzz/events`、`/zzz/planner`、`/zzz/materials`、`/zzz/favorites`、`/zzz/search`。
- 设置：`/settings`。
- 旧地址保留重定向或兼容详情路由，避免已有深链失效。

### 13.3 场景生命周期

Three.js 只存在于启动路由。`LandingScene`
统一持有 renderer、scene、geometry、material 与后处理；卸载时遍历场景并释放 GPU 资源。Canvas、事件、定时器和动画帧都由所属组件清理，工作区不会渲染隐藏场景。

## 14. 内容模型与内容图

### 14.1 内容 Alpha 模型

绝区零内容按
`Agent`、`WEngine`、`DriveDisc`、`Team`、`Version`、`Guide`、`Event`、`Material`、`DailyTask`、`Announcement`
与 `Favorite/ReadingHistory` 组织。页面不直接声明业务文案；内容通过 `shared/content`
读取，便于后续将本地 Mock 替换为带来源的服务端数据。当前 Mock 明确标记为“本地 Mock”，不代表官方数据。

### 14.2 内容图

`shared/content/content-graph.ts` 负责把实体的 ID 关系解析为可导航的
`ContentLink`。实体仅保存关系 ID，不复制描述性内容：角色可关联音擎、驱动盘、配队、材料、攻略、活动与版本；反向入口由内容图查询。新增实体时先补齐
`ContentRelations`，再由列表、详情页与搜索索引消费，避免在页面内按名称匹配。

## 15. AI Provider 边界

AI 是外部 adapter，不进入领域核心。Assistant application
service 管理配额、模型策略、检索、引用、超时、取消、审计与降级。Prompt 模板版本化，外部内容标记为不可信数据；工具调用使用明确 schema、能力 allowlist 和服务端授权，模型不能自行扩大权限。

不得记录完整敏感 Prompt/Response；调试采样需脱敏、限时保留和用户/合规授权。模型、价格和 provider 可替换，业务层只依赖能力接口。输出在展示或执行前分别通过内容安全、引用完整性和工具参数验证。

## 16. 部署拓扑与扩缩容

### 16.1 部署拓扑

初始生产拓扑包括静态签名 Desktop 制品、无状态 API 副本、独立 Worker 副本、托管 PostgreSQL、Redis 和对象存储/CDN。API 与 Worker 使用相同源版本但不同启动入口和扩缩容策略。

环境分为 local、test、staging、production；配置遵循环境变量/secret
provider 注入，启动时校验。禁止通过 `NODE_ENV`
之外的隐式分支改变业务规则；环境差异必须显式配置并有 schema。

### 16.2 扩缩容触发指标

- API：CPU、event-loop lag、并发连接、P95 延迟；
- Worker：队列等待时间、backlog、失败率和外部配额；
- PostgreSQL：连接、慢查询、IO、锁等待、表/索引膨胀；
- Redis：内存、eviction、命中率、blocked clients；
- WebSocket：连接数、消息率、广播延迟与断线重连率。

达到阈值后先优化查询/模型与容量，再决定读副本、分区或服务拆分。服务拆分必须具备独立 SLO、数据所有权、团队所有权和成本收益。

### 16.3 性能与容量

所有列表分页，默认 20、最大 100（具体端点可收紧）。API 层设置 timeout 和 body budget；DB
pool 由实例数与数据库上限反推。使用 explain/analyze 与生产相似数据优化，不凭感觉加索引。

容量测试覆盖热点游戏、发布日流量、AI 流式响应、WS 重连风暴、队列 backlog 和缓存冷启动。每项测试保留场景、数据规模、版本与结果。

## 17. 可观测性

### 17.1 跨进程可观测性

OpenTelemetry 是跨进程关联标准。日志为结构化 JSON，公共字段包括 timestamp、level、service、version、environment、traceId、spanId、requestId、userPseudoId、eventName；禁止敏感数据。指标使用 RED（Rate/Errors/Duration）与 USE（Utilization/Saturation/Errors）。

每个生产能力必须有：健康检查、SLO、告警所有者、Runbook、部署标记和可追踪版本。Desktop 崩溃报告需用户知情、脱敏且支持禁用。

### 17.2 可观测性与运维

- Logs：结构化、脱敏、可关联，不用自由文本承载关键维度；
- Metrics：请求 RED、依赖、DB pool、queue lag、cache、WS、AI token/cost；
- Traces：HTTP→application→DB/Redis/queue/provider，采样策略保留错误和慢请求；
- Audit：主体、动作、资源、结果、策略、时间、来源，不记录秘密；
- Health：liveness 只反映进程；readiness 检查关键依赖且有严格超时。

告警必须可行动，链接 Runbook，指定 owner。禁止仅因单次错误告警；按 SLO burn rate 和持续异常设计。

## 18. 发布与回滚

- API 使用向后兼容的 expand/migrate/contract 数据迁移；旧客户端在支持窗口内继续工作；
- Desktop 采用签名、分阶段更新（内部→小比例→全量），以崩溃率/启动失败自动熔断；
- 新功能先部署暗路径，再由服务端特性开关分群启用；flag 必须有 owner 和到期日；
- 回滚优先禁用 flag 或回滚无状态应用；数据库优先 forward-fix，不依赖危险 down migration；
- 每个 release 记录制品哈希、SBOM、迁移版本、兼容矩阵与回滚步骤。

## 19. 插件架构（未来）

插件不是 Node 依赖，也不得进入 Electron
main 进程。平台采用：签名 manifest + 插件 ID/版本 + 声明式贡献点 + 能力授权 + 隔离执行环境 +
host-mediated API。

首批贡献点仅考虑命令、内容面板、数据解析器和只读上下文菜单；网络、文件、剪贴板、通知和账号信息是独立权限。每次安装展示权限差异，运行时可撤销。SDK 遵循 SemVer，Host 提供最小/最大 API 版本协商、超时、配额、崩溃隔离和 kill
switch。引入前必须 ADR 选择 Web Worker、Utility Process 或 WASM 隔离方案并完成威胁模型。

## 20. 必需 ADR 清单

1. 运行时和包管理器版本固定策略；
2. Electron 构建、签名、自动更新与发布渠道；
3. OIDC Provider、桌面回调与令牌存储；
4. OpenAPI/AsyncAPI 生成工具与运行时校验方案；
5. OpenTelemetry、错误报告和隐私策略；
6. 对象存储、CDN 与媒体处理；
7. 搜索从 PostgreSQL FTS 迁移专用引擎的阈值；
8. 插件隔离、签名、审核和撤销模型。
