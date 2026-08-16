# 编码与工程规则

| 属性     | 值                                       |
| -------- | ---------------------------------------- |
| 状态     | Baseline v1.0                            |
| 所有者   | Engineering Productivity + Architecture  |
| 强制级别 | MUST / SHOULD / MAY；未标注条目默认 MUST |

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

## 6. 注释与文档

代码说明“为什么/约束/非显然风险”，不复述语法。TODO 格式：`TODO(owner, ISSUE-123, YYYY-MM-DD): reason`；无 owner/issue 的 TODO 不得合入。公共包 API、复杂算法、安全边界和迁移脚本需要文档。

决策进入 ADR/RFC，使用说明进入 README/Runbook，用户变化进入 CHANGELOG。注释不能替代清晰命名和测试。

## 7. 依赖治理

新增运行时依赖需说明：现有工具为何不足、维护/许可证/体积/安全、替代方案、移除成本。锁定精确 lockfile；禁止重复功能库和深 import 私有路径。依赖更新由自动 PR 分组，小版本自动化仍需测试，高风险框架单独升级。

Package `exports` 定义公共入口；禁止跨 package 相对路径。循环依赖、undeclared
dependency、生产包引用 dev/test 包由 CI 阻断。

## 8. 工具职责

| 工具                | 唯一职责                                                            | 避免冲突                                             |
| ------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| Biome               | TS/JS/JSON 快速格式化、import organize、安全语法 lint               | 关闭与 ESLint type-aware/React architecture 重复规则 |
| ESLint              | 类型感知、React hooks、Electron/Nest 安全、依赖边界、自定义架构规则 | 不承担格式化                                         |
| Prettier            | Markdown、YAML、CSS 及 Biome 未覆盖格式                             | 排除 TS/JS/JSON；不与 Biome 同文件                   |
| TypeScript          | 类型正确性与 project references                                     | 不用 lint 替代编译                                   |
| Turbo               | 任务图、缓存、受影响范围                                            | 持久任务/secret 输出不缓存                           |
| Husky + lint-staged | 在提交前运行受影响文件的快速本地反馈                                | 不复制完整 CI，不允许用 hook 代替服务端门禁          |
| Commitlint          | 校验 Conventional Commit message                                    | 规则与 [GIT_RULE.md](./GIT_RULE.md) 保持单一来源     |

每种文件只有一个 formatter。CI 顺序：format:check → lint → typecheck → test → build；本地 `check`
可并行但结果一致。Biome/ESLint 规则冲突以职责表修复，不用 disable 注释长期压制。

## 9. 配置与常量

无 magic number/string。业务阈值、timeout、尺寸、事件名、权限、route、query
key 使用有所有权的命名常量/配置；显然值（`0`, `1`
循环边界）无需抽象。环境配置启动时按 schema 验证，区分 secret 与非 secret，并提供 `.env.example`
但无真实值。

Feature flag 有 owner、用途、默认值、创建/到期日期和删除 issue。Flag 不能绕过授权、安全或数据约束。

## 10. 安全编码

- 所有外部输入视为 `unknown` 并在边界验证长度、形状和语义；
- 输出按 HTML/URL/SQL/shell 上下文编码；优先结构化 API，禁止字符串拼接命令/查询；
- Secret/令牌/PII 不进日志、错误、URL、analytics 或 fixtures；
- Electron IPC、文件和外链用 capability allowlist；不得暴露通用 invoke/read/write；
- 使用常量时间比较处理签名，密钥使用受审计库；不自研密码学；
- Markdown/富文本经过 allowlist sanitizer，外部媒体与 URL 防 SSRF；
- AI 输出与插件输入不可信，执行前重新授权和验证。

## 11. 性能规则

先设预算和测量，再优化。避免无界查询/列表、N+1、重复序列化、大对象复制、main
thread 同步 I/O 和高基数日志/指标。缓存必须定义一致性、TTL、失效、容量和观测；没有失效策略不得加缓存。

高频路径用 benchmark/profiler 证据支撑；优化 PR 附前后数据、环境和回归测试。可读性换性能必须是经证实热点。

## 12. 测试友好性

从公共行为测试，不暴露 private 只为测试。用 deterministic
fake 隔离时间/随机/网络；mock 只在进程/网络边界。测试数据 builders 表达意图，不共享可变 fixture。详细门禁见
[TESTING_RULE.md](./TESTING_RULE.md)。

## 13. 禁止清单

- `any`、隐式全局、monkey patch、生产 `console.log`；
- 巨型 component/service、跨域数据库访问、循环依赖；
- raw SQL/HTML/shell 字符串拼接；
- 业务组件 raw color、inline style、任意 z-index；
- 无界重试、无 timeout 网络调用、无分页集合接口；
- 修改生成文件、已发布 migration 或 lockfile 中手工片段；
- 通过注释、lint disable 或 skipped test 掩盖问题而无 issue/到期日。

## 14. 完成标准

变更范围最小、命名和边界清晰、类型无逃逸、错误/安全/可访问性处理完整、测试与性能匹配风险、文档和生成物同步、CI 全绿，并具备部署/迁移/回滚说明。
