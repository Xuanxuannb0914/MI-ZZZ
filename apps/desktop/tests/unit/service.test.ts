import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { CacheFileReader, type CacheReadResult } from '../../src/main/star-rail/cache-file-reader';
import { CacheScanner } from '../../src/main/star-rail/scanner';
import { LatestLinkSelector } from '../../src/main/star-rail/selector';
import {
  StarRailGachaService,
  type StarRailGachaServiceDeps,
} from '../../src/main/star-rail/service';
import type { ClipboardServiceLike, FileSystemAdapter } from '../../src/main/star-rail/types';
import { GachaUrlExtractor } from '../../src/main/star-rail/url-extractor';
import { GachaLinkValidator } from '../../src/main/star-rail/validator';
import { makeFixtureGachaUrl, toBinary } from '../helpers/gacha-fixtures';
import { createNodeFileSystem, starRailFixture } from '../helpers/node-file-system';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function createTempCacheRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'star-rail-gacha-'));
  tempDirs.push(dir);
  return dir;
}

function buildService(
  root: string,
  overrides: Partial<StarRailGachaServiceDeps> = {},
): StarRailGachaService {
  const fs: FileSystemAdapter = overrides.fs ?? createNodeFileSystem();
  const scanner = new CacheScanner(fs);
  const extractor = new GachaUrlExtractor();
  const validator = new GachaLinkValidator();
  const selector = new LatestLinkSelector(fs);
  const reader: { read(filePath: string): CacheReadResult } =
    overrides.reader ?? new CacheFileReader();
  const clipboard: ClipboardServiceLike = overrides.clipboard ?? { copy: () => true };

  return new StarRailGachaService({
    fs,
    resolveCacheRoot: () => root,
    scanner,
    reader,
    extractor,
    validator,
    selector,
    clipboard,
    ...(overrides.onProgress ? { onProgress: overrides.onProgress } : {}),
  });
}

describe('StarRailGachaService', () => {
  it('reports cache-dir-not-found when the cache root is missing', () => {
    const service = buildService(starRailFixture('missing-root'));
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('cache-dir-not-found');
    expect(result.message).toContain('未找到星穹铁道缓存目录');
  });

  it('reports no-version-dirs when the root exists but is empty', () => {
    const service = buildService(starRailFixture('no-version-cache'));
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('no-version-dirs');
    expect(result.message).toContain('没有找到有效缓存版本');
  });

  it('reports no-cache-file when no data_2 file exists', () => {
    const service = buildService(starRailFixture('no-data-cache'));
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('no-cache-file');
    expect(result.message).toContain('未找到抽卡缓存文件');
  });

  it('extracts, validates and copies a single valid URL', () => {
    const copied: string[] = [];
    const service = buildService(starRailFixture('valid-cache'), {
      clipboard: {
        copy: (text: string) => {
          copied.push(text);
          return true;
        },
      },
    });
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('success');
    expect(result.candidateCount).toBe(1);
    expect(result.link).toContain('f1xture-valid-authkey');
    expect(copied).toHaveLength(1);
    expect(copied[0]).toBe(result.link);
    expect(result.message).toContain('已复制到剪贴板');
  });

  it('collects candidates from multiple version directories', () => {
    const service = buildService(starRailFixture('multiple-cache'));
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('success');
    expect(result.candidateCount).toBe(2);
  });

  it('picks the link from the newest cache file by mtime', () => {
    const root = createTempCacheRoot();
    const older = makeFixtureGachaUrl('f1xture-temp-old', '100000010');
    const newer = makeFixtureGachaUrl('f1xture-temp-new', '100000011');

    const olderFile = join(root, '1.0.0', 'Cache', 'Cache_Data', 'data_2');
    const newerFile = join(root, '1.0.1', 'Cache', 'Cache_Data', 'data_2');
    mkdirSync(join(root, '1.0.0', 'Cache', 'Cache_Data'), { recursive: true });
    mkdirSync(join(root, '1.0.1', 'Cache', 'Cache_Data'), { recursive: true });
    writeFileSync(olderFile, toBinary(older, '\x00'));
    writeFileSync(newerFile, toBinary(newer, '\x00'));
    // Deterministic mtimes so the test does not depend on file creation order.
    utimesSync(olderFile, new Date(1000000), new Date(1000000));
    utimesSync(newerFile, new Date(2000000), new Date(2000000));

    const service = buildService(root);
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('success');
    expect(result.link).toContain('f1xture-temp-new');
  });

  it('reports invalid-url when URLs are found but none validate', () => {
    const service = buildService(starRailFixture('invalid-cache'));
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('invalid-url');
    expect(result.message).toContain('数据不完整');
  });

  it('reports no-url-found for an empty cache file', () => {
    const service = buildService(starRailFixture('empty-cache'));
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('no-url-found');
    expect(result.message).toContain('没有找到抽卡记录链接');
  });

  it('reports no-url-found for pure binary noise', () => {
    const service = buildService(starRailFixture('corrupted-cache'));
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('no-url-found');
  });

  it('reports file-in-use when the cache read fails as busy', () => {
    const service = buildService(starRailFixture('valid-cache'), {
      reader: { read: () => ({ status: 'in-use', data: null }) },
    });
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('file-in-use');
    expect(result.message).toContain('请关闭星穹铁道后重试');
  });

  it('reports permission-denied when the cache read is blocked', () => {
    const service = buildService(starRailFixture('valid-cache'), {
      reader: { read: () => ({ status: 'permission-denied', data: null }) },
    });
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('permission-denied');
    expect(result.message).toContain('读取游戏缓存的权限');
  });

  it('still succeeds with a clipboard-failed code when copying fails', () => {
    const service = buildService(starRailFixture('valid-cache'), {
      clipboard: { copy: () => false },
    });
    const result = service.getStarRailGachaLink();
    expect(result.status).toBe('success');
    expect(result.link).toBeDefined();
    expect(result.errorCode).toBe('clipboard-failed');
    expect(result.message).toContain('请手动复制');
  });

  it('emits progress phases in order', () => {
    const phases: string[] = [];
    const service = buildService(starRailFixture('valid-cache'), {
      onProgress: (phase: string) => phases.push(phase),
    });
    service.getStarRailGachaLink();
    expect(phases).toEqual([
      'locating-cache',
      'scanning-versions',
      'reading-cache',
      'parsing-urls',
      'validating-urls',
    ]);
  });
});
