import { describe, expect, it } from 'vitest';
import { exportZenlessUigf, ZenlessGachaParser } from '../gacha/zenless-gacha-parser';
import {
  analyzeGachaHistory,
  buildGachaAnalysis,
  type GachaHistoryItem,
  LocalGachaDataProvider,
  mergeGachaRecords,
  parseGachaImport,
} from './gacha';

describe('gacha analytics', () => {
  it('derives pity and an explainable luck score from records', () => {
    const analytics = analyzeGachaHistory([
      {
        id: '1',
        bannerType: 'limited-agent',
        itemName: '测试音擎',
        itemType: 'w-engine',
        rarity: 3,
        pulledAt: '2026-01-01T00:00:00.000Z',
        isLimited: false,
      },
      {
        id: '2',
        bannerType: 'limited-agent',
        itemName: '测试代理人',
        itemType: 'agent',
        rarity: 5,
        pulledAt: '2026-01-01T00:01:00.000Z',
        isLimited: true,
      },
      {
        id: '3',
        bannerType: 'limited-agent',
        itemName: '测试音擎',
        itemType: 'w-engine',
        rarity: 4,
        pulledAt: '2026-01-01T00:02:00.000Z',
        isLimited: false,
      },
    ]);

    expect(analytics).toMatchObject({
      totalPulls: 3,
      fiveStarCount: 1,
      limitedWinCount: 1,
      averageFiveStarPity: 2,
      currentPity: 1,
    });
    expect(analytics.luckScore).toBeGreaterThan(50);
  });

  it('validates date and required import fields before accepting records', () => {
    const result = parseGachaImport({
      records: [
        {
          id: 'valid',
          itemName: '测试代理人',
          rarity: 5,
          pulledAt: '2026-01-01T00:00:00.000Z',
        },
        { id: 42, itemName: '无效记录', rarity: 4 },
        { id: 'invalid-date', itemName: '无效时间', rarity: 4, pulledAt: 'not-a-date' },
      ],
    });

    expect(result.records).toHaveLength(1);
    expect(result.rejectedRecords).toBe(2);
  });

  it('aggregates rarity and per-banner pity without random data', () => {
    const analysis = buildGachaAnalysis([
      {
        id: '1',
        bannerType: 'limited-agent',
        itemName: '测试角色',
        itemType: 'agent',
        rarity: 5,
        pulledAt: '2026-01-01T00:00:00.000Z',
        isLimited: true,
      },
      {
        id: '2',
        bannerType: 'limited-agent',
        itemName: '测试音擎',
        itemType: 'w-engine',
        rarity: 4,
        pulledAt: '2026-01-01T00:01:00.000Z',
        isLimited: false,
      },
      {
        id: '3',
        bannerType: 'standard',
        itemName: '测试材料',
        itemType: 'w-engine',
        rarity: 3,
        pulledAt: '2026-01-01T00:02:00.000Z',
        isLimited: false,
      },
    ]);

    expect(analysis.statistics).toMatchObject({
      threeStarCount: 1,
      fourStarCount: 1,
      limitedWinCount: 1,
      limitedLossCount: 0,
      limitedWinRate: 1,
      fiveStarPities: [1],
    });
    expect(analysis.banners).toContainEqual(
      expect.objectContaining({ bannerType: 'limited-agent', currentPity: 1, pullCount: 2 }),
    );
  });

  it('deduplicates records and persists imports through the provider boundary', () => {
    let stored: readonly GachaHistoryItem[] = [];
    const provider = new LocalGachaDataProvider({
      load: () => stored,
      save: (records) => {
        stored = records;
      },
      clear: () => {
        stored = [];
      },
    });
    const payload = JSON.stringify({
      records: [
        {
          id: 'same-record',
          itemName: '测试代理人',
          rarity: 5,
          pulledAt: '2026-02-01T00:00:00.000Z',
          bannerType: 'limited-agent',
          itemType: 'agent',
          isLimited: true,
        },
      ],
    });

    expect(provider.importText(payload, 'json').summary).toMatchObject({
      acceptedRecords: 1,
      duplicateRecords: 0,
      totalRecords: 1,
    });
    expect(provider.importText(payload, 'clipboard').summary).toMatchObject({
      acceptedRecords: 0,
      duplicateRecords: 1,
      totalRecords: 1,
    });
    provider.clear();
    expect(provider.load()).toEqual([]);
  });

  it('handles a large chronological record set without changing calculated totals', () => {
    const records: GachaHistoryItem[] = Array.from({ length: 240 }, (_, index) => ({
      id: `record-${index}`,
      bannerType: index % 3 === 0 ? 'standard' : 'limited-agent',
      itemName: `测试物品 ${index}`,
      itemType: index % 2 === 0 ? 'agent' : 'w-engine',
      rarity: index % 80 === 79 ? 5 : index % 10 === 0 ? 4 : 3,
      pulledAt: `2026-03-${String((index % 28) + 1).padStart(2, '0')}T${String(index % 24).padStart(2, '0')}:00:00.000Z`,
      isLimited: index % 160 === 159,
    }));
    const merged = mergeGachaRecords(records.slice(0, 120), records.slice(120));
    const analysis = buildGachaAnalysis(merged.records);

    expect(analysis.statistics.totalPulls).toBe(240);
    expect(analysis.statistics.fiveStarCount).toBe(3);
  });

  it('parses ZZZ UIGF records into internal records with a stable identifier', () => {
    const parser = new ZenlessGachaParser();
    const result = parser.parse({
      info: { game: 'zzz', uid: '100000001' },
      list: [
        {
          gacha_type: '1',
          name: '测试代理人',
          item_type: 'Character',
          rank_type: '5',
          time: '2026-08-15 12:00:00',
        },
      ],
    });

    expect(result.records).toEqual([
      expect.objectContaining({
        gameId: 'zenless-zone-zero',
        uid: '100000001',
        itemType: 'agent',
        rarity: 5,
      }),
    ]);
    expect(result.records[0]?.id).toMatch(/^uigf-/);
  });

  it('rejects a UIGF payload explicitly marked for another game and exports local records', () => {
    const parser = new ZenlessGachaParser();
    expect(parser.parse({ info: { game: 'genshin' }, list: [] }).issues[0]).toContain(
      '不属于绝区零',
    );
    const exported = exportZenlessUigf([
      {
        id: 'export-1',
        gameId: 'zenless-zone-zero',
        itemName: '测试音擎',
        itemType: 'w-engine',
        bannerType: 'limited-w-engine',
        rarity: 4,
        pulledAt: '2026-08-15T00:00:00.000Z',
        isLimited: false,
      },
    ]);

    expect(exported.info.game).toBe('zzz');
    expect(exported.list[0]).toMatchObject({ name: '测试音擎', rank_type: '4' });
  });
});
