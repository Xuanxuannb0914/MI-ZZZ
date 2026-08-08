import { CalendarDays, Heart, History, Swords } from '@game-guide-hub/icons';
import { Button, Card, EmptyState } from '@game-guide-hub/ui';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { AgentCard } from '../../entities/agent/ui/agent-card';
import { GuideCard } from '../../entities/guide/ui/guide-card';
import { agents } from '../../shared/mock/agents';
import { events } from '../../shared/mock/events';
import { guides } from '../../shared/mock/guides';
import { teams } from '../../shared/mock/teams';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SectionTitle } from '../../shared/ui/section-title';
import { Tag } from '../../shared/ui/tag';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const favoriteAgentIds = useAppStore((state) => state.favoriteAgentIds);
  const favoriteGuideIds = useAppStore((state) => state.favoriteGuideIds);
  const favoriteEventIds = useAppStore((state) => state.favoriteEventIds);
  const favoriteTeamIds = useAppStore((state) => state.favoriteTeamIds);
  const historyAgentIds = useAppStore((state) => state.historyAgentIds);
  const historyGuideIds = useAppStore((state) => state.historyGuideIds);
  const toggleFavoriteAgent = useAppStore((state) => state.toggleFavoriteAgent);
  const toggleFavoriteEvent = useAppStore((state) => state.toggleFavoriteEvent);
  const toggleFavoriteTeam = useAppStore((state) => state.toggleFavoriteTeam);
  const favoriteAgents = agents.filter((agent) => favoriteAgentIds.includes(agent.id));
  const favoriteGuides = guides.filter((guide) => favoriteGuideIds.includes(guide.id));
  const favoriteEvents = events.filter((event) => favoriteEventIds.includes(event.id));
  const favoriteTeams = teams.filter((team) => favoriteTeamIds.includes(team.id));
  const recentAgents = historyAgentIds
    .map((id) => agents.find((agent) => agent.id === id))
    .filter((agent) => agent !== undefined);
  const recentGuides = historyGuideIds
    .map((id) => guides.find((guide) => guide.id === id))
    .filter((guide) => guide !== undefined);
  const hasFavorites =
    favoriteAgents.length + favoriteGuides.length + favoriteEvents.length + favoriteTeams.length >
    0;

  return (
    <PageTransition>
      <Page className="page-surface page-favorites">
        <header>
          <p className="text-caption font-semibold text-content-electric">本地收藏库</p>
          <h1 className="mt-control text-title1 font-semibold">收藏与最近浏览</h1>
          <p className="mt-compact text-body text-text-secondary">
            角色、攻略、活动与配队都保存在当前设备。
          </p>
        </header>

        {!hasFavorites ? (
          <EmptyState
            icon={Heart}
            title="还没有收藏"
            description="在角色、攻略和活动卡片上点击心形按钮即可固定常用内容。"
            actionLabel="浏览角色"
            onAction={() => navigate('/agents')}
          />
        ) : null}

        {favoriteAgents.length ? (
          <section>
            <SectionTitle eyebrow="角色" title="收藏角色" />
            <div className="mt-panel grid gap-content md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {favoriteAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isFavorite
                  onToggleFavorite={toggleFavoriteAgent}
                />
              ))}
            </div>
          </section>
        ) : null}

        {favoriteGuides.length ? (
          <section>
            <SectionTitle eyebrow="攻略" title="固定攻略" />
            <div className="mt-panel grid gap-content xl:grid-cols-3">
              {favoriteGuides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid gap-layout xl:grid-cols-2">
          <section>
            <SectionTitle eyebrow="活动" title="收藏活动" />
            <div className="mt-panel space-y-content">
              {favoriteEvents.length ? (
                favoriteEvents.map((event) => (
                  <Card key={event.id} interactive className="flex items-center gap-content">
                    <span
                      className="ggh-icon-container ggh-icon-container-warning"
                      aria-hidden="true"
                    >
                      <CalendarDays size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-label">{event.title}</strong>
                      <small className="text-caption text-text-tertiary">
                        {event.duration} · {event.reward}
                      </small>
                    </span>
                    <Button
                      variant="quiet"
                      size="compact"
                      onClick={() => toggleFavoriteEvent(event.id)}
                      aria-label={`取消收藏活动：${event.title}`}
                    >
                      <Heart aria-hidden="true" size={16} fill="currentColor" />
                    </Button>
                  </Card>
                ))
              ) : (
                <p className="text-body text-text-tertiary">暂无收藏活动。</p>
              )}
            </div>
          </section>
          <section>
            <SectionTitle eyebrow="配队" title="收藏队伍" />
            <div className="mt-panel space-y-content">
              {favoriteTeams.length ? (
                favoriteTeams.map((team) => (
                  <Card key={team.id} interactive className="space-y-content">
                    <div className="flex items-center gap-content">
                      <span
                        className="ggh-icon-container ggh-icon-container-secondary"
                        aria-hidden="true"
                      >
                        <Swords size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block text-label">{team.name}</strong>
                        <small className="text-caption text-text-tertiary">{team.focus}</small>
                      </span>
                      <Button
                        variant="quiet"
                        size="compact"
                        onClick={() => toggleFavoriteTeam(team.id)}
                        aria-label={`取消收藏配队：${team.name}`}
                      >
                        <Heart aria-hidden="true" size={16} fill="currentColor" />
                      </Button>
                    </div>
                    <p className="text-caption text-text-secondary">{team.description}</p>
                    <div className="flex flex-wrap gap-control">
                      {team.members.map((member) => (
                        <Tag key={member}>{member}</Tag>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-body text-text-tertiary">暂无收藏配队。</p>
              )}
            </div>
          </section>
        </div>

        <section>
          <SectionTitle eyebrow="历史" title="最近浏览" />
          <div className="mt-panel grid gap-content xl:grid-cols-2">
            {[
              ...recentGuides.slice(0, 4).map((guide) => ({
                id: `guide-${guide.id}`,
                title: guide.title,
                meta: `攻略 · ${guide.category}`,
                to: `/guide/${guide.id}`,
              })),
              ...recentAgents.slice(0, 4).map((agent) => ({
                id: `agent-${agent.id}`,
                title: agent.name,
                meta: `角色 · ${agent.attribute} · ${agent.specialty}`,
                to: `/agent/${agent.id}`,
              })),
            ].map((item) => (
              <Link key={item.id} to={item.to}>
                <Card interactive className="flex items-center gap-content">
                  <History aria-hidden="true" className="text-content-electric" size={16} />
                  <span>
                    <strong className="block text-label">{item.title}</strong>
                    <small className="text-caption text-text-tertiary">{item.meta}</small>
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </Page>
    </PageTransition>
  );
}
