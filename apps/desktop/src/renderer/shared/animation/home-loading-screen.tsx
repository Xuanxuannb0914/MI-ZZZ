import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HomeLoadingScreenProps {
  readonly isVisible: boolean;
}

export function HomeLoadingScreen({ isVisible }: HomeLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return undefined;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(100, ((now - startedAt) / 720) * 100);
      setProgress(next);
      if (next < 100) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="home-loading fixed inset-0 z-critical flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.35 }}
          aria-label="正在加载 Asteris"
          role="status"
        >
          <div className="home-loading-panel">
            <div className="home-logo-mark">G</div>
            <div className="mt-panel text-center">
              <p className="text-label font-semibold tracking-[0.18em] text-text-primary">
                Asteris
              </p>
              <p className="mt-compact text-caption text-text-tertiary">正在同步新艾利都情报</p>
            </div>
            <div className="home-loading-track" aria-hidden="true">
              <motion.div className="home-loading-progress" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-content text-center text-caption tabular-nums text-text-tertiary">
              {Math.round(progress).toString().padStart(3, '0')} / 100
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
