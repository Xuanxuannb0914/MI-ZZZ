import { motion } from 'framer-motion';
import type { CSSProperties, PropsWithChildren, PointerEvent as ReactPointerEvent } from 'react';

interface RevealProps extends PropsWithChildren {
  readonly delay?: number;
  readonly className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface InteractiveCardProps extends PropsWithChildren {
  readonly className?: string;
}

export function InteractiveCard({ children, className }: InteractiveCardProps) {
  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--card-pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--card-pointer-y', `${event.clientY - bounds.top}px`);
  };
  const cardStyle = { '--card-pointer-x': '50%', '--card-pointer-y': '50%' } as CSSProperties;

  return (
    <motion.article
      className={className}
      style={cardStyle as Record<string, string>}
      whileHover={{ y: -5, rotateX: 0.7, rotateY: -0.7 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty('--card-pointer-x', '50%');
        event.currentTarget.style.setProperty('--card-pointer-y', '50%');
      }}
    >
      {children}
    </motion.article>
  );
}
