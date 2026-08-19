# 数据与 API 规范

| 属性   | 值                                                       |
| ------ | -------------------------------------------------------- |
| 状态   | Baseline v1.0                                            |
| 所有者 | Data + Backend Platform + API Council                    |
| 事实源 | PostgreSQL                                               |
| 协议   | HTTPS REST/JSON + WebSocket；OpenAPI/AsyncAPI 为机器契约 |

## 1. 设计原则

API 是长期产品契约，不是数据库的远程映射。目标是可预测、可演进、可观测、可缓存和客户端友好。默认 REST；只有持续事件/进度需要 WebSocket。内部与外部 API 使用同等验证标准，但管理能力独立授权和审计。

PostgreSQL 是业务事实的唯一权威来源。Redis、客户端缓存、搜索索引、向量索引和分析仓库必须可从事实数据与事件重建。数据模型服务领域不变量、审计和演进，不直接复制页面形状。

## 2. 概念数据域

| 域           | 概念实体                                            | 关键治理点                     |
| ------------ | --------------------------------------------------- | ------------------------------ |
| Identity     | users、external_identities、sessions、roles、grants | PII 分类、撤销、审计           |
| Catalog      | games、platforms、releases、patches、taxonomies     | 稳定 slug、版本时间线          |
| Knowledge    | documents、revisions、sources、reviews、citations   | 不可变修订、发布指针、来源授权 |
| Builds       | builds、build_versions、components、compatibility   | 游戏版本适用性、快照           |
| Assistant    | conversations、messages、citations、usage、feedback | 保留期、脱敏、模型/Prompt 版本 |
| Community    | resources、ratings/trust_signals、reports           | 防滥用、审核审计               |
| Notification | preferences、deliveries、receipts                   | 幂等投递、退订                 |
| Media        | assets、variants、ownership、processing_jobs        | 对象存储引用、哈希、许可证     |
| Platform     | outbox_events、audit_events、feature_flag_audits    | append-only、归档              |

此表是边界清单而非物理 schema。实体、字段和关系必须随领域 RFC/ADR 设计，禁止据此直接生成迁移。

## 3. 标识与通用字段

- 主键默认 UUID
  v7（数据库/应用生成策略由 ADR 固定），兼顾全局唯一和索引局部性；外部不可暴露自增 ID；
- 时间使用 `timestamptz`、UTC 存储，API 输出 RFC 3339；业务日期另用 `date`；
- 金额（未来）使用最小货币单位整数或明确 precision 的 decimal，禁止 float；
- 枚举：稳定且数据库约束强的状态可用 PostgreSQL enum；高频演进值用 text + check/reference table；
- 每张可变表至少有 `created_at`、`updated_at`；需要乐观并发时加 `version`；
- 用户可见 slug 可变且不作为外键；唯一约束需明确大小写与 locale 行为。

## 4. 命名与约束

物理对象使用 `snake_case` 复数表名，主键 `id`，外键 `<singular>_id`，唯一约束
`uq_<table>__<columns>`，索引 `ix_<table>__<columns>`，外键 `fk_<from>__<to>`，check
`ck_<table>__<rule>`。详见 [NAMING_RULE.md](./engineering.md)。

正确性优先由数据库约束保证：NOT
NULL、FK、UNIQUE、CHECK。Prisma/schema 验证不能替代数据库约束。所有 FK 明确
`ON DELETE`：默认 RESTRICT；CASCADE 仅用于真正组成关系并有测试。

## 5. URL 与版本

- Base：`/api/v1`；路径使用复数、kebab-case 名词，如 `/games/{gameId}/guides`；
- 不在 URL 使用动词，确属命令语义时使用子资源：`POST /guide-revisions/{id}/publication`；
- 主版本只在破坏性契约时增加；字段增加保持向后兼容；
- 支持的 Desktop 版本窗口与弃用日期由 Release policy 公布，响应可带 `Deprecation`、`Sunset`
  与文档链接；
- 资源 ID 使用不透明字符串；人类可读 slug 仅用于定位且允许变更。

## 6. HTTP 语义

| 方法   | 用途                         | 幂等                           |
| ------ | ---------------------------- | ------------------------------ |
| GET    | 读取资源/集合；无副作用      | 是                             |
| POST   | 创建或非幂等命令             | 否；高风险支持 Idempotency-Key |
| PUT    | 完整替换（少用）             | 是                             |
| PATCH  | 部分更新，使用明确 patch DTO | 设计为幂等                     |
| DELETE | 删除/撤销资源                | 是（重复返回稳定结果）         |

状态码：200 读取/同步变更、201 创建并返回
`Location`、202 异步接受、204 无 body、304 条件缓存、400 协议错误、401 未认证、403 无权、404 不泄露或不存在、409 冲突、412 前置条件失败、422 语义验证、429 限流、500 未知错误、502/503/504 依赖/暂不可用。

## 7. 表示与字段

JSON 字段使用 `camelCase`；时间为 RFC 3339 UTC；日期为 `YYYY-MM-DD`；枚举是稳定小写 `snake_case`
字符串；未知枚举客户端必须安全降级。缺失与 `null` 语义需在 schema 中区分。

成功的单资源直接返回资源或稳定 response DTO，不强制无价值 `{ data }` 包装；集合采用：

```json
{
  "items": [],
  "pageInfo": {
    "nextCursor": null,
    "hasNextPage": false
  },
  "meta": {
    "requestId": "req_..."
  }
}
```

禁止返回内部表名、堆栈、Prisma error、secret、未授权字段或未经限制的动态对象。

## 8. 分页、筛选与排序

变化频繁/大集合默认 cursor
pagination。Cursor 不透明、签名/防篡改并编码稳定排序边界；排序必须含唯一 tie-breaker。默认
`limit=20`、最大 100，端点可收紧。

筛选用明确参数，如 `filter[gameId]`、`filter[status]`；排序用 `sort=-publishedAt,title`；全文搜索用
`q`。不接受任意字段、任意操作符或客户端 SQL 风格表达式。offset 只用于小型、稳定、需要页码的管理集合，并写明上限。

## 9. 错误格式

采用 RFC 9457 Problem Details，扩展稳定 `code`、`requestId` 和字段错误：

```json
{
  "type": "https://docs.example.invalid/problems/validation",
  "title": "请求数据无效",
  "status": 422,
  "code": "VALIDATION_FAILED",
  "detail": "请修正标记字段后重试。",
  "instance": "/api/v1/builds",
  "requestId": "req_...",
  "errors": [{ "path": "title", "code": "too_long", "message": "标题不能超过 120 个字符" }]
}
```

`code` 一经发布不可改变含义；本地化 `message/detail`
不参与程序判断。认证/授权错误避免透露账号、资源或策略细节。500 只返回通用信息与 request ID。

## 10. 修订、删除与审计

Wiki/攻略/Build 等可发布内容采用不可变 revision + 当前发布指针；编辑产生新修订，便于比较、回滚、审核和引用固定版本。审计事件 append-only，业务管理员不能更新或删除。

软删除不是默认方案。需要恢复、法律保留或引用完整性时使用 `deleted_at`
并确保所有唯一约束、查询和索引理解软删除；否则硬删除配合审计/备份。个人数据删除采用去标识化、级联清理与法定保留策略，不能只设置一个标记。

## 11. 并发与一致性

默认 isolation 使用 PostgreSQL `READ COMMITTED`；需要更强保证的 use
case 显式使用行锁、唯一约束、乐观版本或更高隔离级别，并处理 serialization
failure。禁止“先查再写”而无约束防竞态。

跨模块副作用写入 outbox 与业务事务同提交；publisher 可重复发送，consumer 以 event
ID/幂等键去重。最终一致性状态必须对用户可解释，并有对账/修复任务。

## 12. 并发、缓存与条件请求

可编辑资源返回 `ETag`/version；更新要求
`If-Match`，版本冲突返回 412/409 和恢复提示。读取按数据敏感度设置 `Cache-Control`，用户私有响应默认
`private, no-store` 或严格短缓存；公共版本内容可用 ETag/CDN。

写成功后返回最新表示或 204，客户端不得假设本地 patch 等于服务端状态。创建类请求可接受
`Idempotency-Key`；同 key 不同 body 返回冲突。

## 13. 长任务与流式响应

耗时操作返回 202 和 operation
resource：`/operations/{id}`，状态为 queued/running/succeeded/failed/cancelled，带 progress（可选）、结果链接和稳定错误。客户端轮询带
`Retry-After`，或订阅对应 WebSocket 事件。

AI 流可使用 SSE 或 WebSocket，具体由 ADR 选择；流帧带 sequence/type，最终帧包含 usage、citations、finishReason。连接断开不等于任务取消，取消必须调用显式命令并授权。

## 14. WebSocket/事件契约

连接先完成认证与协议版本协商。事件 envelope：

```json
{
  "id": "evt_...",
  "type": "operation.progress.v1",
  "occurredAt": "2026-08-04T10:00:00Z",
  "correlationId": "req_...",
  "sequence": 17,
  "data": {}
}
```

事件名以过去式表达事实，命令不得伪装事件。Schema 保存在 contracts 中并生成类型；消费者忽略未知可选字段，对未知 major 版本停止处理并刷新快照。事件交付按 at-least-once 设计，客户端去重；不可依赖实时事件作为唯一事实。

## 15. 查询与索引

每个查询必须有稳定排序、字段投影、合理上限。索引由真实查询模式驱动，记录对应 query、选择性、写放大和移除条件。组合索引列顺序匹配过滤/排序；低选择性单列通常不建索引。

上线前对关键查询在生产相似数据执行 `EXPLAIN (ANALYZE, BUFFERS)`；慢查询门槛初始为 500
ms 并随 SLO 调整。定期检查 unused/duplicate indexes、膨胀、锁和统计信息。

搜索初期使用 PostgreSQL FTS +
`pg_trgm`（需 ADR/扩展可用性验证）；只有相关性、语言分词、吞吐或规模连续超出预算，才引入专用搜索引擎。向量检索可使用
`pgvector` 或外部服务，但必须保留源文档 ID、revision、embedding model/version 和可重建流程。

## 16. 迁移策略

所有生产迁移采用 expand → migrate/backfill → contract：

1. Expand：添加 nullable/有默认策略的新结构，保持旧应用兼容；
2. Migrate：双读/双写（仅必要时）、分批回填、校验计数与校验和；
3. Switch：特性开关切换读取，观察；
4. Contract：支持窗口结束后删除旧结构，单独发布。

大表加列、索引、类型变更必须评估锁；优先 concurrent
index（事务限制需处理）和小批回填。Migration 需有 owner、预计时长、锁风险、磁盘增量、监控、停止条件和 forward-fix。禁止修改已在共享环境应用的 migration 文件。

### Prisma 边界

- Prisma schema 按模块分区/注释维护，生成 Client 不外泄到 interface/domain；
- Repository 将数据库行映射为领域/读取模型，避免 DTO=Prisma model；
- 事务由 application use case 决定，repository 不私自开启无法组合的事务；
- 禁止在循环中查询、无界 `findMany`、隐式加载大 relation 和生产 `db push`；
- Migration 文件经人工评审，不因生成工具而默认可信。

## 17. 安全与访问

- 应用、迁移、只读分析和备份使用不同最小权限角色；生产禁止共享超级用户；
- 连接强制 TLS，凭据由 secret manager 轮换；
- PII 字段建立数据目录，必要时应用层 envelope encryption；密钥不在数据库；
- 非生产使用合成/脱敏数据，禁止复制完整生产库到开发机；
- 所有管理查询可审计，break-glass 访问限时、审批并告警；
- RLS 不是默认复杂度；出现多租户需求时作为独立 ADR 与防御层引入，应用授权仍不可省略。

## 18. 备份、恢复与保留

生产启用自动快照 + PITR，目标 RPO 15 分钟、RTO
60 分钟。备份跨故障域、加密、设置不可变保留，并至少每季度执行隔离恢复演练。恢复验证包括 schema
version、行数/校验、关键查询和应用 smoke test，不以“备份任务成功”替代恢复证明。

为会话、日志、AI 内容、审计、媒体和软删除记录分别定义保留期与 legal
hold；到期清理为可观测、可重试作业。删除需传播到缓存、索引、对象存储和派生数据。

## 19. 数据质量与运营

关键数据定义 completeness、uniqueness、freshness、referential
integrity 指标。Outbox 积压、孤儿媒体、搜索索引差异、失效引用和版本不匹配需定期对账。修复脚本位于
`infrastructure/migrations`，必须 dry-run、限速、可恢复并输出审计摘要。

## 20. 验证与安全

- 对 path/query/header/body/WS frame 做运行时 schema 验证与大小限制；
- 认证后仍逐资源授权；批量接口逐项授权并限制数量；
- CORS 精确 allowlist，不用 `*` 搭配 credentials；
- 速率限制按 IP、用户、token、资源成本组合，429 返回 `Retry-After`；
- URL、Markdown、HTML、文件和模型输出均视为不可信；输出编码在消费端完成；
- 日志只记录字段摘要和分类，不记录 Authorization、cookie、完整个人/AI 内容。

## 21. OpenAPI 与生成客户端

OpenAPI 是 CI 制品和 API 评审依据：operationId 稳定唯一；所有状态、schema、权限、分页和示例明确。生成
`packages/api-client`，generated 文件不可手改；自定义 transport、错误映射和 query
hooks 放在生成目录外。

CI 执行 schema lint、breaking-change
diff、生成物无漂移、契约测试。API 改动顺序是 schema/评审 → 服务实现 → 客户端生成 → 兼容测试；不得先改客户端猜测响应。

## 22. 可观测性头与元数据

接收/返回 `X-Request-Id`（服务端校验或重建），传播 W3C
`traceparent`。公开限流可返回标准 RateLimit 头。客户端版本使用
`X-Client-Version`，但授权和行为不能只信任可伪造头。

## 23. 变更门禁与契约评审清单

### 数据变更门禁

- Schema/查询与领域 owner 双评审；破坏性变更需 ADR；
- Migration 在真实量级副本验证耗时、锁和空间；
- 应用版本兼容、备份、回填、观测、停止/回滚策略齐备；
- 新数据说明分类、保留、删除、访问角色与下游；
- Prisma 生成、集成测试、契约测试和关键查询计划快照通过。

### 契约评审清单

- 资源模型与用户任务一致，不泄漏持久层；
- 命名、HTTP 语义、错误和权限稳定；
- 分页/上限/排序/幂等/并发策略明确；
- 旧客户端与事件消费者兼容；
- 敏感字段、枚举扩展、缓存和日志已评估；
- OpenAPI/AsyncAPI lint、diff、contract/E2E 测试通过；
- 弃用、迁移、观测与回滚路径存在。
