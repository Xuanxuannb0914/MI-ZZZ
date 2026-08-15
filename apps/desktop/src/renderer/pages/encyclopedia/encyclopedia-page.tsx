import { ChevronRight, Disc3, ShieldCheck, UsersRound, Wrench } from '@game-guide-hub/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { workspaceRoutes } from '../../shared/config/workspace-routes';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { MonsterViewer } from './monster-viewer';

const entries = [
  {
    label: '角色',
    description: '角色定位、属性与培养资料。',
    to: workspaceRoutes.encyclopedia.characters,
    icon: UsersRound,
  },
  {
    label: '音擎',
    description: '音擎效果、定位与适配信息。',
    to: workspaceRoutes.encyclopedia.wEngines,
    icon: Wrench,
  },
  {
    label: '驱动盘',
    description: '套装效果与搭配方向。',
    to: workspaceRoutes.encyclopedia.driveDiscs,
    icon: Disc3,
  },
] as const;

export default function EncyclopediaPage() {
  const [params] = useSearchParams();
  const enemyTab = params.get('tab');
  return (
    <PageTransition>
      <Page className="page-surface">
        <header>
          <p className="text-caption font-semibold text-content-electric">图鉴中心</p>
          <h1 className="mt-control text-title1 font-semibold">新艾利都资料库</h1>
          <p className="mt-compact max-w-2xl text-body text-text-secondary">
            角色、装备与敌人资料在同一模块中浏览；怪物与 Boss 三栏图鉴将在此页面内接入。
          </p>
        </header>
        <nav className="page-tabs" aria-label="图鉴分类">
          <Link className="is-active" to={workspaceRoutes.encyclopedia.overview}>
            总览
          </Link>
          <Link to={workspaceRoutes.encyclopedia.characters}>角色</Link>
          <Link to={workspaceRoutes.encyclopedia.wEngines}>音擎</Link>
          <Link to={workspaceRoutes.encyclopedia.driveDiscs}>驱动盘</Link>
          <Link
            className={enemyTab === 'monsters' ? 'is-active' : undefined}
            to={workspaceRoutes.encyclopedia.monsters}
          >
            怪物
          </Link>
          <Link
            className={enemyTab === 'bosses' ? 'is-active' : undefined}
            to={workspaceRoutes.encyclopedia.bosses}
          >
            Boss
          </Link>
        </nav>
        {enemyTab === 'monsters' || enemyTab === 'bosses' ? (
          <MonsterViewer />
        ) : (
          <>
            <section className="grid gap-content md:grid-cols-3">
              {entries.map(({ label, description, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="ggh-glass glass-light ggh-card ggh-card-interactive flex min-h-44 flex-col p-panel"
                >
                  <Icon aria-hidden="true" className="text-content-electric" size={20} />
                  <h2 className="mt-panel text-title3 font-semibold text-text-primary">{label}</h2>
                  <p className="mt-compact text-caption leading-relaxed text-text-secondary">
                    {description}
                  </p>
                  <span className="mt-auto pt-panel text-caption font-semibold text-text-primary">
                    查看图鉴 <ChevronRight aria-hidden="true" className="inline" size={15} />
                  </span>
                </Link>
              ))}
            </section>
            <p className="flex items-center gap-compact border-l-2 border-content-ether pl-content text-caption text-text-secondary">
              <ShieldCheck aria-hidden="true" size={16} />
              怪物与 Boss 数据、3D Viewer 将作为图鉴内部功能上线。
            </p>
          </>
        )}
      </Page>
    </PageTransition>
  );
}
