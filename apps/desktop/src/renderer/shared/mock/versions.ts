import type { Version } from '../content/types';

export const versions: readonly Version[] = [
  {
    id: 'v2-1',
    code: '2.1',
    name: '如月城的霜色回响',
    period: '2026.08.01 - 2026.09.03',
    theme: '霜月、周年庆与城区巡游',
    description: '当前本地资料库对应的版本内容档案。',
    eventIds: ['astra-event', 'anniversary', 'exclusive-banner'],
    agentIds: ['miyabi', 'tsukishiro-yanagi'],
    guideIds: ['miyabi-frostburn'],
  },
  {
    id: 'v2-0',
    code: '2.0',
    name: '卫非地的邀请',
    period: '2026.06.20 - 2026.08.01',
    theme: '新区探索与战斗试炼',
    description: '用于回溯角色培养建议的历史版本档案。',
    eventIds: ['combat-simulation'],
    agentIds: ['lighter', 'caesar-king'],
    guideIds: ['hollow-zero'],
  },
  {
    id: 'v2-2-preview',
    code: '2.2 前瞻',
    name: '未公开观测记录',
    period: '敬请关注官方前瞻',
    theme: '版本前瞻与预约提醒',
    description: '仅作资料库演示，不代表官方版本计划。',
    eventIds: ['version-preview'],
    agentIds: [],
    guideIds: ['banner-planner'],
  },
];

export function findVersionById(id: string): Version | undefined {
  return versions.find((item) => item.id === id);
}
