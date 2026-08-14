import { BookOpen, History } from '@game-guide-hub/icons';
import type { Guide } from '../../../entities/guide/model/types';
import { Tag } from '../../../shared/ui/tag';

interface GuideMetaProps {
  readonly guide: Guide;
}

export function GuideMeta({ guide }: GuideMetaProps) {
  return (
    <div className="guide-meta">
      <span className="guide-meta__item">
        <BookOpen aria-hidden="true" size={15} />
        作者：{guide.author}
      </span>
      <span className="guide-meta__item">
        <History aria-hidden="true" size={15} />
        更新于 {guide.updatedAt}
      </span>
      <div className="guide-meta__tags">
        {guide.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  );
}
