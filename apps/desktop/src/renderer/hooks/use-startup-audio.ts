import { useCallback } from 'react';

interface StartupAudioOptions {
  readonly enabled?: boolean;
}

/** Audio extension point. Kept silent until licensed sound assets are available. */
export function useStartupAudio({ enabled = false }: StartupAudioOptions = {}) {
  const playBackgroundMusic = useCallback(() => {
    if (!enabled) return;
  }, [enabled]);
  const playClickSound = useCallback(() => {
    if (!enabled) return;
  }, [enabled]);
  const playHoverSound = useCallback(() => {
    if (!enabled) return;
  }, [enabled]);
  const playStartupSound = useCallback(() => {
    if (!enabled) return;
  }, [enabled]);

  return { playBackgroundMusic, playClickSound, playHoverSound, playStartupSound };
}
