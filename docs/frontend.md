# 前端与设计系统

| 属性     | 值                                                            |
| -------- | ------------------------------------------------------------- |
| 状态     | Baseline v1.0                                                 |
| 所有者   | Desktop + Frontend Platform + Design System                   |
| 技术     | Electron、React 19、TypeScript、Vite、Tailwind CSS v4、Motion |
| 设计语言 | Quiet Immersion：克制、沉浸、内容优先、桌面高效率             |
| 默认主题 | Dark；Light 与 High Contrast 同等受支持                       |

## 1. 目标

客户端必须像桌面工作台而不是网页套壳：支持键盘、深链接、状态恢复、多窗口约束、系统通知和自动更新，同时保持 Web 技术的可测试性。UI 行为遵循本文『设计系统』章节（第 9–23 章），IPC 与安全边界遵循
[docs/architecture.md](./architecture.md)。

## 2. Renderer 应用分层

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

## 3. Main 与 Preload

Main 按 capability 组织：`windows`、`protocol`、`updates`、`credentials`、`notifications`、`files`、`telemetry`。Preload 对每项能力提供窄接口和版本；Renderer 永远不能获得原始
`ipcRenderer`、路径或 shell 执行能力。

窗口创建采用安全基线：隔离上下文、启用 sandbox、关闭 Node
integration、限制导航/新窗口、CSP、外链 allowlist。自定义标题栏必须保留平台窗口控制、可拖拽区和无障碍名称；macOS
traffic lights 与 Windows snap 行为分别测试。

## 4. 状态职责

| 状态                    | 工具           | 原因/规则                                          |
| ----------------------- | -------------- | -------------------------------------------------- |
| URL/导航                | React Router   | 可深链、可后退、可恢复；筛选尽量进入 search params |
| 服务端状态              | TanStack Query | 缓存、失效、重试和并发请求；不得复制进 Zustand     |
| 跨页面客户端状态        | Zustand        | 仅偏好、面板状态、草稿索引等；小 store + selector  |
| 表单临时状态            | 组件/表单库    | 离用户最近，提交后由 Query 刷新                    |
| 主题/Locale/Auth facade | React Context  | 低频全局依赖；高频数据不放 Context                 |

Query key 由 feature 的 key
factory 统一生成；mutation 成功后以精确 invalidation 或缓存更新处理，禁止全局清缓存。只对幂等读请求有限重试；权限、验证和确定性 4xx 不重试。

## 5. 路由与导航

建议 URI：`/games/:gameSlug`、`/games/:gameSlug/guides/:guideId`、`/builds/:buildId`、`/search?q=`、`/assistant/:conversationId`、`/settings/:section`。Desktop
custom protocol 映射到同一内部路由，所有参数先验证。

- 每个顶级路由有独立 error boundary、loading skeleton 和 empty/offline 状态；
- Back 必须恢复滚动、筛选、展开状态和输入；Modal 不承载主导航；
- 路由变更后将焦点移动至主内容标题，保留可跳过导航链接；
- 命令面板用于跨模块快速动作，不能替代可发现的主导航；
- 权限不足路由显示原因与恢复路径，不通过隐藏造成歧义。

## 6. 数据访问与契约

Renderer 只能通过 `@game-guide-hub/api-client` 和经批准的 WebSocket
client 访问服务端。生成目录只读；业务模型通过显式 mapper 与 transport DTO 分离，以隔离 API 演进。

每个请求注入客户端版本、locale、request ID；认证由统一 transport
adapter 管理，功能代码不得读取 token。取消路由或搜索请求时传递 AbortSignal。错误统一映射为
`AppError`
判别联合：network、timeout、unauthorized、forbidden、notFound、conflict、validation、rateLimited、server、unknown；UI 不显示原始异常。

## 7. 组件与样式

- `packages/ui` 仅包含无业务语义的 primitives 和可组合组件；业务组件留在 feature/entity；
- Tailwind v4 消费 `design-tokens` 生成的语义变量，组件中禁止 raw
  hex、魔法阴影、任意 z-index 和 inline style；动态值通过受控 CSS variable API；
- 组件采用 `Component`, `Component.Trigger`, `Component.Content` 等组合式 API，避免几十个布尔 prop；
- Storybook 覆盖 normal/loading/empty/error/disabled/focus/overflow/dark/light/reduced-motion；不得把 Storybook 当唯一测试。

## 8. React 19 规则

- 使用函数组件、hooks 和组合；不引入类组件，error boundary 可使用受控实现/库；
- `useEffect` 仅同步外部系统，不用于派生状态或顺序编排业务流程；
- 异步边界必须可取消、可重试并有 skeleton；Suspense 使用范围需避免整个 Shell 闪烁；
- props、loader data、IPC 和 API 数据全类型化，禁止 `any` 与无验证断言；
- 并发特性必须通过 race、快速导航和卸载后完成请求测试。

## 9. 设计意图与 Token 架构

### 9.1 设计意图

这是桌面优先的游戏信息智能客户端（项目代号 Asteris）。所有工作区共享同一套视觉语法：深蓝氛围、克制的霓虹点缀、磨砂玻璃表面、Lucide 图标和传达层级的动效。永久 UI 基础包含三层卡片（`Basic`、`Elevated`、`Featured`）和四档动效（`Fast`
150ms、`Normal` 250ms、`Slow` 400ms、`Cinematic`
900ms）；Glass 仅用于导航、重点 Widget、对话框与展示卡片。

Game Guide
Hub 不是传统管理后台，也不是营销落地页。界面应像长期使用的游戏研究工作台：游戏内容和当前上下文是第一视觉信号，应用框架安静稳定，交互密度高但不拥挤。

参考来源只转译原则：

- Apple：清晰层级、材质有因、平台适配和可中断动效；
- Arc：空间组织、侧边导航和上下文切换；
- Steam/Battle.net：游戏资产、库与版本语境；
- Discord：实时状态与社区信息密度；
- Linear：键盘效率、命令面板和精确反馈。

禁止复制品牌布局、图标、动效或资产。禁止用大面积紫蓝渐变、装饰光球、嵌套卡片、超大营销标题和无意义玻璃模拟“高级感”。高级感来自比例、内容、响应和一致性。

### 9.2 Token 架构

```text
Primitive tokens (palette/size/duration)
        ↓
Semantic tokens (surface/text/action/status)
        ↓
Component tokens (button/nav/dialog; 极少且可追踪)
```

组件只能消费 semantic/component token。Primitive 是主题实现细节，不得在 `features/`
中出现。Token 源位于 `packages/theme`，生成 CSS variables、Tailwind theme、TypeScript
metadata 和设计工具交换格式；生成物不可手改。设计系统的事实来源是 `packages/theme/src/tokens` 与
`packages/theme/src/styles.css`：组件必须消费语义 CSS variables 或 Tailwind
aliases，页面代码不得添加 raw 颜色、圆角、阴影或时序值。

命名格式：`--ggh-<category>-<role>-<state?>`，例如
`--ggh-color-text-primary`、`--ggh-color-action-primary-hover`。Token 变更遵循 SemVer；删除或语义改变是 breaking
change。

主题模式通过 `.theme-light` 与 `.theme-high-contrast`
表示。新主题只能 remap 语义变量；组件类名与布局契约保持不变。

## 10. 色彩系统

### 10.1 Dark Theme

| 语义 Token          | 值        | 用途                         |
| ------------------- | --------- | ---------------------------- |
| `canvas`            | `#0B0D12` | 最底层窗口背景，避免纯黑拖影 |
| `surface-1`         | `#11151C` | 主内容/导航表面              |
| `surface-2`         | `#171C25` | 控件、行 hover、浮层基础     |
| `surface-3`         | `#1F2632` | 选中、强调容器               |
| `surface-inverse`   | `#F5F7FA` | 反色提示                     |
| `text-primary`      | `#F4F7FB` | 标题与正文                   |
| `text-secondary`    | `#B4BECC` | 辅助说明                     |
| `text-tertiary`     | `#8793A3` | 元数据；不可用于关键正文     |
| `border-subtle`     | `#252C38` | 分隔线                       |
| `border-strong`     | `#394455` | 控件边界/高层级分隔          |
| `action-primary`    | `#5B8CFF` | 主操作、链接、焦点           |
| `on-action-primary` | `#07111F` | 主操作前景                   |
| `accent-teal`       | `#38B9B1` | 协作/信息类强调              |
| `accent-amber`      | `#E6A84B` | 版本/稀有度/注意             |
| `success`           | `#43B581` | 成功                         |
| `warning`           | `#E6A84B` | 警告                         |
| `danger`            | `#F06A6A` | 危险/错误                    |
| `info`              | `#62A5FF` | 信息                         |

### 10.2 Light Theme

| 语义 Token          | 值        | 用途               |
| ------------------- | --------- | ------------------ |
| `canvas`            | `#F4F6F9` | 最底层窗口背景     |
| `surface-1`         | `#FFFFFF` | 主表面             |
| `surface-2`         | `#EDF1F6` | 控件/次表面        |
| `surface-3`         | `#E2E8F0` | 选中/强调容器      |
| `surface-inverse`   | `#11151C` | 反色提示           |
| `text-primary`      | `#17202D` | 标题与正文         |
| `text-secondary`    | `#4D5B6D` | 辅助说明           |
| `text-tertiary`     | `#68778A` | 元数据             |
| `border-subtle`     | `#D9E0E9` | 分隔线             |
| `border-strong`     | `#B9C4D1` | 控件边界           |
| `action-primary`    | `#315FD6` | 主操作、链接、焦点 |
| `on-action-primary` | `#FFFFFF` | 主操作前景         |
| `accent-teal`       | `#087C82` | 协作/信息类强调    |
| `accent-amber`      | `#A95705` | 版本/注意          |
| `success`           | `#167A4E` | 成功               |
| `warning`           | `#945200` | 警告               |
| `danger`            | `#C73535` | 危险/错误          |
| `info`              | `#245FB8` | 信息               |

### 10.3 对比度与状态

这些值是设计基线，不代表未经验证即可发布。Token
pipeline 必须自动验证实际 foreground/background 组合：普通文本 ≥ 4.5:1，大文本和关键 UI 图形 ≥
3:1；目标正文尽量达到 7:1。状态不得只靠颜色，必须同时使用图标、文字、形状或位置。Light theme
values 定义在同一组语义 slot 中；组件不得按 raw 颜色分支。

### 10.4 游戏内容色

游戏封面、截图、职业/元素色属于内容层，不可覆盖系统状态语义。内容色进入 `content-accent-*`
隔离范围，并通过中性 scrim 保证文字对比。稀有度色不得复用 success/warning/danger，且必须配标签。

## 11. 排版

UI 字体使用 Inter Variable；系统回退为 `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`,
sans-serif。中文回退使用平台默认 CJK 字体，后续通过字体授权与跨平台渲染 ADR 固定。游戏 Logo/标题艺术字仅作为授权内容资产，不作为 UI 字体。

| Role      | Size/Line | Weight | 用途                       |
| --------- | --------- | ------ | -------------------------- |
| `display` | 32/40     | 650    | 极少数游戏详情主标题       |
| `title-1` | 24/32     | 650    | 页面标题                   |
| `title-2` | 20/28     | 600    | 一级区块                   |
| `title-3` | 16/24     | 600    | 面板/列表组标题            |
| `body-lg` | 16/26     | 400    | 长文主正文                 |
| `body`    | 14/22     | 400    | 桌面 UI 正文               |
| `label`   | 13/18     | 550    | 控件标签                   |
| `caption` | 12/18     | 450    | 非关键元数据，最小正文尺寸 |
| `code`    | 13/20     | 450    | 代码、ID、Build 数值       |

不随 viewport 连续缩放字体；通过离散 role 与布局重排响应。Letter spacing 默认
`0`，不使用负字距。数字表格、计时和对齐属性使用 tabular
figures。长文行宽 60-75 个拉丁字符或约 32-42 个中文字符；用户缩放 200% 时不得截断关键内容。

正文保持在 14px 及以上，可读描述保留约 1.5 倍行高。语义字号 scale（`display`、`title1`、`title2`、`title3`、`bodyLarge`、`body`、`label`、`caption`、`code`）与上表一一对应。

## 12. 间距尺寸与圆角边框层级

### 12.1 间距与尺寸

Primitive spacing：`0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`
px。2/6 仅用于内部光学校准；布局优先 4/8 节奏（基础单位为 8px）。

| 语义            | 值      | 用途                 |
| --------------- | ------- | -------------------- |
| `control-gap`   | 8       | 图标与文本、同组控件 |
| `content-gap`   | 12      | 行内内容块           |
| `panel-padding` | 16      | 紧凑面板             |
| `section-gap`   | 24      | 同层级区段           |
| `page-gutter`   | 24 / 32 | 标准/宽窗口          |
| `content-max`   | 1200    | 列表/网格主内容      |
| `reading-max`   | 760     | 攻略/Wiki 长文       |

控件高度：compact 28、default 36、comfortable 44。图标按钮的 visual box 最低 32×32，触摸路径 hit
target 44×44。固定格式 UI 必须使用稳定
`min/max/aspect-ratio/grid track`，loading/hover/badge 不得改变布局尺寸。

### 12.2 圆角、边框与层级

Radius
tokens：`none 0`、`xs 2`、`sm 4`、`md 6`、`lg 8`、`xl 12`、`full 9999`。卡片与重复项最大 8px；Dialog/Sheet 可使用 12px；pill 仅用于状态、标签、分段选择或头像，不作为通用按钮造型。

Border：1px 常规、2px focus/high contrast。避免用阴影替代所有边界。Elevation：

- `0`：平面内容；
- `1`：sticky chrome/浮起行；
- `2`：popover/menu；
- `3`：dialog/sheet；
- `focus`：2px action ring + 2px canvas offset。

阴影在 dark theme 使用低透明黑色 + 细亮边，在 light
theme 使用中性黑；不得出现彩色发光作为常规 elevation。

Z-index 仅用语义层：base 0、sticky 100、dropdown 300、popover 400、overlay 600、dialog 700、toast
800、critical 900。业务代码禁止任意数字。Toast 不应覆盖 Dialog 的关键操作。

### 12.3 补充：兼容命名

提升层级使用 `shadow-level-1/2/3`
对应 raised、floating 与 dialog 层；glow 仅保留给 focus、active 与有意的 hover 反馈。圆角使用
`radius-md`（控件）、`radius-lg`（紧凑卡片）与 `radius-xl`（hero/widget 表面）。

## 13. Glass 与卡片

### 13.1 Glass 规范

Glass 是“背景退居次要”的功能材质，仅允许 titlebar、悬浮导航、popover/dialog
backdrop 和媒体上的临时控制层使用。内容 section、列表卡片、表单和嵌套容器禁止 glass。

- Dark 建议 surface alpha 0.78-0.9，Light 0.84-0.94；backdrop blur 12-20px；
- 必须有不透明 fallback、边界和独立对比测试；
- 用户减少透明度、GPU 性能不足或远程桌面环境下关闭 blur；
- 同一区域不得叠加两个 blur 层；滚动列表下的持续 blur 需性能基准；
- Blur 表达层级/遮罩，不作装饰。禁止环境光球和持续漂移动画。

### 13.2 Glass 类名

浮层表面只能使用以下其中一个类：

- `glass-light`：14px blur，低透明度，上下文表面；
- `glass-medium`：22px blur，标准卡片与 Widget；
- `glass-strong`：30px blur，对话框、命令 popover、聚焦面板。

所有 glass 表面通过 `.ggh-glass` 共享 1px 边框、反射层、细微颗粒和 elevation 阴影。

### 13.3 内容卡片

材料、公告、攻略与最近阅读统一使用 `ggh-card`/`ggh-widget`
作为容器。内容先显示名称与分类，再显示用途、来源或更新时间。卡片 hover 只使用轻微位移、边缘高光和图片缩放，不使用持续霓虹或影响布局的动画。

卡片层级固定为 `Basic`、`Elevated`、`Featured`
三层，避免所有卡片同时发光。页面 section 是无框全宽布局，不包成漂浮卡；卡片只用于真正重复、可独立选择的项目。禁止 card
inside card。

## 14. Motion 系统

使用 Motion 提供状态与空间连续性，不制造表演。最多每个视图 1-2 个关键动画，所有动画可中断且不阻塞输入。

| Token     | 时长       | 用途                         |
| --------- | ---------- | ---------------------------- |
| `instant` | 0 ms       | reduced motion/不可见同步    |
| `fast`    | 120 ms     | hover、pressed、tooltip exit |
| `normal`  | 180 ms     | 控件状态、popover exit       |
| `slow`    | 240 ms     | popover/dialog enter、panel  |
| `route`   | 320 ms max | 保持空间关系的路由过渡       |

进入
`cubic-bezier(0.16, 1, 0.3, 1)`，退出更短、使用 ease-in；布局弹簧仅用于拖放/面板并限制 overshoot。只动画 transform/opacity；禁止动画 width/height/top/left 导致重排。列表 stagger 每项 24-40ms、最多前 8 项，密集数据表不 stagger。

Reduced
motion：取消 parallax、spring、scale 和大位移；route 改短 crossfade，loading 用静态/低频进度，保留 focus/pressed/success 的非运动反馈。

补充（Asteris 动效层级）：`Fast` 150ms 用于按钮、图标反馈；`Normal` 250ms 用于卡片与输入状态；`Slow`
400ms 用于页面区块、侧栏；`Cinematic` 900ms 用于启动与游戏选择转换。优先动画 `opacity`、`transform`
与 `filter`；连续动效只用于启动场景和关键环境层，并遵循 `prefers-reduced-motion`。

## 15. 桌面布局

推荐最小窗口 1024×640；低于此尺寸不承诺完整三栏，但必须保持核心阅读和关闭/返回可用。具体 hard
minimum 需跨平台验证后 ADR 固定。

```text
┌──────────────────── Platform-aware titlebar: 40 ────────────────────┐
│ Rail 56-64 │ Context sidebar 240-320 │ Main min 600 │ Panel 320-400 │
└──────────────────────────────────────────────────────────────────────┘
```

| 模式       | 宽度      | 规则                                                   |
| ---------- | --------- | ------------------------------------------------------ |
| Compact    | 1024-1279 | Rail 保留；sidebar 可覆盖/折叠；右 panel 互斥          |
| Standard   | 1280-1599 | Rail + sidebar + main；右 panel 按任务打开             |
| Wide       | ≥1600     | 可持久显示右 panel；主内容仍有 max-width               |
| Low height | <720      | 缩减垂直 padding，不缩字体/目标；工具栏可滚动/overflow |

桌面目标宽度为 1024、1280、1440、1600、1920。断点：`compact` 1024px、`standard` 1280px、`wide`
1600px、`ultraWide`
1920px。小尺寸桌面收拢列数，不创建移动底部导航；所有页面不得产生横向滚动，固定头部与侧栏必须为内容预留空间。桌面内容最大宽度 1920px，并为持久 command
bar/sidebar 预留空间。

工作区网格为 12 列、16px gutter；桌面页面 padding 32px，section 间距 24px。

Rail 是顶级空间，Sidebar 是当前空间导航，Tabs/segmented
control 是当前页面视图；三者不得表达同一层级。

未来 Web 断点基线为 375、768、1024、1440；Mobile 采用独立适配，不把桌面多栏压扁。核心内容优先，次要面板折叠；不得产生无意水平滚动。

### 15.1 首页信息层级

首页只回答四个问题：有什么新内容、今天做什么、读什么、下一步去哪。固定顺序为 Hero、今日养成、当前活动、推荐攻略、推荐角色。次要内容进入独立页面。

Alpha 首页在主工作区下补充官方公告、继续浏览/收藏和 AI 助手状态，所有“本地 Mock”数据都在页面上下文中明确说明来源；空列表必须提供下一步操作，不以空白或无意义占位符代替。

## 16. 组件分类与命名

| 层        | 示例                                       | 规则                          |
| --------- | ------------------------------------------ | ----------------------------- |
| Primitive | `Button`, `TextField`, `Dialog`            | 无业务、可访问、Token 驱动    |
| Pattern   | `CommandMenu`, `ResourceList`, `SplitView` | 跨功能交互模式                |
| Entity    | `GameRow`, `BuildSummary`                  | 领域展示，位于 entity/feature |
| Feature   | `BuildEditor`, `GuideRevisionPanel`        | 完整用例组合                  |

使用 PascalCase；状态/尺寸用有限 union，不用布尔 prop 爆炸。Compound component 采用
`Dialog.Trigger`、`Dialog.Content`。每个组件公开 anatomy、states、keyboard、ARIA、tokens 和 testing
contract。

基础组件目录计划：Actions、Inputs、Navigation、Overlays、Feedback、Data
Display、Layout、Content、Media。不要为了目录完整提前生成无需求组件。

## 17. 图标与资产

- 系统图标统一 Lucide，经 `packages/icons` 封装；不在业务代码直接混用多个库；
- 尺寸仅 12、16、20、24、32，默认 stroke 1.75；同层级 outline/fill 不混用；
- 熟悉工具动作优先图标按钮（返回、关闭、收藏、下载），不熟悉图标带 tooltip 与 accessible name；
- 导航同时显示图标与文字（极窄 Rail 可在稳定学习后仅图标，但 tooltip/label 必须存在）；
- 禁止 Emoji 作为结构图标，禁止手绘已有标准图标的 SVG；
- 游戏、平台和社区品牌资产使用官方文件、比例和 clear space，记录来源/许可证；
- 主媒体必须展示真实游戏/内容，不用模糊裁剪或纯氛围图替代可检查信息。

Lucide 是唯一图标族。彩色图标表面使用
`IconContainer`，图标尺寸保持在 16/20/24 尺度；纯图标控件必须有 accessible label 和可见 focus ring。

媒体使用 `ImageFrame` 承载 banner、cover、avatar、thumbnail 与背景图：它预留 aspect
ratio、应用渐变遮罩与阴影，并默认 lazy-load。Hero 媒体可选用 eager
loading；首屏以下的媒体保持 lazy。

## 18. 交互与反馈

每个交互组件具备 default、hover、focus-visible、pressed、selected、disabled、loading 和 error（适用时）。反馈在 100ms 内出现；超过 300ms 显示局部 progress，超过 1s 用保留尺寸 skeleton。Skeleton 不模拟不可预测内容，也不无限循环吸引注意。

表单始终有可见 label；blur 后验证，错误靠近字段并说明原因与修复；多错误提供 summary/focus。破坏性操作与主操作空间分离，优先 undo；不可逆动作二次确认并明确对象。Toast
3-5 秒（错误/可操作消息不强制自动消失），`aria-live` 宣告且不抢焦点。

## 19. 可访问性

目标 WCAG 2.2 AA：

- 语义结构与标题顺序正确；主内容 skip link；使用语义标题、label 与原生控件；
- 所有功能可仅键盘完成；无焦点陷阱，route/dialog
  focus 管理可预测；Tab 顺序与视觉一致，焦点环 2px 以上且不被裁剪，`:focus-visible` 可见；
- 图标按钮至少 32×32 CSS px 视觉框，目标区域建议 36×36；触屏可用路径达到 44×44；
- `Esc` 关闭顶层浮层，`Enter/Space` 激活，方向键遵循 ARIA pattern；不得覆盖 OS/辅助技术保留快捷键；
- icon-only control 有 accessible name，装饰图隐藏，重要图有替代文本；
- 文本缩放至 200% 不丢功能；系统高对比模式不丢内容/操作；正文对比 ≥
  4.5:1（主文本），大文本/重要图形 ≥
  3:1（次文本）；颜色不是唯一信息，也不是唯一状态信号；图表提供数据表/文本替代；
- 尊重 `prefers-reduced-motion` 与减少透明度策略；减少动效时保留状态反馈；
- 虚拟列表、拖放、gesture 和 Canvas 必须有屏幕阅读器/键盘替代路径；
- Live region 谨慎使用，实时进度节流，避免屏幕阅读器噪音。

快捷键集中注册、冲突检测并在命令面板可发现。平台差异使用 `Cmd`/`Ctrl` 映射，不在文案中硬编码。

## 20. 离线、缓存与恢复

Foundation 只承诺最近访问内容的只读降级，不承诺离线写同步。持久缓存必须版本化、限制容量、可清除且不包含令牌/Restricted 数据。离线时明确标注快照时间和版本；恢复联网后后台刷新，内容变化不得突然丢失阅读位置。

草稿使用本地加密/受限存储与周期保存；正式设计前 ADR 明确冲突策略、密钥来源和数据保留。崩溃恢复只恢复允许的路由与非敏感 UI 状态。

## 21. 错误与遥测

App shell、顶级路由和高风险 widget 设置分层 error
boundary。错误界面包含稳定错误 ID、重试/返回/报告路径，不暴露堆栈或内部主机名。Renderer、Main、Preload 日志通过 correlation
ID 关联；采集前遵循用户同意和脱敏策略。

## 22. 性能预算

| 项目                     | 基线预算                                          |
| ------------------------ | ------------------------------------------------- |
| Renderer 初始压缩 JS     | ≤ 350 KB（不含 Electron/runtime，预算需基准确认） |
| 单个懒加载 feature chunk | ≤ 200 KB，超出需解释                              |
| 长任务                   | < 50 ms；连续交互每帧工作尽量 < 16 ms             |
| 输入反馈                 | < 100 ms                                          |
| 列表                     | 50+ 复杂项评估虚拟化；100+ 默认虚拟化             |
| 图片                     | AVIF/WebP 优先，声明尺寸，非首屏 lazy load        |

按路由/feature 代码拆分；重型编辑器、图表、AI 会话按需加载。使用 React
Profiler 和实际指标后才引入 memoization。稳定 key 来自实体 ID，禁止数组索引 key。避免在 render 中创建大对象、排序大列表或同步解析文档；重计算进入 worker/缓存。

## 23. 设计评审与完成门禁

### 23.1 设计评审门禁

- Token 无 raw value 泄漏，明暗/高对比状态完整；
- 1024×640、1280×720、1440×900、1920×1080 与 200% 缩放无重叠/截断；
- 键盘、屏幕阅读器、reduced-motion/reduced-transparency 通过；
- 文本溢出、长中文/英文/数字、空/错/慢/离线状态通过；
- 图标、品牌资产、媒体授权与替代文本正确；
- 动画没有 layout shift，滚动/blur 达到性能预算；
- Storybook 视觉回归、axe 自动检查和关键流程人工检查完成。

设计系统的任何例外必须记录原因、范围、owner 和到期日；“更好看”不是绕过一致性或无障碍的理由。

### 23.2 完成门禁

- 类型、lint、unit/component/E2E 全部通过；
- Windows/macOS（Linux 支持级别由 ADR 决定）验证窗口、协议、更新、快捷键；
- 明暗、高对比、200% 缩放、键盘、屏幕阅读器和 reduced-motion 通过；
- 无 Node 泄漏、任意导航、未验证 IPC 或敏感持久化；
- Bundle/启动/交互性能未超预算；
- Storybook 状态、API 契约、用户可见变更与回滚说明同步。
