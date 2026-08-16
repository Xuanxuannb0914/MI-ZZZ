import type { CacheReadResult } from './cache-file-reader';
import type {
  CacheFileInfo,
  ClipboardServiceLike,
  FileSystemAdapter,
  GachaLinkValidatorLike,
  LatestLinkSelectorLike,
  LinkCandidate,
  ScanPhase,
  StarRailGachaLinkResult,
  UrlExtractorLike,
} from './types';

export interface StarRailGachaServiceDeps {
  readonly fs: FileSystemAdapter;
  readonly resolveCacheRoot: () => string;
  readonly scanner: {
    collectAllDataFiles(cacheRoot: string): readonly CacheFileInfo[];
    scanVersionDirectories(cacheRoot: string): readonly string[];
  };
  readonly reader: { read(filePath: string): CacheReadResult };
  readonly extractor: UrlExtractorLike;
  readonly validator: GachaLinkValidatorLike;
  readonly selector: LatestLinkSelectorLike;
  readonly clipboard: ClipboardServiceLike;
  readonly onProgress?: (phase: ScanPhase, message: string) => void;
}

const MESSAGES = {
  cacheDirNotFound: '未找到星穹铁道缓存目录，请确认游戏已经在本机启动过。',
  noVersionDirs: '检测到游戏缓存目录，但没有找到有效缓存版本。',
  noCacheFile: '未找到抽卡缓存文件，请先进入游戏打开一次抽卡记录后重试。',
  fileInUse: '抽卡缓存文件当前正在被游戏使用，请关闭星穹铁道后重试。',
  permissionDenied: '当前没有读取游戏缓存的权限，请检查 Windows 文件权限。',
  noUrlFound: '没有找到抽卡记录链接，请先在游戏内打开一次抽卡记录页面，然后重新获取。',
  invalidUrl: '检测到抽卡链接，但数据不完整，请关闭游戏后重新打开抽卡记录并再次获取。',
  clipboardFailed: '已找到抽卡记录链接，但无法自动复制，请手动复制。',
} as const;

type ErrorCode = NonNullable<StarRailGachaLinkResult['errorCode']>;

/**
 * End-to-end local extraction of the Star Rail gacha record link.
 *
 * Flow: locate cache root -> scan version dirs -> read data_2 (binary) ->
 * extract URLs -> validate format -> pick latest -> copy to clipboard.
 *
 * LOCAL ONLY: never performs a network request, never uploads data, and
 * never persists the extracted link. The URL (and its authkey/cookie) stays
 * in memory only.
 */
export class StarRailGachaService {
  constructor(private readonly deps: StarRailGachaServiceDeps) {}

  /** Single public entry point used by the UI/IPC layer. */
  getStarRailGachaLink(): StarRailGachaLinkResult {
    const { fs, resolveCacheRoot } = this.deps;

    let cacheRoot: string;
    try {
      cacheRoot = resolveCacheRoot();
    } catch {
      return this.error('cache-dir-not-found', MESSAGES.cacheDirNotFound);
    }

    this.progress('locating-cache', '正在定位缓存目录');
    if (!fs.exists(cacheRoot)) {
      return this.error('cache-dir-not-found', MESSAGES.cacheDirNotFound);
    }

    this.progress('scanning-versions', '正在扫描版本目录');
    const dataFiles = this.deps.scanner.collectAllDataFiles(cacheRoot);
    if (dataFiles.length === 0) {
      // Distinguish "no version dirs" from "no data_2 files".
      const versionDirs = this.deps.scanner.scanVersionDirectories(cacheRoot);
      return this.error(
        versionDirs.length === 0 ? 'no-version-dirs' : 'no-cache-file',
        versionDirs.length === 0 ? MESSAGES.noVersionDirs : MESSAGES.noCacheFile,
      );
    }

    this.progress('reading-cache', '正在读取缓存');
    const candidates: LinkCandidate[] = [];
    let foundAnyUrl = false;

    for (const dataFile of dataFiles) {
      const read = this.deps.reader.read(dataFile.path);
      if (read.status !== 'ok' || read.data === null) {
        const error = this.mapReadError(read);
        if (error) return error;
        continue;
      }

      this.progress('parsing-urls', '正在解析抽卡链接');
      const extracted = this.extractCandidates(read.data, dataFile);
      foundAnyUrl = foundAnyUrl || extracted.length > 0;
      for (const candidate of extracted) {
        if (this.deps.validator.validate(candidate.url)) {
          candidates.push(candidate);
        }
      }
    }

    if (!foundAnyUrl) {
      return this.error('no-url-found', MESSAGES.noUrlFound);
    }
    if (candidates.length === 0) {
      return this.error('invalid-url', MESSAGES.invalidUrl);
    }

    this.progress('validating-urls', '正在验证数据格式');
    const selected = this.deps.selector.select(candidates);
    if (!selected) {
      return this.error('invalid-url', MESSAGES.invalidUrl);
    }

    const copied = this.deps.clipboard.copy(selected.url);
    return {
      status: 'success',
      link: selected.url,
      candidateCount: candidates.length,
      message: copied ? '抽卡记录链接已复制到剪贴板' : MESSAGES.clipboardFailed,
      errorCode: copied ? undefined : 'clipboard-failed',
    };
  }

  private extractCandidates(data: Uint8Array, sourceFile: CacheFileInfo): readonly LinkCandidate[] {
    return this.deps.extractor.extractAll(data).map((entry) => ({
      url: entry.url,
      sourceFile,
      offset: entry.offset,
    }));
  }

  private mapReadError(read: { readonly status: string }): StarRailGachaLinkResult | null {
    if (read.status === 'in-use') {
      return this.error('file-in-use', MESSAGES.fileInUse);
    }
    if (read.status === 'permission-denied') {
      return this.error('permission-denied', MESSAGES.permissionDenied);
    }
    return null;
  }

  private error(errorCode: ErrorCode, message: string): StarRailGachaLinkResult {
    return { status: 'error', candidateCount: 0, message, errorCode };
  }

  private progress(phase: ScanPhase, message: string): void {
    this.deps.onProgress?.(phase, message);
  }
}
