import { BookOpen, ChevronRight } from '@game-guide-hub/icons';
import { Widget as WidgetShell } from '@game-guide-hub/ui';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../app/stores/app-store';
import { guides } from '../../../shared/content';

const categoryGuides = [guides[0], guides[1], guides[6], guides[4], guides[21]].filter(
  (guide): guide is NonNullable<typeof guide> => Boolean(guide),
);

export const GuideCenterWidget = memo(function GuideCenterWidget() {
  const recordGuideVisit = useAppStore((state) => state.recordGuideVisit);

  return (
    <WidgetShell
      title="热门攻略"
      eyebrow="攻略中心"
      icon={BookOpen}
      className="workspace-widget-guides"
      action={
        <Link to="/zzz/guides" aria-label="查看全部攻略">
          <ChevronRight aria-hidden="true" size={16} />
        </Link>
      }
    >
      <div className="workspace-guide-list">
        {categoryGuides.map((guide) => (
          <Link
            to={`/zzz/guides/${guide.id}`}
            key={guide.id}
            className="workspace-guide-item"
            onClick={() => recordGuideVisit(guide.id)}
          >
            <span className="workspace-guide-category">{guide.category}</span>
            <span className="workspace-guide-copy">
              <strong>{guide.title}</strong>
              <small>{guide.summary}</small>
            </span>
            <time>{guide.readTime} 分钟</time>
          </Link>
        ))}
      </div>
    </WidgetShell>
  );
});
