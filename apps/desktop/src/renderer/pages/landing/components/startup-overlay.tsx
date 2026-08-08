import { AnimatePresence, motion } from 'framer-motion';

interface StartupOverlayProps {
  readonly isVisible: boolean;
}

export function StartupOverlay({ isVisible }: StartupOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="landing-startup-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          role="status"
          aria-label="正在初始化系统"
        >
          <motion.div
            className="landing-startup-mark"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            A
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            正在启动 Asteris...
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
