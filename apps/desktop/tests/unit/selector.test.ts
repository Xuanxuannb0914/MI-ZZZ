import { describe, expect, it } from 'vitest';
import { LatestLinkSelector } from '../../src/main/star-rail/selector';
import type { FileSystemAdapter, LinkCandidate } from '../../src/main/star-rail/types';

function mockFs(modifiedTimes: Record<string, number>): FileSystemAdapter {
  return {
    exists: () => true,
    readFileBinary: () => null,
    listSubDirectories: () => [],
    statModifiedTime: (path: string) => modifiedTimes[path] ?? null,
  };
}

function candidate(file: string, offset: number, time: number): LinkCandidate {
  return {
    url: `https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog?authkey=f1xture-${file}-${offset}`,
    sourceFile: { path: file, modifiedAt: time },
    offset,
  };
}

describe('LatestLinkSelector', () => {
  it('returns null for an empty list', () => {
    const selector = new LatestLinkSelector(mockFs({}));
    expect(selector.select([])).toBeNull();
  });

  it('returns the sole candidate', () => {
    const selector = new LatestLinkSelector(mockFs({}));
    const c = candidate('v1/Cache/Cache_Data/data_2', 100, 1000);
    expect(selector.select([c])).toBe(c);
  });

  it('prefers the candidate from a newer file (by mtime)', () => {
    const fs = mockFs({
      'v1/Cache/Cache_Data/data_2': 1000,
      'v2/Cache/Cache_Data/data_2': 2000,
    });
    const selector = new LatestLinkSelector(fs);
    const old = candidate('v1/Cache/Cache_Data/data_2', 100, 1000);
    const fresh = candidate('v2/Cache/Cache_Data/data_2', 200, 2000);
    expect(selector.select([old, fresh])).toBe(fresh);
  });

  it('uses the fallback modifiedAt when statModifiedTime returns null', () => {
    const fs = mockFs({});
    const selector = new LatestLinkSelector(fs);
    const old = candidate('v1/data_2', 100, 1000);
    const fresh = candidate('v2/data_2', 200, 2000);
    expect(selector.select([old, fresh])).toBe(fresh);
  });

  it('breaks ties by later offset when files have the same mtime', () => {
    const fs = mockFs({
      'v1/Cache/Cache_Data/data_2': 1000,
      'v2/Cache/Cache_Data/data_2': 1000,
    });
    const selector = new LatestLinkSelector(fs);
    const early = candidate('v1/Cache/Cache_Data/data_2', 100, 1000);
    const later = candidate('v2/Cache/Cache_Data/data_2', 200, 1000);
    expect(selector.select([early, later])).toBe(later);
  });
});
