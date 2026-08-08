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

export interface DesktopBridge {
  readonly app: {
    getEnvironment(): Promise<DesktopEnvironmentInfo>;
  };
}
