export const guideCategories = [
  '全部',
  '入门',
  '角色养成',
  '配队',
  '战斗',
  '资源',
  '活动',
  '挑战',
  '终局',
] as const;
export type GuideCategory = Exclude<(typeof guideCategories)[number], '全部'>;
export type GuideDifficulty = '入门' | '进阶' | '高阶';

export interface GuideSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface Guide {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly category: GuideCategory;
  readonly readTime: number;
  readonly updatedAt: string;
  readonly cover: string;
  readonly isFeatured: boolean;
  readonly author: string;
  readonly difficulty: GuideDifficulty;
  readonly tags: readonly string[];
  readonly sections: readonly GuideSection[];
}
