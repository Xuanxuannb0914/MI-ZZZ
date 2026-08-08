import { ChevronRight, Newspaper } from '@game-guide-hub/icons';
import type { NewsEntry } from '../../../shared/mock/news';

interface NewsCardProps {
  readonly newsEntry: NewsEntry;
}

export function NewsCard({ newsEntry }: NewsCardProps) {
  return (
    <article className="group flex items-start gap-content border-b border-border-subtle py-content last:border-0">
      <span className="mt-compact flex size-control shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-secondary">
        <Newspaper aria-hidden="true" size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-control">
          <span className="text-caption font-medium text-content-electric">{newsEntry.kind}</span>
          <time className="text-caption text-text-tertiary">{newsEntry.date}</time>
        </div>
        <h3 className="mt-compact text-label font-semibold text-text-primary">{newsEntry.title}</h3>
        <p className="mt-compact line-clamp-2 text-caption text-text-secondary">
          {newsEntry.summary}
        </p>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="mt-content shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary"
        size={16}
      />
    </article>
  );
}
