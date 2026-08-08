import { CalendarDays, Clock3, Sparkles, Zap } from '@game-guide-hub/icons';
import type { ReactNode } from 'react';
import { memo, useEffect, useState } from 'react';
import { events } from '../../../shared/mock/events';

const clockFormatter = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

interface UtilityCardProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly icon: typeof Clock3;
  readonly tone?: 'primary' | 'accent' | 'orange' | 'secondary';
  readonly children?: ReactNode;
}

function UtilityCard({ eyebrow, title, icon: Icon, tone = 'primary', children }: UtilityCardProps) {
  return (
    <article
      className={`ggh-glass glass-medium workspace-utility-card workspace-utility-card-${tone}`}
    >
      <header className="workspace-utility-card-header">
        <span className="workspace-utility-icon">
          <Icon aria-hidden="true" size={15} />
        </span>
        <span>
          <small>{eyebrow}</small>
          <strong>{title}</strong>
        </span>
      </header>
      {children ? <div className="workspace-utility-card-body">{children}</div> : null}
    </article>
  );
}

export const WorkspaceUtilityRail = memo(function WorkspaceUtilityRail() {
  const [now, setNow] = useState(() => new Date());
  const featuredEvent = events[0];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="workspace-utility-rail" aria-label="工作区辅助信息">
      <UtilityCard
        eyebrow="本地时间"
        title={dateFormatter.format(now)}
        icon={Clock3}
        tone="primary"
      >
        <strong className="workspace-utility-time">{clockFormatter.format(now)}</strong>
        <span className="workspace-utility-caption">新艾利都 · 晴</span>
      </UtilityCard>

      <UtilityCard eyebrow="当前版本" title="风花之诗" icon={Sparkles} tone="secondary">
        <div className="workspace-utility-stat-row">
          <strong>2.1</strong>
          <span>数据已同步</span>
        </div>
        <span className="workspace-utility-progress">
          <span />
        </span>
      </UtilityCard>

      <UtilityCard
        eyebrow="活动倒计时"
        title={featuredEvent?.title ?? '版本活动'}
        icon={Zap}
        tone="accent"
      >
        <strong className="workspace-utility-countdown">12 天 08:34</strong>
        <span className="workspace-utility-caption">限定频段 · 菲林 ×720</span>
      </UtilityCard>

      <UtilityCard eyebrow="今日提醒" title="行动电量" icon={CalendarDays} tone="orange">
        <div className="workspace-utility-reminder">
          <strong>180 / 240</strong>
          <span>建议先完成角色突破材料</span>
        </div>
      </UtilityCard>

      <UtilityCard eyebrow="未来日历" title="本周节点" icon={CalendarDays} tone="primary">
        <ul className="workspace-utility-calendar">
          <li>
            <span>周五</span>
            <strong>双倍掉落</strong>
          </li>
          <li>
            <span>周日</span>
            <strong>版本前瞻</strong>
          </li>
          <li>
            <span>下周一</span>
            <strong>周常刷新</strong>
          </li>
        </ul>
      </UtilityCard>
    </aside>
  );
});
