import { Heart } from '@game-guide-hub/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { motionPresets } from '../../../shared/animation/motion-presets';
import { Tag } from '../../../shared/ui/tag';
import type { Agent } from '../model/types';

interface AgentCardProps {
  readonly agent: Agent;
  readonly isFavorite: boolean;
  readonly onToggleFavorite: (agentId: string) => void;
}

const attributeTone = {
  电: 'electric',
  以太: 'ether',
  冰: 'ice',
  火: 'fire',
  物理: 'physical',
} as const;

export function AgentCard({ agent, isFavorite, onToggleFavorite }: AgentCardProps) {
  return (
    <motion.article
      whileHover={motionPresets.hoverCard.whileHover}
      whileTap={motionPresets.hoverCard.whileTap}
      transition={motionPresets.hoverCard.transition}
      className="agent-card group relative overflow-hidden rounded-lg border border-border-subtle bg-surface-1 shadow-level-1"
    >
      <Link to={`/agent/${agent.id}`} className="block focus-visible:outline-none">
        <div
          className={`relative aspect-[4/5] overflow-hidden bg-content-surface ${agent.accentClass}`}
        >
          <img
            src={agent.avatar}
            alt={`${agent.name} 角色立绘`}
            width="512"
            height="512"
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="agent-portrait-scrim absolute inset-0" aria-hidden="true" />
          <span className="absolute left-content top-content flex size-control items-center justify-center rounded-md bg-canvas/80 text-title3 font-bold text-content-electric backdrop-blur-md">
            {agent.rarity}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-panel">
            <p className="text-caption text-text-secondary">{agent.faction}</p>
            <h3 className="mt-compact text-title3 font-semibold text-text-primary">{agent.name}</h3>
            <div className="mt-content flex flex-wrap gap-compact">
              <Tag tone={attributeTone[agent.attribute]}>{agent.attribute}</Tag>
              <Tag>{agent.specialty}</Tag>
            </div>
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => onToggleFavorite(agent.id)}
        aria-label={isFavorite ? `取消收藏${agent.name}` : `收藏${agent.name}`}
        className="absolute right-content top-content flex size-control items-center justify-center rounded-md border border-border-subtle bg-canvas/75 text-text-secondary backdrop-blur-md transition-colors hover:text-content-fire"
      >
        <Heart
          aria-hidden="true"
          fill={isFavorite ? 'currentColor' : 'none'}
          size={17}
          className={isFavorite ? 'text-content-fire' : undefined}
        />
      </button>
    </motion.article>
  );
}
