import { CacheFileReader } from './cache-file-reader';
import { ElectronClipboardService } from './clipboard';
import { GACHA_API_HOST, GACHA_API_PATH, STAR_RAIL_CACHE_RELATIVE_PATH } from './constants';
import { createWindowsFileSystem, type PlatformFileSystem } from './platform/windows-file-system';
import { CacheScanner } from './scanner';
import { LatestLinkSelector } from './selector';
import { StarRailGachaService } from './service';
import type { ScanPhase } from './types';
import { GachaUrlExtractor } from './url-extractor';
import { GachaLinkValidator } from './validator';

export interface StarRailGachaFactory {
  readonly service: StarRailGachaService;
  readonly cacheRoot: string;
  readonly gachaApiHost: string;
  readonly gachaApiPath: string;
}

export interface CreateStarRailGachaFactoryOptions {
  readonly userProfile?: string | undefined;
  readonly onProgress?: (phase: ScanPhase, message: string) => void;
}

/**
 * Builds the production Star Rail gacha service with the Windows file
 * system adapter. The cache root is resolved at runtime from USERPROFILE.
 */
export function createStarRailGachaFactory(
  options: CreateStarRailGachaFactoryOptions = {},
): StarRailGachaFactory {
  const fs: PlatformFileSystem = createWindowsFileSystem(
    STAR_RAIL_CACHE_RELATIVE_PATH,
    options.userProfile,
  );
  const scanner = new CacheScanner(fs);
  const reader = new CacheFileReader();
  const extractor = new GachaUrlExtractor();
  const validator = new GachaLinkValidator();
  const selector = new LatestLinkSelector(fs);
  const clipboard = new ElectronClipboardService();

  const service = new StarRailGachaService({
    fs,
    resolveCacheRoot: () => fs.resolveCacheRoot(),
    scanner,
    reader,
    extractor,
    validator,
    selector,
    clipboard,
    ...(options.onProgress ? { onProgress: options.onProgress } : {}),
  });

  return {
    service,
    cacheRoot: safeResolveCacheRoot(fs),
    gachaApiHost: GACHA_API_HOST,
    gachaApiPath: GACHA_API_PATH,
  };
}

function safeResolveCacheRoot(fs: PlatformFileSystem): string {
  try {
    return fs.resolveCacheRoot();
  } catch {
    return '';
  }
}
