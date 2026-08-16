import { ArrowUpRight, CalendarDays, Clock3, Play, Sparkles } from '@game-guide-hub/icons';
import { Button } from '@game-guide-hub/ui';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motionPresets } from '../../../shared/animation/motion-presets';

export const HomeHero = memo(function HomeHero() {
  const navigate = useNavigate();

  return (
    <motion.section
      className="workspace-hero"
      aria-labelledby="workspace-hero-title"
      {...motionPresets.sectionReveal}
    >
      <div className="workspace-hero-art" aria-hidden="true" />
      <div className="workspace-hero-mask" aria-hidden="true" />
      <div className="workspace-hero-particles" aria-hidden="true" />
      <div className="workspace-hero-copy">
        <div className="workspace-hero-meta">
          <span className="workspace-version-badge">版本 2.1</span>
          <span>
            <Sparkles aria-hidden="true" size={13} /> 风花之诗
          </span>
        </div>
        <p className="workspace-hero-kicker">当前限定活动</p>
        <h1 id="workspace-hero-title" className="ggh-text-glow">
          霜月映照，<span className="ggh-text-gradient">新章已启</span>。
        </h1>
        <p className="workspace-hero-description">
          星见雅限定频段与周年庆活动进行中。今日材料、活动进度与培养计划已经同步。
        </p>
        <div className="workspace-hero-actions">
          <Button size="comfortable" onClick={() => navigate('/zzz/events')}>
            <Play aria-hidden="true" size={16} />
            进入活动中心
          </Button>
          <Link to="/zzz/planner" className="workspace-secondary-action">
            <CalendarDays aria-hidden="true" size={16} />
            查看今日养成
            <ArrowUpRight aria-hidden="true" size={14} />
          </Link>
        </div>
      </div>
      <aside className="workspace-hero-countdown" aria-label="活动倒计时">
        <span>
          <Clock3 aria-hidden="true" size={14} /> 活动倒计时
        </span>
        <strong>12 天 08:34</strong>
        <small>奖励剩余：菲林 ×720</small>
      </aside>
    </motion.section>
  );
});
