import { ChevronLeft, Sparkles } from '@game-guide-hub/icons';
import { Button } from '@game-guide-hub/ui';
import { Link } from 'react-router-dom';
import { PageTransition } from '../../shared/ui/page-transition';

interface GamePlaceholderPageProps {
  readonly gameName: string;
  readonly gameShortName: string;
}

export default function GamePlaceholderPage({ gameName, gameShortName }: GamePlaceholderPageProps) {
  return (
    <PageTransition>
      <main className="game-placeholder-page">
        <div className="game-placeholder-glow" aria-hidden="true" />
        <section className="game-placeholder-panel" aria-labelledby="placeholder-title">
          <span className="game-placeholder-icon" aria-hidden="true">
            <Sparkles size={22} />
          </span>
          <p className="game-placeholder-kicker">{gameShortName}</p>
          <h1 id="placeholder-title">{gameName}档案正在建立</h1>
          <p>角色、攻略、活动与智能建议即将接入 Asteris。</p>
          <Link to="/zzz">
            <Button variant="secondary">
              <ChevronLeft aria-hidden="true" size={16} />
              返回绝区零
            </Button>
          </Link>
        </section>
      </main>
    </PageTransition>
  );
}
