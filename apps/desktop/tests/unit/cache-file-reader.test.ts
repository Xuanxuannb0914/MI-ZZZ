import { describe, expect, it } from 'vitest';
import { CacheFileReader } from '../../src/main/star-rail/cache-file-reader';
import { starRailFixture } from '../helpers/node-file-system';

const reader = new CacheFileReader();

describe('CacheFileReader', () => {
  it('reads an existing binary cache file as Uint8Array', () => {
    const result = reader.read(starRailFixture('valid-cache/1.0.0/Cache/Cache_Data/data_2'));
    expect(result.status).toBe('ok');
    expect(result.data).toBeInstanceOf(Uint8Array);
    expect(result.data?.length ?? 0).toBeGreaterThan(0);
  });

  it('returns not-found for a missing file', () => {
    const result = reader.read(starRailFixture('missing-root/data_2'));
    expect(result.status).toBe('not-found');
    expect(result.data).toBeNull();
  });

  it('readDataFile returns null for a missing file', () => {
    expect(reader.readDataFile(starRailFixture('missing-root/data_2'))).toBeNull();
  });
});
