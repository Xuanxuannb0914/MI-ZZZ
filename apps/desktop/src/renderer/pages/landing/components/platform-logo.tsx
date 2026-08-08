import { motion } from 'framer-motion';

export function PlatformLogo() {
  return (
    <motion.div
      className="platform-logo"
      initial={{ opacity: 0, scale: 0.86, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="platform-logo-mark" aria-hidden="true">
        A
      </span>
      <span className="platform-logo-name">Asteris</span>
    </motion.div>
  );
}
