import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { GameDefinition } from '../../../shared/mock/games';

interface GamePreviewProps {
  readonly game: GameDefinition;
  readonly isExiting: boolean;
}

export function GamePreview({ game, isExiting }: GamePreviewProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const artworkStyle = {
    '--game-artwork': `url(${game.artwork})`,
    '--game-background': `url(${game.background})`,
  } as CSSProperties;

  return (
    <section className="game-preview" style={artworkStyle} aria-label={`${game.name}视觉预览`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          className="game-preview-stage"
          initial={{ opacity: 0, scale: 1.035, filter: 'blur(12px)' }}
          animate={
            isExiting
              ? { opacity: 0, scale: 1.12, filter: 'blur(16px)' }
              : { opacity: 1, scale: 1, filter: 'blur(0px)' }
          }
          exit={{ opacity: 0, scale: 0.985, filter: 'blur(8px)' }}
          transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="game-preview-backdrop" aria-hidden="true" />
          {!hasImageError ? (
            <img
              key={game.artwork}
              className="game-preview-artwork"
              src={game.artwork}
              alt=""
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div className="game-preview-artwork-fallback" aria-hidden="true" />
          )}
          <span className="game-preview-noise" aria-hidden="true" />
          <span className="game-preview-sweep" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
