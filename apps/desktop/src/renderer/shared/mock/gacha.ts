import type { GachaHistoryItem } from '../gacha/gacha-data';

export * from '../gacha/gacha-data';

const samplePulls = [
  ['1', '街头乐手', 'agent', 3, false],
  ['2', '恒等式-本格', 'w-engine', 3, false],
  ['3', '苍角', 'agent', 4, false],
  ['4', '家政员', 'agent', 3, false],
  ['5', '音擎校准器', 'w-engine', 3, false],
  ['6', '格莉丝', 'agent', 5, false],
  ['7', '安东', 'agent', 4, false],
  ['8', '夜行者', 'w-engine', 3, false],
  ['9', '妮可', 'agent', 4, false],
  ['10', '都市回声', 'w-engine', 3, false],
  ['11', '朱鸢', 'agent', 5, true],
  ['12', '比利', 'agent', 4, false],
  ['13', '月相', 'w-engine', 3, false],
  ['14', '露西', 'agent', 4, false],
  ['15', '巡演补给', 'w-engine', 3, false],
  ['16', '青衣', 'agent', 5, true],
  ['17', '可琳', 'agent', 4, false],
  ['18', '回廊', 'w-engine', 3, false],
  ['19', '苍角', 'agent', 4, false],
  ['20', '恒等式-本格', 'w-engine', 3, false],
] as const;

export const gachaHistory: readonly GachaHistoryItem[] = samplePulls.map(
  ([id, itemName, itemType, rarity, isLimited], index) => ({
    id,
    gameId: 'zenless-zone-zero',
    bannerType: 'limited-agent',
    itemName,
    itemType,
    rarity,
    isLimited,
    pulledAt: `2026-08-${String(1 + index).padStart(2, '0')}T12:00:00.000Z`,
  }),
);

export const sampleGachaImport = JSON.stringify({ records: gachaHistory }, null, 2);
