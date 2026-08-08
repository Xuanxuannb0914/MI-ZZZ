import { Clock3 } from '@game-guide-hub/icons';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../app/stores/app-store';
import { guides } from '../../../shared/mock/guides';
import { WidgetShell } from './widget-shell';

export const ContinueReadingWidget = memo(function ContinueReadingWidget() {
  const historyGuideIds = useAppStore((state) => state.historyGuideIds);
  const recordGuideVisit = useAppStore((state) => state.recordGuideVisit);
  const recentGuides = useMemo(() => {
    const history = historyGuideIds
      .map((id) => guides.find((guide) => guide.id === id))
      .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));
    return (history.length > 0 ? history : guides).slice(0, 2);
  }, [historyGuideIds]);

  return (
    <WidgetShell
      title="最近浏览"
      eyebrow="继续阅读"
      icon={Clock3}
      className="workspace-widget-history"
    >
      <div className="workspace-history-list">
        {recentGuides.map((guide, index) => (
          <Link
            to={`/guide/${guide.id}`}
            key={guide.id}
            className="workspace-history-item"
            onClick={() => recordGuideVisit(guide.id)}
          >
            <span>0{index + 1}</span>
            <span>
              <strong>{guide.title}</strong>
              <small>
                {guide.category} · {guide.updatedAt}
              </small>
            </span>
          </Link>
        ))}
      </div>
    </WidgetShell>
  );
});
