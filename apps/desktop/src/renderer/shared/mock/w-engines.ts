import type { WEngine } from '../content/types';

type WEngineSeed = Pick<WEngine, 'id' | 'name' | 'rarity' | 'specialty' | 'effect'>;

const seeds: readonly WEngineSeed[] = [
  {
    id: 'hailstorm-shrine',
    name: '霰落星殿',
    rarity: 'S',
    specialty: '异常',
    effect: '提高暴击与冰属性异常爆发收益。',
  },
  {
    id: 'deep-sea-visitor',
    name: '深海访客',
    rarity: 'S',
    specialty: '强攻',
    effect: '急冻充能期间获得稳定的冰属性增伤。',
  },
  {
    id: 'riot-suppressor',
    name: '防暴者 VI 型',
    rarity: 'S',
    specialty: '强攻',
    effect: '强化特殊技后提升以太爆发伤害。',
  },
  {
    id: 'sharpened-stinger',
    name: '淬锋钳刺',
    rarity: 'S',
    specialty: '异常',
    effect: '攻击命中后提高物理异常积蓄效率。',
  },
  {
    id: 'flaming-shaker',
    name: '灼心摇壶',
    rarity: 'S',
    specialty: '异常',
    effect: '后台攻击也可稳定维持灼烧增益。',
  },
  {
    id: 'tusks-of-rage',
    name: '奔袭獠牙',
    rarity: 'S',
    specialty: '防护',
    effect: '护盾生成后为队伍提供攻击力与减伤。',
  },
  {
    id: 'jade-teapot',
    name: '玉壶青冰',
    rarity: 'S',
    specialty: '击破',
    effect: '连续攻击提高失衡值与目标易伤。',
  },
  {
    id: 'crown-of-embers',
    name: '焰心桂冠',
    rarity: 'S',
    specialty: '击破',
    effect: '强化特殊技命中后提升冰火伤害。',
  },
  {
    id: 'time-weaver',
    name: '时流贤者',
    rarity: 'S',
    specialty: '异常',
    effect: '极性紊乱触发后延长异常伤害窗口。',
  },
  {
    id: 'restraint',
    name: '拘缚者',
    rarity: 'S',
    specialty: '击破',
    effect: '蓄力攻击提高失衡倍率与冰伤加成。',
  },
  {
    id: 'weeping-cradle',
    name: '啜泣摇篮',
    rarity: 'S',
    specialty: '支援',
    effect: '后台也能提供穿透率与全队伤害增益。',
  },
  {
    id: 'furnace-gear',
    name: '燃狱齿轮',
    rarity: 'S',
    specialty: '击破',
    effect: '能量不足时强化冲击力与快速回能。',
  },
  {
    id: 'fusion-compiler',
    name: '嵌合编译器',
    rarity: 'S',
    specialty: '异常',
    effect: '提高异常精通，并放大感电伤害。',
  },
  {
    id: 'treasure-box',
    name: '聚宝箱',
    rarity: 'A',
    specialty: '支援',
    effect: '命中敌人后提升全队以太伤害。',
  },
  {
    id: 'bashful-demon',
    name: '含羞恶面',
    rarity: 'A',
    specialty: '支援',
    effect: '切换入场后提供攻击力增益。',
  },
  {
    id: 'roaring-ride',
    name: '轰鸣座驾',
    rarity: 'A',
    specialty: '异常',
    effect: '蓄力攻击提升物理异常积蓄。',
  },
  {
    id: 'special-order',
    name: '维序者·特化型',
    rarity: 'A',
    specialty: '防护',
    effect: '护盾持续期间提高装备者异常精通。',
  },
  {
    id: 'replica-starlight',
    name: '仿制星徽引擎',
    rarity: 'A',
    specialty: '强攻',
    effect: '在远距离持续输出时提高攻击力。',
  },
  {
    id: 'demara-battery',
    name: '德玛拉电池 II 型',
    rarity: 'A',
    specialty: '击破',
    effect: '普通攻击命中后提升冲击力。',
  },
  {
    id: 'big-cannon',
    name: '好斗的阿炮',
    rarity: 'A',
    specialty: '支援',
    effect: '召唤物命中后提供全队攻击加成。',
  },
] as const;

export const wEngines: readonly WEngine[] = seeds.map((item, index) => ({
  ...item,
  description: `${item.name}是适合${item.specialty}代理人的本地培养档案音擎。`,
  source: index < 13 ? '独家频段与音擎频道' : '音擎频道与常驻商店',
  materialIds: ['w-engine-power', 'w-engine-chip', 'hollow-chip'],
  guideIds: ['wengine-priority'],
  versionIds: ['v2-1'],
}));

export function findWEngineById(id: string): WEngine | undefined {
  return wEngines.find((item) => item.id === id);
}
