import { PanelLeftClose, PanelLeftOpen } from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { games } from '../../shared/mock/games';
import { sidebarNavigationEntries } from './sidebar-navigation';

/** 路由首段 → 游戏名，未匹配时回退「绝区零」。 */
const gameNameByRoute = new Map(games.map((game) => [game.route.slice(1), game.name]));

export function Sidebar() {
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebarCollapsed = useAppStore((state) => state.toggleSidebarCollapsed);
  const location = useLocation();
  const gameKey = location.pathname.split('/')[1] ?? '';
  const gameName = gameNameByRoute.get(gameKey) ?? '绝区零';

  return (
    <aside
      aria-label="主导航"
      className={classNames(
        'ggh-glass glass-strong app-sidebar desktop-sidebar fixed inset-y-0 left-0 z-dialog flex flex-col',
        isSidebarCollapsed && 'is-collapsed',
      )}
    >
      <div className="desktop-sidebar-brand">
        <span className="desktop-sidebar-logo">A</span>
        <span className="desktop-sidebar-brand-copy">
          <strong>Asteris</strong>
          <small>{gameName}工作区</small>
        </span>
        <button
          type="button"
          className="desktop-sidebar-collapse"
          onClick={toggleSidebarCollapsed}
          aria-label={isSidebarCollapsed ? '展开侧栏' : '折叠侧栏'}
          title={isSidebarCollapsed ? '展开侧栏' : '折叠侧栏'}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen aria-hidden="true" size={17} />
          ) : (
            <PanelLeftClose aria-hidden="true" size={17} />
          )}
        </button>
      </div>

      <nav className="desktop-sidebar-nav">
        {sidebarNavigationEntries.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end ?? false}
            aria-label={label}
            title={isSidebarCollapsed ? label : undefined}
            className={({ isActive }) => classNames('desktop-nav-entry', isActive && 'is-active')}
          >
            <Icon aria-hidden="true" size={18} />
            <span className="desktop-nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
