import { CalendarDays, Heart, Play, Target, Zap } from '@game-guide-hub/icons';
import { Banner, Button } from '@game-guide-hub/ui';
import { useAppStore } from '../../app/stores/app-store';
import { Link } from 'react-router-dom';
import { events } from '../../shared/content';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';

export default function EventsPage() {
  const favoriteEventIds = useAppStore((state) => state.favoriteEventIds);
  const toggleFavoriteEvent = useAppStore((state) => state.toggleFavoriteEvent);
  const featuredEvent = events[0];
  return (
    <PageTransition>
      <Page className="page-surface page-events">
        <header>
          <p className="text-caption font-semibold text-content-electric">版本日历</p>
          <h1 className="mt-control text-title1 font-semibold">活动中心</h1>
          <p className="mt-compact text-body text-text-secondary">
            追踪限时活动、周年庆与双倍奖励，合理安排每一份电量。
          </p>
        </header>
        {featuredEvent ? (
          <Banner
            artwork="/assets/zzz-city.jpg"
            eyebrow={`${featuredEvent.type} · ${featuredEvent.duration}`}
            title={featuredEvent.title}
            description={`参与活动可获取 ${featuredEvent.reward}，当前完成进度 ${featuredEvent.progress}%。`}
          >
            <Link to={`/zzz/events/${featuredEvent.id}`} className="inline-flex h-control items-center gap-control rounded-md bg-action-primary px-panel text-label font-semibold text-on-action-primary transition-transform hover:-translate-y-px">
              <Play aria-hidden="true" size={16} />
              参与指南
            </Link>
            <Button
              variant="secondary"
              onClick={() => toggleFavoriteEvent(featuredEvent.id)}
              aria-pressed={favoriteEventIds.includes(featuredEvent.id)}
            >
              <Heart
                aria-hidden="true"
                size={16}
                fill={favoriteEventIds.includes(featuredEvent.id) ? 'currentColor' : 'none'}
              />
              {favoriteEventIds.includes(featuredEvent.id) ? '已收藏' : '收藏活动'}
            </Button>
          </Banner>
        ) : null}
        <div className="grid gap-content sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-lg border border-border-subtle bg-surface-1 shadow-level-1 transition-transform hover:-translate-y-1"
            >
              <div className="h-1 bg-gradient-to-r from-content-electric via-content-ice to-content-ether" />
              <div className="p-panel">
                <div className="flex items-center justify-between text-caption text-text-tertiary">
                  <span className="inline-flex items-center gap-compact text-content-electric">
                    <CalendarDays aria-hidden="true" size={15} />
                    {event.type}
                  </span>
                  <span>{event.duration}</span>
                </div>
                <Link to={`/zzz/events/${event.id}`} className="mt-panel block text-title3 font-semibold hover:text-content-electric">{event.title}</Link>
                <p className="mt-compact text-body text-text-secondary">{event.reward}</p>
                <div className="mt-panel flex items-center justify-between text-caption text-text-tertiary">
                  <span className="inline-flex items-center gap-compact">
                    <Target aria-hidden="true" size={14} />
                    完成进度
                  </span>
                  <strong className="text-text-primary">{event.progress}%</strong>
                </div>
                <progress
                  className="ggh-progress mt-compact"
                  max="100"
                  value={event.progress}
                  aria-label={`${event.title} 进度`}
                />
                <div className="mt-content flex items-center justify-between">
                  <span className="text-caption text-text-tertiary">
                    {event.status} · {event.startsAt}
                  </span>
                  <button
                    type="button"
                    className="command-icon-button"
                    aria-label={
                      favoriteEventIds.includes(event.id)
                        ? `取消收藏活动：${event.title}`
                        : `收藏活动：${event.title}`
                    }
                    aria-pressed={favoriteEventIds.includes(event.id)}
                    onClick={() => toggleFavoriteEvent(event.id)}
                  >
                    <Heart
                      aria-hidden="true"
                      size={15}
                      fill={favoriteEventIds.includes(event.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="flex items-start gap-content rounded-lg border border-content-electric/20 bg-content-electric/5 p-panel text-body text-text-secondary">
          <Zap className="mt-compact shrink-0 text-content-electric" aria-hidden="true" size={18} />
          <p>活动数据为本地 Mock 展示，实际开放时间请以游戏内公告为准。</p>
        </div>
      </Page>
    </PageTransition>
  );
}
