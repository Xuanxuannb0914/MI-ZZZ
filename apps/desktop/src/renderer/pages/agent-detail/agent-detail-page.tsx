import {
  BookOpen,
  Bot,
  Check,
  ChevronLeft,
  Film,
  Heart,
  History,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
  WandSparkles,
} from '@game-guide-hub/icons';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@game-guide-hub/ui';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import {
  agents,
  findAgentById,
  findDriveDiscById,
  findVersionById,
  findWEngineById,
  guides,
  resolveContentLinks,
  teams,
} from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { Tag } from '../../shared/ui/tag';

const attributeTone = {
  电: 'electric',
  以太: 'ether',
  冰: 'ice',
  火: 'fire',
  物理: 'physical',
} as const;

interface DetailPanelProps {
  readonly title: string;
  readonly icon: typeof Star;
  readonly children: React.ReactNode;
}
function DetailPanel({ title, icon: Icon, children }: DetailPanelProps) {
  return (
    <section className="border-t border-border-subtle py-panel">
      <h2 className="flex items-center gap-control text-label font-semibold">
        <Icon aria-hidden="true" className="text-content-electric" size={17} />
        {title}
      </h2>
      <div className="mt-content text-body text-text-secondary">{children}</div>
    </section>
  );
}

export default function AgentDetailPage() {
  const { id } = useParams();
  const agent = id ? findAgentById(id) : undefined;
  const favoriteAgentIds = useAppStore((state) => state.favoriteAgentIds);
  const toggleFavoriteAgent = useAppStore((state) => state.toggleFavoriteAgent);
  const recordAgentVisit = useAppStore((state) => state.recordAgentVisit);
  const [shareLabel, setShareLabel] = useState('分享');

  useEffect(() => {
    if (agent) recordAgentVisit(agent.id);
  }, [agent, recordAgentVisit]);
  if (!agent) return <Navigate replace to="/zzz/agents" />;

  const teamAgents = agent.recommendedTeam
    .map((name) => agents.find((candidate) => candidate.name === name))
    .filter((candidate) => candidate !== undefined);
  const isFavorite = favoriteAgentIds.includes(agent.id);
  const relatedGuides = guides
    .filter((guide) => guide.title.includes(agent.name) || guide.category === '角色养成')
    .slice(0, 3);
  const recommendedWEngines = (agent.recommendedWEngineIds ?? [])
    .map(findWEngineById)
    .filter((item): item is NonNullable<ReturnType<typeof findWEngineById>> => Boolean(item));
  const recommendedDriveDiscs = (agent.recommendedDriveDiscIds ?? [])
    .map(findDriveDiscById)
    .filter((item): item is NonNullable<ReturnType<typeof findDriveDiscById>> => Boolean(item));
  const recommendedTeams = (agent.teamIds ?? [])
    .map((teamId) => teams.find((team) => team.id === teamId))
    .filter((item): item is NonNullable<(typeof teams)[number]> => Boolean(item));
  const relatedLinks = resolveContentLinks(agent).slice(0, 8);
  const version = agent.versionId ? findVersionById(agent.versionId) : undefined;

  const shareAgent = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/agent/${agent.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLabel('链接已复制');
    } catch {
      setShareLabel('已生成链接');
    }
  };

  return (
    <PageTransition>
      <div>
        <section
          className={`relative min-h-[28rem] overflow-hidden border-b border-border-subtle bg-content-surface ${agent.accentClass}`}
        >
          <img
            src={agent.cover}
            alt=""
            width="1920"
            height="1080"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="hero-scrim absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[28rem] max-w-app items-end px-panel py-layout lg:px-layout">
            <img
              src={agent.avatar}
              alt={`${agent.name} 角色立绘`}
              width="512"
              height="512"
              className="absolute bottom-0 right-[5%] hidden h-[95%] w-auto object-contain drop-shadow-2xl md:block"
            />
            <div className="relative z-base max-w-2xl">
              <Link
                to="/zzz/agents"
                className="mb-section inline-flex items-center gap-compact text-label text-text-secondary hover:text-text-primary"
              >
                <ChevronLeft aria-hidden="true" size={17} />
                返回角色图鉴
              </Link>
              <div className="flex gap-compact">
                <Tag tone={attributeTone[agent.attribute]}>{agent.attribute}</Tag>
                <Tag>{agent.specialty}</Tag>
                <Tag>{agent.rarity} 级</Tag>
              </div>
              <p className="mt-panel text-caption font-semibold text-content-electric">
                {agent.faction}
              </p>
              <h1 className="mt-compact text-display font-bold">{agent.name}</h1>
              <p className="mt-content max-w-xl text-body-lg text-text-secondary">
                {agent.description}
              </p>
              <div className="mt-section flex flex-wrap gap-control">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="comfortable"
                      className="bg-content-electric text-on-action-primary"
                    >
                      <Bot aria-hidden="true" size={17} />
                      AI 培养建议
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>AI 培养建议即将开放</DialogTitle>
                    <DialogDescription>
                      当前展示的是本地整理的培养建议。AI
                      助手将在后续版本提供可解释的配装理由与资料来源。
                    </DialogDescription>
                    <DialogClose asChild>
                      <Button className="mt-section" variant="secondary">
                        知道了
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <Button
                  size="comfortable"
                  variant="secondary"
                  onClick={() => toggleFavoriteAgent(agent.id)}
                >
                  <Heart aria-hidden="true" size={17} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? '已收藏' : '收藏角色'}
                </Button>
                <Button size="comfortable" variant="quiet" onClick={shareAgent}>
                  <Share2 aria-hidden="true" size={17} />
                  {shareLabel}
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Page className="grid gap-layout xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.8fr)]">
          <div className="space-y-section">
            <DetailPanel title="动作演示" icon={Film}>
              <div
                className="guide-video-placeholder"
                role="img"
                aria-label={`${agent.name} 动作演示占位区域`}
              >
                <Film aria-hidden="true" size={28} />
                <span>角色动画与技能轴演示将在后续版本接入</span>
              </div>
            </DetailPanel>
            <DetailPanel title="推荐配队" icon={UsersRound}>
              <div className="grid gap-content sm:grid-cols-2">
                {teamAgents.map((member) => (
                  <Link
                    key={member.id}
                    to={`/zzz/agents/${member.id}`}
                    className="flex items-center gap-content rounded-lg border border-border-subtle bg-surface-1 p-content hover:bg-surface-2"
                  >
                    <img
                      src={member.avatar}
                      alt=""
                      width="512"
                      height="512"
                      className="size-12 rounded-lg bg-surface-2 object-cover"
                    />
                    <span>
                      <strong className="block text-label text-text-primary">{member.name}</strong>
                      <span className="text-caption">
                        {member.specialty} · {member.attribute}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </DetailPanel>
            <DetailPanel title="推荐音擎" icon={WandSparkles}>
              {recommendedWEngines.length ? (
                <div className="flex flex-wrap gap-control">
                  {recommendedWEngines.map((item) => (
                    <Link
                      key={item.id}
                      to={`/zzz/w-engines/${item.id}`}
                      className="rounded-md border border-border-subtle bg-surface-1 p-content hover:bg-surface-2"
                    >
                      <strong className="block text-label text-text-primary">{item.name}</strong>
                      <span className="mt-compact block text-caption">{item.effect}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-title3 font-semibold text-text-primary">
                    {agent.recommendedWeapon}
                  </p>
                  <p className="mt-compact">当前版本本地培养档案中的优先推荐。</p>
                </>
              )}
            </DetailPanel>
            <DetailPanel title="推荐驱动盘" icon={ShieldCheck}>
              <div className="flex flex-wrap gap-control">
                {recommendedDriveDiscs.length
                  ? recommendedDriveDiscs.map((disc) => (
                      <Link key={disc.id} to={`/zzz/drive-discs/${disc.id}`}>
                        <Tag>{disc.name}</Tag>
                      </Link>
                    ))
                  : agent.recommendedDriveDisc.map((disc) => <Tag key={disc}>{disc}</Tag>)}
              </div>
            </DetailPanel>
            {recommendedTeams.length ? (
              <DetailPanel title="成型配队" icon={UsersRound}>
                <div className="grid gap-content sm:grid-cols-2">
                  {recommendedTeams.map((team) => (
                    <Link
                      key={team.id}
                      to={`/zzz/teams/${team.id}`}
                      className="rounded-md border border-border-subtle bg-surface-1 p-content hover:bg-surface-2"
                    >
                      <strong className="block text-label text-text-primary">{team.name}</strong>
                      <span className="mt-compact block text-caption">{team.focus}</span>
                    </Link>
                  ))}
                </div>
              </DetailPanel>
            ) : null}
            <DetailPanel title="培养思路" icon={Sparkles}>
              <p>
                优先完成核心被动阈值，再追求完美副词条。将爆发窗口对齐队伍失衡与支援增益，在自由训练中不断优化循环。
              </p>
            </DetailPanel>
            <DetailPanel title="攻略摘要" icon={BookOpen}>
              <div className="grid gap-content md:grid-cols-3">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    to={`/zzz/guides/${guide.id}`}
                    className="rounded-lg border border-border-subtle bg-surface-1 p-content hover:bg-surface-2"
                  >
                    <strong className="block text-label text-text-primary">{guide.title}</strong>
                    <span className="mt-compact block text-caption text-text-tertiary">
                      {guide.category} · {guide.readTime} 分钟
                    </span>
                  </Link>
                ))}
              </div>
            </DetailPanel>
            {relatedLinks.length ? (
              <DetailPanel title="知识网络" icon={Sparkles}>
                <div className="flex flex-wrap gap-control">
                  {relatedLinks.map((item) => (
                    <Link key={`${item.type}-${item.id}`} to={item.to}>
                      <Tag>{item.title}</Tag>
                    </Link>
                  ))}
                </div>
              </DetailPanel>
            ) : null}
          </div>
          <aside className="space-y-section">
            <DetailPanel title="培养材料" icon={Star}>
              <ul className="space-y-control">
                {agent.materials.map((material) => (
                  <li key={material} className="flex items-start gap-control">
                    <Check
                      aria-hidden="true"
                      className="mt-compact shrink-0 text-success"
                      size={15}
                    />
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </DetailPanel>
            <DetailPanel title="技能加点" icon={Sparkles}>
              <ol className="space-y-control">
                {agent.skills.map((skill, index) => (
                  <li key={skill} className="flex items-center gap-content">
                    <span className="flex size-control-compact items-center justify-center rounded-md bg-surface-2 text-caption font-semibold text-text-primary">
                      {index + 1}
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ol>
            </DetailPanel>
            <DetailPanel title="基础信息" icon={ShieldCheck}>
              <dl className="grid grid-cols-[auto_1fr] gap-x-panel gap-y-control">
                <dt>稀有度</dt>
                <dd className="text-right text-text-primary">{agent.rarity}</dd>
                <dt>属性</dt>
                <dd className="text-right text-text-primary">{agent.attribute}</dd>
                <dt>特性</dt>
                <dd className="text-right text-text-primary">{agent.specialty}</dd>
                <dt>阵营</dt>
                <dd className="text-right text-text-primary">{agent.faction}</dd>
                <dt>版本</dt>
                <dd className="text-right text-text-primary">
                  {version ? `${version.code} ${version.name}` : '资料整理中'}
                </dd>
              </dl>
            </DetailPanel>
            <DetailPanel title="最近改动" icon={History}>
              <ul className="space-y-control">
                <li>
                  <strong className="text-text-primary">2.1.0</strong> · 更新推荐配队与驱动盘阈值
                </li>
                <li>
                  <strong className="text-text-primary">2.0.2</strong> · 补充技能优先级与材料清单
                </li>
                <li>
                  <strong className="text-text-primary">2.0.0</strong> · 建立首版角色档案
                </li>
              </ul>
            </DetailPanel>
          </aside>
        </Page>
      </div>
    </PageTransition>
  );
}
