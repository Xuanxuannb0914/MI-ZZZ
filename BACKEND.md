# 后端规范

| 属性   | 值                                                   |
| ------ | ---------------------------------------------------- |
| 状态   | Baseline v1.0                                        |
| 所有者 | Backend Platform                                     |
| 技术   | NestJS、PostgreSQL、Prisma、Redis、BullMQ、WebSocket |

## 1. 架构选择

后端以 NestJS **模块化单体**
起步，API 与 Worker 为两个部署进程。模块化单体允许核心写入保持本地事务、降低观测和运维复杂度；领域模块与端口适配器又保留未来按证据拆分的能力。

禁止以“未来可能扩展”为理由提前拆微服务。拆分必须同时满足：独立数据所有权、独立 SLO/扩缩容、明确团队 owner、可接受的一致性模型和可量化收益。

## 2. 模块地图与所有权

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

## 3. 模块内部职责

- **Domain**：实体、值对象、不变量、领域服务、领域事件和 repository port；不依赖框架；
- **Application**：use case、授权协调、事务边界、command/query、port；
- **Interface**：Controller、Gateway、Queue processor、DTO 和协议映射；
- **Infrastructure**：Prisma repository、Redis cache、外部 AI/媒体/邮件 adapter。

Controller 只做协议解析、验证、身份上下文和响应映射。Repository 不包含业务决策。跨模块调用通过对方 application facade；不得跨模块 join 私有表。复杂读取可由明确所有权的 read model 提供。

## 4. 请求生命周期

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

每个请求具备 request ID、trace context、超时和取消信号。全局 interceptor/filter 只处理横切关注点，不隐藏业务控制流。输入限制 body size、字段长度、数组大小和查询复杂度。

## 5. 认证与授权

认证基于 OIDC/OAuth 2.1 Authorization Code +
PKCE；具体 Provider 由 ADR 决定。API 校验 issuer、audience、signature、expiry 和 token type。刷新令牌轮换与复用检测由 Identity 负责。

授权采用 deny-by-default 的 policy/permission，资源级检查位于 application boundary。Controller guard 可做粗粒度检查，但不能替代对象级授权。管理员接口单独路由、权限、审计和速率限制；禁止以客户端隐藏按钮当授权。

## 6. PostgreSQL 与 Prisma

- Prisma Client 仅在 infrastructure 层使用，通过 request/application transaction context 协调事务；
- 每个模块拥有明确表前缀/映射与 repository，不直接暴露 Prisma model 到 API；
- 查询必须显式 select 所需字段，分页且有稳定排序；禁止无界列表和循环 N+1；
- 原生 SQL 仅用于 Prisma 无法清晰表达且有基准证据的查询，必须参数化、封装并测试；
- 迁移遵循 [DATABASE.md](./DATABASE.md) 的 expand/migrate/contract 和生产审批流程。

## 7. Redis 与缓存

Redis 用于短期缓存、限流计数、分布式协调、WebSocket adapter 与 BullMQ。它不是事实源。

Key 格式：`ggh:<env>:<domain>:<purpose>:<version>:<identity>`。每类 key 声明 owner、TTL、最大大小和失效方式；TTL 加随机抖动。缓存 value 使用版本化 schema，敏感数据默认不缓存。删除/更新事实后采用事件驱动失效，短 TTL 作为最终保护。

Redis 不可用时：核心读写绕过缓存继续访问 PostgreSQL；限流按端点风险 fail-open 或 fail-closed；队列型功能进入明确降级并告警。该策略必须按能力记录。

## 8. BullMQ 作业规范

Job payload 只含稳定 ID 与最少上下文，不携带大文档、令牌或完整用户数据。名称采用
`<domain>.<action>.v<major>`。每个 processor 定义：

- 幂等键和重复执行结果；
- timeout、attempts、指数退避与 jitter；
- concurrency、rate limit 与上游配额；
- progress 语义、失败分类、补偿与人工重放；
- retention、dead-letter/failed set 与告警阈值；
- payload schema 的向后兼容窗口。

数据库写入与入队需要 transactional outbox，禁止“先提交数据库再尽力 enqueue”的双写。

## 9. WebSocket

WebSocket 用于通知、协作状态和长任务进度，不替代 REST 事实读取。连接使用短期专用 ticket 或安全 token 协商，校验 origin/客户端版本；按用户、会话和主题授权 room。

事件包含
`id`、`type`、`version`、`occurredAt`、`correlationId`、`sequence?`、`data`。客户端必须处理重复、乱序、断线和版本未知；重连采用带抖动的指数退避，通过 cursor/REST snapshot 补偿丢失事件。背压时合并低价值进度事件并断开持续慢消费者。

## 10. AI Provider 边界

AI 是外部 adapter，不进入领域核心。Assistant application service 管理配额、模型策略、检索、引用、超时、取消、审计与降级。Prompt 模板版本化，外部内容标记为不可信数据；工具调用使用明确 schema、能力 allowlist 和服务端授权，模型不能自行扩大权限。

不得记录完整敏感 Prompt/Response；调试采样需脱敏、限时保留和用户/合规授权。模型、价格和 provider 可替换，业务层只依赖能力接口。输出在展示或执行前分别通过内容安全、引用完整性和工具参数验证。

## 11. 错误、重试与幂等

错误分为 validation、authentication、authorization、not-found、conflict、rate-limit、dependency、internal；对外按
[API_GUIDELINE.md](./API_GUIDELINE.md) 返回稳定 code。未知异常统一 500 并关联 error ID。

仅对瞬态故障重试；重试有上限、总时间预算和 jitter，禁止层层重试放大流量。创建/支付式高影响写入（如未来能力）支持
`Idempotency-Key`；幂等记录绑定用户、路由与请求摘要，并设置明确保留期。

## 12. 可观测性与运维

- Logs：结构化、脱敏、可关联，不用自由文本承载关键维度；
- Metrics：请求 RED、依赖、DB pool、queue lag、cache、WS、AI token/cost；
- Traces：HTTP→application→DB/Redis/queue/provider，采样策略保留错误和慢请求；
- Audit：主体、动作、资源、结果、策略、时间、来源，不记录秘密；
- Health：liveness 只反映进程；readiness 检查关键依赖且有严格超时。

告警必须可行动，链接 Runbook，指定 owner。禁止仅因单次错误告警；按 SLO burn rate 和持续异常设计。

## 13. 安全基线

TLS only；Helmet/CSP（适用于 HTTP 内容）、严格 CORS allowlist、速率限制、输入验证、参数化查询、上传内容类型/大小/恶意文件检查。内部管理端点与公开 API 分离。Secrets 由 secret manager 注入并轮换，禁止进入 Git、镜像或日志。

SSRF 防护需解析后校验协议、主机/IP、重定向和 DNS rebinding；用户 URL 抓取在隔离网络执行。Webhook（未来）必须签名、防重放、限时。依赖和容器镜像需扫描、SBOM 与签名。

## 14. 性能与容量

所有列表分页，默认 20、最大 100（具体端点可收紧）。API 层设置 timeout 和 body budget；DB pool 由实例数与数据库上限反推。使用 explain/analyze 与生产相似数据优化，不凭感觉加索引。

容量测试覆盖热点游戏、发布日流量、AI 流式响应、WS 重连风暴、队列 backlog 和缓存冷启动。每项测试保留场景、数据规模、版本与结果。

## 15. 完成门禁

模块依赖检查、单元/集成/契约/E2E、安全测试通过；OpenAPI 同步；迁移与回滚计划批准；日志指标追踪和告警可用；负载预算满足；数据分类、权限、幂等、超时和降级路径明确。任何未定义 owner 的后台任务不得上线。
