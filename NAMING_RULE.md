# 命名规范

| 属性   | 值                                          |
| ------ | ------------------------------------------- |
| 状态   | Baseline v1.0                               |
| 所有者 | Architecture Guild                          |
| 语言   | 代码标识符与协议使用英语；用户文案按 Locale |

## 1. 总则

命名表达领域含义与意图，避免实现细节和含糊缩写。使用团队可搜索的统一词汇；同一概念不得在 API、数据库、事件和 UI 中分别叫不同名字。术语变化需更新 product glossary 和迁移说明。

禁止：`data`、`info`、`item`、`obj`、`temp`、`manager`、`processor`、`handler`
等无上下文名称；在有明确职责时如 `WebhookHandler` 可用。禁止 `utils2`、`newService`、`finalFinal`。

## 2. TypeScript 命名

| 对象                 | 规则                                 | 示例                             |
| -------------------- | ------------------------------------ | -------------------------------- |
| 变量/函数            | `camelCase`                          | `publishedRevision`, `loadGuide` |
| Type/Class/Component | `PascalCase`                         | `GuideRevision`, `BuildEditor`   |
| 常量值               | `UPPER_SNAKE_CASE` 仅真正全局常量    | `MAX_PAGE_SIZE`                  |
| 布尔值               | `is/has/can/should/did`              | `isPublished`, `canEdit`         |
| 集合                 | 复数                                 | `guideRevisions`                 |
| Map/Set              | 后缀表达索引                         | `guideById`, `selectedGameIds`   |
| Async action         | 动词；不加 `Async`，除非与 sync 并存 | `fetchGuide`                     |
| Event callback prop  | `on<Event>`                          | `onSelectionChange`              |
| 内部 event handler   | `handle<Event>`                      | `handleSelectionChange`          |
| Hook                 | `use<Noun/Verb>`                     | `useCommandMenu`                 |
| Zustand store        | `use<Scope>Store`                    | `useWorkspaceStore`              |
| Query key factory    | `<feature>Keys`                      | `guideKeys.detail(id)`           |

接口不加 `I`，类型不加 `T`；以角色命名 `GuideRepository`、`Clock`。实现只有在需要区分时用 provider/技术：`PrismaGuideRepository`、`SystemClock`。DTO 明确方向与动作：`CreateGuideRequest`、`GuideResponse`，不使用泛化 `GuideDto` 贯穿层次。

领域命令用祈使动作 `PublishGuideRevision`，领域事件用过去式 `GuideRevisionPublished`，查询用意图
`GetGuideDetails`。Error 使用 `<Condition>Error`，对外稳定 code 使用 `UPPER_SNAKE_CASE`。

## 3. 文件与目录

- 目录：`kebab-case`；文件默认 `kebab-case.ts`；React component 可用
  `component-name.tsx`，导出名 PascalCase；
- 测试：`*.test.ts(x)`；integration：`*.integration.test.ts`；E2E：`*.spec.ts`；Story：`*.stories.tsx`；
- Nest：`*.controller.ts`、`*.service.ts`（仅真正 service）、`*.module.ts`、`*.repository.ts`、`*.gateway.ts`；
- Schema：`*.schema.ts`；mapper：`*.mapper.ts`；factory/builder 名称必须说明产物；
- 公共入口 `index.ts` 只 re-export 公共 API，不实现逻辑；禁止层层 barrel 导致循环依赖；
- 动态路由参数按框架约定，概念名保持一致。

功能目录以用户能力命名，如 `guide-reader`、`build-editor`，不用技术层 `components` 作为 feature。后端 bounded context 使用单数概念目录或公认集合名，并在全仓一致。

## 4. React 组件

Primitive 使用名词：`Button`、`Dialog`、`TextField`。组合模式使用清晰领域/任务：`GameLibrarySidebar`、`GuideSourceList`。避免
`Card` 泛滥；如果组件是 `GuideSummary`，按内容命名而非外观 `GuideCard`，除非 Card 本身是交互契约。

Props 类型为 `<Component>Props`；variant 使用语义 `primary/secondary/quiet/danger`，不用颜色名 `blue/red`。Slot 用角色 `leadingIcon`、`actions`、`footer`。禁止 `isTypeA`、`isTypeB` 多布尔切换，改为 `variant` union 或组合。

## 5. API 命名

- URL 复数 kebab-case：`/guide-revisions/{revisionId}`；
- JSON camelCase：`publishedAt`；query 参数 camelCase，结构化过滤 `filter[gameId]`；
- operationId 为动词 + 资源：`listGameGuides`、`publishGuideRevision`；
- HTTP header 使用标准头优先，自定义 `X-Client-Version` 等仅在必要时；
- Error code：`GUIDE_REVISION_CONFLICT`；字段错误 code 小写 snake_case：`too_long`；
- API enum 小写 snake_case；不得直接暴露数据库 enum 名。

## 6. 数据库命名

| 对象               | 格式                 | 示例                                      |
| ------------------ | -------------------- | ----------------------------------------- |
| Schema/Table       | `snake_case`，表复数 | `knowledge.guide_revisions`               |
| Column             | `snake_case`         | `published_at`                            |
| Primary key        | `id`                 | `id`                                      |
| Foreign key column | `<singular>_id`      | `guide_id`                                |
| Unique             | `uq_<table>__<cols>` | `uq_games__slug`                          |
| Index              | `ix_<table>__<cols>` | `ix_guide_revisions__guide_id_created_at` |
| Foreign key        | `fk_<from>__<to>`    | `fk_guide_revisions__guides`              |
| Check              | `ck_<table>__<rule>` | `ck_builds__title_not_blank`              |

Join table 用两个实体复数按领域自然顺序，如 `guide_tags`；不是机械字母排序。时间列 `_at`，业务日期 `_on`，布尔列 `is_`/`has_`。禁止 `tbl_`、`col_` 和数据库保留字。

## 7. Redis、Queue 与事件

- Redis：`ggh:<env>:<domain>:<purpose>:<version>:<id>`，例如
  `ggh:prod:catalog:game:v2:<id>`；禁止 PII 放 key；
- BullMQ queue：`<domain>.<purpose>.v<major>`；job：`<domain>.<action>.v<major>`；
- Integration event：`<domain>.<entity>.<past-tense>.v<major>`，如
  `knowledge.revision.published.v1`；
- WebSocket UI event 可按事实/进度：`operation.progress.v1`；
- Event field 使用 camelCase，事件 ID 和 correlation ID 不混用。

事件版本在语义破坏时升级 major；新增可选字段不升级。事件名不包含 transport（如
`kafka`/`ws`）或消费者名字。

## 8. Git、环境与配置

Branch 见 [GIT_RULE.md](./GIT_RULE.md)：`feature/GGH-123-guide-search`。环境变量以 `GGH_` 开头、`UPPER_SNAKE_CASE`，按作用域命名：`GGH_API_DATABASE_URL`、`GGH_DESKTOP_UPDATE_CHANNEL`。Secret 名称表达内容但不含真实环境值。

Feature flag：`<area>.<capability>.<variant?>`，例如 `assistant.citations.v2`；避免否定名。Telemetry event 使用 `<surface>.<object>.<action>`，属性名稳定且不含动态 ID。

## 9. 缩写与保留词

允许行业通用：API、HTTP、URL、ID、UI、AI、DB、DTO、SLO。标识符按自然大小写：`apiClient`、`userId`、`HttpGateway`（不使用 `APIClient`/`userID`）。领域缩写首次在 glossary 定义；单字母只用于极短数学/索引范围。

避免 `delete` 与 `remove` 混用：删除事实用 `delete`，从集合解除关联用 `remove`，可逆状态用 `archive`/`deactivate`。读取远程资源用 `fetch`，从 repository 用 `find/get`（`get` 不存在时抛/失败，`find` 可返回空），转换用 `map/to/from`，验证用 `validate/parse`（parse 成功返回类型，失败明确）。

## 10. 评审清单

- 名称是否使用统一领域语言、可搜索且不泄漏实现？
- 动词是否准确表达副作用、失败和返回语义？
- Boolean/collection/time/ID 是否一眼可辨？
- 文件/导出/API/DB/event 是否遵循各自 casing？
- 缩写、版本、状态和错误 code 是否稳定可演进？
- 新术语是否进入 glossary/文档并清理旧别名？
