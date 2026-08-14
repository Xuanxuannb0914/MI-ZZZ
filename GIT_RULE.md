# Git 与发布工作流

| 属性   | 值                                               |
| ------ | ------------------------------------------------ |
| 状态   | Baseline v1.0                                    |
| 所有者 | Release Engineering                              |
| 模型   | Git Flow + 短生命周期分支 + Conventional Commits |

## 1. 分支模型

| 分支         | 来源           | 合并目标                      | 用途                                 |
| ------------ | -------------- | ----------------------------- | ------------------------------------ |
| `main`       | release/hotfix | -                             | 仅生产可发布历史，每个版本有签名 tag |
| `develop`    | main 初始化    | -                             | 下一版本集成，始终可部署到 staging   |
| `feature/*`  | develop        | develop                       | 用户能力/新功能                      |
| `fix/*`      | develop        | develop                       | 非生产紧急缺陷                       |
| `refactor/*` | develop        | develop                       | 无外部行为改变的结构优化             |
| `release/*`  | develop        | main + develop                | 版本稳定、文档、版本号；禁止新功能   |
| `hotfix/*`   | main           | main + develop/active release | 生产严重问题                         |

Git Flow 容易产生长分支，因此 feature/fix/refactor 目标 24-72 小时，超过 5 个工作日必须拆分或用 feature flag 合并暗路径。每天同步 `develop`，避免发布阶段集中集成。

## 2. 分支命名

格式：`<type>/<ticket>-<short-kebab-description>`。

```text
feature/GGH-123-guide-search
fix/GGH-241-stale-build-version
refactor/GGH-310-query-key-factory
release/1.4.0
hotfix/1.4.1-auth-token-leak
```

只用 ASCII 小写描述，不含姓名、日期、`final`、`new`。无 ticket 的维护工作用批准的 `NO-TICKET`
并在 PR 解释。分支不得复用。

## 3. Commit Convention

遵循 Conventional Commits：

```text
<type>(<scope>)<!>: <imperative summary>

[body: why, constraints, behavior]

[footer: BREAKING CHANGE / issue references]
```

允许类型：`feat`、`fix`、`refactor`、`perf`、`test`、`docs`、`build`、`ci`、`chore`、`revert`、`security`。Scope 使用稳定 workspace/domain：`desktop`、`api`、`worker`、`ui`、`knowledge`、`builds`、`assistant`、`deps`。

示例：`fix(knowledge): preserve revision cursor after refresh`。Subject 使用英文祈使句、小写开头、无句号、建议 ≤72 字符。Body 解释 WHY 和行为，不复制 diff。Breaking change 使用 `!` 和 `BREAKING CHANGE:`，同时必须有迁移方案。

Husky 在 `commit-msg` 调用 Commitlint 阻止无效提交，在 `pre-commit`
先通过 lint-staged 运行受影响文件的格式化与 lint，再执行全仓 lint、typecheck 和 test。CI 仍是不可绕过的权威门禁。自动生成提交必须标记来源但仍遵守规范。禁止把 secret、个人数据、二进制大文件和生成缓存提交到 Git。

## 4. 原子提交与历史

每个 commit 可构建/可测试并表达一个逻辑变化。格式化、生成物可与触发它的源变更同提交；全仓机械重排应单独 commit，避免掩盖行为变化。禁止“fix review”“misc”“wip”进入受保护分支。

本地可交互整理尚未共享的分支；已被他人消费的历史不得 force push，除非协调并使用
`--force-with-lease`。`main`、`develop`、release/hotfix 禁止直接 push 与改写历史。

## 5. Pull Request

PR 模板必须包含：问题/非目标、方案与 WHY、影响范围、截图/录屏（UI）、测试证据、API/数据/安全/可访问性影响、部署/迁移、回滚、文档、风险与监控。

推荐净变更 ≤400 行（生成物/快照分开统计）；超过 800 行需拆分说明和评审计划。大重构先 RFC，使用无行为变化的准备 PR，再引入功能。

PR 默认 Draft 起步；Ready 后必须同步目标分支、无 unresolved thread、所有 required checks 通过、CODEOWNERS 批准。作者不能作为唯一批准者。

## 6. 合并策略

- feature/fix/refactor → develop：**Squash merge**，PR 标题成为 Conventional Commit，保持主线清晰；
- release/hotfix → main：**Merge commit**，保留发布分支边界；创建签名 annotated tag；
- main 的 release/hotfix merge commit 必须回合并 develop 和活动 release，避免修复丢失；
- 禁止直接 cherry-pick 代替必要的回合并；确需 backport 时标记原 commit/PR 并独立验证。

仓库设置自动删除已合并短分支。Merge queue 可在并发增长后启用，仍须以最新目标分支结果为准。

## 7. 保护与 CI 门禁

`main`/`develop`：必需 PR、至少 1 名 owner 批准；安全/认证/迁移/发布流程至少 2 名且含专项 owner；dismiss stale approvals；禁止 force push/delete；要求签名提交/tag（组织能力允许时）。

Required checks：

- secret/license/dependency scan；
- format、lint、typecheck、dependency boundary；
- unit、integration、contract、受影响 E2E；
- build/package、OpenAPI diff、Prisma migration review；
- Storybook/visual/a11y（UI 变更）；
- commitlint、PR title、changelog policy。

不得用管理员 override 例行绕过门禁。紧急 override 需 incident ID、两人批准、风险/补测时限，并在 24 小时内复盘。

## 8. Release Flow

1. 从 develop 创建 `release/x.y.z`，冻结功能；
2. 自动计算/人工确认 SemVer、更新 CHANGELOG、兼容矩阵与 release notes；
3. Staging 执行全量 E2E、迁移/恢复、签名/更新、性能与安全 smoke；
4. 修复只进入 release 分支，并同步到 develop；
5. Merge commit 到 main，创建签名 `vX.Y.Z` tag；CI 从 tag 构建，不从开发机上传；
6. 保存 provenance、制品哈希、SBOM、签名与测试报告；
7. 分阶段发布 Desktop/API flags，观察 SLO、崩溃与业务指标；
8. 回合并 main 到 develop，关闭 release。

SemVer：破坏兼容/迁移要求 major，向后兼容功能 minor，修复 patch。0.x 阶段仍必须明确 breaking change，不能把 0.x 当无契约。

## 9. Hotfix

只用于生产安全、数据完整性、崩溃/不可用等不能等常规 release 的问题。从 main 最新 tag 创建，保持最小改动，附 incident、风险和验证。通过缩减但明确的门禁后发布 patch；随后回合并 main
→ develop 和活动 release。

安全 hotfix 的公开信息遵循 coordinated disclosure，不在修复发布前泄露可利用细节。

## 10. 回滚与 Revert

禁止删除历史或移动已发布 tag。代码回滚使用 `revert` commit/PR，指明原 PR 和用户影响。优先顺序：关闭 feature flag → 回滚无状态服务/Desktop rollout → forward-fix 数据/契约。

数据库 rollback 不假设 down migration 安全；采用 expand/contract 与 forward-fix。Desktop 已发布制品不可从用户机器强制“撤回”，需要更新 channel 熔断、阻止继续 rollout，并发布签名修复版。每次 release 必须在发布前验证具体回滚命令与 owner。

## 11. Changelog 与 Release Notes

[CHANGELOG.md](./CHANGELOG.md) 只记录用户/运营可感知变化，按 Added、Changed、Deprecated、Removed、Fixed、Security。内部重构不必记录，除非影响兼容、性能或运维。Release notes 从 Changelog 生成并补充升级、迁移、已知问题和支持窗口。

## 12. 禁止事项

直接 push 保护分支、force push 公共历史、跳过 hooks 规避失败、无 review 合并、发布未签名制品、从非 tag 重建同版本、在 release 分支开发新功能、提交真实 `.env`/凭据、删除已发布 tag，均为阻断项。
