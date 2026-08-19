import { Settings } from '@game-guide-hub/icons';
import { motion as themeMotion } from '@game-guide-hub/theme';
import { AnimatePresence, type MotionStyle, motion } from 'framer-motion';
import type { GameDefinition } from '../../../shared/mock/games';
import { games } from '../../../shared/mock/games';
import { BackgroundScene } from '../../../shared/scene/background-scene';
import { GameEnterButton } from './game-enter-button';
import { GameInfo } from './game-info';
import { GameOptionWheel } from './game-option-wheel';
import { GamePreview } from './game-preview';

interface GameHubProps {
  readonly isExiting: boolean;
  readonly selectedGame: GameDefinition;
  readonly onGameSelect: (game: GameDefinition) => void;
  readonly onEnter: () => void;
  /** 演示模式：允许进入「敬请期待」的游戏以预览开场动画。 */
  readonly allowComingSoon?: boolean;
}

export function GameHub({
  isExiting,
  selectedGame,
  onGameSelect,
  onEnter,
  allowComingSoon = false,
}: GameHubProps) {
  const selectedIndex = games.findIndex((game) => game.id === selectedGame.id);
  const gameTheme = {
    '--game-primary': selectedGame.accentColor,
    '--game-secondary': selectedGame.secondaryColor,
    '--game-glow': selectedGame.glowColor,
    '--game-font': selectedGame.fontFamily,
  } as MotionStyle;
  return (
    <motion.main
      className="game-hub"
      style={gameTheme}
      initial={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
      animate={
        isExiting
          ? { opacity: 0, scale: 0.96, filter: 'blur(16px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: themeMotion.durationSeconds.cinematic, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Asteris 游戏中心"
    >
      <BackgroundScene className="game-hub-background-canvas" />
      <div className="game-hub-shell">
        <header className="game-hub-header">
          <div className="game-hub-brand">
            <span aria-hidden="true">A</span>
            <strong>Asteris</strong>
            <i className="game-hub-brand-sep" aria-hidden="true" />
            <span className="game-hub-brand-crumb">游戏中心</span>
          </div>
          <div className="game-hub-header-meta">
            <span className="game-hub-live">
              <i aria-hidden="true" /> LOCAL NETWORK READY
            </span>
            <button type="button" aria-label="设置">
              <Settings aria-hidden="true" size={15} />
            </button>
          </div>
        </header>
        <section className="game-hub-stage" aria-label="游戏选择舞台">
          <div className="game-hub-wheel-panel">
            <GameOptionWheel
              games={games}
              selectedIndex={selectedIndex}
              onSelect={(index) => {
                const game = games[index];
                if (game) onGameSelect(game);
              }}
              onEnter={onEnter}
              disabled={isExiting}
            />
          </div>
          <div className="game-hub-preview-panel">
            <span className="game-hub-preview-index" aria-hidden="true">
              {String(selectedIndex + 1).padStart(2, '0')}
              <i>/</i>
              {String(games.length).padStart(2, '0')}
            </span>
            <GamePreview game={selectedGame} isExiting={isExiting} />
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGame.id}
                className="game-hub-preview-content"
                initial={{ opacity: 0, x: 40, scale: 0.98, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -28, scale: 0.98, filter: 'blur(5px)' }}
                transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
              >
                <GameInfo game={selectedGame} />
                <div className="game-hub-actions">
                  <span
                    className={`game-status ${selectedGame.status === 'available' ? 'is-available' : ''}`}
                  >
                    {selectedGame.status === 'available' ? '已开放' : '开发中'}
                  </span>
                  <GameEnterButton
                    game={selectedGame}
                    disabled={isExiting}
                    onEnter={onEnter}
                    allowComingSoon={allowComingSoon}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
        <footer className="game-hub-footer">
          <span>本地游戏档案</span>
          <span>ENTER 进入当前选择</span>
        </footer>
      </div>
    </motion.main>
  );
}
