# API 与实时契约规范

| 属性   | 值                                                       |
| ------ | -------------------------------------------------------- |
| 状态   | Baseline v1.0                                            |
| 所有者 | API Council                                              |
| 协议   | HTTPS REST/JSON + WebSocket；OpenAPI/AsyncAPI 为机器契约 |

## 1. 设计原则

API 是长期产品契约，不是数据库的远程映射。目标是可预测、可演进、可观测、可缓存和客户端友好。默认 REST；只有持续事件/进度需要 WebSocket。内部与外部 API 使用同等验证标准，但管理能力独立授权和审计。

## 2. URL 与版本

- Base：`/api/v1`；路径使用复数、kebab-case 名词，如 `/games/{gameId}/guides`；
- 不在 URL 使用动词，确属命令语义时使用子资源：`POST /guide-revisions/{id}/publication`；
- 主版本只在破坏性契约时增加；字段增加保持向后兼容；
- 支持的 Desktop 版本窗口与弃用日期由 Release policy 公布，响应可带 `Deprecation`、`Sunset`
  与文档链接；
- 资源 ID 使用不透明字符串；人类可读 slug 仅用于定位且允许变更。

## 3. HTTP 语义

| 方法   | 用途                         | 幂等                           |
| ------ | ---------------------------- | ------------------------------ |
| GET    | 读取资源/集合；无副作用      | 是                             |
| POST   | 创建或非幂等命令             | 否；高风险支持 Idempotency-Key |
| PUT    | 完整替换（少用）             | 是                             |
| PATCH  | 部分更新，使用明确 patch DTO | 设计为幂等                     |
| DELETE | 删除/撤销资源                | 是（重复返回稳定结果）         |

状态码：200 读取/同步变更、201 创建并返回
`Location`、202 异步接受、204 无 body、304 条件缓存、400 协议错误、401 未认证、403 无权、404 不泄露或不存在、409 冲突、412 前置条件失败、422 语义验证、429 限流、500 未知错误、502/503/504 依赖/暂不可用。

## 4. 表示与字段

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

## 5. 分页、筛选与排序

变化频繁/大集合默认 cursor
pagination。Cursor 不透明、签名/防篡改并编码稳定排序边界；排序必须含唯一 tie-breaker。默认
`limit=20`、最大 100，端点可收紧。

筛选用明确参数，如 `filter[gameId]`、`filter[status]`；排序用 `sort=-publishedAt,title`；全文搜索用
`q`。不接受任意字段、任意操作符或客户端 SQL 风格表达式。offset 只用于小型、稳定、需要页码的管理集合，并写明上限。

## 6. 错误格式

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

## 7. 并发、缓存与条件请求

可编辑资源返回 `ETag`/version；更新要求
`If-Match`，版本冲突返回 412/409 和恢复提示。读取按数据敏感度设置 `Cache-Control`，用户私有响应默认
`private, no-store` 或严格短缓存；公共版本内容可用 ETag/CDN。

写成功后返回最新表示或 204，客户端不得假设本地 patch 等于服务端状态。创建类请求可接受
`Idempotency-Key`；同 key 不同 body 返回冲突。

## 8. 长任务与流式响应

耗时操作返回 202 和 operation
resource：`/operations/{id}`，状态为 queued/running/succeeded/failed/cancelled，带 progress（可选）、结果链接和稳定错误。客户端轮询带
`Retry-After`，或订阅对应 WebSocket 事件。

AI 流可使用 SSE 或 WebSocket，具体由 ADR 选择；流帧带 sequence/type，最终帧包含 usage、citations、finishReason。连接断开不等于任务取消，取消必须调用显式命令并授权。

## 9. WebSocket/事件契约

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

## 10. 验证与安全

- 对 path/query/header/body/WS frame 做运行时 schema 验证与大小限制；
- 认证后仍逐资源授权；批量接口逐项授权并限制数量；
- CORS 精确 allowlist，不用 `*` 搭配 credentials；
- 速率限制按 IP、用户、token、资源成本组合，429 返回 `Retry-After`；
- URL、Markdown、HTML、文件和模型输出均视为不可信；输出编码在消费端完成；
- 日志只记录字段摘要和分类，不记录 Authorization、cookie、完整个人/AI 内容。

## 11. OpenAPI 与生成客户端

OpenAPI 是 CI 制品和 API 评审依据：operationId 稳定唯一；所有状态、schema、权限、分页和示例明确。生成
`packages/api-client`，generated 文件不可手改；自定义 transport、错误映射和 query
hooks 放在生成目录外。

CI 执行 schema lint、breaking-change
diff、生成物无漂移、契约测试。API 改动顺序是 schema/评审 → 服务实现 → 客户端生成 → 兼容测试；不得先改客户端猜测响应。

## 12. 可观测性头与元数据

接收/返回 `X-Request-Id`（服务端校验或重建），传播 W3C
`traceparent`。公开限流可返回标准 RateLimit 头。客户端版本使用
`X-Client-Version`，但授权和行为不能只信任可伪造头。

## 13. 契约评审清单

- 资源模型与用户任务一致，不泄漏持久层；
- 命名、HTTP 语义、错误和权限稳定；
- 分页/上限/排序/幂等/并发策略明确；
- 旧客户端与事件消费者兼容；
- 敏感字段、枚举扩展、缓存和日志已评估；
- OpenAPI/AsyncAPI lint、diff、contract/E2E 测试通过；
- 弃用、迁移、观测与回滚路径存在。
