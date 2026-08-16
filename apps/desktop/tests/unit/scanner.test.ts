import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CacheScanner } from '../../src/main/star-rail/scanner';
import { createNodeFileSystem, starRailFixture } from '../helpers/node-file-system';

describe('CacheScanner', () => {
  it('returns no version dirs when the root does not exist', () => {
    const root = starRailFixture('missing-root');
    const scanner = new CacheScanner(createNodeFileSystem());
    expect(scanner.scanVersionDirectories(root)).toEqual([]);
    expect(scanner.collectAllDataFiles(root)).toEqual([]);
  });

  it('returns an empty list when the root has no version directories', () => {
    const root = starRailFixture('no-version-cache');
    const scanner = new CacheScanner(createNodeFileSystem());
    expect(scanner.scanVersionDirectories(root)).toEqual([]);
  });

  it('lists version directories that contain a Cache folder', () => {
    const root = starRailFixture('valid-cache');
    const scanner = new CacheScanner(createNodeFileSystem());
    expect(scanner.scanVersionDirectories(root)).toEqual([join(root, '1.0.0')]);
  });

  it('finds the data_2 file inside a version directory', () => {
    const root = starRailFixture('valid-cache');
    const scanner = new CacheScanner(createNodeFileSystem());
    expect(scanner.findDataFile(join(root, '1.0.0'))).toBe(
      join(root, '1.0.0', 'Cache', 'Cache_Data', 'data_2'),
    );
  });

  it('returns null for a version dir without data_2', () => {
    const root = starRailFixture('no-data-cache');
    const scanner = new CacheScanner(createNodeFileSystem());
    expect(scanner.findDataFile(join(root, '1.0.0'))).toBeNull();
  });

  it('collects data files from every version directory', () => {
    const root = starRailFixture('multiple-cache');
    const scanner = new CacheScanner(createNodeFileSystem());
    const files = scanner.collectAllDataFiles(root);
    expect(files).toHaveLength(2);
    for (const file of files) {
      expect(file.path.endsWith(join('Cache', 'Cache_Data', 'data_2'))).toBe(true);
      expect(file.modifiedAt).toBeGreaterThan(0);
    }
  });
});
