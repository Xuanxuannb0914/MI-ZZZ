# Asteris 客户端架构

## 运行时边界

```text
/startup -> /games -> /zzz
   |          |        |
WebGL 场景   游戏选择   持久工作区壳层
LandingLayout         MainLayout
```

启动页和游戏中心只存在于 `LandingLayout`。选择游戏后，`StartupProvider`
将应用标记为就绪，启动路由树被整体卸载；绝区零页面只由 `MainLayout` 与 `AppShell` 承载。

## Renderer 目录职责

- `app/`：Provider、路由、布局、全局状态。
- `pages/`：路由页面与页面专属组合，不承载跨页面基础组件。
- `widgets/`：应用壳层与可复用的大型界面区域。
- `entities/`：角色、攻略等领域展示模型。
- `shared/content/`：Mock 内容的唯一聚合入口；新增内容先进入领域模型与 `shared/mock`
  数据，再由页面组合。
- `shared/`：场景、内容聚合、搜索、通用 UI 和无业务语义工具。

页面组合业务能力；实体保存领域展示模型；共享层不得包含业务状态。只有至少两个真实消费者时才抽离到
`packages/*`。

## 路由

- 平台：`/startup`、`/games`。
- 工作区：`/zzz`、`/zzz/guides`、`/zzz/agents`、`/zzz/events`、`/zzz/planner`、`/zzz/materials`、`/zzz/favorites`、`/zzz/search`。
- 设置：`/settings`。
- 旧地址保留重定向或兼容详情路由，避免已有深链失效。

## 场景生命周期

Three.js 只存在于启动路由。`LandingScene`
统一持有 renderer、scene、geometry、material 与后处理；卸载时遍历场景并释放 GPU 资源。Canvas、事件、定时器和动画帧都由所属组件清理，工作区不会渲染隐藏场景。

## 内容 Alpha 模型

绝区零内容按 `Agent`、`Guide`、`Event`、`Material`、`DailyTask`、`Announcement` 与
`Favorite/ReadingHistory` 组织。页面不直接声明业务文案；内容通过 `shared/content`
读取，便于后续将本地 Mock 替换为带来源的服务端数据。当前 Mock 明确标记为“本地 Mock”，不代表官方数据。
