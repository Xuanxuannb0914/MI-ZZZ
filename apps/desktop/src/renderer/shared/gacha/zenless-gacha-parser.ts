import {
  type GachaBannerType,
  type GachaImportResult,
  type GachaRecord,
  parseGachaImport,
} from './gacha-data';

interface UigfItem {
  readonly id?: string | number;
  readonly uid?: string | number;
  readonly gacha_type?: string | number;
  readonly banner_type?: string;
  readonly item_id?: string | number;
  readonly name?: string;
  readonly item_type?: string;
  readonly rank_type?: string | number;
  readonly time?: string;
  readonly timestamp?: string;
}

interface UigfPayload {
  readonly info?: { readonly game?: string; readonly uid?: string | number };
  readonly list?: readonly UigfItem[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function stableRecordId(parts: readonly string[]) {
  let hash = 2166136261;
  for (const character of parts.join('|')) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `uigf-${(hash >>> 0).toString(36)}`;
}

function bannerType(value: unknown): GachaBannerType {
  const token = (
    typeof value === 'string' || typeof value === 'number' ? String(value) : ''
  ).toLowerCase();
  if (
    token.includes('weapon') ||
    token.includes('engine') ||
    token.includes('音擎') ||
    token === '2'
  ) {
    return 'limited-w-engine';
  }
  if (token.includes('standard') || token.includes('常驻') || token === '3') return 'standard';
  return 'limited-agent';
}

function toIso(value: string | undefined) {
  if (!value) return undefined;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export interface GachaParser {
  readonly id: string;
  canParse(payload: unknown): boolean;
  parse(payload: unknown): GachaImportResult;
}

export class ZenlessGachaParser implements GachaParser {
  readonly id = 'zenless-uigf';

  canParse(payload: unknown) {
    return isObject(payload) && Array.isArray(payload.list);
  }

  parse(payload: unknown): GachaImportResult {
    if (!this.canParse(payload)) {
      return {
        records: [],
        rejectedRecords: 0,
        normalizedRecords: 0,
        issues: ['未识别为 UIGF 抽卡记录。'],
      };
    }
    const uigf = payload as UigfPayload;
    if (
      uigf.info?.game &&
      !['zzz', 'nap', 'zenless-zone-zero'].includes(uigf.info.game.toLowerCase())
    ) {
      return {
        records: [],
        rejectedRecords: 0,
        normalizedRecords: 0,
        issues: ['该 UIGF 文件不属于绝区零。'],
      };
    }
    const records = (uigf.list ?? []).map((item) => {
      const uid = item.uid === undefined ? uigf.info?.uid : item.uid;
      const pulledAt = toIso(item.time ?? item.timestamp);
      const id =
        item.id === undefined
          ? stableRecordId([
              String(uid ?? ''),
              String(item.gacha_type ?? item.banner_type ?? ''),
              item.name ?? '',
              pulledAt ?? '',
              String(item.item_id ?? ''),
            ])
          : String(item.id);
      return {
        id,
        gameId: 'zenless-zone-zero',
        uid: uid === undefined ? undefined : String(uid),
        bannerType: bannerType(item.gacha_type ?? item.banner_type),
        bannerId: item.gacha_type === undefined ? undefined : String(item.gacha_type),
        itemId: item.item_id === undefined ? undefined : String(item.item_id),
        itemName: item.name ?? '',
        itemType: /weapon|engine|音擎/i.test(item.item_type ?? '') ? 'w-engine' : 'agent',
        rarity: Number(item.rank_type),
        pulledAt: pulledAt ?? '',
        isLimited: false,
        source: 'json',
      };
    });
    return parseGachaImport({ records });
  }
}

export function exportZenlessUigf(records: readonly GachaRecord[]) {
  return {
    info: {
      export_app: 'Asteris',
      export_timestamp: new Date().toISOString(),
      game: 'zzz',
    },
    list: records.map((record) => ({
      id: record.id,
      uid: record.uid,
      gacha_type: record.bannerId ?? record.bannerType,
      item_id: record.itemId,
      name: record.itemName,
      item_type: record.itemType === 'w-engine' ? 'Weapon' : 'Character',
      rank_type: String(record.rarity),
      time: record.pulledAt,
    })),
  };
}
