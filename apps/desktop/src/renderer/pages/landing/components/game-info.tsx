import { motion } from 'framer-motion';
import type { GameDefinition } from '../../../shared/mock/games';

export function GameInfo({ game }: { readonly game: GameDefinition }) {
  return (
    <motion.div
      key={game.id}
      className="game-info"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.48, staggerChildren: 0.07, delayChildren: 0.09 },
        },
      }}
    >
      <motion.p
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        className="game-info-kicker"
      >
        {game.shortName} / 游戏档案
      </motion.p>
      <motion.h1 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
        {game.name}
      </motion.h1>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        className="game-info-english"
      >
        {game.id === 'zzz' ? 'ZENLESS ZONE ZERO' : game.shortName}
      </motion.p>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
        className="game-info-description"
      >
        {game.description}
      </motion.p>
    </motion.div>
  );
}
