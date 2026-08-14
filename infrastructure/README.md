# Infrastructure

该目录承载环境与运维资产，不承载应用业务代码。

- `compose/`：本地 PostgreSQL、Redis 等依赖编排；
- `migrations/`：运维迁移、回填与校验入口；
- `deployment/`：环境部署声明；
- `monitoring/`：SLO、告警与可观测性配置；
- `security/`：威胁模型、SBOM 与供应链策略。

当前 Phase 1 仅建立边界。具体供应商、部署目标和生产凭据策略必须经 ADR 审批后引入。
