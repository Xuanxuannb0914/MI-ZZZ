export const materialCategories = [
  '角色材料',
  '音擎材料',
  '驱动盘材料',
  '货币',
  '升级材料',
  '活动材料',
] as const;

export type MaterialCategory = (typeof materialCategories)[number];

export interface Material {
  readonly id: string;
  readonly name: string;
  readonly category: MaterialCategory;
  readonly rarity: '常见' | '稀有' | '高级';
  readonly purpose: string;
  readonly source: readonly string[];
  readonly recommendedObtain: string;
  readonly relatedAgents: readonly string[];
  readonly relatedWeapons: readonly string[];
  readonly relatedGuides: readonly string[];
}
