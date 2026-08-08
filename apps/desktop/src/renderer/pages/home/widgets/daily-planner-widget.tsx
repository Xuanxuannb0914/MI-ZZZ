import { CalendarDays, ChevronRight, Zap } from '@game-guide-hub/icons';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  dailySchedules,
  dailyTasks,
  todaysMaterials,
  weeklyTasks,
} from '../../../shared/mock/daily';
import { WidgetShell } from './widget-shell';

const weekday = new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(new Date());
const todaySchedule =
  dailySchedules.find((schedule) => schedule.day === weekday) ?? dailySchedules[0];
const completedDaily = dailyTasks.filter((task) => task.isComplete).length;
const completedWeekly = weeklyTasks.filter((task) => task.isComplete).length;

export const DailyPlannerWidget = memo(function DailyPlannerWidget() {
  return (
    <WidgetShell
      title="今日养成"
      eyebrow="行动计划"
      icon={CalendarDays}
      className="workspace-widget-daily"
      action={
        <Link to="/daily" aria-label="打开完整每日养成计划">
          <ChevronRight aria-hidden="true" size={16} />
        </Link>
      }
    >
      <div className="workspace-materials">
        {todaysMaterials.map((material) => (
          <span key={material}>{material}</span>
        ))}
      </div>
      <div className="workspace-energy-plan">
        <span className="workspace-energy-icon">
          <Zap aria-hidden="true" size={15} />
        </span>
        <span>
          <small>推荐体力规划</small>
          <strong>{todaySchedule?.priority ?? '主力角色突破'}</strong>
        </span>
        <b>{todaySchedule?.energy ?? 180}</b>
      </div>
      <div className="workspace-progress-row">
        <span>
          每日任务 {completedDaily}/{dailyTasks.length}
        </span>
        <span>
          每周任务 {completedWeekly}/{weeklyTasks.length}
        </span>
        <strong>活跃度 78</strong>
      </div>
      <div className="workspace-planner-footer">
        <div
          className="workspace-progress-ring"
          role="progressbar"
          aria-label="今日活跃度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={78}
        >
          <svg viewBox="0 0 42 42" role="img" aria-hidden="true">
            <circle
              className="workspace-progress-ring-track"
              cx="21"
              cy="21"
              r="16"
              pathLength="100"
            />
            <circle
              className="workspace-progress-ring-value"
              cx="21"
              cy="21"
              r="16"
              pathLength="100"
              strokeDasharray="78 100"
            />
          </svg>
          <strong>78%</strong>
        </div>
        <div className="workspace-planner-time">
          <span>剩余时间</span>
          <strong>08:34:12</strong>
        </div>
      </div>
    </WidgetShell>
  );
});
