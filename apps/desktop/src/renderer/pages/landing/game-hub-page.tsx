import { useCallback, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStartup } from '../../hooks/use-startup';
import { type GameDefinition, games } from '../../shared/mock/games';
import { GameHub } from './components/game-hub';
import { TransitionLayer } from './components/transition-layer';
import { useLanding } from './hooks/use-landing';

export default function GameHubPage() {
  const navigate = useNavigate();
  const { completeStartup } = useStartup();
  const selectedGameRef = useRef<GameDefinition | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [params, setParams] = useSearchParams();
  const defaultGame = games[0];
  if (!defaultGame) throw new Error('游戏配置不能为空。');
  const selectedGame = games.find((game) => game.id === params.get('game')) ?? defaultGame;

  const completeSelection = useCallback(() => {
    const game = selectedGameRef.current;
    if (!game) return;
    completeStartup();
    navigate(game.route);
  }, [completeStartup, navigate]);

  const { enter, isEntering } = useLanding(completeSelection);

  const handleGameSelect = useCallback(
    (game: GameDefinition) => setParams({ game: game.id }, { replace: true }),
    [setParams],
  );
  const handleEnter = useCallback(() => {
    if (selectedGame.status !== 'available' || isEntering || isExiting) return;
    selectedGameRef.current = selectedGame;
    setIsExiting(true);
    enter();
  }, [enter, isEntering, isExiting, selectedGame]);

  return (
    <div className="landing-act-root">
      <GameHub
        isExiting={isExiting}
        selectedGame={selectedGame}
        onGameSelect={handleGameSelect}
        onEnter={handleEnter}
      />
      <TransitionLayer isActive={isEntering} />
    </div>
  );
}
