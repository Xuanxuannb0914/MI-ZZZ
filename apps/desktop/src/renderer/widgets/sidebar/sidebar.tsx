import type { LucideIcon } from '@game-guide-hub/icons';
import {
  BookOpen,
  CalendarDays,
  Compass,
  Disc3,
  Heart,
  Home,
  PackageOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UserRound,
  UsersRound,
  Wrench,
} from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';

interface NavigationEntry {
  readonly label: string;
  readonly to: string;
  readonly icon: LucideIcon;
  readonly end?: boolean;
  readonly comingSoon?: boolean;
}

const navigationEntries: readonly NavigationEntry[] = [
  { label: '首页', to: '/zzz', icon: Home, end: true },
  { label: '攻略', to: '/zzz/guides', icon: BookOpen },
  { label: '角色', to: '/zzz/agents', icon: UsersRound },
  { label: '配队', to: '/zzz/teams', icon: UsersRound },
  { label: '音擎', to: '/zzz/w-engines', icon: Wrench },
  { label: '驱动盘', to: '/zzz/drive-discs', icon: Disc3 },
  { label: '活动', to: '/zzz/events', icon: Compass },
  { label: '养成', to: '/zzz/planner', icon: CalendarDays },
  { label: '材料', to: '/zzz/materials', icon: PackageOpen },
  { label: '收藏', to: '/zzz/favorites', icon: Heart },
  { label: '搜索', to: '/zzz/search', icon: Search, end: true },
];

export function Sidebar() {
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebarCollapsed = useAppStore((state) => state.toggleSidebarCollapsed);

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
          <small>绝区零工作区</small>
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
        {navigationEntries.map(({ label, to, icon: Icon, end, comingSoon }) =>
          comingSoon ? (
            <div
              key={label}
              className="desktop-nav-entry is-coming"
              title={isSidebarCollapsed ? `${label} · 即将上线` : undefined}
            >
              <Icon aria-hidden="true" size={18} />
              <span className="desktop-nav-label">{label}</span>
              <small>即将上线</small>
            </div>
          ) : (
            <NavLink
              key={label}
              to={to}
              end={end ?? false}
              aria-label={label}
              title={isSidebarCollapsed ? label : undefined}
              className={({ isActive }) => classNames('desktop-nav-entry', isActive && 'is-active')}
            >
              <Icon aria-hidden="true" size={18} />
              <span className="desktop-nav-label">{label}</span>
            </NavLink>
          ),
        )}
      </nav>

      <div className="desktop-sidebar-footer">
        <div className="desktop-sidebar-profile">
          <span>
            <UserRound aria-hidden="true" size={17} />
          </span>
          <span className="desktop-sidebar-profile-copy">
            <strong>访客绳匠</strong>
            <small>数据已同步</small>
          </span>
          <i aria-hidden="true" />
        </div>
        <NavLink
          to="/settings"
          aria-label="设置"
          title={isSidebarCollapsed ? '设置' : undefined}
          className={({ isActive }) =>
            classNames('desktop-nav-entry desktop-settings-entry', isActive && 'is-active')
          }
        >
          <Settings aria-hidden="true" size={18} />
          <span className="desktop-nav-label">设置</span>
        </NavLink>
      </div>
    </aside>
  );
}
