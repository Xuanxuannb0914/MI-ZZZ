import type { DriveDisc } from '../content/types';

const sets = [
  ['折枝剑歌', '提高冰属性伤害。', '霜燃触发后提高暴击伤害。', '冰属性异常队'],
  ['啄木鸟电音', '提高暴击率。', '暴击触发后提供攻击力层数。', '直伤爆发队'],
  ['极地重金属', '提高冰属性伤害。', '冻结或碎冰后强化普攻与冲刺攻击。', '冰属性强攻队'],
  ['震星迪斯科', '提高冲击力。', '普攻、冲刺攻击与闪避反击的失衡值提高。', '击破队'],
  ['摇摆爵士', '提高能量自动回复。', '发动连携技或终结技后提高全队伤害。', '支援通用'],
  ['混沌重金属', '提高以太属性伤害。', '以太异常触发后缩短强化特殊技冷却。', '以太强攻队'],
  ['獠牙重金属', '提高物理属性伤害。', '强击触发后提高全队暴击率。', '物理异常队'],
  ['自由蓝调', '提高异常精通。', '强化特殊技命中后降低敌人异常积蓄抗性。', '紊乱队'],
  ['混沌爵士', '提高异常掌控。', '后台攻击命中后提高火属性异常伤害。', '后台异常队'],
  ['原始朋克', '降低受到的伤害。', '护盾存在时提高全队伤害。', '防护辅助队'],
  ['雷暴重金属', '提高电属性伤害。', '感电状态下提高装备者攻击力。', '电属性异常队'],
  ['炎狱重金属', '提高火属性伤害。', '灼烧触发后提高暴击与攻击。', '火属性队'],
  ['河豚电音', '提高穿透率。', '终结技后提高全队穿透率。', '终结技循环队'],
  ['激素朋克', '提高攻击力。', '入场时获得短时间攻击力爆发。', '前台爆发队'],
  ['灵魂摇滚', '提高生命值。', '受击后提高护盾强度与减伤。', '生存防护队'],
] as const;

export const driveDiscs: readonly DriveDisc[] = sets.concat(sets).map((set, index) => ({
  id: `${index < sets.length ? '' : 'mk2-'}${index + 1}-${set[0]}`
    .toLowerCase()
    .replaceAll(' ', '-'),
  name: `${set[0]}${index < sets.length ? '' : '·调律档案'}`,
  setName: set[0],
  description: `适用于${set[3]}的驱动盘推荐方案。`,
  twoPieceEffect: `2 件：${set[1]}`,
  fourPieceEffect: `4 件：${set[2]}`,
  recommendedStats: [
    'IV 位：暴击 / 异常精通',
    'V 位：属性伤害 / 穿透率',
    'VI 位：攻击力 / 异常掌控',
  ],
  source: '定期清剿：驱动盘调律',
  materialIds: ['drive-disc-calibrator', 'plating-agent', 'tuning-catalyst'],
  guideIds: ['drive-disc', 'disc-locking'],
  versionIds: ['v2-1'],
}));

export function findDriveDiscById(id: string): DriveDisc | undefined {
  return driveDiscs.find((item) => item.id === id);
}
