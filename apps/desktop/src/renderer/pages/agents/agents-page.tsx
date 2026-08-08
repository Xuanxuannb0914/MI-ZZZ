import { useState } from 'react';
import { useAppStore } from '../../app/stores/app-store';
import type { AgentAttribute, AgentSpecialty } from '../../entities/agent/model/types';
import { agentAttributes, agentSpecialties } from '../../entities/agent/model/types';
import { AgentCard } from '../../entities/agent/ui/agent-card';
import { agents } from '../../shared/mock/agents';
import { EmptyState } from '../../shared/ui/empty-state';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SearchBar } from '../../shared/ui/search-bar';

type AttributeFilter = AgentAttribute | '全部';
type SpecialtyFilter = AgentSpecialty | '全部';

export default function AgentsPage() {
  const searchKeyword = useAppStore((state) => state.searchKeyword);
  const setSearchKeyword = useAppStore((state) => state.setSearchKeyword);
  const favoriteAgentIds = useAppStore((state) => state.favoriteAgentIds);
  const toggleFavoriteAgent = useAppStore((state) => state.toggleFavoriteAgent);
  const [attributeFilter, setAttributeFilter] = useState<AttributeFilter>('全部');
  const [specialtyFilter, setSpecialtyFilter] = useState<SpecialtyFilter>('全部');
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const filteredAgents = agents.filter(
    (agent) =>
      (attributeFilter === '全部' || agent.attribute === attributeFilter) &&
      (specialtyFilter === '全部' || agent.specialty === specialtyFilter) &&
      (!normalizedKeyword ||
        `${agent.name} ${agent.faction} ${agent.specialty}`
          .toLowerCase()
          .includes(normalizedKeyword)),
  );

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
            }}
          />
        )}
      </Page>
    </PageTransition>
  );
}
