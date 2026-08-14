import type { CSSProperties, KeyboardEvent, PointerEvent, WheelEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameDefinition } from '../../../shared/mock/games';

interface GameOptionWheelProps {
  readonly games: readonly GameDefinition[];
  readonly selectedIndex: number;
  readonly onSelect: (index: number) => void;
  readonly onEnter: () => void;
  readonly disabled?: boolean;
}

const ITEM_STEP = 68;
const MAX_DRAG_DISTANCE = ITEM_STEP * 1.25;

function clampIndex(index: number, total: number): number {
  return Math.max(0, Math.min(index, total - 1));
}

export function GameOptionWheel({
  games,
  selectedIndex,
  onSelect,
  onEnter,
  disabled = false,
}: GameOptionWheelProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const pointerStartYRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const setDragOffsetInFrame = useCallback((value: number) => {
    dragOffsetRef.current = Math.max(-MAX_DRAG_DISTANCE, Math.min(MAX_DRAG_DISTANCE, value));
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      setDragOffset(dragOffsetRef.current);
    });
  }, []);

  const moveSelection = useCallback(
    (delta: number) => {
      if (disabled) return;
      onSelect(clampIndex(selectedIndex + delta, games.length));
    },
    [disabled, games.length, onSelect, selectedIndex],
  );

  const finishDrag = useCallback(() => {
    if (pointerStartYRef.current === null) return;
    const dragSteps = Math.round(-dragOffsetRef.current / ITEM_STEP);
    pointerStartYRef.current = null;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    if (dragSteps) moveSelection(dragSteps);
  }, [moveSelection]);

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < 4) return;
      moveSelection(event.deltaY > 0 ? 1 : -1);
    },
    [moveSelection],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (disabled || event.button !== 0) return;
      pointerStartYRef.current = event.clientY;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [disabled],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (pointerStartYRef.current === null) return;
      setDragOffsetInFrame(event.clientY - pointerStartYRef.current);
    },
    [setDragOffsetInFrame],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveSelection(-1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        onEnter();
      } else if (event.key === 'Escape') {
        event.currentTarget.blur();
      }
    },
    [moveSelection, onEnter],
  );

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null)
        window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div
      className="game-option-wheel"
      role="listbox"
      aria-label="选择游戏"
      aria-activedescendant={`game-option-${games[selectedIndex]?.id ?? ''}`}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={handleKeyDown}
    >
      <span className="game-option-wheel-axis" aria-hidden="true" />
      <div
        className="game-option-wheel-items"
        style={{ '--wheel-drag': `${dragOffset}px` } as CSSProperties}
      >
        {games.map((game, index) => {
          const distance = index - selectedIndex - dragOffset / ITEM_STEP;
          const isSelected = index === selectedIndex;
          const proximity = Math.min(Math.abs(distance), 3);
          const itemStyle = {
            '--wheel-distance': distance,
            '--wheel-y': `${distance * ITEM_STEP}px`,
            '--wheel-x': `${proximity * 16}px`,
            '--wheel-scale': `${1 - proximity * 0.09}`,
            '--wheel-opacity': `${1 - proximity * 0.27}`,
            '--wheel-blur': `${proximity * 1.4}px`,
          } as CSSProperties;
          return (
            <button
              key={game.id}
              id={`game-option-${game.id}`}
              type="button"
              role="option"
              aria-selected={isSelected}
              className="game-option-wheel-item"
              style={itemStyle}
              onClick={() => onSelect(index)}
              onDoubleClick={() => {
                if (isSelected) onEnter();
              }}
              disabled={disabled}
            >
              <span className="game-option-wheel-index">0{index + 1}</span>
              <span className="game-option-wheel-name">{game.name}</span>
              <span className="game-option-wheel-status">
                {game.status === 'available' ? '已开放' : '开发中'}
              </span>
            </button>
          );
        })}
      </div>
      <p className="game-option-wheel-hint">滚动、拖动或使用方向键选择</p>
    </div>
  );
}
