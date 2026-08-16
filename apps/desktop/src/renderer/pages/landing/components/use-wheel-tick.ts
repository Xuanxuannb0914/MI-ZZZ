import { useCallback, useEffect, useRef } from 'react';

/** A restrained, asset-free UI tick used until product audio assets are supplied. */
export function useWheelTick(volume = 0.18) {
  const contextRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    const AudioContextConstructor = (window as unknown as { AudioContext?: typeof AudioContext })
      .AudioContext;
    if (!AudioContextConstructor) return;
    const context = contextRef.current ?? new AudioContextConstructor();
    contextRef.current = context;
    void context.resume().catch(() => undefined);
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(680, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.035);
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.045);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.05);
  }, [volume]);

  useEffect(
    () => () => {
      void contextRef.current?.close().catch(() => undefined);
      contextRef.current = null;
    },
    [],
  );

  return play;
}
