// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('navigates the available game to its workspace', async () => {
    renderGameHub('/games?game=zzz');

    fireEvent.click(screen.getByRole('button', { name: '进入绝区零' }));

    // 开场动画播放约 2.6s 后自动进入对应工作区
    await waitFor(
      () => expect(screen.getByText('绝区零工作区')).toBeTruthy(),
      { timeout: 4000 },
    );
  });

  it('keeps coming-soon games in the hub while playing its intro', async () => {
    renderGameHub('/games?game=genshin');

    fireEvent.click(screen.getByRole('button', { name: '进入原神' }));

    // 演示模式：进入「敬请期待」游戏先播放开场动画，页面仍停留在游戏中心
    expect(await screen.findByRole('dialog', { name: '原神开场动画' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '进入原神' })).toBeTruthy();
  });
});
