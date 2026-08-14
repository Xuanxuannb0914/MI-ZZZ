import type { GameDefinition } from '../../../shared/mock/games';
import { OptionWheel } from './option-wheel';

interface GameOptionWheelProps {
  readonly games: readonly GameDefinition[];
  readonly selectedIndex: number;
  readonly onSelect: (index: number) => void;
  readonly onEnter: () => void;
  readonly disabled?: boolean;
}

/** Adapts the generic cinematic wheel to the Game Hub's configured game data. */
export function GameOptionWheel({
  games,
  selectedIndex,
  onSelect,
  onEnter,
  disabled = false,
}: GameOptionWheelProps) {
  return (
    <OptionWheel
      items={games.map((game) => game.name)}
      selectedIndex={selectedIndex}
      onChange={(index) => onSelect(index)}
      onEnter={onEnter}
      textColor="var(--ggh-color-text-secondary)"
      activeColor="var(--ggh-color-text-primary)"
      fontSize="clamp(2.25rem, 3vw, 3.25rem)"
      spacing={1.24}
      rowHeight={74}
      curve={0.82}
      tilt={5.5}
      blur={2.35}
      fade={0.29}
      minOpacity={0.06}
      smoothing={210}
      inset="clamp(2rem, 6vw, 7rem)"
      draggable
      disabled={disabled}
      ariaLabel="选择游戏"
      className="game-option-wheel"
    />
  );
}
