# 评审规范

| 属性   | 值                                                         |
| ------ | ---------------------------------------------------------- |
| 状态   | Baseline v1.0                                              |
| 所有者 | Engineering Leadership                                     |
| 目标   | 尽早发现正确性、安全、数据、兼容与运维风险，并传播系统知识 |

## 1. 评审原则

评审针对代码和决策，不针对作者。结论必须可执行、基于证据并标注严重度。自动工具负责格式与机械规则；人工优先检查业务正确性、边界、失败模式、安全、可访问性、迁移和可维护性。

作者对可评审性负责，reviewer 对认真验证负责，最终 owner 对风险接受负责。批准不转移作者责任。

## 2. 评审类型

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

## 3. PR 就绪标准

作者在请求 review 前：范围单一、Draft 自审完成、目标分支已同步、CI 基础检查通过、描述/截图/测试/风险/回滚完整、无无关格式化、注释和 TODO 可追踪、生成物同步。未达到可退回 Draft，不浪费 reviewer 时间。

建议净变更 ≤400 行。大型 PR 必须给出阅读顺序、按 commit 组织并说明为何不能拆。生成物、lockfile 和 snapshot 折叠单列。

## 4. 严重度与处置

| 级别       | 含义                                       | 处置                                  |
| ---------- | ------------------------------------------ | ------------------------------------- |
| Blocker    | 安全/数据损坏/生产不可用/违法/无法回滚     | 必须修复，禁止合并                    |
| Major      | 正确性、兼容、可访问性、明显架构或性能风险 | 必须修复或由 owner 书面接受并建 issue |
| Minor      | 可维护性、测试缺口、边界情况               | 通常合并前修复；可追踪后续            |
| Suggestion | 非阻断改进/替代方案                        | 作者判断并回应                        |
| Question   | 需要澄清，不默认阻断                       | 回答后 reviewer 决定是否升级          |

评论写法：`[Major] <问题>` + 具体场景/证据 + 影响 + 建议或验收条件。避免只说“感觉不对”“改一下”。重复问题用一个总评论和代表行，不制造噪音。

## 5. 评审顺序

1. 问题、用户行为和非目标是否正确；
2. 安全、隐私、授权和数据完整性；
3. 架构边界、契约兼容和故障/回滚；
4. 并发、性能、可观测性和运维；
5. 测试充分性、可访问性和开发体验；
6. 命名、局部清晰度与风格。

不要先花时间挑命名，最后才发现方案本身不可行。

## 6. 通用检查

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

## 7. 前端/UI 专项

- TanStack Query/Zustand/URL 状态职责未重复；
- 组件规模与 feature 边界合理，无巨型页面或过早共享；
- 无 inline style/raw color/任意 z-index，Token 与 UI primitives 正确；
- loading/empty/error/offline/overflow/long text/disabled 完整；
- 键盘、焦点、ARIA、200% 缩放、明暗/高对比/reduced-motion 通过；
- 动画可中断、无 layout shift，列表/媒体/blur 性能达预算；
- Electron IPC 最小化且 Renderer 无 Node/secret 能力；
- 截图覆盖规定窗口和主题，视觉回归差异是有意的。

## 8. 后端/API/数据专项

- Controller/processor 薄，事务与授权在 application 边界；
- Repository 不泄漏 Prisma model，不跨模块表；
- 查询有 select、稳定排序、分页和索引证据，无 N+1；
- Queue 至少一次语义、幂等、超时、重试、dead-letter 完整；
- Redis 可丢失、TTL/失效/降级明确；
- API 使用正确 HTTP/error/pagination/ETag/idempotency；
- Migration expand/contract、锁/空间/回填/forward-fix 已演练；
- 审计、追踪和指标可定位失败但不泄漏敏感数据。

## 9. AI 与插件专项

- Prompt/模型/retrieval/tool schema 版本化且有离线评测；
- 外部内容明确不可信，prompt injection 不能改变权限；
- 工具调用服务端重新授权、参数验证、限额和审计；
- 输出引用、置信/拒答、内容安全、成本与延迟有门禁；
- 插件声明能力、签名、隔离、资源配额、兼容与撤销；
- 不将用户敏感上下文发送给未批准 provider/plugin。

## 10. Reviewer 行为

先完整理解再评论；使用代码建议只处理小而明确修改，不替作者重写设计。明确标记阻断与非阻断。作者对每条评论回应“已改 +
commit/证据”“不改 + 理由”“后续 issue”，不得只 resolve。

有分歧时先回到需求、原则和证据；30 分钟无法收敛，交由模块 owner/ADR 决策。不得用职位压过可验证技术论证。同步讨论后的结论必须回写 PR。

## 11. 审批与再评审

代码变化使先前审批失效；机械生成/冲突解决若可证明无语义变化可由 reviewer 快速确认。最后提交者不能在批准后加入未评审行为。所有 Blocker/Major
thread 关闭且 required approvals/CI 有效才可合并。

紧急 hotfix 仍需双人原则（无法满足时按 incident
override），缩减的是范围与等待，不是安全、数据和回滚检查。事后 24 小时内补全常规评审与测试。

## 12. 评审效能

团队跟踪 review wait time、首次反馈时间、返工轮次、post-merge
defect 和 PR 大小，但不以“评论数/审批速度”评价个人。目标工作时段 4 小时内首次响应、1 个工作日内完成首轮；跨时区由 owner 调度。

重复评论应转成 lint、模板、测试或文档。每季度抽样已合并 PR 检查规则有效性，删除无价值门禁。

## 13. 最终批准声明

批准意味着 reviewer 已理解范围，未发现未处理的 Blocker/Major，测试与回滚与风险相称，并愿意共同维护相关区域；不意味着绝对无缺陷。
