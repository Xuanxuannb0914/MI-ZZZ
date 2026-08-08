import { ChevronRight, Megaphone } from '@game-guide-hub/icons';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { news } from '../../../shared/mock/news';
import { WidgetShell } from './widget-shell';

export const AnnouncementsWidget = memo(function AnnouncementsWidget() {
  return (
    <WidgetShell
      title="官方公告"
      eyebrow="新艾利都广播"
      icon={Megaphone}
      className="workspace-widget-news"
      action={
        <Link to="/news" aria-label="查看全部官方公告">
          <ChevronRight aria-hidden="true" size={16} />
        </Link>
      }
    >
      <div className="workspace-news-stack">
        {news.slice(0, 3).map((item) => (
          <Link to="/news" key={item.id} className="workspace-news-item">
            <span className="workspace-news-tag">{item.kind}</span>
            <span className="workspace-news-copy">
              <strong>{item.title}</strong>
              <small>{item.summary}</small>
            </span>
            <time dateTime={item.date}>{item.date}</time>
          </Link>
        ))}
      </div>
    </WidgetShell>
  );
});
