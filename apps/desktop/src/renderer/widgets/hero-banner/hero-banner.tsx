import { CalendarDays, ChevronRight, Sparkles } from '@game-guide-hub/icons';
import { Button } from '@game-guide-hub/ui';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function HeroBanner() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-96 overflow-hidden rounded-lg border border-border-subtle bg-content-surface shadow-level-2">
      <img
        src="/assets/zzz-city.jpg"
        alt="代表新艾利都行动的城市景观"
        width="1920"
        height="1080"
        className="absolute inset-0 h-full w-full object-cover opacity-75"
      />
      <div className="hero-scrim absolute inset-0" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="relative flex min-h-96 max-w-2xl flex-col justify-end p-layout lg:p-10"
      >
        <span className="mb-content inline-flex w-fit items-center gap-compact rounded-full border border-content-electric/30 bg-canvas/70 px-content py-compact text-caption font-semibold text-content-electric backdrop-blur-md">
          <Sparkles aria-hidden="true" size={14} />
          版本 2.1 · 情报已更新
        </span>
        <p className="text-caption font-semibold uppercase text-text-secondary">Asteris · 绝区零</p>
        <h1 className="mt-control text-display font-bold text-text-primary">
          做好规划，再进入空洞
        </h1>
        <p className="mt-content max-w-xl text-body-lg text-text-secondary">
          角色培养、每日规划与版本活动，集中在一个清晰的绝区零工作台中。
        </p>
        <div className="mt-section flex flex-wrap gap-control">
          <Button
            size="comfortable"
            className="bg-content-electric text-on-action-primary"
            onClick={() => navigate('/daily')}
          >
            <CalendarDays aria-hidden="true" size={17} />
            查看每日养成
          </Button>
          <Button
            size="comfortable"
            variant="secondary"
            className="border-white/20 bg-canvas/60 backdrop-blur-md"
            onClick={() => navigate('/agents')}
          >
            浏览角色
            <ChevronRight aria-hidden="true" size={17} />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
