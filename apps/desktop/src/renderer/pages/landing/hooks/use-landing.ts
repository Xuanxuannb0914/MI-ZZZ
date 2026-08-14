import { motion as themeMotion } from '@game-guide-hub/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStartupAudio } from '../../../hooks/use-startup-audio';

export function useLanding(onComplete: () => void) {
  const [isEntering, setIsEntering] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const hasStartedRef = useRef(false);
  const { playClickSound } = useStartupAudio();

  const enter = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    playClickSound();
    setIsEntering(true);
    timeoutRef.current = window.setTimeout(
      onComplete,
      themeMotion.durationSeconds.cinematic * 1000,
    );
  }, [onComplete, playClickSound]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, []);

  return { enter, isEntering };
}
