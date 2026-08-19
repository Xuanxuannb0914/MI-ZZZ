import { AnimatePresence, motion, type MotionStyle } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { games } from '../../../shared/mock/games';
import { DemoChrome } from './demo-chrome';

const PLANET_COUNT = games.length;
const ARC_ANGLE = Math.PI * 0.55;
const ORBIT_RADIUS = 280;

interface PlanetState {
  index: number;
  angle: number;
  x: number;
  y: number;
  isActive: boolean;
  isHovered: boolean;
}

/** Demo B — 全息指挥舱：游戏化作环绕星体。 */
export function HolographicHudDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startRotation: number; isDragging: boolean }>({
    startX: 0,
    startRotation: 0,
    isDragging: false,
  });

  const active = games[activeIndex] ?? games[0];
  if (!active) throw new Error('游戏配置不能为空。');
  const gameTheme = {
    '--demo-b-primary': active.accentColor,
    '--demo-b-secondary': active.secondaryColor,
    '--demo-b-glow': active.glowColor,
    '--demo-b-font': active.fontFamily,
  } as CSSProperties;

  const planets: PlanetState[] = Array.from({ length: PLANET_COUNT }, (_, index) => {
    const baseAngle = -ARC_ANGLE / 2 + (index / (PLANET_COUNT - 1)) * ARC_ANGLE;
    const angle = baseAngle + rotation;
    return {
      index,
      angle,
      x: Math.sin(angle) * ORBIT_RADIUS,
      y: Math.cos(angle) * ORBIT_RADIUS * -0.3,
      isActive: index === activeIndex,
      isHovered: index === hoveredIndex,
    };
  });

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    dragRef.current = {
      startX: event.clientX,
      startRotation: rotation,
      isDragging: true,
    };
    const root = rootRef.current;
    if (!root) return;
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return;
      const delta = (e.clientX - dragRef.current.startX) / 2.5;
      setRotation(dragRef.current.startRotation + delta * 0.008);
    };
    const onUp = () => {
      dragRef.current.isDragging = false;
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
    };
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerup', onUp, { passive: true });
  }, [rotation]);

  const selectPlanet = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(games.length - 1, index)));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const autoRotate = setInterval(() => {
      // Only auto-rotate when not dragging
      if (!dragRef.current.isDragging) {
        setRotation((prev) => prev + 0.002);
      }
    }, 50);
    return () => clearInterval(autoRotate);
  }, []);

  return (
    <div ref={rootRef} className="demo-b" style={gameTheme}>
      <div className="demo-b-grid" aria-hidden="true" />
      <div className="demo-b-radar" aria-hidden="true" />
      <div className="demo-b-noise" aria-hidden="true" />

      <DemoChrome label="B · 全息指挥舱" />

      {/* 中央 HUD 标识 */}
      <div className="demo-b-hub">
        <div className="demo-b-hub-ring" aria-hidden="true" />
        <div className="demo-b-hub-core">
          <span className="demo-b-hub-label">ASTERIS</span>
          <span className="demo-b-hub-sub">GAME COMMAND</span>
        </div>
      </div>

      {/* 行星轨道区 */}
      <div
        className="demo-b-orbit"
        onPointerDown={handlePointerDown}
        role="listbox"
        aria-label="游戏选择"
        style={{ cursor: dragRef.current.isDragging ? 'grabbing' : 'grab' }}
      >
        {planets.map((planet) => {
          const game = games[planet.index];
          if (!game) return null;
          const scale = planet.isActive ? 1.25 : planet.isHovered ? 1.15 : 1;
          return (
            <motion.button
              key={game.id}
              type="button"
              role="option"
              aria-selected={planet.isActive}
              className="demo-b-planet"
              animate={{
                x: planet.x,
                y: planet.y,
                scale,
                opacity: planet.isActive ? 1 : planet.isHovered ? 0.9 : 0.65,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.8 }}
              onClick={() => selectPlanet(planet.index)}
              onPointerEnter={() => setHoveredIndex(planet.index)}
              onPointerLeave={() => setHoveredIndex(null)}
              style={{ '--planet-accent': game.accentColor } as MotionStyle}
            >
              <span className="demo-b-planet-orbit" aria-hidden="true" />
              <span className="demo-b-planet-body">
                <img src={game.cover} alt="" loading="lazy" draggable={false} />
              </span>
              <span className="demo-b-planet-glow" aria-hidden="true" />
              <span className="demo-b-planet-label">
                <strong>{game.name}</strong>
                <small>{game.shortName}</small>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 数据读数面板 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="demo-b-panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="demo-b-panel-header">
            <span className="demo-b-panel-code">{active.shortName}</span>
            <span className="demo-b-panel-status">
              <i aria-hidden="true" />
              {active.status === 'available' ? 'ONLINE' : 'STANDBY'}
            </span>
          </div>
          <div className="demo-b-panel-readings">
            {[
              { label: '状态', value: active.status === 'available' ? '已连接' : '建设中' },
              { label: '资源', value: '4.2 TB' },
              { label: '延迟', value: '12 ms' },
              { label: '活跃', value: '1.2k' },
            ].map((reading) => (
              <div key={reading.label} className="demo-b-reading">
                <span className="demo-b-reading-label">{reading.label}</span>
                <span className="demo-b-reading-value">{reading.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Link className="demo-b-enter" to="/games">
        <span aria-hidden="true">▶</span>
        以此方向实现
      </Link>
    </div>
  );
}

export default HolographicHudDemo;