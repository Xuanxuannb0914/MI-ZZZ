import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { games } from '../../../shared/mock/games';
import { DemoChrome } from './demo-chrome';

/** Demo A — 沉浸式世界画廊：页面即世界。 */
export function WorldGalleryDemo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);
  const selected = games[selectedIndex] ?? games[0];
  if (!selected) throw new Error('游戏配置不能为空。');

  const gameTheme = {
    '--demo-a-primary': selected.accentColor,
    '--demo-a-secondary': selected.secondaryColor,
    '--demo-a-glow': selected.glowColor,
    '--demo-a-font': selected.fontFamily,
  } as CSSProperties;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const applyParallax = () => {
      frameRef.current = null;
      root.style.setProperty('--demo-a-px', `${pointerRef.current.x.toFixed(2)}px`);
      root.style.setProperty('--demo-a-py', `${pointerRef.current.y.toFixed(2)}px`);
    };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 26,
        y: ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 20,
      };
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(applyParallax);
    };
    root.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      root.removeEventListener('pointermove', onPointerMove);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const selectGame = useCallback((index: number) => {
    setSelectedIndex(Math.max(0, Math.min(games.length - 1, index)));
  }, []);

  return (
    <div ref={rootRef} className="demo-a" style={gameTheme}>
      {/* 全屏活背景：当前世界的艺术图，随鼠标视差漂移 */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selected.id}
          className="demo-a-world"
          initial={{ opacity: 0, scale: 1.06, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(14px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="demo-a-world-art"
            style={{ backgroundImage: `url(${selected.artwork})` }}
            aria-hidden="true"
          />
          <div className="demo-a-world-wash" aria-hidden="true" />
          <div className="demo-a-world-fog" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      <div className="demo-a-grain" aria-hidden="true" />
      <div className="demo-a-vignette" aria-hidden="true" />

      <DemoChrome label="A · 沉浸式世界画廊" />

      {/* 左下角：当前世界的身份信息 */}
      <div className="demo-a-identity">
        <span className="demo-a-identity-index" aria-hidden="true">
          {String(selectedIndex + 1).padStart(2, '0')}
          <i>/</i>
          {String(games.length).padStart(2, '0')}
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            className="demo-a-identity-body"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="demo-a-identity-code">{selected.shortName}</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="demo-a-identity-tags">
              <span>{selected.status === 'available' ? '已开放' : '开发中'}</span>
              <span>全屏视差世界</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部悬浮光带：切换世界的入口 */}
      <div className="demo-a-rail">
        <div className="demo-a-rail-track" role="tablist" aria-label="选择世界">
          <AnimatePresence>
            {games.map((game, index) => {
              const active = index === selectedIndex;
              return (
                <button
                  key={game.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`demo-a-rail-thumb${active ? ' is-active' : ''}`}
                  onClick={() => selectGame(index)}
                  style={{ '--thumb-accent': game.accentColor } as CSSProperties}
                >
                  {active && (
                    <motion.span
                      layoutId="demo-a-rail-active"
                      className="demo-a-rail-active"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="demo-a-rail-thumb-media" aria-hidden="true">
                    <img src={game.cover} alt="" loading="lazy" draggable={false} />
                  </span>
                  <span className="demo-a-rail-thumb-label">
                    <strong>{game.name}</strong>
                    <small>{game.shortName}</small>
                  </span>
                </button>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="demo-a-rail-glint" aria-hidden="true" />
      </div>

      <Link className="demo-a-enter" to="/games" onClick={(e) => e.stopPropagation()}>
        <span aria-hidden="true">▶</span>
        以此方向实现
      </Link>
    </div>
  );
}

export default WorldGalleryDemo;
