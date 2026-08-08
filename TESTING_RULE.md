# 测试与质量验证规范

| 属性   | 值                                                               |
| ------ | ---------------------------------------------------------------- |
| 状态   | Baseline v1.0                                                    |
| 所有者 | Quality Engineering + 各模块 Owner                               |
| 工具   | Vitest、Playwright、Storybook；集成环境使用隔离 PostgreSQL/Redis |

## 1. 测试策略

测试按风险而非文件数量分配。目标是快速定位回归、证明边界契约并验证真实用户流程；不追求覆盖率数字本身。测试金字塔：大量 unit，适量 component/integration/contract，少量高价值 E2E，另有性能、安全、无障碍和恢复演练。

```text
             E2E / Release qualification
        Contract / Integration / Component
                 Unit / Static checks
```

静态类型和 lint 不能替代运行时、授权、并发与协议测试。

## 2. 测试层级

| 层级           | 范围                                     | 工具/边界                         | 目标时长                |
| -------------- | ---------------------------------------- | --------------------------------- | ----------------------- |
| Static         | format/lint/type/dependency/schema       | Biome/ESLint/tsc/schema lint      | PR 分钟级               |
| Unit           | 纯 domain、mapper、state、utils          | Vitest；无网络/真实 DB            | 单测毫秒级              |
| Component      | React 组件交互/可访问性                  | Vitest + DOM + Storybook          | 单文件秒级              |
| Integration    | Module + PostgreSQL/Redis/BullMQ adapter | 隔离容器/真实依赖                 | Suite 分钟级            |
| Contract       | OpenAPI/AsyncAPI、provider、IPC          | schema + consumer/provider checks | PR 分钟级               |
| E2E            | Desktop/API 关键旅程                     | Playwright Electron/Web/API       | PR smoke / nightly full |
| Non-functional | 性能、安全、a11y、恢复                   | 专项工具与演练                    | nightly/release         |

## 3. 覆盖率门槛

初始全仓门槛：lines/functions/statements ≥80%，branches
≥75%；核心 domain、认证/授权、迁移/支付式高风险（未来）≥90% lines、≥85%
branches。新/改行覆盖率建议 ≥90%。

门槛是最低线。禁止无意义断言、测试实现细节或排除困难文件来刷数字。Generated、类型声明、配置薄入口可按审议排除；排除清单有 owner。Mutation
testing 可用于核心规则验证测试质量。

## 4. Unit 与 Domain 测试

- Arrange/Act/Assert 清晰，每个测试一个行为；名称：`should <outcome> when <condition>`；
- 覆盖 happy path、边界、无效输入、权限、并发版本和失败；
- 时间、UUID、随机、provider 使用 deterministic fake；
- 不 mock 被测对象内部函数，不读取 private，不用 snapshot 替代业务断言；
- Property-based testing 用于解析器、排序、游标、Build 规则等组合空间大的纯逻辑。

## 5. Frontend Component 测试

从可访问角色、名称和用户行为查询 DOM，不依赖 CSS
class/内部 state。至少验证 loading、empty、error、disabled、overflow、键盘和 focus；主题视觉由 Storybook/visual
test 覆盖。

避免对大 DOM 做无审阅 snapshot。允许小型稳定序列化结构 snapshot，并在 PR 中审查差异。Motion 测试使用 reduced-motion 或可控时钟，不等待真实动画。

## 6. Backend Integration 测试

Repository、事务、outbox、锁、约束、Redis
TTL/失效和 BullMQ 幂等需连接真实兼容版本；不以 SQLite/in-memory 假装 PostgreSQL。每个 worker 测试成功、瞬态重试、永久失败、重复 job、超时和 poison
message。

数据库每 suite/test 使用独立 schema/database 或事务策略，不能依赖测试顺序。Migration 从上一生产 schema 升级并验证数据，不能只测空库。

## 7. 契约测试

- OpenAPI lint、breaking diff、response validation 和生成 client 编译；
- AsyncAPI/事件 schema 的 backward/forward compatibility 与未知字段；
- Electron IPC 的 channel/version/request/response schema、拒绝未授权调用；
- 外部 AI/OIDC/media provider 使用录制/沙箱契约，Secret 不进入 fixture；
- Consumer-driven contract 仅用于存在独立消费者部署节奏的边界，不到处引入。

## 8. E2E 关键旅程

PR
smoke 至少包含：Desktop 启动/恢复、登录模拟、导航/深链接、搜索并打开攻略、错误/离线恢复、主题切换与键盘导航。相应功能里程碑加入 Build 保存冲突、AI 引用/取消、通知重连和自动更新测试。

Playwright 使用稳定 `data-testid`
仅在语义查询不足时；ID 表达角色不含样式/位置。禁止固定 sleep，等待可观察状态、网络/事件条件。测试可并行且数据独立。

跨平台矩阵：每 PR 至少主要开发 OS +
renderer；nightly/release 覆盖受支持 Windows/macOS，Linux 支持级别由 ADR 决定。窗口尺寸覆盖 1024×640、1280×720、1440×900、1920×1080 与高 DPI。

## 9. 视觉与无障碍

Storybook 每个组件覆盖明/暗、高对比、长文本、200% 字体、reduced-motion。视觉差异必须人工审阅，不能盲目更新 baseline。

自动 axe 检查不能替代人工：关键旅程验证仅键盘、焦点顺序/恢复、屏幕阅读器、颜色非唯一、缩放、Windows
High Contrast。对比值在 Token CI 自动计算。

## 10. 性能测试

基准固定硬件、OS、数据集、网络和版本。测量 Desktop 冷/热启动、route/input、内存、长列表滚动、API
P95/P99、DB 查询/锁、WebSocket 重连、queue lag、AI 首 token/总时长/成本。

PR 用 micro/target
benchmark 防局部回归；nightly 做趋势；release 做容量与 soak。预算超出必须阻断或由 owner 提供有时限的 waiver。任何性能优化附 before/after 原始结果。

## 11. 安全测试

- SAST、secret、dependency/license、SBOM 和镜像扫描；
- API 认证/资源授权/枚举、速率限制、输入大小、注入、SSRF、上传；
- Electron node exposure、IPC allowlist、navigation/CSP、custom protocol、更新签名；
- AI prompt injection、工具越权、数据泄漏、恶意 Markdown/引用；
- 插件阶段增加 manifest/签名/能力/沙箱逃逸与撤销；
- 每个主要 release 做 threat model delta，高风险里程碑安排渗透测试。

## 12. AI 质量评测

建立版本化 golden
set，按游戏版本/语言/问题类型分层，测引用正确性、groundedness、拒答、时效、毒性、提示注入、延迟和成本。评测数据区分训练/调优/验收，防止过拟合；模型/Prompt/retrieval 任一变化都重跑。

LLM-as-judge 只能作为一个信号，需校准并抽样人工复核。无来源或低置信输出必须降级，不因“语句流畅”判定正确。

## 13. 测试数据

使用 builder/factory 生成最小意图数据；生产数据不得进入测试。固定 fixture 记录来源、许可证和 schema
version。PII 用合成值。E2E 账号/资源有唯一 run ID、自动清理和保留失败现场策略。

## 14. Flaky Test 政策

Flaky 是缺陷。首次确认后创建 owner/issue、记录频率，可隔离但不得静默 retry 掩盖；隔离最长 7 天，核心安全/数据测试不得 quarantine。CI
retry 只用于诊断并同时报告首次失败。逾期测试阻断 owner 模块发布。

## 15. CI 分层

- Pre-commit：受影响 format/lint/快速 unit；
- PR：全静态、受影响 unit/integration/contract、E2E smoke、scan；
- Merge/develop：完整 unit/integration、build、staging smoke；
- Nightly：全 E2E、跨平台、视觉、性能趋势、依赖深扫；
- Release：迁移/恢复、容量/soak、安全、签名/更新与手工探索。

Turbo
cache 只缓存确定性且不含 secrets 的任务；测试报告、coverage、trace、截图和视频作为有保留期制品。

## 16. 发布门禁

所有 required
suites 通过、无过期 quarantine、覆盖率不下降、关键性能在预算、无未接受高危漏洞、契约无未批准 breaking
change、迁移/恢复验证、关键 a11y 手工检查和测试证据链接齐全。
