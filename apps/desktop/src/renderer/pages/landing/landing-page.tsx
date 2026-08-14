import { motion as themeMotion } from '@game-guide-hub/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicStartup } from './components/cinematic-startup';

export default function LandingPage() {
  const navigate = useNavigate();
  const transitionTimerRef = useRef<number | undefined>(undefined);
  const [isCinematicExiting, setIsCinematicExiting] = useState(false);

  useEffect(
    () => () => {
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    },
    [],
  );

  const handleEnterHub = useCallback(() => {
    if (isCinematicExiting) return;
    setIsCinematicExiting(true);
    transitionTimerRef.current = window.setTimeout(
      () => navigate('/games', { replace: true }),
      themeMotion.durationSeconds.cinematic * 1000,
    );
  }, [isCinematicExiting, navigate]);

  return (
    <div className="landing-act-root">
      <CinematicStartup isExiting={isCinematicExiting} onEnterHub={handleEnterHub} />
    </div>
  );
}
