import { ArrowUpRight, ShieldCheck } from '@game-guide-hub/icons';
import { motion as themeMotion } from '@game-guide-hub/theme';
import { motion } from 'framer-motion';
import type { GameDefinition } from '../../../shared/mock/games';

interface GameCardProps {
  readonly game: GameDefinition;
  readonly onSelect: (game: GameDefinition) => void;
}

export function GameCard({ game, onSelect }: GameCardProps) {
  const isAvailable = game.status === 'available';

  return (
    <motion.button
      type="button"
      className={`platform-game-card platform-game-card-${game.accent}`}
      aria-label={`${game.name}${isAvailable ? '，进入游戏档案' : '，开发中'}`}
      onClick={() => {
        if (isAvailable) onSelect(game);
      }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={isAvailable ? { scale: 0.975 } : {}}
      transition={{ duration: themeMotion.durationSeconds.normal, ease: 'easeOut' }}
    >
      <img src={game.cover} alt="" width="960" height="540" loading="lazy" />
      <span className="platform-game-card-scrim" aria-hidden="true" />
      <span className="platform-game-card-content">
        <span className="platform-game-card-topline">
          <span>{game.shortName}</span>
          {isAvailable ? (
            <ArrowUpRight aria-hidden="true" size={16} />
          ) : (
            <ShieldCheck aria-hidden="true" size={14} />
          )}
        </span>
        <strong>{game.name}</strong>
        <small>{game.description}</small>
        <span className={`platform-game-status ${isAvailable ? 'is-available' : ''}`}>
          <span className="platform-game-status-dot" aria-hidden="true" />
          {isAvailable ? '进入档案' : '开发中'}
        </span>
      </span>
    </motion.button>
  );
}
