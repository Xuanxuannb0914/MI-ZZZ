import type { LucideIcon } from '@game-guide-hub/icons';
import {
  BookOpen,
  CalendarDays,
  Compass,
  Database,
  Disc3,
  PackageOpen,
} from '@game-guide-hub/icons';
import { workspaceRoutes } from '../../shared/config/workspace-routes';

export interface SidebarNavigationItem {
  readonly label: string;
  readonly to?: string;
  readonly status?: '建设中';
}

export interface SidebarNavigationGroup {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly match: readonly string[];
  readonly items: readonly SidebarNavigationItem[];
}

export const sidebarNavigationGroups: readonly SidebarNavigationGroup[] = [
  {
    id: 'guides',
    label: '攻略',
    icon: BookOpen,
    match: [workspaceRoutes.guides],
    items: [
      { label: '攻略中心', to: workspaceRoutes.guides },
      { label: '新手攻略', to: `${workspaceRoutes.guides}?category=入门` },
      { label: '角色攻略', to: `${workspaceRoutes.guides}?category=角色养成` },
      { label: '配队攻略', to: `${workspaceRoutes.guides}?category=配队` },
      { label: '活动攻略', to: `${workspaceRoutes.guides}?category=活动` },
    ],
  },
  {
    id: 'development',
    label: '养成中心',
    icon: CalendarDays,
    match: [
      '/zzz/development',
      '/zzz/agents',
      '/zzz/teams',
      '/zzz/materials',
      '/zzz/w-engines',
      '/zzz/drive-discs',
      '/zzz/planner',
    ],
    items: [
      { label: '养成总览', to: workspaceRoutes.development.overview },
      { label: '角色', to: workspaceRoutes.development.characters },
      { label: '音擎', to: workspaceRoutes.development.wEngines },
      { label: '驱动盘', to: workspaceRoutes.development.driveDiscs },
      { label: '材料', to: workspaceRoutes.development.materials },
      { label: '配队', to: workspaceRoutes.development.teams },
      { label: '养成计划', to: workspaceRoutes.development.calculator },
    ],
  },
  {
    id: 'data',
    label: '数据中心',
    icon: Database,
    match: ['/zzz/data'],
    items: [
      { label: '数据总览', to: workspaceRoutes.data.overview },
      { label: '抽卡分析', to: workspaceRoutes.data.gacha },
      { label: '角色数据', to: workspaceRoutes.data.characters },
      { label: '音擎数据', to: workspaceRoutes.data.wEngines },
      { label: '版本数据', to: workspaceRoutes.data.versions },
      { label: '怪物图鉴', status: '建设中' },
    ],
  },
  {
    id: 'community',
    label: '绳网',
    icon: Compass,
    match: ['/zzz/community'],
    items: [
      { label: '推荐内容', to: workspaceRoutes.community.feed },
      { label: '最新动态', status: '建设中' },
      { label: '关注动态', status: '建设中' },
    ],
  },
  {
    id: 'encyclopedia',
    label: '图鉴',
    icon: Disc3,
    match: ['/zzz/encyclopedia'],
    items: [
      { label: '角色图鉴', to: workspaceRoutes.encyclopedia.characters },
      { label: '音擎图鉴', to: workspaceRoutes.encyclopedia.wEngines },
      { label: '驱动盘图鉴', to: workspaceRoutes.encyclopedia.driveDiscs },
      { label: '怪物与 Boss', status: '建设中' },
    ],
  },
  {
    id: 'events',
    label: '活动',
    icon: PackageOpen,
    match: [workspaceRoutes.events],
    items: [
      { label: '当前活动', to: workspaceRoutes.events },
      { label: '即将开始', status: '建设中' },
      { label: '历史活动', status: '建设中' },
    ],
  },
];
