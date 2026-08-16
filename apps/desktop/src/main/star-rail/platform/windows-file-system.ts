import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { FileSystemAdapter } from '../types';

/**
 * Platform abstraction over the local file system.
 *
 * Windows is supported today; other platforms (macOS/Linux) can add their
 * own adapter without leaking process.env into business logic.
 */
export interface PlatformFileSystem extends FileSystemAdapter {
  readonly platform: NodeJS.Platform;
  resolveCacheRoot(): string;
}

/**
 * Windows file system adapter.
 * Resolves %USERPROFILE% at runtime; never hardcodes a username.
 */
export class WindowsFileSystem implements PlatformFileSystem {
  readonly platform: NodeJS.Platform = 'win32';

  constructor(
    private readonly userProfile: string | undefined = process.env.USERPROFILE,
    private readonly relativeCachePath: string,
  ) {}

  resolveCacheRoot(): string {
    if (!this.userProfile) {
      throw new Error('USERPROFILE is not defined in this environment.');
    }
    return join(this.userProfile, ...this.relativeCachePath.split('/'));
  }

  exists(path: string): boolean {
    return existsSync(path);
  }

  readFileBinary(path: string): Uint8Array | null {
    try {
      return readFileSync(path);
    } catch {
      return null;
    }
  }

  listSubDirectories(path: string): readonly string[] {
    try {
      return readdirSync(path, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(path, entry.name));
    } catch {
      return [];
    }
  }

  statModifiedTime(path: string): number | null {
    try {
      return statSync(path).mtimeMs;
    } catch {
      return null;
    }
  }
}

/** Default cache root used by the Star Rail service. */
export function createWindowsFileSystem(
  relativeCachePath: string,
  userProfile: string | undefined = process.env.USERPROFILE,
): WindowsFileSystem {
  return new WindowsFileSystem(userProfile, relativeCachePath);
}
