import type { LucideIcon } from '@game-guide-hub/icons';
import { BookOpen, Compass, Disc3, History, Home } from '@game-guide-hub/icons';
import { workspaceRoutes } from '../../shared/config/workspace-routes';

export interface SidebarNavigationEntry {
  readonly label: string;
  readonly to: string;
  readonly icon: LucideIcon;
  readonly end?: boolean;
}

export const sidebarNavigationEntries: readonly SidebarNavigationEntry[] = [
  { label: '首页', to: workspaceRoutes.home, icon: Home, end: true },
  { label: '抽卡分析', to: workspaceRoutes.gacha, icon: History },
  { label: '图鉴', to: workspaceRoutes.encyclopedia.overview, icon: Disc3 },
  { label: '绳网', to: workspaceRoutes.community.feed, icon: Compass },
  { label: '攻略', to: workspaceRoutes.guides, icon: BookOpen },
];
