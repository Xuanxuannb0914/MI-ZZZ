import { BookOpen, Clock3, Heart } from '@game-guide-hub/icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../app/stores/app-store';
import { motionPresets } from '../../../shared/animation/motion-presets';
import { Tag } from '../../../shared/ui/tag';
import type { Guide } from '../model/types';

interface GuideCardProps {
  readonly guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  const favoriteGuideIds = useAppStore((state) => state.favoriteGuideIds);
  const toggleFavoriteGuide = useAppStore((state) => state.toggleFavoriteGuide);
  const isFavorite = favoriteGuideIds.includes(guide.id);

  return (
    <motion.article
      whileHover={motionPresets.hoverCard.whileHover}
      whileTap={motionPresets.hoverCard.whileTap}
      transition={motionPresets.hoverCard.transition}
      className="ggh-card ggh-card-interactive guide-card group overflow-hidden rounded-lg border border-border-subtle bg-surface-1 shadow-level-1"
    >
      <Link to={`/guide/${guide.id}`} className="block">
        <div className="relative aspect-[16/8] overflow-hidden bg-surface-2">
          <img
            src={guide.cover}
            alt=""
            width="1400"
            height="700"
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-scrim/35" aria-hidden="true" />
          <Tag className="absolute left-content top-content bg-canvas/80 backdrop-blur-md">
            {guide.category}
          </Tag>
        </div>
        <div className="p-panel">
          <h3 className="text-title3 font-semibold">{guide.title}</h3>
          <p className="mt-compact line-clamp-2 text-body text-text-secondary">{guide.summary}</p>
          <div className="mt-panel flex items-center gap-panel text-caption text-text-tertiary">
            <span className="inline-flex items-center gap-compact">
              <Clock3 aria-hidden="true" size={14} />
              {guide.readTime} 分钟
            </span>
            <span className="inline-flex items-center gap-compact">
              <BookOpen aria-hidden="true" size={14} />
              更新于 {guide.updatedAt}
            </span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        className="guide-card-favorite"
        aria-label={isFavorite ? `取消收藏攻略：${guide.title}` : `收藏攻略：${guide.title}`}
        aria-pressed={isFavorite}
        onClick={() => toggleFavoriteGuide(guide.id)}
      >
        <Heart aria-hidden="true" size={16} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </motion.article>
  );
}
