import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Side = 'left' | 'right';
type FontSize = number | string;

export interface OptionWheelProps {
  readonly items?: readonly string[];
  readonly defaultSelected?: number;
  readonly selectedIndex?: number;
  readonly onChange?: (index: number, item: string) => void;
  readonly onEnter?: () => void;
  readonly textColor?: string;
  readonly activeColor?: string;
  readonly side?: Side;
  readonly fontSize?: FontSize;
  readonly spacing?: number;
  readonly curve?: number;
  readonly tilt?: number;
  readonly blur?: number;
  readonly fade?: number;
  readonly minOpacity?: number;
  readonly smoothing?: number;
  readonly inset?: number;
  readonly rowHeight?: number;
  readonly loop?: boolean;
  readonly draggable?: boolean;
  readonly soundUrl?: string;
  readonly soundVolume?: number;
  readonly disabled?: boolean;
  readonly ariaLabel?: string;
  readonly className?: string;
}

interface WheelConfig {
  readonly count: number;
  readonly rowHeight: number;
  readonly curve: number;
  readonly tilt: number;
  readonly blur: number;
  readonly fade: number;
  readonly minOpacity: number;
  readonly side: Side;
  readonly loop: boolean;
  readonly smoothing: number;
  readonly draggable: boolean;
  readonly soundUrl: string;
  readonly soundVolume: number;
  readonly reducedMotion: boolean;
}

const EMPTY_ITEMS: readonly string[] = [];
const DEFAULT_ROW_HEIGHT = 72;
const WHEEL_SETTLE_DELAY = 140;
const TICK_THROTTLE = 70;
const DRAG_THRESHOLD = 4;

function clampIndex(index: number, count: number): number {
  return Math.max(0, Math.min(index, Math.max(count - 1, 0)));
}

function normaliseIndex(index: number, count: number, loop: boolean): number {
  if (!loop || count < 2) return clampIndex(index, count);
  return ((index % count) + count) % count;
}

function calculateRowHeight(fontSize: FontSize, spacing: number, rowHeight?: number): number {
  if (rowHeight) return rowHeight;
  if (typeof fontSize === 'number') return Math.max(fontSize * spacing * 16, 1);
  return DEFAULT_ROW_HEIGHT;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * A DOM-driven text wheel: React owns selection semantics, while rAF owns the
 * continuous visual position between options.
 */
export function OptionWheel({
  items = EMPTY_ITEMS,
  defaultSelected = 0,
  selectedIndex,
  onChange,
  onEnter,
  textColor = 'var(--ggh-color-text-secondary)',
  activeColor = 'var(--ggh-color-text-primary)',
  side = 'left',
  fontSize = 3,
  spacing = 1.24,
  curve = 0.82,
  tilt = 5.5,
  blur = 2.4,
  fade = 0.29,
  minOpacity = 0.06,
  smoothing = 210,
  inset = 72,
  rowHeight,
  loop = false,
  draggable = true,
  soundUrl = '',
  soundVolume = 0.5,
  disabled = false,
  ariaLabel = '选择选项',
  className = '',
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const positionRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const selectedRef = useRef(defaultSelected);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const wheelTimerRef = useRef<number | null>(null);
  const clickSuppressionTimerRef = useRef<number | null>(null);
  const dragRef = useRef<{
    readonly y: number;
    readonly start: number;
    readonly id: number;
  } | null>(null);
  const dragMovedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef('');
  const lastTickRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(() =>
    normaliseIndex(defaultSelected, items.length, loop),
  );
  const configRef = useRef<WheelConfig>({
    count: 0,
    rowHeight: DEFAULT_ROW_HEIGHT,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    soundUrl,
    soundVolume,
    reducedMotion: false,
  });
  const onChangeRef = useRef(onChange);
  const onEnterRef = useRef(onEnter);

  onChangeRef.current = onChange;
  onEnterRef.current = onEnter;
  configRef.current = {
    count: items.length,
    rowHeight: calculateRowHeight(fontSize, spacing, rowHeight),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    soundUrl,
    soundVolume,
    reducedMotion: prefersReducedMotion(),
  };

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current === null) return;
    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }, []);

  const playTick = useCallback(() => {
    const { soundUrl: url, soundVolume: volume } = configRef.current;
    if (!url) return;
    const now = performance.now();
    if (now - lastTickRef.current < TICK_THROTTLE) return;
    lastTickRef.current = now;

    if (!audioRef.current || audioUrlRef.current !== url) {
      audioRef.current?.pause();
      audioRef.current = new Audio(url);
      audioRef.current.preload = 'auto';
      audioUrlRef.current = url;
    }

    const audio = audioRef.current;
    audio.volume = Math.max(0, Math.min(volume, 1));
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);

  const runFrame = useCallback((now: number) => {
    const config = configRef.current;
    const elapsed = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = now;
    const smoothingFactor = config.reducedMotion
      ? 1
      : 1 - Math.exp(-elapsed / Math.max(config.smoothing, 1) / 1000);
    const current = positionRef.current;
    let next = current + (targetRef.current - current) * smoothingFactor;
    const settled = Math.abs(targetRef.current - next) < 0.001;
    if (settled) next = targetRef.current;
    positionRef.current = next;

    const tiltRadians = (config.tilt * Math.PI) / 180;
    const radius = tiltRadians > 0.0005 ? config.rowHeight / tiltRadians : 0;
    const mirror = config.side === 'right' ? -1 : 1;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      let distance = index - next;
      if (config.loop && config.count > 1) {
        distance = ((distance % config.count) + config.count) % config.count;
        if (distance > config.count / 2) distance -= config.count;
      }

      const depth = Math.abs(distance);
      const angle = radius
        ? Math.max(-Math.PI / 2, Math.min(Math.PI / 2, distance * tiltRadians))
        : 0;
      const x = radius ? -mirror * radius * (1 - Math.cos(angle)) * config.curve : 0;
      const y = radius ? radius * Math.sin(angle) : distance * config.rowHeight;
      const rotation = radius ? (mirror * angle * 180) / Math.PI : 0;
      const scale = Math.max(0.86, 1 - Math.min(depth, 3) * 0.045);
      const opacity = Math.max(config.minOpacity, 1 - depth * config.fade);
      const progress = Math.max(0, 1 - Math.min(depth, 1));

      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translateY(-50%) rotate(${rotation.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
      element.style.opacity = String(opacity);
      element.style.filter = config.reducedMotion
        ? 'none'
        : `blur(${(depth * config.blur).toFixed(2)}px)`;
      element.style.setProperty('--ow-progress', progress.toFixed(4));
    });

    animationFrameRef.current = settled ? null : window.requestAnimationFrame(runFrame);
  }, []);

  const startAnimation = useCallback(() => {
    cancelAnimation();
    lastFrameRef.current = performance.now();
    animationFrameRef.current = window.requestAnimationFrame(runFrame);
  }, [cancelAnimation, runFrame]);

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const config = configRef.current;
      if (!config.count) return;
      let nextTarget = snap ? Math.round(value) : value;
      if (!config.loop) nextTarget = Math.max(0, Math.min(nextTarget, config.count - 1));
      targetRef.current = nextTarget;

      const nextIndex = normaliseIndex(Math.round(nextTarget), config.count, config.loop);
      if (nextIndex !== selectedRef.current) {
        selectedRef.current = nextIndex;
        setActiveIndex(nextIndex);
        const item = items[nextIndex];
        if (item) onChangeRef.current?.(nextIndex, item);
        playTick();
      }
      startAnimation();
    },
    [items, playTick, startAnimation],
  );

  useEffect(() => {
    const requestedIndex = selectedIndex ?? defaultSelected;
    const normalised = normaliseIndex(requestedIndex, items.length, loop);
    selectedRef.current = normalised;
    setActiveIndex(normalised);
    positionRef.current = normalised;
    targetRef.current = normalised;
    startAnimation();
  }, [defaultSelected, items, loop, selectedIndex, startAnimation]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (disabled || Math.abs(event.deltaY) < 1) return;
      const config = configRef.current;
      const pixelDelta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 24 : event.deltaY;
      const step = Math.max(-1, Math.min(1, pixelDelta / config.rowHeight));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(
        () => applyTarget(targetRef.current, true),
        WHEEL_SETTLE_DELAY,
      );
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      root.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = null;
    };
  }, [applyTarget, disabled]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || !configRef.current.draggable || event.button !== 0) return;
      dragRef.current = { y: event.clientY, start: targetRef.current, id: event.pointerId };
      dragMovedRef.current = false;
      suppressClickRef.current = false;
      if (clickSuppressionTimerRef.current !== null) {
        window.clearTimeout(clickSuppressionTimerRef.current);
        clickSuppressionTimerRef.current = null;
      }
    },
    [disabled],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const deltaY = event.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(deltaY) > DRAG_THRESHOLD) {
        dragMovedRef.current = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (dragMovedRef.current) {
        applyTarget(drag.start - deltaY / configRef.current.rowHeight, false);
      }
    },
    [applyTarget],
  );

  const finishDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    if (rootRef.current?.hasPointerCapture(drag.id)) rootRef.current.releasePointerCapture(drag.id);
    dragRef.current = null;
    if (!dragMovedRef.current) return;
    suppressClickRef.current = true;
    clickSuppressionTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
      clickSuppressionTimerRef.current = null;
    }, 0);
    applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleItemClick = useCallback(
    (index: number) => {
      if (disabled) return;
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }
      const config = configRef.current;
      const currentIndex = normaliseIndex(Math.round(targetRef.current), config.count, config.loop);
      let delta = index - currentIndex;
      if (config.loop && config.count > 1) {
        if (delta > config.count / 2) delta -= config.count;
        if (delta < -config.count / 2) delta += config.count;
      }
      applyTarget(targetRef.current + delta, true);
    },
    [applyTarget, disabled],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        applyTarget(Math.round(targetRef.current) - 1, true);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        applyTarget(Math.round(targetRef.current) + 1, true);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        onEnterRef.current?.();
      } else if (event.key === 'Escape') {
        event.currentTarget.blur();
      }
    },
    [applyTarget, disabled],
  );

  useEffect(() => {
    const root = rootRef.current;
    return () => {
      cancelAnimation();
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current);
      if (clickSuppressionTimerRef.current !== null) {
        window.clearTimeout(clickSuppressionTimerRef.current);
      }
      const drag = dragRef.current;
      if (drag && root?.hasPointerCapture(drag.id)) {
        root.releasePointerCapture(drag.id);
      }
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.src = '';
      audioRef.current = null;
    };
  }, [cancelAnimation]);

  const rootStyle = {
    '--ow-text-color': textColor,
    '--ow-active-color': activeColor,
    '--ow-font-size': typeof fontSize === 'number' ? `${fontSize}rem` : fontSize,
    '--ow-inset': `${inset}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      role="listbox"
      aria-label={ariaLabel}
      aria-activedescendant={items[activeIndex] ? `option-wheel-item-${activeIndex}` : undefined}
      aria-disabled={disabled || undefined}
      className={`option-wheel${side === 'right' ? ' option-wheel--right' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => (
        <button
          key={item}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          id={`option-wheel-item-${index}`}
          type="button"
          role="option"
          aria-selected={activeIndex === index}
          className="option-wheel__item"
          disabled={disabled}
          onClick={() => handleItemClick(index)}
          onDoubleClick={() => {
            if (activeIndex === index && !disabled) onEnterRef.current?.();
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
