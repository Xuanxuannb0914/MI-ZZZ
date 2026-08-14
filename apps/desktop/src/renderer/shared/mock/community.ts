export type CommunityPostKind = '攻略' | '配队' | '抽卡记录' | '心得';

export interface CommunityPost {
  readonly id: string;
  readonly author: string;
  readonly avatarLabel: string;
  readonly kind: CommunityPostKind;
  readonly title: string;
  readonly excerpt: string;
  readonly tags: readonly string[];
  readonly publishedAt: string;
  readonly likeCount: number;
  readonly commentCount: number;
}

export const communityPosts: readonly CommunityPost[] = [
  {
    id: 'miyabi-rotation',
    author: '深渊信号员',
    avatarLabel: '深',
    kind: '攻略',
    title: '雅的霜灼循环：站场与换人时机整理',
    excerpt: '把关键动作拆成三段，先保证失衡窗口内的资源释放，再考虑极限压轴。',
    tags: ['雅', '冰队', '深渊'],
    publishedAt: '12 分钟前',
    likeCount: 128,
    commentCount: 22,
  },
  {
    id: 'ether-team',
    author: '六分街观察者',
    avatarLabel: '六',
    kind: '配队',
    title: '以太异常队的低成本替代位',
    excerpt: '没有限定音擎时，优先确保异常积蓄与能量循环，不要只看面板攻击力。',
    tags: ['配队', '以太', '新人'],
    publishedAt: '38 分钟前',
    likeCount: 86,
    commentCount: 14,
  },
  {
    id: 'gacha-log',
    author: '空洞漫游者',
    avatarLabel: '空',
    kind: '抽卡记录',
    title: '限定池 80 抽记录与保底计算',
    excerpt: '把记录导入分析页后，发现五星均抽比体感更稳定；保底次数也能一并追踪。',
    tags: ['抽卡', '记录', '数据'],
    publishedAt: '1 小时前',
    likeCount: 64,
    commentCount: 9,
  },
];
