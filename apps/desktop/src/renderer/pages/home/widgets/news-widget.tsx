import { ArrowUpRight, Megaphone, Newspaper } from '@game-guide-hub/icons';
import { Widget as WidgetShell } from '@game-guide-hub/ui';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { news } from '../../../shared/content';

export const NewsWidget = memo(function NewsWidget() {
  return (
    <WidgetShell
      title="官方公告"
      eyebrow="最近更新"
      icon={Megaphone}
      className="workspace-widget-news"
      action={
        <Link to="/news" aria-label="查看全部官方公告">
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      }
    >
      <div className="workspace-news-list">
        {news.slice(0, 4).map((entry) => (
          <Link to="/news" key={entry.id} className="workspace-news-item">
            <span className="workspace-news-icon" aria-hidden="true">
              <Newspaper size={14} />
            </span>
            <span className="workspace-news-copy">
              <strong>{entry.title}</strong>
              <small>{entry.summary}</small>
            </span>
            <time>{entry.date}</time>
          </Link>
        ))}
      </div>
    </WidgetShell>
  );
});
