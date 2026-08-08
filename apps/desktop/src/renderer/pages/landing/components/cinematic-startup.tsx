import { motion } from 'framer-motion';
import gsap from 'gsap';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useStartupAudio } from '../../../hooks/use-startup-audio';

const StartupScene = lazy(async () => {
  const module = await import('../../../shared/scene/landing-scene');
  return { default: module.LandingScene };
});

interface CinematicStartupProps {
  readonly isExiting: boolean;
  readonly onEnterHub: () => void;
}

export function CinematicStartup({ isExiting, onEnterHub }: CinematicStartupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const { playStartupSound, playClickSound } = useStartupAudio();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    playStartupSound();
    const readyTimer = window.setTimeout(() => setIsReady(true), prefersReducedMotion ? 900 : 6800);

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setIsReady(true),
      });

      timeline
        .set('.cinematic-logo-mark', { opacity: 0, scale: 0.4, rotate: -18 })
        .set('.cinematic-title', { opacity: 0, y: 18 })
        .set('.cinematic-subtitle', { opacity: 0, y: 10 })
        .set('.cinematic-meta', { opacity: 0 })
        .to('.cinematic-logo-mark', { opacity: 1, scale: 1, rotate: 0, duration: 1.1 })
        .to('.cinematic-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.35')
        .to('.cinematic-subtitle', { opacity: 1, y: 0, duration: 0.7 }, '-=0.28')
        .to('.cinematic-meta', { opacity: 1, duration: 0.55 }, '-=0.14')
        .to({}, { duration: prefersReducedMotion ? 0.25 : 3.2 });

      return () => timeline.kill();
    }, root);

    return () => {
      window.clearTimeout(readyTimer);
      context.revert();
    };
  }, [playStartupSound]);

  const handleEnter = () => {
    if (!isReady || isExiting) return;
    playClickSound();
    onEnterHub();
  };

  return (
    <motion.main
      ref={rootRef}
      className="cinematic-startup"
      animate={
        isExiting
          ? { opacity: 0, scale: 1.08, filter: 'blur(18px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1] }}
      onClick={handleEnter}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleEnter();
      }}
      tabIndex={0}
      aria-label="Asteris 启动画面，点击任意位置进入游戏中心"
    >
      <Suspense fallback={null}>
        <StartupScene />
      </Suspense>
      <div className="cinematic-vignette" aria-hidden="true" />
      <div className="cinematic-content">
        <motion.div
          className="cinematic-logo-mark"
          animate={isExiting ? { scale: 2.8, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1] }}
        >
          A
        </motion.div>
        <p className="cinematic-kicker">系统启动 / 动漫游戏智能平台</p>
        <h1 className="cinematic-title">Asteris</h1>
        <p className="cinematic-subtitle">连接每一个世界，保持你的冒险清晰。</p>
        <p className="cinematic-meta">本地工作区 · 数据已同步</p>
      </div>
      <motion.button
        type="button"
        className="cinematic-enter"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isReady && !isExiting ? 1 : 0.12, y: isReady ? 0 : 8 }}
        transition={{ duration: 0.6 }}
        onClick={(event) => {
          event.stopPropagation();
          handleEnter();
        }}
      >
        <span className="cinematic-enter-line" aria-hidden="true" />
        <span>{isReady ? '点击任意位置进入' : '正在建立连接...'}</span>
        <span className="cinematic-enter-line" aria-hidden="true" />
      </motion.button>
      <span className="cinematic-corner cinematic-corner-top">ASTERIS / 001</span>
      <span className="cinematic-corner cinematic-corner-bottom">本地桌面 · 2026</span>
    </motion.main>
  );
}
