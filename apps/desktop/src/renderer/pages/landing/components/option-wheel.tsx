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
  readonly onTick?: () => void;
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
const WHEEL_IDLE_DELAY = 105;
const TICK_THROTTLE = 72;
const DRAG_THRESHOLD = 4;
const MAX_VELOCITY = 6.2;
const WHEEL_IMPULSE = 0.0048;
const SPRING = 92;
const DAMPING = 13;

function clampIndex(index: number, count: number): number {
  return Math.max(0, Math.min(index, Math.max(count - 1, 0)));
}

function normaliseIndex(index: number, count: number, loop: boolean): number {
  if (!loop || count < 2) return clampIndex(index, count);
  return ((index % count) + count) % count;
}

function calculateRowHeight(fontSize: FontSize, spacing: number, rowHeight?: number): number {
  if (rowHeight) return rowHeight;
  return typeof fontSize === 'number' ? Math.max(fontSize * spacing * 16, 1) : DEFAULT_ROW_HEIGHT;
}

function prefersReducedMotion(): boolean {
  const mediaQuery = (
    window as unknown as { matchMedia?: (query: string) => MediaQueryList }
  ).matchMedia?.bind(window);
  return (
    typeof window !== 'undefined' &&
    mediaQuery?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

/** DOM-driven wheel with inertial scrolling; React owns only semantic selection. */
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
  soundVolume = 0.24,
  onTick,
  disabled = false,
  ariaLabel = '选择选项',
  className = '',
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const positionRef = useRef(defaultSelected);
  const velocityRef = useRef(0);
  const targetRef = useRef(defaultSelected);
  const selectedRef = useRef(normaliseIndex(defaultSelected, items.length, loop));
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const lastInputRef = useRef(0);
  const needsSnapRef = useRef(false);
  const dragRef = useRef<{ y: number; time: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const clickTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef('');
  const lastTickRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const onEnterRef = useRef(onEnter);
  const onTickRef = useRef(onTick);
  const lastExternalIndexRef = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(selectedRef.current);
  const configRef = useRef<WheelConfig>({} as WheelConfig);

  onChangeRef.current = onChange;
  onEnterRef.current = onEnter;
  onTickRef.current = onTick;
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

  const playTick = useCallback(() => {
    const { soundUrl: url, soundVolume: volume } = configRef.current;
    if (performance.now() - lastTickRef.current < TICK_THROTTLE) return;
    lastTickRef.current = performance.now();
    if (!url) {
      onTickRef.current?.();
      return;
    }
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

  const commitSelection = useCallback(
    (position: number) => {
      const config = configRef.current;
      if (!config.count) return;
      const index = normaliseIndex(Math.round(position), config.count, config.loop);
      if (index === selectedRef.current) return;
      selectedRef.current = index;
      setActiveIndex(index);
      const item = items[index];
      if (item) onChangeRef.current?.(index, item);
      playTick();
    },
    [items, playTick],
  );

  const paint = useCallback((position: number) => {
    const config = configRef.current;
    const tiltRadians = (config.tilt * Math.PI) / 180;
    const radius = tiltRadians > 0.0005 ? config.rowHeight / tiltRadians : 0;
    const mirror = config.side === 'right' ? -1 : 1;
    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      let distance = index - position;
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
      const scale = Math.max(0.84, 1 - Math.min(depth, 3) * 0.052);
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translateY(-50%) rotate(${rotation.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
      element.style.opacity = String(Math.max(config.minOpacity, 1 - depth * config.fade));
      element.style.filter = config.reducedMotion
        ? 'none'
        : `blur(${(depth * config.blur).toFixed(2)}px)`;
      element.style.setProperty('--ow-progress', Math.max(0, 1 - Math.min(depth, 1)).toFixed(4));
    });
  }, []);

  const runFrame = useCallback(
    (now: number) => {
      const config = configRef.current;
      const dt = Math.min((now - lastFrameRef.current) / 1000, 0.04);
      lastFrameRef.current = now;
      const idle = now - lastInputRef.current > WHEEL_IDLE_DELAY;
      if (idle && needsSnapRef.current) {
        targetRef.current = Math.round(positionRef.current + velocityRef.current * 0.04);
      }
      if (!config.loop) targetRef.current = clampIndex(targetRef.current, config.count);
      if (config.reducedMotion) {
        positionRef.current = targetRef.current;
        velocityRef.current = 0;
        needsSnapRef.current = false;
      } else {
        if (idle) {
          velocityRef.current += (targetRef.current - positionRef.current) * SPRING * dt;
          velocityRef.current *= Math.exp(-DAMPING * dt);
        } else {
          velocityRef.current *= Math.exp(-2.2 * dt);
        }
        velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current));
        positionRef.current += velocityRef.current * dt;
        if (!config.loop)
          positionRef.current = Math.max(-0.14, Math.min(positionRef.current, config.count - 0.86));
      }
      commitSelection(positionRef.current);
      paint(positionRef.current);
      const resting =
        idle &&
        Math.abs(targetRef.current - positionRef.current) < 0.002 &&
        Math.abs(velocityRef.current) < 0.012;
      if (resting) {
        positionRef.current = targetRef.current;
        velocityRef.current = 0;
        paint(positionRef.current);
        frameRef.current = null;
        return;
      }
      frameRef.current = window.requestAnimationFrame(runFrame);
    },
    [commitSelection, paint],
  );

  const start = useCallback(() => {
    if (frameRef.current !== null) return;
    lastFrameRef.current = performance.now();
    frameRef.current = window.requestAnimationFrame(runFrame);
  }, [runFrame]);

  const moveTo = useCallback(
    (next: number) => {
      const config = configRef.current;
      targetRef.current = config.loop ? next : clampIndex(next, config.count);
      needsSnapRef.current = false;
      lastInputRef.current = -Infinity;
      commitSelection(targetRef.current);
      start();
    },
    [commitSelection, start],
  );

  useEffect(() => {
    const requested = normaliseIndex(selectedIndex ?? defaultSelected, items.length, loop);
    if (lastExternalIndexRef.current === requested && requested === selectedRef.current) return;
    lastExternalIndexRef.current = requested;
    if (requested !== selectedRef.current || frameRef.current === null) {
      selectedRef.current = requested;
      setActiveIndex(requested);
      positionRef.current = requested;
      targetRef.current = requested;
      velocityRef.current = 0;
      paint(requested);
    }
  }, [defaultSelected, items, loop, paint, selectedIndex]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const onWheel = (event: WheelEvent) => {
      if (disabled || Math.abs(event.deltaY) < 0.1) return;
      event.preventDefault();
      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 24 : event.deltaY;
      velocityRef.current = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, velocityRef.current + delta * WHEEL_IMPULSE),
      );
      lastInputRef.current = performance.now();
      needsSnapRef.current = true;
      start();
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, [disabled, start]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || !configRef.current.draggable || event.button !== 0) return;
      dragRef.current = { y: event.clientY, time: performance.now(), id: event.pointerId };
      dragMovedRef.current = false;
      suppressClickRef.current = false;
    },
    [disabled],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const delta = event.clientY - drag.y;
      if (!dragMovedRef.current && Math.abs(delta) > DRAG_THRESHOLD) {
        dragMovedRef.current = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!dragMovedRef.current) return;
      const now = performance.now();
      const deltaTime = Math.max((now - drag.time) / 1000, 0.008);
      const distance = drag.y - event.clientY;
      positionRef.current += distance / configRef.current.rowHeight;
      velocityRef.current = Math.max(
        -MAX_VELOCITY,
        Math.min(MAX_VELOCITY, distance / configRef.current.rowHeight / deltaTime),
      );
      targetRef.current = positionRef.current;
      dragRef.current = { ...drag, y: event.clientY, time: now };
      lastInputRef.current = now;
      needsSnapRef.current = true;
      commitSelection(positionRef.current);
      paint(positionRef.current);
      start();
    },
    [commitSelection, paint, start],
  );

  const finishDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    if (rootRef.current?.hasPointerCapture(drag.id)) rootRef.current.releasePointerCapture(drag.id);
    dragRef.current = null;
    if (!dragMovedRef.current) return;
    suppressClickRef.current = true;
    clickTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
    lastInputRef.current = performance.now();
    start();
  }, [start]);

  const selectOption = useCallback(
    (index: number) => {
      if (disabled || suppressClickRef.current) return;
      moveTo(index);
    },
    [disabled, moveTo],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveTo(Math.round(targetRef.current) - 1);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveTo(Math.round(targetRef.current) + 1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        onEnterRef.current?.();
      } else if (event.key === 'Escape') event.currentTarget.blur();
    },
    [disabled, moveTo],
  );

  useEffect(
    () => () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (clickTimerRef.current !== null) window.clearTimeout(clickTimerRef.current);
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.src = '';
      audioRef.current = null;
    },
    [],
  );

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
          onClick={() => selectOption(index)}
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
