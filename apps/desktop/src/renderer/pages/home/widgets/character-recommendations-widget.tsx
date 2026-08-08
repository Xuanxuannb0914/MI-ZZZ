import { ArrowUpRight, UsersRound } from '@game-guide-hub/icons';
import { Widget as WidgetShell } from '@game-guide-hub/ui';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { agents } from '../../../shared/content';

const recommendations = ['miyabi', 'tsukishiro-yanagi', 'ellen-joe', 'caesar-king']
  .map((id) => agents.find((agent) => agent.id === id))
  .filter((agent): agent is NonNullable<typeof agent> => Boolean(agent));

const difficultyByAgentId: Readonly<Record<string, string>> = {
  miyabi: '进阶',
  'tsukishiro-yanagi': '进阶',
  'ellen-joe': '中等',
  'caesar-king': '易上手',
};

export const CharacterRecommendationsWidget = memo(function CharacterRecommendationsWidget() {
  return (
    <WidgetShell
      title="角色推荐"
      eyebrow="本期培养优先级"
      icon={UsersRound}
      className="workspace-widget-characters"
      action={
        <Link to="/zzz/agents" className="workspace-text-link">
          全部角色 <ArrowUpRight aria-hidden="true" size={14} />
        </Link>
      }
    >
      <div className="workspace-character-grid">
        {recommendations.map((agent) => (
          <Link to={`/zzz/agents/${agent.id}`} key={agent.id} className="workspace-character-card">
            <img src={agent.avatar} alt="" width="128" height="128" loading="lazy" />
            <span className="workspace-character-copy">
              <small>
                {agent.rarity} 级 · {agent.attribute}属性 · {agent.specialty} ·
                {difficultyByAgentId[agent.id] ?? '中等'}
              </small>
              <strong>{agent.name}</strong>
              <span>配队：{agent.recommendedTeam.join(' / ')}</span>
              <span>音擎：{agent.recommendedWeapon}</span>
              <span>驱动盘：{agent.recommendedDriveDisc[0]}</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        ))}
      </div>
    </WidgetShell>
  );
});
