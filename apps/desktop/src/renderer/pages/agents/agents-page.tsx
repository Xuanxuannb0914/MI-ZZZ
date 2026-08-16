import { useState } from 'react';
import { useAppStore } from '../../app/stores/app-store';
import type { AgentAttribute, AgentRarity, AgentSpecialty } from '../../entities/agent/model/types';
import { agentAttributes, agentRarities, agentSpecialties } from '../../entities/agent/model/types';
import { AgentCard } from '../../entities/agent/ui/agent-card';
import { agents, versions } from '../../shared/content';
import { EmptyState } from '../../shared/ui/empty-state';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SearchBar } from '../../shared/ui/search-bar';

type AttributeFilter = AgentAttribute | '全部';
type SpecialtyFilter = AgentSpecialty | '全部';
type RarityFilter = AgentRarity | '全部';
type VersionFilter = string;
type SortMode = '推荐' | '最新' | '稀有度';

export default function AgentsPage() {
  const searchKeyword = useAppStore((state) => state.searchKeyword);
  const setSearchKeyword = useAppStore((state) => state.setSearchKeyword);
  const favoriteAgentIds = useAppStore((state) => state.favoriteAgentIds);
  const toggleFavoriteAgent = useAppStore((state) => state.toggleFavoriteAgent);
  const [attributeFilter, setAttributeFilter] = useState<AttributeFilter>('全部');
  const [specialtyFilter, setSpecialtyFilter] = useState<SpecialtyFilter>('全部');
  const [factionFilter, setFactionFilter] = useState('全部');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('全部');
  const [versionFilter, setVersionFilter] = useState<VersionFilter>('全部');
  const [sortMode, setSortMode] = useState<SortMode>('推荐');
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const filteredAgents = agents
    .filter(
      (agent) =>
        (attributeFilter === '全部' || agent.attribute === attributeFilter) &&
        (specialtyFilter === '全部' || agent.specialty === specialtyFilter) &&
        (factionFilter === '全部' || agent.faction === factionFilter) &&
        (rarityFilter === '全部' || agent.rarity === rarityFilter) &&
        (versionFilter === '全部' || agent.versionId === versionFilter) &&
        (!normalizedKeyword ||
          `${agent.name} ${agent.faction} ${agent.specialty}`
            .toLowerCase()
            .includes(normalizedKeyword)),
    )
    .slice()
    .sort((left, right) => {
      if (sortMode === '稀有度')
        return left.rarity === right.rarity
          ? left.name.localeCompare(right.name, 'zh-CN')
          : left.rarity === 'S'
            ? -1
            : 1;
      if (sortMode === '最新') return (right.versionId ?? '').localeCompare(left.versionId ?? '');
      return (
        (right.guideIds?.length ?? 0) - (left.guideIds?.length ?? 0) ||
        left.name.localeCompare(right.name, 'zh-CN')
      );
    });
  const factions = Array.from(new Set(agents.map((agent) => agent.faction)));

  return (
    <PageTransition>
      <Page className="page-surface page-agents">
        <header className="flex flex-col gap-panel lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">角色图鉴</p>
            <h1 className="mt-control text-title1 font-semibold">新艾利都代理人</h1>
            <p className="mt-compact text-body text-text-secondary">
              对比当前角色的属性、特性与战场定位，快速找到适合你的队伍。
            </p>
          </div>
          <SearchBar
            value={searchKeyword}
            onChange={setSearchKeyword}
            placeholder="搜索角色、阵营或定位"
            label="搜索角色"
            className="w-full lg:max-w-md"
          />
        </header>
        <div className="ggh-glass glass-light flex flex-wrap gap-panel rounded-xl border border-border-subtle p-content">
          <fieldset className="flex flex-wrap items-center gap-compact">
            <legend className="mr-control text-caption text-text-tertiary">属性</legend>
            {(['全部', ...agentAttributes] as const).map((attribute) => (
              <button
                key={attribute}
                type="button"
                onClick={() => setAttributeFilter(attribute)}
                aria-pressed={attributeFilter === attribute}
                className={
                  attributeFilter === attribute
                    ? 'h-control rounded-full bg-content-electric px-panel text-label font-semibold text-on-action-primary'
                    : 'h-control rounded-full border border-border-subtle bg-surface-1 px-panel text-label text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary'
                }
              >
                {attribute}
              </button>
            ))}
          </fieldset>
          <fieldset className="flex flex-wrap items-center gap-compact">
            <legend className="mr-control text-caption text-text-tertiary">阵营</legend>
            {['全部', ...factions].map((faction) => (
              <button
                key={faction}
                type="button"
                onClick={() => setFactionFilter(faction)}
                aria-pressed={factionFilter === faction}
                className={
                  factionFilter === faction
                    ? 'h-control rounded-full bg-content-electric px-panel text-label font-semibold text-on-action-primary'
                    : 'h-control rounded-full border border-border-subtle bg-surface-1 px-panel text-label text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary'
                }
              >
                {faction}
              </button>
            ))}
          </fieldset>
          <fieldset className="flex flex-wrap items-center gap-compact">
            <legend className="mr-control text-caption text-text-tertiary">稀有度</legend>
            {(['全部', ...agentRarities] as const).map((rarity) => (
              <button
                key={rarity}
                type="button"
                onClick={() => setRarityFilter(rarity)}
                aria-pressed={rarityFilter === rarity}
                className={
                  rarityFilter === rarity
                    ? 'h-control rounded-full bg-content-electric px-panel text-label font-semibold text-on-action-primary'
                    : 'h-control rounded-full border border-border-subtle bg-surface-1 px-panel text-label text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary'
                }
              >
                {rarity === '全部' ? rarity : `${rarity} 级`}
              </button>
            ))}
          </fieldset>
          <fieldset className="flex flex-wrap items-center gap-compact">
            <legend className="mr-control text-caption text-text-tertiary">版本</legend>
            {['全部', ...versions.map((version) => version.id)].map((versionId) => {
              const version = versions.find((item) => item.id === versionId);
              return (
                <button
                  key={versionId}
                  type="button"
                  onClick={() => setVersionFilter(versionId)}
                  aria-pressed={versionFilter === versionId}
                  className={
                    versionFilter === versionId
                      ? 'h-control rounded-full bg-content-electric px-panel text-label font-semibold text-on-action-primary'
                      : 'h-control rounded-full border border-border-subtle bg-surface-1 px-panel text-label text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary'
                  }
                >
                  {version ? version.code : '全部'}
                </button>
              );
            })}
          </fieldset>
          <fieldset className="flex flex-wrap items-center gap-compact">
            <legend className="mr-control text-caption text-text-tertiary">排序</legend>
            {(['推荐', '最新', '稀有度'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                aria-pressed={sortMode === mode}
                className={
                  sortMode === mode
                    ? 'h-control rounded-full bg-content-electric px-panel text-label font-semibold text-on-action-primary'
                    : 'h-control rounded-full border border-border-subtle bg-surface-1 px-panel text-label text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary'
                }
              >
                {mode}
              </button>
            ))}
          </fieldset>
          <fieldset className="flex flex-wrap items-center gap-compact">
            <legend className="mr-control text-caption text-text-tertiary">定位</legend>
            {(['全部', ...agentSpecialties] as const).map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => setSpecialtyFilter(specialty)}
                aria-pressed={specialtyFilter === specialty}
                className={
                  specialtyFilter === specialty
                    ? 'h-control rounded-full bg-content-electric px-panel text-label font-semibold text-on-action-primary'
                    : 'h-control rounded-full border border-border-subtle bg-surface-1 px-panel text-label text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary'
                }
              >
                {specialty}
              </button>
            ))}
          </fieldset>
        </div>
        <p className="text-caption text-text-tertiary">
          已显示 {filteredAgents.length} / {agents.length} 名角色
        </p>
        {filteredAgents.length ? (
          <div className="grid gap-content sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isFavorite={favoriteAgentIds.includes(agent.id)}
                onToggleFavorite={toggleFavoriteAgent}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="没有找到角色"
            description="试试其他名称、阵营或属性筛选条件。"
            actionLabel="清除筛选"
            onAction={() => {
              setSearchKeyword('');
              setAttributeFilter('全部');
              setSpecialtyFilter('全部');
              setFactionFilter('全部');
              setRarityFilter('全部');
              setVersionFilter('全部');
              setSortMode('推荐');
            }}
          />
        )}
      </Page>
    </PageTransition>
  );
}
