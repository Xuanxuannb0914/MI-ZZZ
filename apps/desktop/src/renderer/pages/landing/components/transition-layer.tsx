import { motion as themeMotion } from '@game-guide-hub/theme';
import { motion } from 'framer-motion';

interface TransitionLayerProps {
  readonly isActive: boolean;
}

export function TransitionLayer({ isActive }: TransitionLayerProps) {
  return (
    <motion.div
      className="landing-transition-layer"
      initial={false}
      animate={
        isActive
          ? { opacity: 1, scale: 1.04, filter: 'blur(14px)' }
          : { opacity: 0, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: themeMotion.durationSeconds.cinematic, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    />
  );
}
