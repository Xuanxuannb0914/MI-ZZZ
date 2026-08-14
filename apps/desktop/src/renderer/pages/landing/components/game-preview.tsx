import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { GameDefinition } from '../../../shared/mock/games';

interface GamePreviewProps {
  readonly game: GameDefinition;
  readonly isExiting: boolean;
}

export function GamePreview({ game, isExiting }: GamePreviewProps) {
  const previewRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const artworkStyle = {
    '--game-artwork': `url(${game.artwork})`,
    '--game-background': `url(${game.background})`,
  } as CSSProperties;

  useEffect(() => {
    const preview = previewRef.current;
    const mediaQuery = (
      window as unknown as { matchMedia?: (query: string) => MediaQueryList }
    ).matchMedia?.bind(window);
    if (!preview || mediaQuery?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const updatePointer = () => {
      frameRef.current = null;
      preview.style.setProperty('--game-parallax-x', `${pointerRef.current.x.toFixed(2)}px`);
      preview.style.setProperty('--game-parallax-y', `${pointerRef.current.y.toFixed(2)}px`);
    };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = preview.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 10,
        y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8,
      };
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updatePointer);
    };
    const resetPointer = () => {
      pointerRef.current = { x: 0, y: 0 };
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updatePointer);
    };
    preview.addEventListener('pointermove', onPointerMove);
    preview.addEventListener('pointerleave', resetPointer);
    return () => {
      preview.removeEventListener('pointermove', onPointerMove);
      preview.removeEventListener('pointerleave', resetPointer);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section
      ref={previewRef}
      className="game-preview"
      style={artworkStyle}
      aria-label={`${game.name}视觉预览`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          className="game-preview-stage"
          initial={{ opacity: 0, x: 40, scale: 1.035, filter: 'blur(12px)' }}
          animate={
            isExiting
              ? { opacity: 0, scale: 1.12, filter: 'blur(16px)' }
              : { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }
          }
          exit={{ opacity: 0, x: -28, scale: 0.985, filter: 'blur(8px)' }}
          transition={{ duration: 0.76, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="game-preview-backdrop" aria-hidden="true" />
          <div className="game-preview-atmosphere" aria-hidden="true" />
          <GamePreviewArtwork key={game.artwork} artwork={game.artwork} />
          <span className="game-preview-artwork-halo" aria-hidden="true" />
          <span className="game-preview-noise" aria-hidden="true" />
          <span className="game-preview-sweep" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function GamePreviewArtwork({ artwork }: { readonly artwork: string }) {
  const [hasImageError, setHasImageError] = useState(false);

  return hasImageError ? (
    <div className="game-preview-artwork-fallback" aria-hidden="true" />
  ) : (
    <img
      className="game-preview-artwork"
      src={artwork}
      alt=""
      onError={() => setHasImageError(true)}
    />
  );
}
