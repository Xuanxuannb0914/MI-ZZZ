import { describe, expect, it } from 'vitest';
import { analyzeGachaHistory, parseGachaImport } from './gacha';

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

  it('accepts only records with required import fields', () => {
    const result = parseGachaImport({
      records: [
        { id: 'valid', itemName: '测试代理人', rarity: 5 },
        { id: 42, itemName: '无效记录', rarity: 4 },
      ],
    });

    expect(result.records).toHaveLength(1);
    expect(result.rejectedRecords).toBe(1);
  });
});
