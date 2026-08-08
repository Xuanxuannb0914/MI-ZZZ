import { ChevronRight, Compass } from '@game-guide-hub/icons';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { events } from '../../../shared/mock/events';
import { WidgetShell } from './widget-shell';

const featuredEvents = [events[0], events[6], events[5]].filter(
  (event): event is NonNullable<typeof event> => Boolean(event),
);

const eventLabels: Record<string, string> = {
  'astra-event': '当前活动',
  'version-preview': '版本前瞻',
  'exclusive-banner': '限定频段',
};

export const EventCenterWidget = memo(function EventCenterWidget() {
  return (
    <WidgetShell
      title="当前活动"
      eyebrow="活动中心"
      icon={Compass}
      className="workspace-widget-events"
      action={
        <Link to="/events" aria-label="查看全部活动">
          <ChevronRight aria-hidden="true" size={16} />
        </Link>
      }
    >
      <div className="workspace-event-stack">
        {featuredEvents.map((event) => (
          <Link to="/events" key={event.id} className="workspace-event-item">
            <span>
              <small>{eventLabels[event.id] ?? event.type}</small>
              <strong>{event.title}</strong>
            </span>
            <span>
              <small>{event.startsAt ?? event.status}</small>
              <b>{event.duration}</b>
            </span>
          </Link>
        ))}
      </div>
    </WidgetShell>
  );
});
