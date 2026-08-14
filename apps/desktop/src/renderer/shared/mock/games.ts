export type GameAvailability = 'available' | 'coming-soon';

export interface GameDefinition {
  readonly id: 'zzz' | 'genshin' | 'starrail' | 'wuwa';
  readonly name: string;
  readonly shortName: string;
  readonly description: string;
  readonly status: GameAvailability;
  readonly route: '/zzz' | '/genshin' | '/starrail' | '/wuwa';
  readonly artwork: string;
  readonly background: string;
  readonly cover: string;
  readonly accentColor: string;
  readonly secondaryColor: string;
  readonly glowColor: string;
}

export const games: readonly GameDefinition[] = [
  {
    id: 'zzz',
    name: '绝区零',
    shortName: 'ZZZ',
    description: '都市幻想动作游戏攻略与数据中心',
    status: 'available',
    route: '/zzz',
    artwork: '/assets/zzz-city.jpg',
    background: '/assets/zzz-city.jpg',
    cover: '/assets/zzz-city.jpg',
    accentColor: '#27D3FF',
    secondaryColor: '#A3FF12',
    glowColor: 'rgb(39 211 255 / 34%)',
  },
  {
    id: 'genshin',
    name: '原神',
    shortName: 'GI',
    description: '提瓦特探索与角色养成资料库即将加入',
    status: 'coming-soon',
    route: '/genshin',
    artwork: '/assets/guide-combat.jpg',
    background: '/assets/guide-combat.jpg',
    cover: '/assets/guide-combat.jpg',
    accentColor: '#8ED3FF',
    secondaryColor: '#C6F59A',
    glowColor: 'rgb(142 211 255 / 28%)',
  },
  {
    id: 'starrail',
    name: '崩坏：星穹铁道',
    shortName: 'HSR',
    description: '星穹列车数据与战斗策略正在建设',
    status: 'coming-soon',
    route: '/starrail',
    artwork: '/assets/guide-battle.jpg',
    background: '/assets/guide-battle.jpg',
    cover: '/assets/guide-battle.jpg',
    accentColor: '#B5A3FF',
    secondaryColor: '#67DDFE',
    glowColor: 'rgb(181 163 255 / 30%)',
  },
  {
    id: 'wuwa',
    name: '鸣潮',
    shortName: 'WUTHERING',
    description: '共鸣者档案与世界探索内容正在汇集',
    status: 'coming-soon',
    route: '/wuwa',
    artwork: '/assets/zzz-city.jpg',
    background: '/assets/zzz-city.jpg',
    cover: '/assets/zzz-city.jpg',
    accentColor: '#F2BD8E',
    secondaryColor: '#9DE1C5',
    glowColor: 'rgb(242 189 142 / 26%)',
  },
];
