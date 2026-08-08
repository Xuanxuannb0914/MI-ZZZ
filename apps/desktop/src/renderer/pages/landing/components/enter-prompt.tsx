import { ArrowUpRight } from '@game-guide-hub/icons';
import { motion } from 'framer-motion';

interface EnterPromptProps {
  readonly isEntering: boolean;
  readonly onEnter: () => void;
}

export function EnterPrompt({ isEntering, onEnter }: EnterPromptProps) {
  return (
    <motion.button
      type="button"
      className="landing-enter"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isEntering ? 0 : 1, y: isEntering ? 8 : 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
      onClick={(event) => {
        event.stopPropagation();
        onEnter();
      }}
      aria-label="点击任意位置进入"
    >
      <span className="landing-enter-line" />
      <span>点击任意位置进入</span>
      <ArrowUpRight aria-hidden="true" size={16} />
      <span className="landing-enter-line" />
    </motion.button>
  );
}
