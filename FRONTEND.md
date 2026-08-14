# 前端与桌面客户端规范

| 属性   | 值                                                            |
| ------ | ------------------------------------------------------------- |
| 状态   | Baseline v1.0                                                 |
| 所有者 | Desktop + Frontend Platform                                   |
| 技术   | Electron、React 19、TypeScript、Vite、Tailwind CSS v4、Motion |

## 1. 目标

客户端必须像桌面工作台而不是网页套壳：支持键盘、深链接、状态恢复、多窗口约束、系统通知和自动更新，同时保持 Web 技术的可测试性。UI 行为遵循
[UI_SYSTEM.md](./UI_SYSTEM.md)，IPC 与安全边界遵循 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## 2. 应用分层

### 2.1 Renderer

```text
renderer/
├─ app/       # provider、router、error boundaries、shell、startup
├─ processes/  # 可选：跨页面长流程；Foundation 不创建业务流程
├─ pages/      # 路由入口与页面组合
├─ features/  # search、guide-reader、build-editor、assistant-chat...
├─ entities/  # game、guide、build 等展示模型和小组件
├─ widgets/   # navigation、command-palette、activity-panel...
└─ shared/    # renderer-only config、assets、testing
```

Feature 推荐结构：`api/`、`model/`、`ui/`、`routes/`、`lib/`、`testing/`、`index.ts`。共享层使用
`shared/ui`、`shared/lib`、`shared/hooks`、`shared/config`、`shared/assets`。目录按需创建；只有一个文件时不提前分层。页面负责布局和协调，不承载数据转换、权限判断或复杂状态机。

### 2.2 Main 与 Preload

Main 按 capability 组织：`windows`、`protocol`、`updates`、`credentials`、`notifications`、`files`、`telemetry`。Preload 对每项能力提供窄接口和版本；Renderer 永远不能获得原始
`ipcRenderer`、路径或 shell 执行能力。

窗口创建采用安全基线：隔离上下文、启用 sandbox、关闭 Node integration、限制导航/新窗口、CSP、外链 allowlist。自定义标题栏必须保留平台窗口控制、可拖拽区和无障碍名称；macOS traffic lights 与 Windows snap 行为分别测试。

## 3. 状态职责

| 状态                    | 工具           | 原因/规则                                          |
| ----------------------- | -------------- | -------------------------------------------------- |
| URL/导航                | React Router   | 可深链、可后退、可恢复；筛选尽量进入 search params |
| 服务端状态              | TanStack Query | 缓存、失效、重试和并发请求；不得复制进 Zustand     |
| 跨页面客户端状态        | Zustand        | 仅偏好、面板状态、草稿索引等；小 store + selector  |
| 表单临时状态            | 组件/表单库    | 离用户最近，提交后由 Query 刷新                    |
| 主题/Locale/Auth facade | React Context  | 低频全局依赖；高频数据不放 Context                 |

Query key 由 feature 的 key factory 统一生成；mutation 成功后以精确 invalidation 或缓存更新处理，禁止全局清缓存。只对幂等读请求有限重试；权限、验证和确定性 4xx 不重试。

## 4. 路由与导航

建议 URI：`/games/:gameSlug`、`/games/:gameSlug/guides/:guideId`、`/builds/:buildId`、`/search?q=`、`/assistant/:conversationId`、`/settings/:section`。Desktop custom protocol 映射到同一内部路由，所有参数先验证。

- 每个顶级路由有独立 error boundary、loading skeleton 和 empty/offline 状态；
- Back 必须恢复滚动、筛选、展开状态和输入；Modal 不承载主导航；
- 路由变更后将焦点移动至主内容标题，保留可跳过导航链接；
- 命令面板用于跨模块快速动作，不能替代可发现的主导航；
- 权限不足路由显示原因与恢复路径，不通过隐藏造成歧义。

## 5. 数据访问与契约

Renderer 只能通过 `@game-guide-hub/api-client` 和经批准的 WebSocket client 访问服务端。生成目录只读；业务模型通过显式 mapper 与 transport DTO 分离，以隔离 API 演进。

每个请求注入客户端版本、locale、request ID；认证由统一 transport adapter 管理，功能代码不得读取 token。取消路由或搜索请求时传递 AbortSignal。错误统一映射为
`AppError`
判别联合：network、timeout、unauthorized、forbidden、notFound、conflict、validation、rateLimited、server、unknown；UI 不显示原始异常。

## 6. 组件与样式

- `packages/ui` 仅包含无业务语义的 primitives 和可组合组件；业务组件留在 feature/entity；
- Tailwind v4 消费 `design-tokens` 生成的语义变量，组件中禁止 raw hex、魔法阴影、任意 z-index 和 inline style；动态值通过受控 CSS variable API；
- 组件采用 `Component`, `Component.Trigger`, `Component.Content` 等组合式 API，避免几十个布尔 prop；
- 图标通过 `packages/icons` 统一导出 Lucide，默认 1.75px stroke；品牌图标必须来自官方授权资产；
- Storybook 覆盖 normal/loading/empty/error/disabled/focus/overflow/dark/light/reduced-motion；不得把 Storybook 当唯一测试。

## 7. 性能预算

| 项目                     | 基线预算                                          |
| ------------------------ | ------------------------------------------------- |
| Renderer 初始压缩 JS     | ≤ 350 KB（不含 Electron/runtime，预算需基准确认） |
| 单个懒加载 feature chunk | ≤ 200 KB，超出需解释                              |
| 长任务                   | < 50 ms；连续交互每帧工作尽量 < 16 ms             |
| 输入反馈                 | < 100 ms                                          |
| 列表                     | 50+ 复杂项评估虚拟化；100+ 默认虚拟化             |
| 图片                     | AVIF/WebP 优先，声明尺寸，非首屏 lazy load        |

按路由/feature 代码拆分；重型编辑器、图表、AI 会话按需加载。使用 React Profiler 和实际指标后才引入 memoization。稳定 key 来自实体 ID，禁止数组索引 key。避免在 render 中创建大对象、排序大列表或同步解析文档；重计算进入 worker/缓存。

## 8. React 19 规则

- 使用函数组件、hooks 和组合；不引入类组件，error boundary 可使用受控实现/库；
- `useEffect` 仅同步外部系统，不用于派生状态或顺序编排业务流程；
- 异步边界必须可取消、可重试并有 skeleton；Suspense 使用范围需避免整个 Shell 闪烁；
- props、loader data、IPC 和 API 数据全类型化，禁止 `any` 与无验证断言；
- 并发特性必须通过 race、快速导航和卸载后完成请求测试。

## 9. 离线、缓存与恢复

Foundation 只承诺最近访问内容的只读降级，不承诺离线写同步。持久缓存必须版本化、限制容量、可清除且不包含令牌/Restricted 数据。离线时明确标注快照时间和版本；恢复联网后后台刷新，内容变化不得突然丢失阅读位置。

草稿使用本地加密/受限存储与周期保存；正式设计前 ADR 明确冲突策略、密钥来源和数据保留。崩溃恢复只恢复允许的路由与非敏感 UI 状态。

## 10. 可访问性与桌面交互

- 所有功能可仅键盘完成；Tab 顺序与视觉一致，焦点环 2px 以上且不被裁剪；
- 图标按钮至少 32×32 CSS px 视觉框，目标区域建议 36×36；触屏可用路径达到 44×44；
- `Esc` 关闭顶层浮层，`Enter/Space` 激活，方向键遵循 ARIA pattern；不得覆盖 OS/辅助技术保留快捷键；
- 文本缩放至 200% 不丢功能；正文对比 ≥ 4.5:1，大文本/重要图形 ≥ 3:1；
- 尊重 `prefers-reduced-motion` 与减少透明度策略；减少动效时保留状态反馈；
- 虚拟列表、拖放和 Canvas 必须有屏幕阅读器/键盘替代路径。

快捷键集中注册、冲突检测并在命令面板可发现。平台差异使用 `Cmd`/`Ctrl` 映射，不在文案中硬编码。

## 11. 错误与遥测

App shell、顶级路由和高风险 widget 设置分层 error boundary。错误界面包含稳定错误 ID、重试/返回/报告路径，不暴露堆栈或内部主机名。Renderer、Main、Preload 日志通过 correlation ID 关联；采集前遵循用户同意和脱敏策略。

## 12. 完成门禁

- 类型、lint、unit/component/E2E 全部通过；
- Windows/macOS（Linux 支持级别由 ADR 决定）验证窗口、协议、更新、快捷键；
- 明暗、高对比、200% 缩放、键盘、屏幕阅读器和 reduced-motion 通过；
- 无 Node 泄漏、任意导航、未验证 IPC 或敏感持久化；
- Bundle/启动/交互性能未超预算；
- Storybook 状态、API 契约、用户可见变更与回滚说明同步。
