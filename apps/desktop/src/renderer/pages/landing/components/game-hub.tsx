import { ArrowUpRight, Info } from '@game-guide-hub/icons';
import { motion } from 'framer-motion';
import type { GameDefinition } from '../../../shared/mock/games';
import { games } from '../../../shared/mock/games';
import { GameCard } from './game-card';

interface GameHubProps {
  readonly isExiting: boolean;
  readonly onGameSelect: (game: GameDefinition) => void;
}

export function GameHub({ isExiting, onGameSelect }: GameHubProps) {
  return (
    <motion.main
      className="platform-landing"
      initial={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
      animate={
        isExiting
          ? { opacity: 0, scale: 0.96, filter: 'blur(16px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Asteris 游戏中心"
    >
      <div className="platform-landing-shell">
        <header className="platform-landing-header">
          <div className="platform-logo">
            <span className="platform-logo-mark" aria-hidden="true">
              A
            </span>
            <span className="platform-logo-name">Asteris</span>
          </div>
          <span className="platform-landing-build">游戏中心 · 0.3.0</span>
        </header>
        <section className="platform-landing-panel" aria-labelledby="platform-title">
          <div className="platform-landing-intro">
            <div>
              <p className="platform-landing-eyebrow">游戏中心 / 02</p>
              <h1 id="platform-title">选择一个世界。</h1>
              <p className="platform-landing-subtitle">一个入口，连接所有热爱。</p>
            </div>
            <div className="platform-landing-help">
              <Info aria-hidden="true" size={16} />
              <span>选择游戏档案开始</span>
            </div>
          </div>
          <div className="platform-game-grid">
            {games.map((game) => (
              <GameCard key={game.id} game={game} onSelect={onGameSelect} />
            ))}
          </div>
          <footer className="platform-landing-footer">
            <span>平台档案已就绪</span>
            <span className="platform-landing-footer-status">
              <span aria-hidden="true" />
              数据已同步
            </span>
            <span>
              社区动态 <ArrowUpRight aria-hidden="true" size={14} />
            </span>
          </footer>
        </section>
      </div>
    </motion.main>
  );
}
