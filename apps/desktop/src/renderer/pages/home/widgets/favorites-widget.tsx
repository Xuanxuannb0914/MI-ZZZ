import { Heart, Pin } from '@game-guide-hub/icons';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../app/stores/app-store';
import { agents } from '../../../shared/mock/agents';
import { events } from '../../../shared/mock/events';
import { guides } from '../../../shared/mock/guides';
import { WidgetShell } from './widget-shell';

export const FavoritesWidget = memo(function FavoritesWidget() {
  const favoriteAgentIds = useAppStore((state) => state.favoriteAgentIds);
  const favoriteGuideIds = useAppStore((state) => state.favoriteGuideIds);
  const favoriteEventIds = useAppStore((state) => state.favoriteEventIds);

  const pins = useMemo(
    () => [
      {
        label: '角色',
        value:
          agents.find((agent) => favoriteAgentIds.includes(agent.id))?.name ??
          agents.find((agent) => agent.id === 'miyabi')?.name ??
          '星见雅',
        to: '/favorites',
      },
      {
        label: '攻略',
        value: guides.find((guide) => favoriteGuideIds.includes(guide.id))?.title ?? '霜燃进阶手册',
        to: '/favorites',
      },
      {
        label: '活动',
        value: events.find((event) => favoriteEventIds.includes(event.id))?.title ?? '风花之诗',
        to: '/favorites',
      },
    ],
    [favoriteAgentIds, favoriteEventIds, favoriteGuideIds],
  );

  return (
    <WidgetShell
      title="收藏"
      eyebrow="固定内容"
      icon={Heart}
      className="workspace-widget-favorites"
    >
      <div className="workspace-pin-list">
        {pins.map((pin) => (
          <Link to={pin.to} key={pin.label} className="workspace-pin-item">
            <Pin aria-hidden="true" size={13} />
            <span>{pin.label}</span>
            <strong>{pin.value}</strong>
          </Link>
        ))}
      </div>
    </WidgetShell>
  );
});
