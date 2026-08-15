export type EnemyRank = 'S' | 'A' | 'B';
export type EnemyCategory = '普通敌人' | '精英敌人' | 'Boss';

export interface Enemy {
  readonly id: string;
  readonly name: string;
  readonly category: EnemyCategory;
  readonly rank: EnemyRank;
  readonly attribute: string;
  readonly weakTo: readonly string[];
  readonly resistances: readonly string[];
  readonly area: string;
  readonly mechanic: string;
  readonly description: string;
  readonly drops: readonly string[];
  readonly color: string;
  readonly geometry: 'box' | 'sphere' | 'cone';
}

export const enemies: readonly Enemy[] = [
  {
    id: 'ethereal-scout',
    name: '以骸·侦察型',
    category: '普通敌人',
    rank: 'B',
    attribute: '以太',
    weakTo: ['冰'],
    resistances: ['以太'],
    area: '六分街空洞',
    mechanic: '短距离突进后会留下可被打断的蓄力动作。',
    description: '负责侦测与牵制的低阶以骸单位。',
    drops: ['基础以太碎片'],
    color: '#7ee7ff',
    geometry: 'sphere',
  },
  {
    id: 'heavy-punisher',
    name: '重型惩戒者',
    category: '精英敌人',
    rank: 'A',
    attribute: '物理',
    weakTo: ['电', '冰'],
    resistances: ['物理'],
    area: '零号空洞',
    mechanic: '护甲未击破前会连续压制；失衡后承伤显著提高。',
    description: '装备重型护甲的精英单位，适合用击破角色快速制造窗口。',
    drops: ['高级认证章', '强化组件'],
    color: '#a3ff12',
    geometry: 'box',
  },
  {
    id: 'sacrifice-bringer',
    name: '牲鬼·布林格',
    category: 'Boss',
    rank: 'S',
    attribute: '火',
    weakTo: ['冰', '电'],
    resistances: ['火'],
    area: '恶名狩猎',
    mechanic: '二阶段会提高攻击频率，优先处理地面持续伤害区域。',
    description: '拥有高压连段与大范围区域技的首领目标。',
    drops: ['高维数据：凶刑讣告', 'Boss 核心'],
    color: '#ffb020',
    geometry: 'cone',
  },
] as const;
