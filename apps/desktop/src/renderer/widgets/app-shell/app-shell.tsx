import { classNames } from '@game-guide-hub/utils';
import { type PropsWithChildren, useEffect } from 'react';
import { useAppStore } from '../../app/stores/app-store';
import { SkipLink } from '../../shared/ui/skip-link';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

export function AppShell({ children }: PropsWithChildren) {
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const themeMode = useAppStore((state) => state.themeMode);
  const performanceMode = useAppStore((state) => state.performanceMode);
  const animationEnabled = useAppStore((state) => state.animationEnabled);

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
          className="min-h-[calc(100vh-var(--spacing-app-header))] min-w-0 overflow-x-hidden"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
