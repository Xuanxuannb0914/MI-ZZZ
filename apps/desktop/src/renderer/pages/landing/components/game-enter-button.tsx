import { ArrowUpRight, Clock3 } from '@game-guide-hub/icons';
import type { GameDefinition } from '../../../shared/mock/games';

interface GameEnterButtonProps {
  readonly game: GameDefinition;
  readonly disabled: boolean;
  readonly onEnter: () => void;
}

export function GameEnterButton({ game, disabled, onEnter }: GameEnterButtonProps) {
  const isAvailable = game.status === 'available';
  return (
    <button
      type="button"
      className="game-enter-button"
      disabled={disabled || !isAvailable}
      onClick={onEnter}
    >
      {isAvailable ? (
        <ArrowUpRight aria-hidden="true" size={18} />
      ) : (
        <Clock3 aria-hidden="true" size={18} />
      )}
      <span>{isAvailable ? '进入游戏板块' : '敬请期待'}</span>
    </button>
  );
}
