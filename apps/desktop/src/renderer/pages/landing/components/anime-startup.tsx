import { motion as themeMotion } from '@game-guide-hub/theme';
import { motion, useReducedMotion, type MotionStyle, type Variants } from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import bgCity from '../../../assets/startup/bg-city.jpg';
import bgFantasy from '../../../assets/startup/bg-fantasy.jpg';
import bgGalaxy from '../../../assets/startup/bg-galaxy.jpg';
import bgLoop from '../../../assets/startup/bg-loop.mp4';

/*
 * 二次元随机语录开屏 —— 每次进入随机抽取背景（图片/视频）与标语
 *
 * 视觉编排：
 *   1. 背景：随机媒体（Ken Burns 缓推 + 指针视差 + 暗角/噪点罩层）
 *   2. 竖排日文侧注（逐字浮现）
 *   3. 中央大字：三层文字合成
 *      · ghost 描边层（错位拖影，延迟错峰入场）
 *      · main 渐变主体（逐字 3D 翻入 + 模糊显影 + 主题色辉光）
 *      · shine 流光层（逐字接力扫过，无限循环）
 *   4. kicker / 分隔线 / 日文副标 / 英文副标（字距展开）
 *   5. 星芒 ✦ 装饰（弹性弹出 + 呼吸闪烁）
 */

interface StartupPhrase {
  readonly text: string;
  readonly jp: string;
  readonly en: string;
  readonly theme: {
    readonly accent: string;
    readonly from: string;
    readonly via: string;
    readonly to: string;
  };
}

interface StartupBackground {
  readonly type: 'image' | 'video';
  readonly src: string;
  readonly label: string;
}

const PHRASES: readonly StartupPhrase[] = [
  {
    text: '二次元拯救世界',
    jp: 'アニメは世界を救う',
    en: 'ANIME SAVES THE WORLD',
    theme: { accent: '#8fd0ff', from: '#f2fbff', via: '#9db8ff', to: '#c88aff' },
  },
  {
    text: '此生无悔入二次元',
    jp: 'この人生に悔いは無い',
    en: 'NO REGRETS · ONLY 2D',
    theme: { accent: '#ffc07a', from: '#fff7ea', via: '#ffb86b', to: '#ff8fb0' },
  },
  {
    text: '老婆们 我回来了',
    jp: 'ただいま、みんな',
    en: 'HONEY, I AM HOME',
    theme: { accent: '#ff9fd0', from: '#ffeef7', via: '#ff9fd0', to: '#a88aff' },
  },
  {
    text: '星海为幕 幻想为翼',
    jp: '星の海、幻想の翼',
    en: 'SAIL THE SEA OF STARS',
    theme: { accent: '#9fe8ff', from: '#f0fdff', via: '#8fd0ff', to: '#8f9dff' },
  },
];

const BACKGROUNDS: readonly StartupBackground[] = [
  { type: 'image', src: bgGalaxy, label: '星海银河' },
  { type: 'image', src: bgCity, label: '霓虹都市' },
  { type: 'image', src: bgFantasy, label: '幻想浮岛' },
  { type: 'video', src: bgLoop, label: '星云流动' },
];

/** 星芒装饰：位置 / 延迟 / 尺寸 */
const SPARKS: readonly { x: string; y: string; delay: number; scale: number }[] = [
  { x: '16%', y: '30%', delay: 1.7, scale: 1.0 },
  { x: '84%', y: '25%', delay: 1.95, scale: 0.75 },
  { x: '73%', y: '60%', delay: 2.2, scale: 1.2 },
  { x: '11%', y: '63%', delay: 2.45, scale: 0.65 },
  { x: '51%', y: '20%', delay: 2.7, scale: 0.9 },
  { x: '28%', y: '74%', delay: 2.95, scale: 0.8 },
];

function pickRandom<T>(pool: readonly T[]): T {
  return pool[Math.floor(Math.random() * pool.length)] as T;
}

interface AnimeStartupProps {
  readonly isExiting: boolean;
  readonly onEnterHub: () => void;
}

export function AnimeStartup({ isExiting, onEnterHub }: AnimeStartupProps) {
  const rootRef = useRef<HTMLElement>(null);
  // 每次挂载（每次进入开屏）随机抽取
  const [phrase] = useState(() => pickRandom(PHRASES));
  const [background] = useState(() => pickRandom(BACKGROUNDS));
  const reduced = useReducedMotion();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), reduced ? 100 : 1500);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const chars = Array.from(phrase.text);
  const jpChars = Array.from(phrase.jp);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const root = rootRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const nx = ((event.clientX - box.left) / Math.max(box.width, 1) - 0.5) * 2;
    const ny = -((event.clientY - box.top) / Math.max(box.height, 1) - 0.5) * 2;
    root.style.setProperty('--su-px', nx.toFixed(3));
    root.style.setProperty('--su-py', ny.toFixed(3));
  };

  const handleEnter = () => {
    if (!isReady || isExiting) return;
    onEnterHub();
  };

  const themeVars = {
    '--su-accent': phrase.theme.accent,
    '--su-from': phrase.theme.from,
    '--su-via': phrase.theme.via,
    '--su-to': phrase.theme.to,
  } as MotionStyle;

  // 逐字入场：ghost 层与主体层共用节奏，ghost 额外滞后形成拖影
  const ghostVariants: Variants = {
    hidden: { opacity: 0, y: '0.4em', filter: 'blur(8px)' },
    show: (i: number) => ({
      opacity: reduced ? 0.4 : 0.5,
      y: 0,
      filter: 'blur(0px)',
      transition: reduced
        ? { duration: 0.01 }
        : { delay: 0.66 + i * 0.085, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const charVariants: Variants = {
    hidden: { opacity: 0, y: '0.6em', rotateX: -95, filter: 'blur(12px)' },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: reduced
        ? { duration: 0.01 }
        : { delay: 0.5 + i * 0.085, duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const jpVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0.01 }
        : { delay: 1.0 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <motion.main
      ref={rootRef}
      className="anime-startup"
      style={themeVars}
      animate={
        isExiting
          ? { opacity: 0, scale: 1.06, filter: 'blur(20px)' }
          : { opacity: 1, scale: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: themeMotion.durationSeconds.cinematic, ease: [0.76, 0, 0.24, 1] }}
      onClick={handleEnter}
      onPointerMove={handlePointerMove}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleEnter();
      }}
      tabIndex={0}
      aria-label={`Asteris 启动画面 · ${phrase.text}，点击进入游戏中心`}
    >
      {/* ===== 背景媒体层 ===== */}
      <div className="su-bg" aria-hidden="true">
        <div className="su-bg-parallax">
          <motion.div
            className="su-bg-kenburns"
            {...(reduced
              ? {}
              : {
                  initial: { scale: 1.16, x: '-1.6%', y: '1%' },
                  animate: { scale: 1.05, x: '1.6%', y: '-1%' },
                  transition: {
                    duration: 34,
                    repeat: Infinity,
                    repeatType: 'mirror' as const,
                    ease: 'easeInOut',
                  },
                })}
          >
            {background.type === 'video' ? (
              <video className="su-media" src={background.src} autoPlay muted loop playsInline />
            ) : (
              <img className="su-media" src={background.src} alt="" draggable={false} />
            )}
          </motion.div>
        </div>
        <div className="su-scrim" />
        <div className="su-vignette" />
        <div className="su-grain" />
      </div>

      {/* ===== 顶部栏 ===== */}
      <header className="su-topbar">
        <div className="su-brand">
          <span className="su-brand-mark" aria-hidden="true">✦</span>
          <span className="su-brand-name">ASTERIS</span>
          <i className="su-brand-sep" aria-hidden="true" />
          <span className="su-brand-sub">二次元收藏夹</span>
        </div>
        <div className="su-tick" aria-hidden="true">
          {background.type === 'video' ? 'LIVE' : 'STILL'}
          <span>·</span>
          {background.label}
        </div>
      </header>

      {/* ===== 竖排日文侧注 ===== */}
      <motion.aside
        className="su-vertical"
        initial="hidden"
        animate="show"
        aria-hidden="true"
      >
        <span className="su-vertical-cap">✦</span>
        {jpChars.map((ch, i) => (
          <motion.span key={`jp-${ch}-${i}`} custom={i} variants={jpVariants}>
            {ch}
          </motion.span>
        ))}
        <span className="su-vertical-cap">✦</span>
      </motion.aside>

      {/* ===== 中央舞台 ===== */}
      <div className="su-stage">
        <motion.p
          className="su-kicker"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <i aria-hidden="true" />
          <span>OPENING · 序章</span>
          <i aria-hidden="true" />
        </motion.p>

        {/* 三层合成大字 */}
        <div className="su-title-wrap">
          <motion.h1
            className="su-title"
            initial="hidden"
            animate="show"
            aria-label={phrase.text}
          >
            <span className="su-title-ghost" aria-hidden="true">
              {chars.map((ch, i) => (
                <motion.span
                  key={`ghost-${ch}-${i}`}
                  className="su-char"
                  custom={i}
                  variants={ghostVariants}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </span>
            <span className="su-title-main">
              {chars.map((ch, i) => (
                <motion.span
                  key={`main-${ch}-${i}`}
                  className="su-char su-char-main"
                  custom={i}
                  variants={charVariants}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </span>
            <span className="su-title-shine" aria-hidden="true">
              {chars.map((ch, i) => (
                <span
                  key={`shine-${ch}-${i}`}
                  className="su-char su-char-shine"
                  style={{ '--i': i } as CSSProperties}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          </motion.h1>
        </div>

        <motion.span
          className="su-titleline"
          aria-hidden="true"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'min(56vmin, 30rem)', opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.p
          className="su-jp"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {phrase.jp}
        </motion.p>

        <motion.p
          className="su-en"
          initial={{ opacity: 0, letterSpacing: '0.9em' }}
          animate={{ opacity: 1, letterSpacing: '0.42em' }}
          transition={{ duration: 1.1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {phrase.en}
        </motion.p>
      </div>

      {/* ===== 星芒装饰 ===== */}
      <div className="su-sparks" aria-hidden="true">
        {SPARKS.map((spark, i) => (
          <motion.span
            key={`spark-${i}`}
            className="su-spark"
            style={{ left: spark.x, top: spark.y, fontSize: `${spark.scale}rem` }}
            initial={{ opacity: 0, scale: 0, rotate: -120 }}
            animate={
              reduced
                ? { opacity: 0.7, scale: 1, rotate: 0 }
                : { opacity: [0, 0.9, 0.35, 0.75], scale: [0, 1.25, 1, 1.1], rotate: 0 }
            }
            transition={
              reduced
                ? { duration: 0.3, delay: 0.2 }
                : {
                    duration: 4.2,
                    delay: spark.delay,
                    repeat: Infinity,
                    repeatDelay: 1.8,
                    times: [0, 0.12, 0.6, 1],
                    ease: 'easeInOut',
                  }
            }
          >
            ✦
          </motion.span>
        ))}
      </div>

      {/* ===== 进入按钮 ===== */}
      <motion.button
        type="button"
        className="su-enter"
        initial={{ opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: isReady && !isExiting ? 1 : 0, y: isReady ? 0 : 12, scale: 1 }}
        transition={{ duration: 0.7, delay: isReady ? 0.15 : 0, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => {
          event.stopPropagation();
          handleEnter();
        }}
      >
        <span className="su-enter-glow" aria-hidden="true" />
        <span className="su-enter-text">点击进入</span>
        <span className="su-enter-arrow" aria-hidden="true">→</span>
      </motion.button>

      {/* ===== 底部栏 ===== */}
      <footer className="su-footer">
        <span className="su-footer-index">NO.{String(PHRASES.indexOf(phrase) + 1).padStart(2, '0')}</span>
        <span className="su-footer-hints">
          <i aria-hidden="true" />每次进入 · 随机语录
          <i aria-hidden="true" />移动 · 视差
          <i aria-hidden="true" />点击 · 启程
        </span>
        <span className="su-footer-coords">LOCAL DESKTOP · 2026</span>
      </footer>
    </motion.main>
  );
}
