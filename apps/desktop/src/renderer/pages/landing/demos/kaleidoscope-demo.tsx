import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { games } from '../../../shared/mock/games';
import { DemoChrome } from './demo-chrome';

/** Demo C — 分形万花筒：生成式艺术背景。 */
export function KaleidoscopeDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = games[activeIndex] ?? games[0];
  if (!active) throw new Error('游戏配置不能为空。');
  const gameTheme = {
    '--demo-c-primary': active.accentColor,
    '--demo-c-secondary': active.secondaryColor,
    '--demo-c-glow': active.glowColor,
    '--demo-c-font': active.fontFamily,
  } as CSSProperties;

  const selectGame = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(games.length - 1, index)));
  }, []);

  return (
    <div className="demo-c" style={gameTheme}>
      {/* 生成式万花筒背景 */}
      <div className="demo-c-backdrop" aria-hidden="true">
        <div className="demo-c-kaleido" aria-hidden="true">
          <div className="demo-c-petal demo-c-petal-1" aria-hidden="true" />
          <div className="demo-c-petal demo-c-petal-2" aria-hidden="true" />
          <div className="demo-c-petal demo-c-petal-3" aria-hidden="true" />
          <div className="demo-c-petal demo-c-petal-4" aria-hidden="true" />
          <div className="demo-c-petal demo-c-petal-5" aria-hidden="true" />
          <div className="demo-c-petal demo-c-petal-6" aria-hidden="true" />
          <div className="demo-c-petal demo-c-petal-7" aria-hidden="true" />
          <div className="demo-c-petal demo-c-petal-8" aria-hidden="true" />
          <div className="demo-c-halo" aria-hidden="true" />
        </div>
      </div>

      <div className="demo-c-grain" aria-hidden="true" />
      <DemoChrome label="C · 分形万花筒" />

      {/* 中央展示 */}
      <main className="demo-c-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="demo-c-orb"
            initial={{ scale: 0.7, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.15, opacity: 0, rotate: 12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="demo-c-orb-frame" aria-hidden="true" />
            <img src={active.artwork} alt="" loading="lazy" draggable={false} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="demo-c-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="demo-c-code">{active.shortName}</span>
            <h2>{active.name}</h2>
            <p>{active.description}</p>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 游戏切换 */}
      <div className="demo-c-switcher" role="tablist" aria-label="切换游戏">
        {games.map((game, index) => (
          <button
            key={game.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={`demo-c-chip${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => selectGame(index)}
            style={{ '--chip-accent': game.accentColor } as CSSProperties}
          >
            <span className="demo-c-chip-dot" aria-hidden="true" />
            {game.name}
          </button>
        ))}
      </div>

      <Link className="demo-c-enter" to="/games">
        <span aria-hidden="true">▶</span>
        以此方向实现
      </Link>
    </div>
  );
}

export default KaleidoscopeDemo;