export interface TeamPreset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly members: readonly string[];
  readonly focus: string;
}

export const teams: readonly TeamPreset[] = [
  {
    id: 'miyabi-disorder',
    name: '霜灼紊乱队',
    description: '以霜燃与极性紊乱交替制造高压爆发窗口。',
    members: ['星见雅', '月城柳', '苍角'],
    focus: '异常 · 紊乱',
  },
  {
    id: 'zhu-yuan-burst',
    name: '以太失衡爆发队',
    description: '在青衣制造的失衡窗口内集中倾泻强化霰弹。',
    members: ['朱鸢', '青衣', '妮可'],
    focus: '强攻 · 失衡',
  },
  {
    id: 'jane-assault',
    name: '物理异常队',
    description: '持续维持强击触发频率，并由护盾与后台异常补足循环。',
    members: ['简', '赛斯', '柏妮思'],
    focus: '异常 · 强击',
  },
];
