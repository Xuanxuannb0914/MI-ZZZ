export type GameAvailability = 'available' | 'developing';

export interface GameDefinition {
  readonly id: 'zzz' | 'genshin' | 'starrail' | 'wuwa';
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly status: GameAvailability;
  readonly route: '/zzz' | '/genshin' | '/starrail' | '/wuwa';
  readonly cover: string;
  readonly accent: 'cyan' | 'green' | 'orange' | 'violet';
}

export const games: readonly GameDefinition[] = [
  {
    id: 'zzz',
    name: '绝区零',
    shortName: '绝区零 / 01',
    description: '空洞情报、角色培养与每日计划',
    status: 'available',
    route: '/zzz',
    cover: '/assets/zzz-city.jpg',
    accent: 'green',
  },
  {
    id: 'genshin',
    name: '原神',
    shortName: '原神 / 02',
    description: '提瓦特冒险档案正在建立',
    status: 'developing',
    route: '/genshin',
    cover: '/assets/guide-combat.jpg',
    accent: 'cyan',
  },
  {
    id: 'starrail',
    name: '崩坏：星穹铁道',
    shortName: '星穹铁道 / 03',
    description: '星穹列车资料库即将接入',
    status: 'developing',
    route: '/starrail',
    cover: '/assets/guide-battle.jpg',
    accent: 'violet',
  },
  {
    id: 'wuwa',
    name: '鸣潮',
    shortName: '鸣潮 / 04',
    description: '鸣潮世界数据正在同步',
    status: 'developing',
    route: '/wuwa',
    cover: '/assets/zzz-city.jpg',
    accent: 'orange',
  },
];
