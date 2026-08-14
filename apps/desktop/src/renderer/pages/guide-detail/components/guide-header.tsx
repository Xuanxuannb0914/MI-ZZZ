import { Heart, Share2 } from '@game-guide-hub/icons';
import { Banner, Button } from '@game-guide-hub/ui';
import type { Guide } from '../../../entities/guide/model/types';

interface GuideHeaderProps {
  readonly guide: Guide;
  readonly isFavorite: boolean;
  readonly shareLabel: string;
  readonly onToggleFavorite: () => void;
  readonly onShare: () => void;
}

export function GuideHeader({
  guide,
  isFavorite,
  shareLabel,
  onToggleFavorite,
  onShare,
}: GuideHeaderProps) {
  return (
    <header className="guide-reading-header">
      <Banner
        artwork={guide.cover}
        eyebrow={`${guide.category} / ${guide.difficulty} / ${guide.readTime} 分钟阅读`}
        title={guide.title}
        description={guide.summary}
      >
        <Button
          variant={isFavorite ? 'primary' : 'secondary'}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
        >
          <Heart aria-hidden="true" size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          {isFavorite ? '已收藏' : '收藏'}
        </Button>
        <Button variant="secondary" onClick={onShare}>
          <Share2 aria-hidden="true" size={16} />
          {shareLabel}
        </Button>
      </Banner>
    </header>
  );
}
