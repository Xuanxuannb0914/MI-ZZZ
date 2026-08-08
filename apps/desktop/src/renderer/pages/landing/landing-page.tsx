import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartup } from '../../hooks/use-startup';
import type { GameDefinition } from '../../shared/mock/games';
import { CinematicStartup } from './components/cinematic-startup';
import { GameHub } from './components/game-hub';
import { TransitionLayer } from './components/transition-layer';
import { useLanding } from './hooks/use-landing';

type LandingAct = 'cinematic' | 'hub';

export default function LandingPage() {
  const navigate = useNavigate();
  const { completeStartup } = useStartup();
  const selectedGameRef = useRef<GameDefinition | null>(null);
  const hubTimerRef = useRef<number | undefined>(undefined);
  const [act, setAct] = useState<LandingAct>('cinematic');
  const [isHubExiting, setIsHubExiting] = useState(false);
  const [isCinematicExiting, setIsCinematicExiting] = useState(false);

  const completeLanding = useCallback(() => {
    const game = selectedGameRef.current;
    if (!game) return;
    completeStartup();
    navigate(game.route, { replace: true });
  }, [completeStartup, navigate]);

  const { enter, isEntering } = useLanding(completeLanding);

  useEffect(() => {
    return () => {
      if (hubTimerRef.current) window.clearTimeout(hubTimerRef.current);
    };
  }, []);

  const handleEnterHub = () => {
    if (isCinematicExiting || act !== 'cinematic') return;
    setIsCinematicExiting(true);
    hubTimerRef.current = window.setTimeout(() => {
      setAct('hub');
      setIsCinematicExiting(false);
    }, 680);
  };

  const handleGameSelect = (game: GameDefinition) => {
    if (isEntering || isHubExiting) return;
    selectedGameRef.current = game;
    setIsHubExiting(true);
    enter();
  };

  return (
    <div className="landing-act-root">
      {act === 'cinematic' ? (
        <CinematicStartup isExiting={isCinematicExiting} onEnterHub={handleEnterHub} />
      ) : (
        <GameHub isExiting={isHubExiting} onGameSelect={handleGameSelect} />
      )}
      {act === 'hub' ? <TransitionLayer isActive={isEntering} /> : null}
    </div>
  );
}
