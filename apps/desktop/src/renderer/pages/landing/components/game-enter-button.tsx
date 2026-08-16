import { ArrowUpRight, Clock3 } from '@game-guide-hub/icons';
import type { GameDefinition } from '../../../shared/mock/games';

interface GameEnterButtonProps {
  readonly game: GameDefinition;
  readonly disabled: boolean;
  readonly onEnter: () => void;
  /** 演示模式：允许进入「敬请期待」的游戏以预览开场动画。 */
  readonly allowComingSoon?: boolean;
}

export function GameEnterButton({
  game,
  disabled,
  onEnter,
  allowComingSoon = false,
}: GameEnterButtonProps) {
  const isAvailable = game.status === 'available';
  const canEnter = isAvailable || allowComingSoon;
  return (
    <button
      type="button"
      className="game-enter-button"
      disabled={disabled || !canEnter}
      onClick={onEnter}
    >
      {isAvailable ? (
        <ArrowUpRight aria-hidden="true" size={18} />
      ) : (
        <Clock3 aria-hidden="true" size={18} />
      )}
      <span>{isAvailable ? '进入游戏板块' : allowComingSoon ? '演示进入' : '敬请期待'}</span>
    </button>
  );
}
