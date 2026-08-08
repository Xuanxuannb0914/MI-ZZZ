import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartup } from '../../hooks/use-startup';
import type { GameDefinition } from '../../shared/mock/games';
import { GameHub } from './components/game-hub';
import { TransitionLayer } from './components/transition-layer';
import { useLanding } from './hooks/use-landing';

export default function GameHubPage() {
  const navigate = useNavigate();
  const { completeStartup } = useStartup();
  const selectedGameRef = useRef<GameDefinition | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const completeSelection = useCallback(() => {
    const game = selectedGameRef.current;
    if (!game) return;
    completeStartup();
    navigate(game.route, { replace: true });
  }, [completeStartup, navigate]);

  const { enter, isEntering } = useLanding(completeSelection);

  const handleGameSelect = useCallback(
    (game: GameDefinition) => {
      if (game.status !== 'available' || isEntering || isExiting) return;
      selectedGameRef.current = game;
      setIsExiting(true);
      enter();
    },
    [enter, isEntering, isExiting],
  );

  return (
    <div className="landing-act-root">
      <GameHub isExiting={isExiting} onGameSelect={handleGameSelect} />
      <TransitionLayer isActive={isEntering} />
    </div>
  );
}
