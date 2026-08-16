import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameDefinition } from '../../../shared/mock/games';

interface GameIntroOverlayProps {
  /** 当前要播放开场动画的游戏；null 表示不显示。 */
  readonly game: GameDefinition | null;
  /** 动画播放完毕或用户点击跳过后回调。 */
  readonly onDone: () => void;
}

const INTRO_MS = 2600;

interface StarSpec {
  readonly left: string;
  readonly top: string;
  readonly delay: number;
  readonly size: number;
}

const STAR_FIELD: readonly StarSpec[] = [
  { left: '10%', top: '20%', delay: 0.1, size: 2 },
  { left: '22%', top: '12%', delay: 0.7, size: 2 },
  { left: '34%', top: '26%', delay: 1.3, size: 3 },
  { left: '47%', top: '9%', delay: 0.4, size: 2 },
  { left: '60%', top: '18%', delay: 1.8, size: 2 },
  { left: '72%', top: '11%', delay: 0.9, size: 3 },
  { left: '85%', top: '22%', delay: 1.5, size: 2 },
  { left: '90%', top: '40%', delay: 0.2, size: 2 },
  { left: '8%', top: '55%', delay: 1.1, size: 2 },
  { left: '18%', top: '70%', delay: 0.6, size: 2 },
  { left: '30%', top: '60%', delay: 1.6, size: 3 },
  { left: '44%', top: '74%', delay: 0.3, size: 2 },
  { left: '57%', top: '64%', delay: 1.2, size: 2 },
  { left: '70%', top: '76%', delay: 0.8, size: 2 },
  { left: '82%', top: '62%', delay: 1.7, size: 3 },
  { left: '94%', top: '72%', delay: 0.5, size: 2 },
  { left: '52%', top: '30%', delay: 2.0, size: 2 },
  { left: '66%', top: '34%', delay: 1.4, size: 2 },
];

function Stars({ withMotion = false }: { readonly withMotion?: boolean }) {
  return (
    <div className={`gi-stars${withMotion ? ' gi-stars--motion' : ''}`}>
      {STAR_FIELD.map((star, index) => (
        <span
          key={index}
          className="gi-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** 全屏官方美术背景，带缓慢缩放（Ken Burns）运动。 */
function Backdrop({ src }: { readonly src: string }) {
  return (
    <>
      <div className="gi-backdrop" style={{ backgroundImage: `url(${src})` }} aria-hidden="true" />
      <div className="gi-veil" aria-hidden="true" />
    </>
  );
}

/** 原神：官方天空岛登录视频 + 光影开门（视频失败或低动效时回退静态登录图） */
function GenshinScene() {
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const matchMedia = (
      window as unknown as { matchMedia?: (query: string) => MediaQueryList }
    ).matchMedia?.bind(window);
    if (!matchMedia) return;
    const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const onChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  const useVideo = !videoFailed && !reducedMotion;

  return (
    <div className="gi-scene gi-scene--genshin" aria-hidden="true">
      {useVideo ? (
        <>
          <video
            className="gi-backdrop gi-backdrop--video"
            src="/assets/games/genshin-opening.mp4"
            poster="/assets/games/genshin-celestia.png"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
          />
          <div className="gi-veil" aria-hidden="true" />
        </>
      ) : (
        <Backdrop src="/assets/games/genshin-celestia.png" />
      )}
      <div className="gi-gate-light" />
      <div className="gi-clouds" />
    </div>
  );
}

/** 崩坏：星穹铁道 — 官方封面 + 星穹列车图标驶入银河 */
function StarRailScene() {
  return (
    <div className="gi-scene gi-scene--starrail" aria-hidden="true">
      <Backdrop src="/assets/games/starrail-cover.png" />
      <Stars withMotion />
      <div className="gi-track" />
      <div className="gi-logo gi-logo--starrail">
        <img className="gi-logo__img" src="/assets/games/starrail-icon.png" alt="" />
      </div>
      <div className="gi-speed-lines">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

/** 绝区零：官方封面 + 复古霓虹信号与标志聚光 */
function ZzzScene() {
  return (
    <div className="gi-scene gi-scene--zzz" aria-hidden="true">
      <Backdrop src="/assets/games/zzz-cover.png" />
      <span className="gi-tv-corner gi-tv-corner--tl" />
      <span className="gi-tv-corner gi-tv-corner--tr" />
      <span className="gi-tv-corner gi-tv-corner--bl" />
      <span className="gi-tv-corner gi-tv-corner--br" />
      <div className="gi-logo gi-logo--zzz">
        <img className="gi-logo__img" src="/assets/games/zzz-icon.png" alt="" />
      </div>
      <div className="gi-scan" />
      <div className="gi-noise" />
    </div>
  );
}

/** 鸣潮：官方封面 + 声骸共鸣徽记聚光 */
function WuwaScene() {
  return (
    <div className="gi-scene gi-scene--wuwa" aria-hidden="true">
      <Backdrop src="/assets/games/wuwa-calcharo.png" />
      <div className="gi-ripples">
        <span />
        <span />
        <span />
      </div>
      <div className="gi-emblem">
        <img className="gi-emblem__img" src="/assets/games/wuwa-jiyan.png" alt="" />
      </div>
      <div className="gi-core" />
    </div>
  );
}

function GameIntroScene({ game }: { readonly game: GameDefinition }) {
  switch (game.id) {
    case 'genshin':
      return <GenshinScene />;
    case 'starrail':
      return <StarRailScene />;
    case 'zzz':
      return <ZzzScene />;
    case 'wuwa':
      return <WuwaScene />;
  }
}

export function GameIntroOverlay({ game, onDone }: GameIntroOverlayProps) {
  const doneRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (!game) return;
    doneRef.current = false;
    const matchMedia = (
      window as unknown as { matchMedia?: (query: string) => MediaQueryList }
    ).matchMedia?.bind(window);
    const reduced = matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    timerRef.current = window.setTimeout(finish, reduced ? 700 : INTRO_MS);
    return () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    };
  }, [game, finish]);

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          key={game.id}
          className={`game-intro game-intro--${game.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={`${game.name}开场动画`}
        >
          <GameIntroScene game={game} />
          <span className="game-intro__flash" aria-hidden="true" />
          <div className="game-intro__caption">
            <span className="game-intro__kicker">进入 {game.name}</span>
            <strong className="game-intro__title">{game.shortName}</strong>
            <p className="game-intro__hint">动画结束自动进入</p>
          </div>
          <button type="button" className="game-intro__skip" onClick={finish}>
            跳过
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
