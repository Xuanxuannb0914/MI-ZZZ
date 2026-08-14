import {
  ChevronDown,
  Heart,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  UserRound,
} from '@game-guide-hub/icons';
import { classNames } from '@game-guide-hub/utils';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../app/stores/app-store';
import { workspaceRoutes } from '../../shared/config/workspace-routes';
import { sidebarNavigationGroups } from './sidebar-navigation';

export function Sidebar() {
  const location = useLocation();
  const isSidebarCollapsed = useAppStore((state) => state.isSidebarCollapsed);
  const toggleSidebarCollapsed = useAppStore((state) => state.toggleSidebarCollapsed);
  const activeGroup = sidebarNavigationGroups.find((group) =>
    group.match.some((path) => location.pathname.startsWith(path)),
  );
  const [expandedGroupId, setExpandedGroupId] = useState(activeGroup?.id ?? null);

  useEffect(() => {
    if (activeGroup) setExpandedGroupId(activeGroup.id);
  }, [activeGroup]);

  const toggleGroup = (groupId: string) => {
    if (isSidebarCollapsed) {
      toggleSidebarCollapsed();
      setExpandedGroupId(groupId);
      return;
    }
    setExpandedGroupId((currentGroupId) => (currentGroupId === groupId ? null : groupId));
  };

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
        <NavLink
          to={workspaceRoutes.home}
          end
          aria-label="首页"
          title={isSidebarCollapsed ? '首页' : undefined}
          className={({ isActive }) => classNames('desktop-nav-entry', isActive && 'is-active')}
        >
          <Home aria-hidden="true" size={18} />
          <span className="desktop-nav-label">首页</span>
        </NavLink>

        {sidebarNavigationGroups.map((group) => {
          const isExpanded = expandedGroupId === group.id;
          const isActive = activeGroup?.id === group.id;
          const panelId = `sidebar-group-${group.id}`;
          const Icon = group.icon;

          return (
            <section
              key={group.id}
              className={classNames(
                'desktop-nav-group',
                isExpanded && 'is-expanded',
                isActive && 'is-active',
              )}
            >
              <button
                type="button"
                className="desktop-nav-entry desktop-nav-group-trigger"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                title={isSidebarCollapsed ? group.label : undefined}
                onClick={() => toggleGroup(group.id)}
              >
                <Icon aria-hidden="true" size={18} />
                <span className="desktop-nav-label">{group.label}</span>
                <ChevronDown aria-hidden="true" className="desktop-nav-group-chevron" size={15} />
              </button>
              <div
                id={panelId}
                className="desktop-nav-submenu"
                aria-hidden={!isExpanded}
                inert={!isExpanded}
              >
                <div className="desktop-nav-submenu-content">
                  {group.items.map((item) =>
                    item.to ? (
                      <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive: isItemActive }) =>
                          classNames('desktop-nav-subentry', isItemActive && 'is-active')
                        }
                      >
                        <span>{item.label}</span>
                      </NavLink>
                    ) : (
                      <span key={item.label} className="desktop-nav-subentry is-coming">
                        <span>{item.label}</span>
                        <small>{item.status}</small>
                      </span>
                    ),
                  )}
                </div>
              </div>
            </section>
          );
        })}

        <NavLink
          to={workspaceRoutes.favorites}
          aria-label="收藏"
          title={isSidebarCollapsed ? '收藏' : undefined}
          className={({ isActive }) => classNames('desktop-nav-entry', isActive && 'is-active')}
        >
          <Heart aria-hidden="true" size={18} />
          <span className="desktop-nav-label">收藏</span>
        </NavLink>
        <NavLink
          to={workspaceRoutes.search}
          end
          aria-label="全局搜索"
          title={isSidebarCollapsed ? '全局搜索' : undefined}
          className={({ isActive }) => classNames('desktop-nav-entry', isActive && 'is-active')}
        >
          <Search aria-hidden="true" size={18} />
          <span className="desktop-nav-label">全局搜索</span>
        </NavLink>
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
