// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { games } from '../../../shared/mock/games';
import { GameOptionWheel } from './game-option-wheel';

describe('GameOptionWheel', () => {
  afterEach(cleanup);

  it('starts on 绝区零 and renders only configured game names', () => {
    render(
      <GameOptionWheel games={games} selectedIndex={0} onSelect={vi.fn()} onEnter={vi.fn()} />,
    );

    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(screen.getByRole('option', { name: '绝区零' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(screen.queryByText('Ambient')).toBeNull();
  });

  it('supports keyboard selection and keeps navigation outside the wheel callback', () => {
    const onSelect = vi.fn();
    const onEnter = vi.fn();
    render(
      <GameOptionWheel games={games} selectedIndex={0} onSelect={onSelect} onEnter={onEnter} />,
    );

    const wheel = screen.getByRole('listbox', { name: '选择游戏' });
    fireEvent.keyDown(wheel, { key: 'ArrowDown' });
    fireEvent.keyDown(wheel, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onEnter).toHaveBeenCalledOnce();
  });

  it('selects an option on click without entering it', () => {
    const onSelect = vi.fn();
    const onEnter = vi.fn();
    render(
      <GameOptionWheel games={games} selectedIndex={0} onSelect={onSelect} onEnter={onEnter} />,
    );

    fireEvent.click(screen.getByRole('option', { name: /原神/ }));

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('maps mouse wheel movement to selection without updating at a boundary', () => {
    const onSelect = vi.fn();
    const onEnter = vi.fn();
    render(
      <GameOptionWheel games={games} selectedIndex={0} onSelect={onSelect} onEnter={onEnter} />,
    );

    const wheel = screen.getByRole('listbox', { name: '选择游戏' });
    fireEvent.wheel(wheel, { deltaY: -80 });

    expect(onSelect).not.toHaveBeenCalled();
  });
});
