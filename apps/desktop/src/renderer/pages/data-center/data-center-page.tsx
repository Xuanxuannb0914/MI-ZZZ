import type { LucideIcon } from '@game-guide-hub/icons';
import {
  ChevronRight,
  Database,
  History,
  Newspaper,
  UsersRound,
  Wrench,
} from '@game-guide-hub/icons';
import { Link } from 'react-router-dom';
import { workspaceRoutes } from '../../shared/config/workspace-routes';
import {
  agents,
  analyzeGachaHistory,
  gachaHistory,
  versions,
  wEngines,
} from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';

interface DataEntry {
  readonly label: string;
  readonly description: string;
  readonly metric: string;
  readonly to: string;
  readonly icon: LucideIcon;
}

export default function DataCenterPage() {
  const gacha = analyzeGachaHistory(gachaHistory);
  const entries: readonly DataEntry[] = [
    {
      label: '抽卡分析',
      description: '统计保底、出货与限定获取情况。',
      metric: `${gacha.totalPulls} 抽`,
      to: workspaceRoutes.data.gacha,
      icon: History,
    },
    {
      label: '角色数据',
      description: '检索属性、定位和阵营信息。',
      metric: `${agents.length} 名`,
      to: workspaceRoutes.data.characters,
      icon: UsersRound,
    },
    {
      label: '音擎数据',
      description: '按定位核对音擎效果与来源。',
      metric: `${wEngines.length} 件`,
      to: workspaceRoutes.data.wEngines,
      icon: Wrench,
    },
    {
      label: '版本数据',
      description: '回溯版本主题、周期与活动线索。',
      metric: `${versions.length} 条`,
      to: workspaceRoutes.data.versions,
      icon: Newspaper,
    },
  ];

  return (
    <PageTransition>
      <Page className="page-surface">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">数据中心</p>
            <h1 className="mt-control text-title1 font-semibold">让信息变成可执行的判断</h1>
            <p className="mt-compact max-w-2xl text-body text-text-secondary">
              角色、装备、版本与个人抽卡记录汇聚在同一入口，后续会在此扩展怪物图鉴与版本数据工具。
            </p>
          </div>
          <span className="ggh-icon-container ggh-icon-container-secondary" aria-hidden="true">
            <Database size={20} />
          </span>
        </header>

        <section className="grid gap-content sm:grid-cols-2 xl:grid-cols-4" aria-label="数据摘要">
          <Metric label="总抽数" value={`${gacha.totalPulls}`} detail="本地导入示例" />
          <Metric label="五星记录" value={`${gacha.fiveStarCount}`} detail="含限定获取" />
          <Metric
            label="五星均抽"
            value={gacha.averageFiveStarPity?.toFixed(1) ?? '--'}
            detail="按五星出货统计"
          />
          <Metric label="当前保底" value={`${gacha.currentPity}`} detail="距离下一次五星" />
        </section>

        <section className="grid gap-content md:grid-cols-2">
          {entries.map((entry) => {
            const Icon = entry.icon;
            return (
              <Link
                key={entry.to}
                to={entry.to}
                className="ggh-glass glass-light ggh-card ggh-card-interactive flex min-h-40 flex-col p-panel"
              >
                <div className="flex items-start justify-between gap-content">
                  <span className="ggh-icon-container" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="text-caption font-semibold text-content-electric">
                    {entry.metric}
                  </span>
                </div>
                <h2 className="mt-panel text-title3 font-semibold text-text-primary">
                  {entry.label}
                </h2>
                <p className="mt-compact text-caption leading-relaxed text-text-secondary">
                  {entry.description}
                </p>
                <span className="mt-auto pt-panel text-caption font-semibold text-text-primary">
                  打开数据 <ChevronRight aria-hidden="true" className="inline" size={15} />
                </span>
              </Link>
            );
          })}
        </section>
      </Page>
    </PageTransition>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}) {
  return (
    <article className="border-t border-border-subtle pt-content">
      <p className="text-caption text-text-tertiary">{label}</p>
      <p className="mt-compact font-display text-title1 font-semibold tabular-nums text-text-primary">
        {value}
      </p>
      <p className="mt-compact text-caption text-text-secondary">{detail}</p>
    </article>
  );
}
