export interface VersionEvent {
  readonly id: string;
  readonly title: string;
  readonly duration: string;
  readonly progress: number;
  readonly reward: string;
  readonly type?: string;
  readonly status?: '进行中' | '即将开放' | '常驻';
  readonly startsAt?: string;
}
export const events: readonly VersionEvent[] = [
  {
    id: 'astra-event',
    title: '星见雅 · 风花之诗',
    type: '版本活动',
    duration: '剩余 12 天',
    progress: 68,
    reward: '菲林 ×720',
    status: '进行中',
    startsAt: '8 月 1 日',
  },
  {
    id: 'anniversary',
    title: '新艾利都周年庆',
    type: '周年庆',
    duration: '剩余 19 天',
    progress: 42,
    reward: '菲林 ×1,600',
    status: '进行中',
    startsAt: '8 月 8 日',
  },
  {
    id: 'shiyu',
    title: '式舆防卫：危机节点',
    type: '限定活动',
    duration: '剩余 5 天',
    progress: 50,
    reward: '菲林 ×720',
    status: '进行中',
    startsAt: '8 月 3 日',
  },
  {
    id: 'double-reward',
    title: '双倍掉落：实战模拟',
    type: '双倍奖励',
    duration: '今日可用',
    progress: 80,
    reward: '养成材料 ×2',
    status: '进行中',
    startsAt: '今日 04:00',
  },
  {
    id: 'hollow-zero',
    title: '零号空洞周常悬赏',
    type: '周常活动',
    duration: '周一刷新',
    progress: 80,
    reward: '邦布券 ×2',
    status: '常驻',
    startsAt: '每周一刷新',
  },
  {
    id: 'exclusive-banner',
    title: '独家频段：霜月之愿',
    type: '限定卡池',
    duration: '剩余 12 天',
    progress: 66,
    reward: '星见雅概率提升',
    status: '进行中',
    startsAt: '8 月 1 日',
  },
  {
    id: 'version-preview',
    title: '2.2 版本前瞻特别节目',
    type: '版本前瞻',
    duration: '3 天后开始',
    progress: 14,
    reward: '兑换码 ×3',
    status: '即将开放',
    startsAt: '8 月 10 日 19:30',
  },
  {
    id: 'combat-simulation',
    title: '拟真鏖战试炼',
    type: '战斗活动',
    duration: '剩余 8 天',
    progress: 56,
    reward: '菲林 ×500',
    status: '进行中',
    startsAt: '8 月 4 日',
  },
  {
    id: 'arcade-tournament',
    title: '金手指街机争霸赛',
    type: '休闲活动',
    duration: '6 天后开始',
    progress: 8,
    reward: '限定名片',
    status: '即将开放',
    startsAt: '8 月 13 日',
  },
  {
    id: 'login-gifts',
    title: '新城观览护照',
    type: '签到活动',
    duration: '剩余 20 天',
    progress: 35,
    reward: '加密母带 ×10',
    status: '进行中',
    startsAt: '8 月 1 日',
  },
];
