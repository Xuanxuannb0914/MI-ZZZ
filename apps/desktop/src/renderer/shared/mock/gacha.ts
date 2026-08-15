export type GachaItemType = 'agent' | 'w-engine';
export type GachaBannerType = 'limited-agent' | 'limited-w-engine' | 'standard';

export interface GachaHistoryItem {
  readonly id: string;
  readonly bannerType: GachaBannerType;
  readonly itemName: string;
  readonly itemType: GachaItemType;
  readonly rarity: 3 | 4 | 5;
  readonly pulledAt: string;
  readonly isLimited: boolean;
}

export type GachaLuckLabel = '极欧' | '欧' | '正常' | '偏非' | '非' | '究极非';

export interface GachaAnalytics {
  readonly totalPulls: number;
  readonly fiveStarCount: number;
  readonly limitedWinCount: number;
  readonly averageFiveStarPity: number | null;
  readonly bestFiveStarPity: number | null;
  readonly worstFiveStarPity: number | null;
  readonly currentPity: number;
  readonly guaranteeCount: number;
  readonly luckScore: number;
  readonly luckLabel: GachaLuckLabel;
}

export interface GachaStatistics extends GachaAnalytics {
  readonly threeStarCount: number;
  readonly fourStarCount: number;
  readonly limitedLossCount: number;
  readonly limitedWinRate: number | null;
  readonly fiveStarPities: readonly number[];
}

export interface GachaBannerSummary {
  readonly bannerType: GachaBannerType;
  readonly pullCount: number;
  readonly fiveStarCount: number;
  readonly currentPity: number;
}

export interface GachaAnalysis {
  readonly statistics: GachaStatistics;
  readonly banners: readonly GachaBannerSummary[];
}

export interface GachaImportResult {
  readonly records: readonly GachaHistoryItem[];
  readonly rejectedRecords: number;
}

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
    bannerType: 'limited-agent',
    itemName,
    itemType,
    rarity,
    isLimited,
    pulledAt: `2026-08-${String(20 - index).padStart(2, '0')}T12:00:00.000Z`,
  }),
);

export const sampleGachaImport = JSON.stringify({ records: gachaHistory }, null, 2);

function getFiveStarPities(records: readonly GachaHistoryItem[]) {
  const pities: number[] = [];
  let pullsSinceFiveStar = 0;
  for (const record of records) {
    pullsSinceFiveStar += 1;
    if (record.rarity === 5) {
      pities.push(pullsSinceFiveStar);
      pullsSinceFiveStar = 0;
    }
  }
  return pities;
}

function getLuckLabel(score: number): GachaLuckLabel {
  if (score >= 82) return '极欧';
  if (score >= 65) return '欧';
  if (score >= 44) return '正常';
  if (score >= 28) return '偏非';
  if (score >= 12) return '非';
  return '究极非';
}

export function analyzeGachaHistory(records: readonly GachaHistoryItem[]): GachaAnalytics {
  const pities = getFiveStarPities(records);
  const fiveStarCount = pities.length;
  const averageFiveStarPity =
    fiveStarCount > 0 ? pities.reduce((sum, pity) => sum + pity, 0) / fiveStarCount : null;
  const currentPity = records.length - records.map((record) => record.rarity).lastIndexOf(5) - 1;
  const expectedPity = 80;
  const averageDelta = averageFiveStarPity === null ? 0 : expectedPity - averageFiveStarPity;
  const earlyPullBonus = pities.length ? Math.max(0, expectedPity - Math.min(...pities)) * 0.4 : 0;
  const luckScore = Math.round(
    Math.min(100, Math.max(0, 50 + averageDelta * 1.4 + earlyPullBonus)),
  );

  return {
    totalPulls: records.length,
    fiveStarCount,
    limitedWinCount: records.filter((record) => record.rarity === 5 && record.isLimited).length,
    averageFiveStarPity,
    bestFiveStarPity: pities.length ? Math.min(...pities) : null,
    worstFiveStarPity: pities.length ? Math.max(...pities) : null,
    currentPity,
    guaranteeCount: records.filter((record) => record.rarity === 5 && !record.isLimited).length,
    luckScore,
    luckLabel: getLuckLabel(luckScore),
  };
}

export function buildGachaAnalysis(records: readonly GachaHistoryItem[]): GachaAnalysis {
  const analytics = analyzeGachaHistory(records);
  const fiveStarPities = getFiveStarPities(records);
  const fiveStarRecords = records.filter((record) => record.rarity === 5);
  const limitedWinCount = fiveStarRecords.filter((record) => record.isLimited).length;
  const limitedLossCount = fiveStarRecords.length - limitedWinCount;
  const bannerTypes: readonly GachaBannerType[] = ['limited-agent', 'limited-w-engine', 'standard'];

  return {
    statistics: {
      ...analytics,
      threeStarCount: records.filter((record) => record.rarity === 3).length,
      fourStarCount: records.filter((record) => record.rarity === 4).length,
      limitedLossCount,
      limitedWinRate: fiveStarRecords.length ? limitedWinCount / fiveStarRecords.length : null,
      fiveStarPities,
    },
    banners: bannerTypes
      .map((bannerType) => {
        const bannerRecords = records.filter((record) => record.bannerType === bannerType);
        if (!bannerRecords.length) return null;
        const latestFiveStarIndex = bannerRecords.map((record) => record.rarity).lastIndexOf(5);
        return {
          bannerType,
          pullCount: bannerRecords.length,
          fiveStarCount: bannerRecords.filter((record) => record.rarity === 5).length,
          currentPity:
            latestFiveStarIndex === -1
              ? bannerRecords.length
              : bannerRecords.length - latestFiveStarIndex - 1,
        } satisfies GachaBannerSummary;
      })
      .filter((summary): summary is GachaBannerSummary => summary !== null),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseGachaImport(payload: unknown): GachaImportResult {
  if (!isRecord(payload) || !Array.isArray(payload.records))
    return { records: [], rejectedRecords: 0 };
  const records: GachaHistoryItem[] = [];
  let rejectedRecords = 0;
  for (const item of payload.records) {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.itemName !== 'string') {
      rejectedRecords += 1;
      continue;
    }
    const rarity = item.rarity;
    if (rarity !== 3 && rarity !== 4 && rarity !== 5) {
      rejectedRecords += 1;
      continue;
    }
    records.push({
      id: item.id,
      bannerType:
        item.bannerType === 'limited-w-engine' || item.bannerType === 'standard'
          ? item.bannerType
          : 'limited-agent',
      itemName: item.itemName,
      itemType: item.itemType === 'w-engine' ? 'w-engine' : 'agent',
      rarity,
      pulledAt: typeof item.pulledAt === 'string' ? item.pulledAt : new Date(0).toISOString(),
      isLimited: item.isLimited === true,
    });
  }
  return { records, rejectedRecords };
}
