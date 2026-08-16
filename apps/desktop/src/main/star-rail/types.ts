/**
 * Result of a single Star Rail local cache scan.
 * All sensitive payloads (authkey/cookie) are kept in memory only
 * and never persisted, logged, or transmitted.
 */
export interface StarRailGachaLinkResult {
  readonly status: 'success' | 'error';
  readonly link?: string | undefined;
  readonly candidateCount: number;
  readonly message: string;
  readonly errorCode?:
    | 'cache-dir-not-found'
    | 'no-version-dirs'
    | 'no-cache-file'
    | 'file-in-use'
    | 'permission-denied'
    | 'no-url-found'
    | 'invalid-url'
    | 'clipboard-failed'
    | 'unknown'
    | undefined;
}

export type ScanPhase =
  | 'locating-cache'
  | 'scanning-versions'
  | 'reading-cache'
  | 'parsing-urls'
  | 'validating-urls';

export interface ScanProgress {
  readonly phase: ScanPhase;
  readonly message: string;
}

export interface CacheFileSummary {
  readonly path: string;
  readonly modifiedAt: number;
}

export interface CacheFileInfo {
  readonly path: string;
  readonly modifiedAt: number;
}

export interface CacheFileReaderLike {
  readDataFile(filePath: string): Uint8Array | null;
}

export interface FileSystemAdapter {
  exists(path: string): boolean;
  readFileBinary(path: string): Uint8Array | null;
  listSubDirectories(path: string): readonly string[];
  statModifiedTime(path: string): number | null;
}

export interface LinkCandidate {
  readonly url: string;
  readonly sourceFile: CacheFileInfo;
  /** Byte offset where the URL starts in the data file, used to prefer later-found URLs. */
  readonly offset: number;
}

export type GachaLinkValidatorLike = {
  validate(url: string): boolean;
};

export type LatestLinkSelectorLike = {
  select(
    candidates: readonly LinkCandidate[],
    fileModified?: (path: string) => number | null,
  ): LinkCandidate | null;
};

export type UrlExtractorLike = {
  extractUrl(buffer: Uint8Array): string | null;
  extractAll(buffer: Uint8Array): readonly { readonly url: string; readonly offset: number }[];
};

export type ClipboardServiceLike = {
  copy(text: string): boolean;
};
