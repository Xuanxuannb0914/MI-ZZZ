export type RuntimeEnvironment = 'development' | 'test' | 'staging' | 'production';
export type DesktopPlatform = 'darwin' | 'win32' | 'linux';

export interface LoggerLike {
  debug(message: string, context?: string): void;
  info(message: string, context?: string): void;
  warn(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
}

export interface DesktopEnvironmentInfo {
  readonly environment: RuntimeEnvironment;
  readonly platform: DesktopPlatform;
  readonly version: string;
}

export type StarRailGachaScanPhase =
  | 'locating-cache'
  | 'scanning-versions'
  | 'reading-cache'
  | 'parsing-urls'
  | 'validating-urls';

export type StarRailGachaErrorCode =
  | 'cache-dir-not-found'
  | 'no-version-dirs'
  | 'no-cache-file'
  | 'file-in-use'
  | 'permission-denied'
  | 'no-url-found'
  | 'invalid-url'
  | 'clipboard-failed'
  | 'unknown';

export interface StarRailGachaLinkResult {
  readonly status: 'success' | 'error';
  /** The extracted link. Only present on success; kept in memory, never persisted. */
  readonly link?: string | undefined;
  readonly candidateCount: number;
  readonly message: string;
  readonly errorCode?: StarRailGachaErrorCode | undefined;
}

export interface StarRailGachaScanProgress {
  readonly phase: StarRailGachaScanPhase;
  readonly message: string;
}

export interface DesktopBridge {
  readonly app: {
    getEnvironment(): Promise<DesktopEnvironmentInfo>;
  };
  readonly starRail: {
    getGachaLink(): Promise<StarRailGachaLinkResult>;
  };
}
