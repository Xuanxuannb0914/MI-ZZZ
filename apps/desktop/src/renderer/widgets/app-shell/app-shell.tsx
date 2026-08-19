import { classNames } from '@game-guide-hub/utils';
import { type CSSProperties, type PropsWithChildren, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { games } from '../../shared/mock/games';
import { SkipLink } from '../../shared/ui/skip-link';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

/** 路由首段 → 游戏元信息（字体 / 主题 / 色彩），未匹配（如设置页）回退默认 UI。 */
const gameByRoute = new Map(games.map((game) => [game.route.slice(1), game]));

export function AppShell({ children }: PropsWithChildren) {
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const themeMode = useAppStore((state) => state.themeMode);
  const performanceMode = useAppStore((state) => state.performanceMode);
  const animationEnabled = useAppStore((state) => state.animationEnabled);
  const location = useLocation();

  const gameKey = location.pathname.split('/')[1] ?? '';
  const game = gameByRoute.get(gameKey);

  const gameStyle = useMemo<CSSProperties | undefined>(() => {
    if (!game) return undefined;
    return {
      '--game-font': game.fontFamily,
      '--game-primary': game.accentColor,
      '--game-secondary': game.secondaryColor,
      '--game-glow': game.glowColor,
    } as CSSProperties;
  }, [game]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('theme-light', themeMode === 'light');
    root.classList.toggle('motion-disabled', !animationEnabled);
    root.classList.toggle('performance-balanced', performanceMode === 'balanced');
    // 依据当前路由应用对应游戏的风格模式（data-game-theme 选择器驱动主题覆盖）
    if (gameKey) root.dataset.gameTheme = gameKey;
    else delete root.dataset.gameTheme;
  }, [animationEnabled, gameKey, performanceMode, themeMode]);

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
          style={gameStyle}
          className="min-h-[calc(100vh-var(--spacing-app-header))] min-w-0 overflow-x-hidden"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
