# Asteris Widget Guide

首页是由独立 Widget 组成的桌面工作区。Widget 不直接持有业务请求，只接收已整理好的 Mock 或未来 query 数据，因此后续可以将布局状态替换为拖拽排序而不修改业务模块。

## 当前 Widget

- `QuickActions`：角色、攻略、配队、驱动盘、音擎、材料和兑换码入口。
- `DailyPlannerWidget`：今日材料、电量规划、每日/每周任务与活跃度。
- `EventCenterWidget`：当前活动、版本前瞻、限定卡池与倒计时。
- `AnnouncementsWidget`：公告、版本资讯、维护和活动新闻。
- `CharacterRecommendationsWidget`：推荐角色与培养方向。
- `GuideCenterWidget`：热门攻略和阅读时长。
- `ContinueReadingWidget`：基于 Zustand 本地历史的继续阅读。
- `FavoritesWidget`：固定角色、攻略和活动。
- `AiAssistantWidget`：未来 AI 培养、配队与问答的占位模块。

## 扩展约定

1. 使用 `WidgetShell` 作为统一标题、图标、操作入口和玻璃材质边界。
2. 内容区域只消费类型化数据，不在组件内创建重复的 Mock 结构。
3. 列表超过 50 项时使用虚拟化或分页；图片声明尺寸并使用 `loading="lazy"`。
4. 所有动作必须有键盘路径、可见焦点和明确的中文 `aria-label`。
5. 未来拖拽排序应以 `widgetId + order` 持久化，不要将布局顺序写死在业务数据中。
