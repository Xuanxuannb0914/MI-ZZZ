import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { motionPresets } from '../animation/motion-presets';

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={motionPresets.page.initial}
      animate={motionPresets.page.animate}
      exit={motionPresets.page.exit}
      transition={motionPresets.page.transition}
    >
      {children}
    </motion.div>
  );
}
