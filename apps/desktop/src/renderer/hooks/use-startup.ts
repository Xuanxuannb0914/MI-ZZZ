import {
  createContext,
  createElement,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type StartupPhase = 'startup' | 'landing-finished' | 'ready';
export type StartupScene = 'landing' | 'application';

interface StartupState {
  phase: StartupPhase;
  currentScene: StartupScene;
  landingFinished: boolean;
  applicationReady: boolean;
}

interface StartupContextValue extends StartupState {
  hasCompleted: boolean;
  markLandingFinished: () => void;
  markApplicationReady: () => void;
  completeStartup: () => void;
  markStartupComplete: () => void;
}

const initialState: StartupState = {
  phase: 'startup',
  currentScene: 'landing',
  landingFinished: false,
  applicationReady: false,
};

const StartupContext = createContext<StartupContextValue | null>(null);

export function StartupProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<StartupState>(initialState);

  const markLandingFinished = useCallback(() => {
    setState((current) =>
      current.landingFinished
        ? current
        : { ...current, phase: 'landing-finished', landingFinished: true },
    );
  }, []);

  const markApplicationReady = useCallback(() => {
    setState((current) =>
      current.applicationReady
        ? current
        : {
            ...current,
            phase: 'ready',
            currentScene: 'application',
            landingFinished: true,
            applicationReady: true,
          },
    );
  }, []);

  const completeStartup = useCallback(() => {
    setState((current) =>
      current.applicationReady
        ? current
        : {
            phase: 'ready',
            currentScene: 'application',
            landingFinished: true,
            applicationReady: true,
          },
    );
  }, []);

  const value = useMemo<StartupContextValue>(
    () => ({
      ...state,
      hasCompleted: state.applicationReady,
      markLandingFinished,
      markApplicationReady,
      completeStartup,
      markStartupComplete: completeStartup,
    }),
    [completeStartup, markApplicationReady, markLandingFinished, state],
  );

  return createElement(StartupContext.Provider, { value }, children);
}

/** Owns the startup scene lifecycle for one renderer launch. */
export function useStartup() {
  const context = useContext(StartupContext);
  if (!context) {
    throw new Error('useStartup must be used inside StartupProvider.');
  }
  return context;
}
