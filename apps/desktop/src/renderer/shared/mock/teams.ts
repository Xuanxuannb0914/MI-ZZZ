export interface TeamPreset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly members: readonly string[];
  readonly focus: string;
  readonly agentIds: readonly string[];
  readonly wEngineIds: readonly string[];
  readonly driveDiscIds: readonly string[];
  readonly guideIds: readonly string[];
  readonly advantages: readonly string[];
  readonly cautions: readonly string[];
}

const featuredTeams: readonly TeamPreset[] = [
  {
    id: 'miyabi-disorder',
    name: '霜灼紊乱队',
    description: '以霜燃与极性紊乱交替制造高压爆发窗口。',
    members: ['星见雅', '月城柳', '苍角'],
    focus: '异常 · 紊乱',
    agentIds: ['miyabi', 'tsukishiro-yanagi', 'soukaku'],
    wEngineIds: ['hailstorm-shrine', 'time-weaver'],
    driveDiscIds: ['1-折枝剑歌', '9-混沌爵士'],
    guideIds: ['miyabi-team', 'miyabi-frostburn'],
    advantages: ['爆发窗口清晰', '异常覆盖稳定'],
    cautions: ['需要注意切人轴长'],
  },
  {
    id: 'zhu-yuan-burst',
    name: '以太失衡爆发队',
    description: '在青衣制造的失衡窗口内集中倾泻强化霰弹。',
    members: ['朱鸢', '青衣', '妮可'],
    focus: '强攻 · 失衡',
    agentIds: ['zhu-yuan', 'qingyi', 'nicole-demara'],
    wEngineIds: ['riot-suppressor', 'jade-teapot'],
    driveDiscIds: ['6-混沌重金属', '4-震星迪斯科'],
    guideIds: ['zhu-yuan-burst'],
    advantages: ['失衡爆发上限高'],
    cautions: ['需要集中资源管理'],
  },
  {
    id: 'jane-assault',
    name: '物理异常队',
    description: '持续维持强击触发频率，并由护盾与后台异常补足循环。',
    members: ['简', '赛斯', '柏妮思'],
    focus: '异常 · 强击',
    agentIds: ['jane-doe', 'seth-lowell', 'burnice-white'],
    wEngineIds: ['sharpened-stinger', 'special-order'],
    driveDiscIds: ['7-獠牙重金属', '8-自由蓝调'],
    guideIds: ['jane-assault'],
    advantages: ['前后台伤害兼顾'],
    cautions: ['异常节奏要求较高'],
  },
];

const teamPatterns = [
  ['冰霜失衡队', '艾莲', '莱卡恩', '苍角', '冰属性爆发'],
  ['电感紊乱队', '格莉丝', '丽娜', '安东', '电属性异常'],
  ['狡兔屋速攻队', '比利', '安比', '妮可', '前期速攻'],
  ['赤焰护航队', '柏妮思', '凯撒', '露西', '火属性护盾'],
  ['白祇重工队', '珂蕾妲', '格莉丝', '安东', '失衡与感电'],
  ['对空六课协同队', '月城柳', '星见雅', '苍角', '冰电紊乱'],
  ['物理轮转队', '派派', '凯撒', '露西', '物理异常'],
  ['以太聚怪队', '朱鸢', '青衣', '妮可', '以太爆发'],
  ['冰属性节奏队', '艾莲', '莱特', '苍角', '冰火失衡'],
  ['防护反击队', '凯撒', '赛斯', '妮可', '生存反击'],
  ['电击破队', '青衣', '丽娜', '安比', '电属性失衡'],
  ['新手资源队', '比利', '安比', '妮可', '低成本养成'],
] as const;

export const teams: readonly TeamPreset[] = featuredTeams.concat(
  teamPatterns.map(([name, first, second, third, focus], index) => ({
    id: `team-${index + 4}`,
    name,
    description: `${first}、${second}与${third}组成的${focus}本地配队档案。`,
    members: [first, second, third],
    focus,
    agentIds: [],
    wEngineIds: [],
    driveDiscIds: [],
    guideIds: ['starter-teams'],
    advantages: ['定位直观，适合日常规划'],
    cautions: ['请根据实战配置调整'],
  })),
);
