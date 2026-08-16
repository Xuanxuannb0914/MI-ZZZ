// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StartupProvider } from '../../hooks/use-startup';
import GameHubPage from './game-hub-page';

interface GameHubStubProps {
  readonly selectedGame: { readonly id: string; readonly name: string };
  readonly onEnter: () => void;
}

vi.mock('./components/game-hub', () => ({
  GameHub: ({ selectedGame, onEnter }: GameHubStubProps) => (
    <button type="button" onClick={onEnter}>
      进入{selectedGame.name}
    </button>
  ),
}));

vi.mock('./components/transition-layer', () => ({
  TransitionLayer: () => null,
}));

vi.mock('./hooks/use-landing', () => ({
  useLanding: (onComplete: () => void) => ({ enter: onComplete, isEntering: false }),
}));

function renderGameHub(initialEntry: string) {
  return render(
    <StartupProvider>
      <MemoryRouter
        initialEntries={[initialEntry]}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <Routes>
          <Route path="/games" element={<GameHubPage />} />
          <Route path="/zzz" element={<p>绝区零工作区</p>} />
        </Routes>
      </MemoryRouter>
    </StartupProvider>,
  );
}

describe('GameHubPage', () => {
  afterEach(cleanup);

  it('navigates the available game to its workspace', () => {
    renderGameHub('/games?game=zzz');

    fireEvent.click(screen.getByRole('button', { name: '进入绝区零' }));

    expect(screen.getByText('绝区零工作区')).toBeTruthy();
  });

  it('keeps coming-soon games in the hub', () => {
    renderGameHub('/games?game=genshin');

    fireEvent.click(screen.getByRole('button', { name: '进入原神' }));

    expect(screen.getByRole('button', { name: '进入原神' })).toBeTruthy();
  });
});
