import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface DemoCard {
  readonly code: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly to: string;
  readonly theme: string;
}

const DEMO_CARDS: readonly DemoCard[] = [
  {
    code: 'A',
    title: '沉浸式世界画廊',
    tagline: '页面即世界',
    description: '游戏占满全屏成为活背景，底部悬浮光带切换世界，电影级 crossfade + 视差转场。',
    to: '/demos/world-gallery',
    theme: '--demo-a-primary',
  },
  {
    code: 'B',
    title: '全息指挥舱',
    tagline: '深空 HUD 仪表盘',
    description: '游戏化作环绕星体，轨道线、数据流环绕，拖拽旋转视角，实时读数面板。',
    to: '/demos/holographic-hud',
    theme: '--demo-b-primary',
  },
  {
    code: 'C',
    title: '分形万花筒',
    tagline: '生成式艺术背景',
    description: '专属配色与几何语言，游戏切换时像万花筒般绽放变形，画面有机散落。',
    to: '/demos/kaleidoscope',
    theme: '--demo-c-primary',
  },
];

export default function DemosHubPage() {
  return (
    <div className="demos-hub">
      <header className="demos-hub-header">
        <p className="demos-hub-kicker">ASTERIS · DESIGN DIRECTIONS</p>
        <h1>游戏展示界面 · 三向探索</h1>
        <p className="demos-hub-sub">
          三个完全不同的视觉方向，点击进入真实可交互原型，感受后决定主界面方向。
        </p>
      </header>

      <main className="demos-hub-grid">
        {DEMO_CARDS.map((card, index) => (
          <motion.div
            key={card.code}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link className="demos-hub-card" to={card.to} style={{ '--card-accent': card.theme } as React.CSSProperties}>
              <span className="demos-hub-card-code" aria-hidden="true">
                {card.code}
              </span>
              <span className="demos-hub-card-arrow" aria-hidden="true">
                →
              </span>
              <h2>{card.title}</h2>
              <p className="demos-hub-card-tagline">{card.tagline}</p>
              <p className="demos-hub-card-desc">{card.description}</p>
              <span className="demos-hub-card-enter">进入原型</span>
            </Link>
          </motion.div>
        ))}
      </main>

      <footer className="demos-hub-footer">
        <span>选择你认可的方向后，我会以它为骨架重构游戏中心。</span>
      </footer>
    </div>
  );
}