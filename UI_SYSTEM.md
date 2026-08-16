# Game Guide Hub 设计系统

| 属性     | 值                                                |
| -------- | ------------------------------------------------- |
| 状态     | Baseline v1.0                                     |
| 所有者   | Design System + Accessibility                     |
| 设计语言 | Quiet Immersion：克制、沉浸、内容优先、桌面高效率 |
| 默认主题 | Dark；Light 与 High Contrast 同等受支持           |

## 1. 设计意图

Game Guide
Hub 不是传统管理后台，也不是营销落地页。界面应像长期使用的游戏研究工作台：游戏内容和当前上下文是第一视觉信号，应用框架安静稳定，交互密度高但不拥挤。

参考来源只转译原则：

- Apple：清晰层级、材质有因、平台适配和可中断动效；
- Arc：空间组织、侧边导航和上下文切换；
- Steam/Battle.net：游戏资产、库与版本语境；
- Discord：实时状态与社区信息密度；
- Linear：键盘效率、命令面板和精确反馈。

禁止复制品牌布局、图标、动效或资产。禁止用大面积紫蓝渐变、装饰光球、嵌套卡片、超大营销标题和无意义玻璃模拟“高级感”。高级感来自比例、内容、响应和一致性。

## 2. Token 架构

```text
Primitive tokens (palette/size/duration)
        ↓
Semantic tokens (surface/text/action/status)
        ↓
Component tokens (button/nav/dialog; 极少且可追踪)
```

组件只能消费 semantic/component token。Primitive 是主题实现细节，不得在 `features/`
中出现。Token 源位于 `packages/theme`，生成 CSS variables、Tailwind theme、TypeScript
metadata 和设计工具交换格式；生成物不可手改。

命名格式：`--ggh-<category>-<role>-<state?>`，例如
`--ggh-color-text-primary`、`--ggh-color-action-primary-hover`。Token 变更遵循 SemVer；删除或语义改变是 breaking
change。

## 3. 色彩系统

### 3.1 Dark Theme

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

### 3.2 Light Theme

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

这些值是设计基线，不代表未经验证即可发布。Token
pipeline 必须自动验证实际 foreground/background 组合：普通文本 ≥ 4.5:1，大文本和关键 UI 图形 ≥
3:1；目标正文尽量达到 7:1。状态不得只靠颜色，必须同时使用图标、文字、形状或位置。

### 3.3 游戏内容色

游戏封面、截图、职业/元素色属于内容层，不可覆盖系统状态语义。内容色进入 `content-accent-*`
隔离范围，并通过中性 scrim 保证文字对比。稀有度色不得复用 success/warning/danger，且必须配标签。

## 4. 排版

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

## 5. 间距与尺寸

Primitive spacing：`0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`
px。2/6 仅用于内部光学校准；布局优先 4/8 节奏。

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

## 6. 圆角、边框与层级

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

## 7. Glass 规范

Glass 是“背景退居次要”的功能材质，仅允许 titlebar、悬浮导航、popover/dialog
backdrop 和媒体上的临时控制层使用。内容 section、列表卡片、表单和嵌套容器禁止 glass。

- Dark 建议 surface alpha 0.78-0.9，Light 0.84-0.94；backdrop blur 12-20px；
- 必须有不透明 fallback、边界和独立对比测试；
- 用户减少透明度、GPU 性能不足或远程桌面环境下关闭 blur；
- 同一区域不得叠加两个 blur 层；滚动列表下的持续 blur 需性能基准；
- Blur 表达层级/遮罩，不作装饰。禁止环境光球和持续漂移动画。

## 8. Motion 系统

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

## 9. 桌面布局

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

Rail 是顶级空间，Sidebar 是当前空间导航，Tabs/segmented
control 是当前页面视图；三者不得表达同一层级。页面 section 是无框全宽布局，不包成漂浮卡；卡片只用于真正重复、可独立选择的项目。禁止 card
inside card。

未来 Web 断点基线为 375、768、1024、1440；Mobile 采用独立适配，不把桌面多栏压扁。核心内容优先，次要面板折叠；不得产生无意水平滚动。

## 10. 组件分类与命名

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

## 11. 图标与资产

- 系统图标统一 Lucide，经 `packages/icons` 封装；不在业务代码直接混用多个库；
- 尺寸仅 12、16、20、24、32，默认 stroke 1.75；同层级 outline/fill 不混用；
- 熟悉工具动作优先图标按钮（返回、关闭、收藏、下载），不熟悉图标带 tooltip 与 accessible name；
- 导航同时显示图标与文字（极窄 Rail 可在稳定学习后仅图标，但 tooltip/label 必须存在）；
- 禁止 Emoji 作为结构图标，禁止手绘已有标准图标的 SVG；
- 游戏、平台和社区品牌资产使用官方文件、比例和 clear space，记录来源/许可证；
- 主媒体必须展示真实游戏/内容，不用模糊裁剪或纯氛围图替代可检查信息。

## 12. 交互与反馈

每个交互组件具备 default、hover、focus-visible、pressed、selected、disabled、loading 和 error（适用时）。反馈在 100ms 内出现；超过 300ms 显示局部 progress，超过 1s 用保留尺寸 skeleton。Skeleton 不模拟不可预测内容，也不无限循环吸引注意。

表单始终有可见 label；blur 后验证，错误靠近字段并说明原因与修复；多错误提供 summary/focus。破坏性操作与主操作空间分离，优先 undo；不可逆动作二次确认并明确对象。Toast
3-5 秒（错误/可操作消息不强制自动消失），`aria-live` 宣告且不抢焦点。

## 13. 可访问性

目标 WCAG 2.2 AA：

- 语义结构与标题顺序正确；主内容 skip link；
- 全键盘操作，无焦点陷阱，route/dialog focus 管理可预测；
- icon-only control 有 accessible name，装饰图隐藏，重要图有替代文本；
- 颜色不是唯一信息；图表提供数据表/文本替代；
- 200% 文本缩放和系统高对比模式不丢内容/操作；
- drag、hover、gesture、Canvas 都有可见的键盘/点击替代；
- Live region 谨慎使用，实时进度节流，避免屏幕阅读器噪音。

## 14. 设计评审与发布门禁

- Token 无 raw value 泄漏，明暗/高对比状态完整；
- 1024×640、1280×720、1440×900、1920×1080 与 200% 缩放无重叠/截断；
- 键盘、屏幕阅读器、reduced-motion/reduced-transparency 通过；
- 文本溢出、长中文/英文/数字、空/错/慢/离线状态通过；
- 图标、品牌资产、媒体授权与替代文本正确；
- 动画没有 layout shift，滚动/blur 达到性能预算；
- Storybook 视觉回归、axe 自动检查和关键流程人工检查完成。

设计系统的任何例外必须记录原因、范围、owner 和到期日；“更好看”不是绕过一致性或无障碍的理由。
