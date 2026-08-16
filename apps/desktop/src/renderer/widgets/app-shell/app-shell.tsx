import { classNames } from '@game-guide-hub/utils';
import { type CSSProperties, type PropsWithChildren, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { games } from '../../shared/mock/games';
import { SkipLink } from '../../shared/ui/skip-link';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

/** 路由首段 → 游戏字体栈，未匹配的游戏（如设置页）回退默认 UI 字体。 */
const gameFontByRoute = new Map<string, string>(
  games.map((game) => [game.route.slice(1), game.fontFamily]),
);

export function AppShell({ children }: PropsWithChildren) {
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const themeMode = useAppStore((state) => state.themeMode);
  const performanceMode = useAppStore((state) => state.performanceMode);
  const animationEnabled = useAppStore((state) => state.animationEnabled);
  const location = useLocation();

  const gameFontStyle = useMemo<CSSProperties | undefined>(() => {
    const gameKey = location.pathname.split('/')[1] ?? '';
    const fontFamily = gameFontByRoute.get(gameKey);
    return fontFamily ? ({ '--game-font': fontFamily } as CSSProperties) : undefined;
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('theme-light', themeMode === 'light');
    root.classList.toggle('motion-disabled', !animationEnabled);
    root.classList.toggle('performance-balanced', performanceMode === 'balanced');
  }, [animationEnabled, performanceMode, themeMode]);

  return (
    <div
      className={classNames(
        'app-shell min-h-screen bg-canvas text-text-primary',
        isSidebarCollapsed && 'is-sidebar-collapsed',
      )}
    >
      <SkipLink />
      <Sidebar />
      <div className="app-shell-main min-w-0">
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          style={gameFontStyle}
          className="min-h-[calc(100vh-var(--spacing-app-header))] min-w-0 overflow-x-hidden"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
