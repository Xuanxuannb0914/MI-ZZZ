# 开发说明

## 环境

- Node.js 24.13+
- pnpm 11.20
- Git

```bash
pnpm install
pnpm --filter @game-guide-hub/desktop dev
```

Web Renderer 默认位于 `http://127.0.0.1:5173/#/startup`。

## 质量门禁

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Renderer 不能直接访问 Node、文件系统或通用 IPC。组件只消费主题 Token；业务模型留在所属实体或功能内。新增路由时先判断它属于平台启动树还是持久工作区树，不得把启动场景放进
`AppShell`。

内容开发优先复用 `apps/desktop/src/renderer/shared/content`
聚合入口。新增角色、攻略、活动或材料时，先补齐实体类型与本地 Mock，再在页面中组合；不要把长篇内容直接写进 JSX。每日任务状态使用现有 Zustand
`useAppStore` 持久化，不新增第二套状态管理。

提交前验证
`/startup -> /games -> /zzz`、工作区核心导航、返回操作、窗口缩放、重复点击与启动 Canvas 清理。
