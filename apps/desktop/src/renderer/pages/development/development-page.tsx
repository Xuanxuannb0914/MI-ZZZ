import type { LucideIcon } from '@game-guide-hub/icons';
import {
  CalendarDays,
  ChevronRight,
  Disc3,
  PackageOpen,
  Swords,
  UsersRound,
  Wrench,
} from '@game-guide-hub/icons';
import { Link } from 'react-router-dom';
import { workspaceRoutes } from '../../shared/config/workspace-routes';
import {
  agents,
  driveDiscs,
  materials,
  teams,
  todaysFarming,
  wEngines,
} from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SectionTitle } from '../../shared/ui/section-title';

interface DevelopmentTool {
  readonly title: string;
  readonly description: string;
  readonly value: string;
  readonly label: string;
  readonly to: string;
  readonly icon: LucideIcon;
}

const developmentTools: readonly DevelopmentTool[] = [
  {
    title: '角色养成',
    description: '查看代理人定位、属性与培养方向。',
    value: `${agents.length}`,
    label: '名代理人',
    to: workspaceRoutes.development.characters,
    icon: UsersRound,
  },
  {
    title: '音擎配置',
    description: '按定位筛选可用音擎与适配方案。',
    value: `${wEngines.length}`,
    label: '件音擎',
    to: workspaceRoutes.development.wEngines,
    icon: Wrench,
  },
  {
    title: '驱动盘搭配',
    description: '整理套装效果与角色适配思路。',
    value: `${driveDiscs.length}`,
    label: '套驱动盘',
    to: workspaceRoutes.development.driveDiscs,
    icon: Disc3,
  },
  {
    title: '材料查询',
    description: '按目标定位升级、技能与突破素材。',
    value: `${materials.length}`,
    label: '类材料',
    to: workspaceRoutes.development.materials,
    icon: PackageOpen,
  },
  {
    title: '配队资料库',
    description: '以核心角色和循环逻辑浏览配队。',
    value: `${teams.length}`,
    label: '套方案',
    to: workspaceRoutes.development.teams,
    icon: Swords,
  },
  {
    title: '每日规划',
    description: '聚合体力规划、每日刷新与活动目标。',
    value: '今日',
    label: '可执行',
    to: workspaceRoutes.development.calculator,
    icon: CalendarDays,
  },
];

export default function DevelopmentPage() {
  return (
    <PageTransition>
      <Page className="page-surface development-page">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">养成中心</p>
            <h1 className="mt-control text-title1 font-semibold">把每一份体力用在关键目标上</h1>
            <p className="mt-compact max-w-2xl text-body text-text-secondary">
              从角色、装备到材料与配队，按当前目标快速进入需要的资料与规划工具。
            </p>
          </div>
          <Link
            className="ggh-button ggh-button-secondary inline-flex h-control items-center gap-compact px-panel text-label font-semibold"
            to={workspaceRoutes.development.calculator}
          >
            打开今日规划
            <ChevronRight aria-hidden="true" size={16} />
          </Link>
        </header>

        <section className="grid gap-content sm:grid-cols-2 xl:grid-cols-3" aria-label="养成工具">
          {developmentTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="ggh-glass glass-light ggh-card ggh-card-interactive p-panel"
              >
                <div className="flex items-start justify-between gap-content">
                  <span className="ggh-icon-container" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="text-caption font-semibold tabular-nums text-content-electric">
                    {tool.value}{' '}
                    <span className="font-normal text-text-tertiary">{tool.label}</span>
                  </span>
                </div>
                <h2 className="mt-panel text-title3 font-semibold text-text-primary">
                  {tool.title}
                </h2>
                <p className="mt-compact text-caption leading-relaxed text-text-secondary">
                  {tool.description}
                </p>
                <span className="mt-panel inline-flex items-center gap-compact text-caption font-semibold text-text-primary">
                  进入工具
                  <ChevronRight aria-hidden="true" size={15} />
                </span>
              </Link>
            );
          })}
        </section>

        <section>
          <SectionTitle
            eyebrow="今日建议"
            title="下一步刷取"
            description="基于当前开放内容整理的本地推荐路线。"
          />
          <ol className="mt-panel grid gap-content md:grid-cols-3">
            {todaysFarming.slice(0, 3).map((item, index) => (
              <li
                key={item}
                className="flex items-start gap-content border-t border-border-subtle pt-content"
              >
                <span className="font-mono text-caption font-semibold text-content-electric">
                  0{index + 1}
                </span>
                <p className="text-label leading-relaxed text-text-primary">{item}</p>
              </li>
            ))}
          </ol>
        </section>
      </Page>
    </PageTransition>
  );
}
