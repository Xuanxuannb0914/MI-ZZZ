# 工程规范

| 属性     | 值                                                                  |
| -------- | ------------------------------------------------------------------- |
| 状态     | Baseline v1.0                                                       |
| 所有者   | Engineering Productivity + Quality Engineering + Architecture Guild |
| 强制级别 | MUST / SHOULD / MAY；未标注条目默认 MUST                            |

## 1. 核心原则

- SOLID 用于维持职责与替换边界，不为每个函数制造接口；
- DRY 针对同一知识的重复，而非表面相似；两处相似允许存在，第三次且变化原因相同再抽象；
- KISS 优先最小可证明方案；复杂性必须由测量、业务规则或安全边界证明；
- Clean Architecture 约束依赖方向；框架属于外层细节；
- Composition over Inheritance；只允许 Error 等语言/框架明确模式的有限继承；
- DDD 适用于核心复杂域，简单 CRUD 不强制实体/值对象仪式。

## 2. TypeScript 基线

全仓启用 `strict`，并评估开启
`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`useUnknownInCatchVariables`、`noImplicitOverride`、`noFallthroughCasesInSwitch`。任何关闭项需 ADR/注释说明迁移计划。

- 禁止 `any`、`as any`、`@ts-ignore` 和无说明 `@ts-expect-error`；边界数据先是
  `unknown`，运行时验证后收窄；
- 优先判别联合、branded ID、readonly 数据和 exhaustive `never`；
- 不使用 TypeScript `enum`，优先 `as const` object + union；
- 类型断言只用于类型系统无法表达但已由同处运行时保证的情况，并附短理由；
- 公共函数/包出口显式返回类型；局部清晰变量允许推断；
- 避免 `!` 非空断言；通过控制流、schema 或明确 invariant 处理；
- DTO、domain model、view model 分离，禁止一型贯穿数据库到 UI。

## 3. 函数、组件与模块

函数应单一意图、早返回、命名表达原因。超过约 40 行或三层嵌套触发重构审查，但不是机械失败线；复杂算法可保留完整性并由测试和注释支撑。

React 组件超过约 200 行、同时处理数据获取/状态/布局/业务决策，必须拆分。Nest
Controller 不含业务逻辑，use
case 不解析 HTTP，repository 不做授权。文件应有一个主要概念；`utils.ts`、`helpers.ts`、`common.ts`
只能作为极小局部文件，禁止仓库级杂物箱。

公共抽象必须回答：谁拥有、谁消费、变化轴是什么、如何测试、如何弃用。无真实替换需求时不创建单实现接口；在 I/O、外部 provider、领域 repository 和测试隔离处使用 port。

## 4. 错误与控制流

- 预期业务失败用明确 Result/typed error，未知程序错误抛出并由边界捕获；
- 不吞异常、不空 catch、不以 `null` 同时表示多个失败原因；
- 对外错误在 interface 边界映射，domain/application 不依赖 HTTP status；
- retry/timeout/circuit-breaker 只在外部边界，配置有总预算和指标；
- Promise 必须 await/return/显式 `void` 并在内部处理；禁止浮动 Promise；
- 并发操作定义取消、竞态和部分失败语义。

## 5. 不可变性与副作用

默认不可变数据与纯函数；副作用集中在 adapter/use
case。不要修改参数、共享 singleton 状态或依赖隐式全局。时间、随机数、ID、环境、文件、网络以可注入 port 提供，确保测试确定性。

事务、锁、缓存失效和事件发布在 application 层可见，不隐藏在通用 decorator/middleware 中导致控制流不可读。

## 6. 命名规范总则

命名表达领域含义与意图，避免实现细节和含糊缩写。使用团队可搜索的统一词汇；同一概念不得在 API、数据库、事件和 UI 中分别叫不同名字。术语变化需更新 product
glossary 和迁移说明。

禁止：`data`、`info`、`item`、`obj`、`temp`、`manager`、`processor`、`handler`
等无上下文名称；在有明确职责时如 `WebhookHandler` 可用。禁止 `utils2`、`newService`、`finalFinal`。

### 6.1 缩写与保留词

允许行业通用：API、HTTP、URL、ID、UI、AI、DB、DTO、SLO。标识符按自然大小写：`apiClient`、`userId`、`HttpGateway`（不使用
`APIClient`/`userID`）。领域缩写首次在 glossary 定义；单字母只用于极短数学/索引范围。

避免 `delete` 与 `remove` 混用：删除事实用 `delete`，从集合解除关联用 `remove`，可逆状态用
`archive`/`deactivate`。读取远程资源用 `fetch`，从 repository 用 `find/get`（`get`
不存在时抛/失败，`find` 可返回空），转换用 `map/to/from`，验证用
`validate/parse`（parse 成功返回类型，失败明确）。

## 7. TypeScript 命名

| 对象                 | 规则                                 | 示例                             |
| -------------------- | ------------------------------------ | -------------------------------- |
| 变量/函数            | `camelCase`                          | `publishedRevision`, `loadGuide` |
| Type/Class/Component | `PascalCase`                         | `GuideRevision`, `BuildEditor`   |
| 常量值               | `UPPER_SNAKE_CASE` 仅真正全局常量    | `MAX_PAGE_SIZE`                  |
| 布尔值               | `is/has/can/should/did`              | `isPublished`, `canEdit`         |
| 集合                 | 复数                                 | `guideRevisions`                 |
| Map/Set              | 后缀表达索引                         | `guideById`, `selectedGameIds`   |
| Async action         | 动词；不加 `Async`，除非与 sync 并存 | `fetchGuide`                     |
| Event callback prop  | `on<Event>`                          | `onSelectionChange`              |
| 内部 event handler   | `handle<Event>`                      | `handleSelectionChange`          |
| Hook                 | `use<Noun/Verb>`                     | `useCommandMenu`                 |
| Zustand store        | `use<Scope>Store`                    | `useWorkspaceStore`              |
| Query key factory    | `<feature>Keys`                      | `guideKeys.detail(id)`           |

接口不加 `I`，类型不加 `T`；以角色命名
`GuideRepository`、`Clock`。实现只有在需要区分时用 provider/技术：`PrismaGuideRepository`、`SystemClock`。DTO 明确方向与动作：`CreateGuideRequest`、`GuideResponse`，不使用泛化
`GuideDto` 贯穿层次。

领域命令用祈使动作 `PublishGuideRevision`，领域事件用过去式 `GuideRevisionPublished`，查询用意图
`GetGuideDetails`。Error 使用 `<Condition>Error`，对外稳定 code 使用 `UPPER_SNAKE_CASE`。

## 8. 文件与目录

- 目录：`kebab-case`；文件默认 `kebab-case.ts`；React component 可用
  `component-name.tsx`，导出名 PascalCase；
- 测试：`*.test.ts(x)`；integration：`*.integration.test.ts`；E2E：`*.spec.ts`；Story：`*.stories.tsx`；
- Nest：`*.controller.ts`、`*.service.ts`（仅真正 service）、`*.module.ts`、`*.repository.ts`、`*.gateway.ts`；
- Schema：`*.schema.ts`；mapper：`*.mapper.ts`；factory/builder 名称必须说明产物；
- 公共入口 `index.ts` 只 re-export 公共 API，不实现逻辑；禁止层层 barrel 导致循环依赖；
- 动态路由参数按框架约定，概念名保持一致。

功能目录以用户能力命名，如 `guide-reader`、`build-editor`，不用技术层 `components`
作为 feature。后端 bounded context 使用单数概念目录或公认集合名，并在全仓一致。

## 9. React 组件命名

Primitive 使用名词：`Button`、`Dialog`、`TextField`。组合模式使用清晰领域/任务：`GameLibrarySidebar`、`GuideSourceList`。避免
`Card` 泛滥；如果组件是 `GuideSummary`，按内容命名而非外观 `GuideCard`，除非 Card 本身是交互契约。

Props 类型为 `<Component>Props`；variant 使用语义 `primary/secondary/quiet/danger`，不用颜色名
`blue/red`。Slot 用角色 `leadingIcon`、`actions`、`footer`。禁止 `isTypeA`、`isTypeB`
多布尔切换，改为 `variant` union 或组合。

## 10. API、数据库、Redis、Queue 与事件命名

### 10.1 API 命名

- URL 复数 kebab-case：`/guide-revisions/{revisionId}`；
- JSON camelCase：`publishedAt`；query 参数 camelCase，结构化过滤 `filter[gameId]`；
- operationId 为动词 + 资源：`listGameGuides`、`publishGuideRevision`；
- HTTP header 使用标准头优先，自定义 `X-Client-Version` 等仅在必要时；
- Error code：`GUIDE_REVISION_CONFLICT`；字段错误 code 小写 snake_case：`too_long`；
- API enum 小写 snake_case；不得直接暴露数据库 enum 名。

### 10.2 数据库命名

| 对象               | 格式                 | 示例                                      |
| ------------------ | -------------------- | ----------------------------------------- |
| Schema/Table       | `snake_case`，表复数 | `knowledge.guide_revisions`               |
| Column             | `snake_case`         | `published_at`                            |
| Primary key        | `id`                 | `id`                                      |
| Foreign key column | `<singular>_id`      | `guide_id`                                |
| Unique             | `uq_<table>__<cols>` | `uq_games__slug`                          |
| Index              | `ix_<table>__<cols>` | `ix_guide_revisions__guide_id_created_at` |
| Foreign key        | `fk_<from>__<to>`    | `fk_guide_revisions__guides`              |
| Check              | `ck_<table>__<rule>` | `ck_builds__title_not_blank`              |

Join table 用两个实体复数按领域自然顺序，如 `guide_tags`；不是机械字母排序。时间列 `_at`，业务日期
`_on`，布尔列 `is_`/`has_`。禁止 `tbl_`、`col_` 和数据库保留字。

### 10.3 Redis、Queue 与事件命名

- Redis：`ggh:<env>:<domain>:<purpose>:<version>:<id>`，例如
  `ggh:prod:catalog:game:v2:<id>`；禁止 PII 放 key；
- BullMQ queue：`<domain>.<purpose>.v<major>`；job：`<domain>.<action>.v<major>`；
- Integration event：`<domain>.<entity>.<past-tense>.v<major>`，如
  `knowledge.revision.published.v1`；
- WebSocket UI event 可按事实/进度：`operation.progress.v1`；
- Event field 使用 camelCase，事件 ID 和 correlation ID 不混用。

事件版本在语义破坏时升级 major；新增可选字段不升级。事件名不包含 transport（如
`kafka`/`ws`）或消费者名字。

## 11. 注释与文档

代码说明“为什么/约束/非显然风险”，不复述语法。TODO 格式：`TODO(owner, ISSUE-123, YYYY-MM-DD): reason`；无 owner/issue 的 TODO 不得合入。公共包 API、复杂算法、安全边界和迁移脚本需要文档。

决策进入 ADR/RFC，使用说明进入 README/Runbook，用户变化进入 CHANGELOG。注释不能替代清晰命名和测试。

## 12. 依赖治理

新增运行时依赖需说明：现有工具为何不足、维护/许可证/体积/安全、替代方案、移除成本。锁定精确 lockfile；禁止重复功能库和深 import 私有路径。依赖更新由自动 PR 分组，小版本自动化仍需测试，高风险框架单独升级。

Package `exports` 定义公共入口；禁止跨 package 相对路径。循环依赖、undeclared
dependency、生产包引用 dev/test 包由 CI 阻断。

## 13. 工具职责

| 工具                | 唯一职责                                                            | 避免冲突                                             |
| ------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| Biome               | TS/JS/JSON 快速格式化、import organize、安全语法 lint               | 关闭与 ESLint type-aware/React architecture 重复规则 |
| ESLint              | 类型感知、React hooks、Electron/Nest 安全、依赖边界、自定义架构规则 | 不承担格式化                                         |
| Prettier            | Markdown、YAML、CSS 及 Biome 未覆盖格式                             | 排除 TS/JS/JSON；不与 Biome 同文件                   |
| TypeScript          | 类型正确性与 project references                                     | 不用 lint 替代编译                                   |
| Turbo               | 任务图、缓存、受影响范围                                            | 持久任务/secret 输出不缓存                           |
| Husky + lint-staged | 在提交前运行受影响文件的快速本地反馈                                | 不复制完整 CI，不允许用 hook 代替服务端门禁          |
| Commitlint          | 校验 Conventional Commit message                                    | 规则与 [GIT_RULE.md](./workflow.md) 保持单一来源     |

每种文件只有一个 formatter。CI 顺序：format:check → lint → typecheck → test → build；本地 `check`
可并行但结果一致。Biome/ESLint 规则冲突以职责表修复，不用 disable 注释长期压制。

## 14. 配置与常量

无 magic number/string。业务阈值、timeout、尺寸、事件名、权限、route、query
key 使用有所有权的命名常量/配置；显然值（`0`, `1`
循环边界）无需抽象。环境配置启动时按 schema 验证，区分 secret 与非 secret，并提供 `.env.example`
但无真实值。

Feature flag 有 owner、用途、默认值、创建/到期日期和删除 issue。Flag 不能绕过授权、安全或数据约束。

### 14.1 Git、环境与配置命名

Branch 见 [GIT_RULE.md](./workflow.md)：`feature/GGH-123-guide-search`。环境变量以 `GGH_`
开头、`UPPER_SNAKE_CASE`，按作用域命名：`GGH_API_DATABASE_URL`、`GGH_DESKTOP_UPDATE_CHANNEL`。Secret 名称表达内容但不含真实环境值。

Feature flag：`<area>.<capability>.<variant?>`，例如 `assistant.citations.v2`；避免否定名。Telemetry
event 使用 `<surface>.<object>.<action>`，属性名稳定且不含动态 ID。

## 15. 安全编码

- 所有外部输入视为 `unknown` 并在边界验证长度、形状和语义；
- 输出按 HTML/URL/SQL/shell 上下文编码；优先结构化 API，禁止字符串拼接命令/查询；
- Secret/令牌/PII 不进日志、错误、URL、analytics 或 fixtures；
- Electron IPC、文件和外链用 capability allowlist；不得暴露通用 invoke/read/write；
- 使用常量时间比较处理签名，密钥使用受审计库；不自研密码学；
- Markdown/富文本经过 allowlist sanitizer，外部媒体与 URL 防 SSRF；
- AI 输出与插件输入不可信，执行前重新授权和验证。

## 16. 性能规则

先设预算和测量，再优化。避免无界查询/列表、N+1、重复序列化、大对象复制、main
thread 同步 I/O 和高基数日志/指标。缓存必须定义一致性、TTL、失效、容量和观测；没有失效策略不得加缓存。

高频路径用 benchmark/profiler 证据支撑；优化 PR 附前后数据、环境和回归测试。可读性换性能必须是经证实热点。

## 17. 测试策略与层级

测试按风险而非文件数量分配。目标是快速定位回归、证明边界契约并验证真实用户流程；不追求覆盖率数字本身。测试金字塔：大量 unit，适量 component/integration/contract，少量高价值 E2E，另有性能、安全、无障碍和恢复演练。

```text
             E2E / Release qualification
        Contract / Integration / Component
                 Unit / Static checks
```

静态类型和 lint 不能替代运行时、授权、并发与协议测试。

| 层级           | 范围                                     | 工具/边界                         | 目标时长                |
| -------------- | ---------------------------------------- | --------------------------------- | ----------------------- |
| Static         | format/lint/type/dependency/schema       | Biome/ESLint/tsc/schema lint      | PR 分钟级               |
| Unit           | 纯 domain、mapper、state、utils          | Vitest；无网络/真实 DB            | 单测毫秒级              |
| Component      | React 组件交互/可访问性                  | Vitest + DOM + Storybook          | 单文件秒级              |
| Integration    | Module + PostgreSQL/Redis/BullMQ adapter | 隔离容器/真实依赖                 | Suite 分钟级            |
| Contract       | OpenAPI/AsyncAPI、provider、IPC          | schema + consumer/provider checks | PR 分钟级               |
| E2E            | Desktop/API 关键旅程                     | Playwright Electron/Web/API       | PR smoke / nightly full |
| Non-functional | 性能、安全、a11y、恢复                   | 专项工具与演练                    | nightly/release         |

测试友好性：从公共行为测试，不暴露 private 只为测试。用 deterministic
fake 隔离时间/随机/网络；mock 只在进程/网络边界。测试数据 builders 表达意图，不共享可变 fixture。详细门禁见本文档相应测试章节。

## 18. 覆盖率门槛

初始全仓门槛：lines/functions/statements ≥80%，branches
≥75%；核心 domain、认证/授权、迁移/支付式高风险（未来）≥90% lines、≥85%
branches。新/改行覆盖率建议 ≥90%。

门槛是最低线。禁止无意义断言、测试实现细节或排除困难文件来刷数字。Generated、类型声明、配置薄入口可按审议排除；排除清单有 owner。Mutation
testing 可用于核心规则验证测试质量。

## 19. Unit 与 Domain 测试

- Arrange/Act/Assert 清晰，每个测试一个行为；名称：`should <outcome> when <condition>`；
- 覆盖 happy path、边界、无效输入、权限、并发版本和失败；
- 时间、UUID、随机、provider 使用 deterministic fake；
- 不 mock 被测对象内部函数，不读取 private，不用 snapshot 替代业务断言；
- Property-based testing 用于解析器、排序、游标、Build 规则等组合空间大的纯逻辑。

## 20. 前端 Component 测试

从可访问角色、名称和用户行为查询 DOM，不依赖 CSS
class/内部 state。至少验证 loading、empty、error、disabled、overflow、键盘和 focus；主题视觉由 Storybook/visual
test 覆盖。

避免对大 DOM 做无审阅 snapshot。允许小型稳定序列化结构 snapshot，并在 PR 中审查差异。Motion 测试使用 reduced-motion 或可控时钟，不等待真实动画。

## 21. 后端 Integration 测试

Repository、事务、outbox、锁、约束、Redis
TTL/失效和 BullMQ 幂等需连接真实兼容版本；不以 SQLite/in-memory 假装 PostgreSQL。每个 worker 测试成功、瞬态重试、永久失败、重复 job、超时和 poison
message。

数据库每 suite/test 使用独立 schema/database 或事务策略，不能依赖测试顺序。Migration 从上一生产 schema 升级并验证数据，不能只测空库。

## 22. 契约测试

- OpenAPI lint、breaking diff、response validation 和生成 client 编译；
- AsyncAPI/事件 schema 的 backward/forward compatibility 与未知字段；
- Electron IPC 的 channel/version/request/response schema、拒绝未授权调用；
- 外部 AI/OIDC/media provider 使用录制/沙箱契约，Secret 不进入 fixture；
- Consumer-driven contract 仅用于存在独立消费者部署节奏的边界，不到处引入。

## 23. E2E 关键旅程

PR
smoke 至少包含：Desktop 启动/恢复、登录模拟、导航/深链接、搜索并打开攻略、错误/离线恢复、主题切换与键盘导航。相应功能里程碑加入 Build 保存冲突、AI 引用/取消、通知重连和自动更新测试。

Playwright 使用稳定 `data-testid`
仅在语义查询不足时；ID 表达角色不含样式/位置。禁止固定 sleep，等待可观察状态、网络/事件条件。测试可并行且数据独立。

跨平台矩阵：每 PR 至少主要开发 OS +
renderer；nightly/release 覆盖受支持 Windows/macOS，Linux 支持级别由 ADR 决定。窗口尺寸覆盖 1024×640、1280×720、1440×900、1920×1080 与高 DPI。

## 24. 视觉与无障碍

Storybook 每个组件覆盖明/暗、高对比、长文本、200% 字体、reduced-motion。视觉差异必须人工审阅，不能盲目更新 baseline。

自动 axe 检查不能替代人工：关键旅程验证仅键盘、焦点顺序/恢复、屏幕阅读器、颜色非唯一、缩放、Windows
High Contrast。对比值在 Token CI 自动计算。

## 25. 性能测试

基准固定硬件、OS、数据集、网络和版本。测量 Desktop 冷/热启动、route/input、内存、长列表滚动、API
P95/P99、DB 查询/锁、WebSocket 重连、queue lag、AI 首 token/总时长/成本。

PR 用 micro/target
benchmark 防局部回归；nightly 做趋势；release 做容量与 soak。预算超出必须阻断或由 owner 提供有时限的 waiver。任何性能优化附 before/after 原始结果。

## 26. 安全测试

- SAST、secret、dependency/license、SBOM 和镜像扫描；
- API 认证/资源授权/枚举、速率限制、输入大小、注入、SSRF、上传；
- Electron node exposure、IPC allowlist、navigation/CSP、custom protocol、更新签名；
- AI prompt injection、工具越权、数据泄漏、恶意 Markdown/引用；
- 插件阶段增加 manifest/签名/能力/沙箱逃逸与撤销；
- 每个主要 release 做 threat model delta，高风险里程碑安排渗透测试。

## 27. AI 质量评测

建立版本化 golden
set，按游戏版本/语言/问题类型分层，测引用正确性、groundedness、拒答、时效、毒性、提示注入、延迟和成本。评测数据区分训练/调优/验收，防止过拟合；模型/Prompt/retrieval 任一变化都重跑。

LLM-as-judge 只能作为一个信号，需校准并抽样人工复核。无来源或低置信输出必须降级，不因“语句流畅”判定正确。

## 28. 测试数据与 Flaky 政策

### 28.1 测试数据

使用 builder/factory 生成最小意图数据；生产数据不得进入测试。固定 fixture 记录来源、许可证和 schema
version。PII 用合成值。E2E 账号/资源有唯一 run ID、自动清理和保留失败现场策略。

### 28.2 Flaky Test 政策

Flaky 是缺陷。首次确认后创建 owner/issue、记录频率，可隔离但不得静默 retry 掩盖；隔离最长 7 天，核心安全/数据测试不得 quarantine。CI
retry 只用于诊断并同时报告首次失败。逾期测试阻断 owner 模块发布。

## 29. CI 分层

- Pre-commit：受影响 format/lint/快速 unit；
- PR：全静态、受影响 unit/integration/contract、E2E smoke、scan；
- Merge/develop：完整 unit/integration、build、staging smoke；
- Nightly：全 E2E、跨平台、视觉、性能趋势、依赖深扫；
- Release：迁移/恢复、容量/soak、安全、签名/更新与手工探索。

Turbo
cache 只缓存确定性且不含 secrets 的任务；测试报告、coverage、trace、截图和视频作为有保留期制品。

## 30. 评审原则与类型

### 30.1 评审原则

评审针对代码和决策，不针对作者。结论必须可执行、基于证据并标注严重度。自动工具负责格式与机械规则；人工优先检查业务正确性、边界、失败模式、安全、可访问性、迁移和可维护性。

作者对可评审性负责，reviewer 对认真验证负责，最终 owner 对风险接受负责。批准不转移作者责任。

### 30.2 评审类型

| 类型             | 触发条件                            | 必需参与者                        |
| ---------------- | ----------------------------------- | --------------------------------- |
| Product/RFC      | 跨域功能、行为/非目标不清           | Product、Design、相关 Engineering |
| Architecture/ADR | 新依赖/存储/服务/边界/运行时        | Architecture + owners             |
| API/Contract     | 公共 REST/WS/IPC/event 变化         | Producer + consumer owner         |
| Data/Migration   | schema、回填、保留、权限            | Backend/Data/SRE                  |
| Security/Privacy | auth、权限、外部内容、AI、插件、PII | Security/Privacy owner            |
| UI/A11y          | 新模式、Token/交互/布局变化         | Design System + A11y              |
| Operations       | 部署、告警、SLO、恢复、成本         | SRE/Release                       |
| Code Review      | 所有生产变更                        | CODEOWNERS 至少一人               |

一人可承担多个角色，但高风险变更至少两名独立 reviewer。

## 31. 评审严重度与顺序

### 31.1 PR 就绪标准

作者在请求 review 前：范围单一、Draft 自审完成、目标分支已同步、CI 基础检查通过、描述/截图/测试/风险/回滚完整、无无关格式化、注释和 TODO 可追踪、生成物同步。未达到可退回 Draft，不浪费 reviewer 时间。

建议净变更 ≤400 行。大型 PR 必须给出阅读顺序、按 commit 组织并说明为何不能拆。生成物、lockfile 和 snapshot 折叠单列。

### 31.2 严重度与处置

| 级别       | 含义                                       | 处置                                  |
| ---------- | ------------------------------------------ | ------------------------------------- |
| Blocker    | 安全/数据损坏/生产不可用/违法/无法回滚     | 必须修复，禁止合并                    |
| Major      | 正确性、兼容、可访问性、明显架构或性能风险 | 必须修复或由 owner 书面接受并建 issue |
| Minor      | 可维护性、测试缺口、边界情况               | 通常合并前修复；可追踪后续            |
| Suggestion | 非阻断改进/替代方案                        | 作者判断并回应                        |
| Question   | 需要澄清，不默认阻断                       | 回答后 reviewer 决定是否升级          |

评论写法：`[Major] <问题>` + 具体场景/证据 + 影响 + 建议或验收条件。避免只说“感觉不对”“改一下”。重复问题用一个总评论和代表行，不制造噪音。

### 31.3 评审顺序

1. 问题、用户行为和非目标是否正确；
2. 安全、隐私、授权和数据完整性；
3. 架构边界、契约兼容和故障/回滚；
4. 并发、性能、可观测性和运维；
5. 测试充分性、可访问性和开发体验；
6. 命名、局部清晰度与风格。

不要先花时间挑命名，最后才发现方案本身不可行。

## 32. 评审专项检查

### 32.1 通用检查

- 行为满足需求，边界/空/慢/失败/并发场景明确；
- 变化位于正确模块，无循环/深 import/跨域数据访问；
- 类型在边界验证，无 `any`、危险断言、吞异常；
- 权限服务端执行，输入/输出/日志/secret 安全；
- API/事件/IPC 向后兼容，版本/弃用/生成物同步；
- 数据迁移、约束、索引、回填、保留和恢复可执行；
- timeout/retry/idempotency/cache 限定且可观测；
- 测试覆盖风险而非实现，失败证明有效；
- 用户可见状态、无障碍、国际化和文档完整；
- Feature flag、指标、告警、发布和回滚有 owner。

### 32.2 前端/UI 专项

- TanStack Query/Zustand/URL 状态职责未重复；
- 组件规模与 feature 边界合理，无巨型页面或过早共享；
- 无 inline style/raw color/任意 z-index，Token 与 UI primitives 正确；
- loading/empty/error/offline/overflow/long text/disabled 完整；
- 键盘、焦点、ARIA、200% 缩放、明暗/高对比/reduced-motion 通过；
- 动画可中断、无 layout shift，列表/媒体/blur 性能达预算；
- Electron IPC 最小化且 Renderer 无 Node/secret 能力；
- 截图覆盖规定窗口和主题，视觉回归差异是有意的。

### 32.3 后端/API/数据专项

- Controller/processor 薄，事务与授权在 application 边界；
- Repository 不泄漏 Prisma model，不跨模块表；
- 查询有 select、稳定排序、分页和索引证据，无 N+1；
- Queue 至少一次语义、幂等、超时、重试、dead-letter 完整；
- Redis 可丢失、TTL/失效/降级明确；
- API 使用正确 HTTP/error/pagination/ETag/idempotency；
- Migration expand/contract、锁/空间/回填/forward-fix 已演练；
- 审计、追踪和指标可定位失败但不泄漏敏感数据。

### 32.4 AI 与插件专项

- Prompt/模型/retrieval/tool schema 版本化且有离线评测；
- 外部内容明确不可信，prompt injection 不能改变权限；
- 工具调用服务端重新授权、参数验证、限额和审计；
- 输出引用、置信/拒答、内容安全、成本与延迟有门禁；
- 插件声明能力、签名、隔离、资源配额、兼容与撤销；
- 不将用户敏感上下文发送给未批准 provider/plugin。

### 32.5 命名评审清单

- 名称是否使用统一领域语言、可搜索且不泄漏实现？
- 动词是否准确表达副作用、失败和返回语义？
- Boolean/collection/time/ID 是否一眼可辨？
- 文件/导出/API/DB/event 是否遵循各自 casing？
- 缩写、版本、状态和错误 code 是否稳定可演进？
- 新术语是否进入 glossary/文档并清理旧别名？

## 33. 评审行为与审批

### 33.1 Reviewer 行为

先完整理解再评论；使用代码建议只处理小而明确修改，不替作者重写设计。明确标记阻断与非阻断。作者对每条评论回应“已改 +
commit/证据”“不改 + 理由”“后续 issue”，不得只 resolve。

有分歧时先回到需求、原则和证据；30 分钟无法收敛，交由模块 owner/ADR 决策。不得用职位压过可验证技术论证。同步讨论后的结论必须回写 PR。

### 33.2 审批与再评审

代码变化使先前审批失效；机械生成/冲突解决若可证明无语义变化可由 reviewer 快速确认。最后提交者不能在批准后加入未评审行为。所有 Blocker/Major
thread 关闭且 required approvals/CI 有效才可合并。

紧急 hotfix 仍需双人原则（无法满足时按 incident
override），缩减的是范围与等待，不是安全、数据和回滚检查。事后 24 小时内补全常规评审与测试。

### 33.3 评审效能

团队跟踪 review wait time、首次反馈时间、返工轮次、post-merge
defect 和 PR 大小，但不以“评论数/审批速度”评价个人。目标工作时段 4 小时内首次响应、1 个工作日内完成首轮；跨时区由 owner 调度。

重复评论应转成 lint、模板、测试或文档。每季度抽样已合并 PR 检查规则有效性，删除无价值门禁。

### 33.4 最终批准声明

批准意味着 reviewer 已理解范围，未发现未处理的 Blocker/Major，测试与回滚与风险相称，并愿意共同维护相关区域；不意味着绝对无缺陷。

## 34. 禁止清单与完成门禁

### 34.1 禁止清单

- `any`、隐式全局、monkey patch、生产 `console.log`；
- 巨型 component/service、跨域数据库访问、循环依赖；
- raw SQL/HTML/shell 字符串拼接；
- 业务组件 raw color、inline style、任意 z-index；
- 无界重试、无 timeout 网络调用、无分页集合接口；
- 修改生成文件、已发布 migration 或 lockfile 中手工片段；
- 通过注释、lint disable 或 skipped test 掩盖问题而无 issue/到期日。

### 34.2 完成标准

变更范围最小、命名和边界清晰、类型无逃逸、错误/安全/可访问性处理完整、测试与性能匹配风险、文档和生成物同步、CI 全绿，并具备部署/迁移/回滚说明。

### 34.3 发布门禁

所有 required
suites 通过、无过期 quarantine、覆盖率不下降、关键性能在预算、无未接受高危漏洞、契约无未批准 breaking
change、迁移/恢复验证、关键 a11y 手工检查和测试证据链接齐全。
