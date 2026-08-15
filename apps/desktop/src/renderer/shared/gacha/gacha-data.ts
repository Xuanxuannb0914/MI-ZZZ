export type GachaGameId = 'zenless-zone-zero';
export type GachaItemType = 'agent' | 'w-engine';
export type GachaBannerType = 'limited-agent' | 'limited-w-engine' | 'standard';
export type GachaDataSource = 'json' | 'clipboard' | 'local-cache';
export type GachaLuckLabel = '极欧' | '欧' | '正常' | '偏非' | '非' | '究极非';

export interface GachaRecord {
  readonly id: string;
  readonly gameId?: GachaGameId | undefined;
  readonly uid?: string | undefined;
  readonly bannerType: GachaBannerType;
  readonly bannerId?: string | undefined;
  readonly itemName: string;
  readonly itemId?: string | undefined;
  readonly itemType: GachaItemType;
  readonly rarity: 3 | 4 | 5;
  readonly pulledAt: string;
  readonly pullIndex?: number | undefined;
  readonly source?: GachaDataSource | undefined;
  readonly isLimited: boolean;
}

export type GachaHistoryItem = GachaRecord;

export interface GachaImportResult {
  readonly records: readonly GachaRecord[];
  readonly rejectedRecords: number;
  readonly normalizedRecords: number;
  readonly issues: readonly string[];
}

export interface GachaImportSummary extends GachaImportResult {
  readonly acceptedRecords: number;
  readonly duplicateRecords: number;
  readonly totalRecords: number;
}

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

export interface GachaRepository {
  load(): readonly GachaRecord[];
  save(records: readonly GachaRecord[]): void;
  clear(): void;
}

export interface GachaDataProvider {
  load(): readonly GachaRecord[];
  previewText(text: string, source: Exclude<GachaDataSource, 'local-cache'>): GachaImportResult;
  importText(
    text: string,
    source: Exclude<GachaDataSource, 'local-cache'>,
  ): {
    readonly records: readonly GachaRecord[];
    readonly summary: GachaImportSummary;
  };
  clear(): void;
}

const storageKey = 'ggh:gacha-records:v1';
const bannerTypes: readonly GachaBannerType[] = ['limited-agent', 'limited-w-engine', 'standard'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBannerType(value: unknown): value is GachaBannerType {
  return typeof value === 'string' && bannerTypes.includes(value as GachaBannerType);
}

function parseDate(value: unknown): string | null {
  if (typeof value !== 'string' || Number.isNaN(new Date(value).getTime())) return null;
  return new Date(value).toISOString();
}

export function parseGachaImport(payload: unknown): GachaImportResult {
  if (!isRecord(payload) || !Array.isArray(payload.records)) {
    return {
      records: [],
      rejectedRecords: 0,
      normalizedRecords: 0,
      issues: ['未找到 records 数组。'],
    };
  }
  const records: GachaRecord[] = [];
  const issues: string[] = [];
  let rejectedRecords = 0;
  let normalizedRecords = 0;

  for (const [index, item] of payload.records.entries()) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      !item.id.trim() ||
      typeof item.itemName !== 'string' ||
      !item.itemName.trim()
    ) {
      rejectedRecords += 1;
      issues.push(`第 ${index + 1} 条缺少记录标识或物品名称。`);
      continue;
    }
    if (item.rarity !== 3 && item.rarity !== 4 && item.rarity !== 5) {
      rejectedRecords += 1;
      issues.push(`第 ${index + 1} 条稀有度无效。`);
      continue;
    }
    const pulledAt = parseDate(item.pulledAt);
    if (!pulledAt) {
      rejectedRecords += 1;
      issues.push(`第 ${index + 1} 条时间格式无效。`);
      continue;
    }
    const isNormalized =
      !isBannerType(item.bannerType) ||
      (item.itemType !== 'agent' && item.itemType !== 'w-engine') ||
      typeof item.isLimited !== 'boolean' ||
      item.gameId !== 'zenless-zone-zero';
    if (isNormalized) normalizedRecords += 1;
    records.push({
      id: item.id.trim(),
      gameId: 'zenless-zone-zero',
      uid: typeof item.uid === 'string' && item.uid.trim() ? item.uid.trim() : undefined,
      bannerType: isBannerType(item.bannerType) ? item.bannerType : 'limited-agent',
      bannerId: typeof item.bannerId === 'string' ? item.bannerId : undefined,
      itemName: item.itemName.trim(),
      itemId: typeof item.itemId === 'string' ? item.itemId : undefined,
      itemType: item.itemType === 'w-engine' ? 'w-engine' : 'agent',
      rarity: item.rarity,
      pulledAt,
      pullIndex:
        typeof item.pullIndex === 'number' && Number.isInteger(item.pullIndex)
          ? item.pullIndex
          : undefined,
      source: item.source === 'clipboard' ? 'clipboard' : 'json',
      isLimited: item.isLimited === true,
    });
  }
  return { records, rejectedRecords, normalizedRecords, issues };
}

export function mergeGachaRecords(
  existing: readonly GachaRecord[],
  incoming: readonly GachaRecord[],
): { readonly records: readonly GachaRecord[]; readonly duplicateRecords: number } {
  const known = new Set(
    existing.map(
      (record) => `${record.gameId ?? 'zenless-zone-zero'}:${record.uid ?? ''}:${record.id}`,
    ),
  );
  let duplicateRecords = 0;
  const additions = incoming.filter((record) => {
    const key = `${record.gameId ?? 'zenless-zone-zero'}:${record.uid ?? ''}:${record.id}`;
    if (known.has(key)) {
      duplicateRecords += 1;
      return false;
    }
    known.add(key);
    return true;
  });
  return {
    records: [...existing, ...additions].sort(
      (left, right) => new Date(right.pulledAt).getTime() - new Date(left.pulledAt).getTime(),
    ),
    duplicateRecords,
  };
}

export class LocalGachaRepository implements GachaRepository {
  load() {
    try {
      if (typeof window === 'undefined') return [];
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return [];
      return parseGachaImport(JSON.parse(raw)).records;
    } catch {
      return [];
    }
  }

  save(records: readonly GachaRecord[]) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify({ records }));
  }

  clear() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(storageKey);
  }
}

export class LocalGachaDataProvider implements GachaDataProvider {
  constructor(private readonly repository: GachaRepository = new LocalGachaRepository()) {}

  load() {
    return this.repository.load();
  }

  previewText(text: string, _source: Exclude<GachaDataSource, 'local-cache'>) {
    void _source;
    try {
      return parseGachaImport(JSON.parse(text));
    } catch {
      return {
        records: [],
        rejectedRecords: 0,
        normalizedRecords: 0,
        issues: ['JSON 格式无效，请检查逗号、引号和括号。'],
      };
    }
  }

  importText(text: string, source: Exclude<GachaDataSource, 'local-cache'>) {
    const result = this.previewText(text, source);
    if (!result.records.length) {
      const summary: GachaImportSummary = {
        ...result,
        acceptedRecords: 0,
        duplicateRecords: 0,
        totalRecords: this.load().length,
      };
      return { records: this.load(), summary };
    }
    const merged = mergeGachaRecords(this.load(), result.records);
    this.repository.save(merged.records);
    return {
      records: merged.records,
      summary: {
        ...result,
        acceptedRecords: result.records.length - merged.duplicateRecords,
        duplicateRecords: merged.duplicateRecords,
        totalRecords: merged.records.length,
      },
    };
  }

  clear() {
    this.repository.clear();
  }
}

function getFiveStarPities(records: readonly GachaRecord[]) {
  const pities: number[] = [];
  let pullsSinceFiveStar = 0;
  for (const record of [...records].sort((left, right) =>
    left.pulledAt.localeCompare(right.pulledAt),
  )) {
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

export function analyzeGachaHistory(records: readonly GachaRecord[]): GachaAnalytics {
  const chronological = [...records].sort((left, right) =>
    left.pulledAt.localeCompare(right.pulledAt),
  );
  const pities = getFiveStarPities(chronological);
  const fiveStarCount = pities.length;
  const averageFiveStarPity = fiveStarCount
    ? pities.reduce((sum, pity) => sum + pity, 0) / fiveStarCount
    : null;
  const currentPity =
    chronological.length - chronological.map((record) => record.rarity).lastIndexOf(5) - 1;
  const expectedPity = 80;
  const averageDelta = averageFiveStarPity === null ? 0 : expectedPity - averageFiveStarPity;
  const earlyPullBonus = pities.length ? Math.max(0, expectedPity - Math.min(...pities)) * 0.4 : 0;
  const luckScore = Math.round(
    Math.min(100, Math.max(0, 50 + averageDelta * 1.4 + earlyPullBonus)),
  );
  return {
    totalPulls: chronological.length,
    fiveStarCount,
    limitedWinCount: chronological.filter((record) => record.rarity === 5 && record.isLimited)
      .length,
    averageFiveStarPity,
    bestFiveStarPity: pities.length ? Math.min(...pities) : null,
    worstFiveStarPity: pities.length ? Math.max(...pities) : null,
    currentPity,
    guaranteeCount: chronological.filter((record) => record.rarity === 5 && !record.isLimited)
      .length,
    luckScore,
    luckLabel: getLuckLabel(luckScore),
  };
}

export function buildGachaAnalysis(records: readonly GachaRecord[]): GachaAnalysis {
  const analytics = analyzeGachaHistory(records);
  const fiveStarPities = getFiveStarPities(records);
  const fiveStarRecords = records.filter((record) => record.rarity === 5);
  const limitedWinCount = fiveStarRecords.filter((record) => record.isLimited).length;
  return {
    statistics: {
      ...analytics,
      threeStarCount: records.filter((record) => record.rarity === 3).length,
      fourStarCount: records.filter((record) => record.rarity === 4).length,
      limitedLossCount: fiveStarRecords.length - limitedWinCount,
      limitedWinRate: fiveStarRecords.length ? limitedWinCount / fiveStarRecords.length : null,
      fiveStarPities,
    },
    banners: bannerTypes.map((bannerType) => {
      const bannerRecords = records.filter((record) => record.bannerType === bannerType);
      const latestFiveStarIndex = bannerRecords.map((record) => record.rarity).lastIndexOf(5);
      return {
        bannerType,
        pullCount: bannerRecords.length,
        fiveStarCount: bannerRecords.filter((record) => record.rarity === 5).length,
        currentPity:
          latestFiveStarIndex === -1
            ? bannerRecords.length
            : bannerRecords.length - latestFiveStarIndex - 1,
      };
    }),
  };
}
