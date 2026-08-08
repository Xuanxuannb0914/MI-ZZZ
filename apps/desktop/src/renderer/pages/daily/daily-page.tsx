import { CalendarDays, Check, Clock3, Flame, Target, Trophy, Zap } from '@game-guide-hub/icons';
import { dailyTasks, todaysFarming, todaysMaterials, weeklyTasks } from '../../shared/mock/daily';
import { events } from '../../shared/mock/events';
import { Page } from '../../shared/ui/page';
import { PageTransition } from '../../shared/ui/page-transition';
import { SectionTitle } from '../../shared/ui/section-title';

interface TaskListProps {
  readonly tasks: typeof dailyTasks;
}
function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="divide-y divide-border-subtle">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center gap-content py-content">
          <span
            className={
              task.isComplete
                ? 'flex size-control items-center justify-center rounded-full bg-success/15 text-success'
                : 'flex size-control items-center justify-center rounded-full border border-border-strong text-text-tertiary'
            }
          >
            {task.isComplete ? (
              <Check aria-hidden="true" size={15} />
            ) : (
              <span className="size-1.5 rounded-full bg-current" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-label font-medium text-text-primary">{task.title}</p>
            <p className="text-caption text-text-tertiary">{task.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function DailyPage() {
  const completedDailyTasks = dailyTasks.filter((task) => task.isComplete).length;
  return (
    <PageTransition>
      <Page className="page-surface page-daily">
        <header className="flex flex-col gap-panel md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-caption font-semibold text-content-electric">星期二 · 新艾利都</p>
            <h1 className="mt-control text-title1 font-semibold">每日养成</h1>
            <p className="mt-compact text-body text-text-secondary">
              一份聚合每日刷新、材料刷取和版本目标的清单。
            </p>
          </div>
          <div className="flex items-center gap-content rounded-lg border border-border-subtle bg-surface-1 px-panel py-content">
            <span className="flex size-control items-center justify-center rounded-md bg-content-electric text-on-action-primary">
              <Zap aria-hidden="true" size={16} />
            </span>
            <div>
              <p className="text-caption text-text-tertiary">当前电量</p>
              <p className="text-label font-semibold tabular-nums">180 / 240</p>
            </div>
          </div>
        </header>
        <section className="grid gap-content md:grid-cols-3">
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-panel">
            <CalendarDays className="text-content-electric" aria-hidden="true" size={18} />
            <p className="mt-content text-caption text-text-tertiary">每日进度</p>
            <p className="mt-compact text-title1 font-semibold tabular-nums">
              {completedDailyTasks} / {dailyTasks.length}
            </p>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-panel">
            <Clock3 className="text-content-ice" aria-hidden="true" size={18} />
            <p className="mt-content text-caption text-text-tertiary">下次刷新</p>
            <p className="mt-compact text-title1 font-semibold tabular-nums">06:42:18</p>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface-1 p-panel">
            <Trophy className="text-content-physical" aria-hidden="true" size={18} />
            <p className="mt-content text-caption text-text-tertiary">每周完成度</p>
            <p className="mt-compact text-title1 font-semibold tabular-nums">73%</p>
          </div>
        </section>
        <div className="grid gap-layout xl:grid-cols-2">
          <section>
            <SectionTitle eyebrow="今日" title="每日任务" />
            <div className="mt-panel rounded-lg border border-border-subtle bg-surface-1 px-panel">
              <TaskList tasks={dailyTasks} />
            </div>
          </section>
          <section>
            <SectionTitle eyebrow="本周" title="每周任务" />
            <div className="mt-panel rounded-lg border border-border-subtle bg-surface-1 px-panel">
              <TaskList tasks={weeklyTasks} />
            </div>
          </section>
        </div>
        <div className="grid gap-layout xl:grid-cols-2">
          <section>
            <SectionTitle eyebrow="材料开放" title="今日可刷材料" />
            <div className="mt-panel space-y-control">
              {todaysMaterials.map((material) => (
                <div
                  key={material}
                  className="flex items-center gap-content border-b border-border-subtle py-content"
                >
                  <span className="flex size-control items-center justify-center rounded-md bg-content-fire/10 text-content-fire">
                    <Flame aria-hidden="true" size={16} />
                  </span>
                  <span className="text-label font-medium">{material}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle eyebrow="体力规划" title="推荐刷取路线" />
            <ol className="mt-panel space-y-control">
              {todaysFarming.map((activity, index) => (
                <li
                  key={activity}
                  className="flex items-center gap-content rounded-lg border border-border-subtle bg-surface-1 p-content"
                >
                  <span className="flex size-control items-center justify-center rounded-md bg-surface-2 text-caption font-semibold text-content-electric">
                    {index + 1}
                  </span>
                  <span className="text-label">{activity}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <section>
          <SectionTitle eyebrow="版本活动" title="当前活动目标" />
          <div className="mt-panel grid gap-content md:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-lg border border-border-subtle bg-surface-1 p-panel"
              >
                <div className="flex items-center justify-between">
                  <Target aria-hidden="true" className="text-content-ether" size={18} />
                  <span className="text-caption text-text-tertiary">{event.duration}</span>
                </div>
                <h3 className="mt-content text-label font-semibold">{event.title}</h3>
                <p className="mt-compact text-caption text-text-secondary">{event.reward}</p>
                <progress
                  className="ggh-progress ggh-progress-accent mt-panel"
                  max="100"
                  value={event.progress}
                  aria-label={`${event.title} progress`}
                />
              </article>
            ))}
          </div>
        </section>
      </Page>
    </PageTransition>
  );
}
