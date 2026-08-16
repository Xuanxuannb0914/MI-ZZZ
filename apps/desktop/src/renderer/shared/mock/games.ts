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
  /** 游戏官方字体栈（商用字体使用风格相近的免费替代）。 */
  readonly fontFamily: string;
}

export const games: readonly GameDefinition[] = [
  {
    id: 'zzz',
    name: '绝区零',
    shortName: 'ZZZ',
    description: '都市幻想动作游戏攻略与数据中心',
    status: 'available',
    route: '/zzz',
    artwork: '/assets/games/zzz-anby-big.png',
    background: '/assets/games/zzz-anby-big.png',
    cover: '/assets/games/zzz-anby-big.png',
    accentColor: '#FFD84D',
    secondaryColor: '#FF6B35',
    glowColor: 'rgb(255 216 77 / 28%)',
    fontFamily: "'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  {
    id: 'genshin',
    name: '原神',
    shortName: 'GI',
    description: '提瓦特探索与角色养成资料库即将加入',
    status: 'coming-soon',
    route: '/genshin',
    artwork: '/assets/games/genshin-hutao.png',
    background: '/assets/games/genshin-hutao.png',
    cover: '/assets/games/genshin-hutao.png',
    accentColor: '#5AA0E8',
    secondaryColor: '#9FD0FF',
    glowColor: 'rgb(90 160 232 / 30%)',
    fontFamily: "'GenshinHyWenHei', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  {
    id: 'starrail',
    name: '崩坏：星穹铁道',
    shortName: 'HSR',
    description: '星穹列车数据与战斗策略正在建设',
    status: 'coming-soon',
    route: '/starrail',
    artwork: '/assets/games/starrail-kafka.png',
    background: '/assets/games/starrail-kafka.png',
    cover: '/assets/games/starrail-kafka.png',
    accentColor: '#8FB6FF',
    secondaryColor: '#5B8CFF',
    glowColor: 'rgb(143 182 255 / 28%)',
    fontFamily: "'GenJyuuGothic', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  {
    id: 'wuwa',
    name: '鸣潮',
    shortName: 'WUTHERING',
    description: '共鸣者档案与世界探索内容正在汇集',
    status: 'coming-soon',
    route: '/wuwa',
    artwork: '/assets/games/wuwa-calcharo.png',
    background: '/assets/games/wuwa-calcharo.png',
    cover: '/assets/games/wuwa-calcharo.png',
    accentColor: '#6FE3C1',
    secondaryColor: '#4FB8E8',
    glowColor: 'rgb(111 227 193 / 26%)',
    fontFamily: "'JitingSans', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
];
