import { readFileSync } from 'node:fs';
import type { CacheFileReaderLike } from './types';

export type CacheReadStatus = 'ok' | 'not-found' | 'in-use' | 'permission-denied' | 'unknown-error';

export interface CacheReadResult {
  readonly status: CacheReadStatus;
  readonly data: Uint8Array | null;
}

/**
 * Reads a cache data file as raw binary, preferring read-only access and
 * distinguishing transient read failures (file in use / permissions) from
 * missing files. Never modifies, locks, or writes back the original file.
 */
export class CacheFileReader implements CacheFileReaderLike {
  readDataFile(filePath: string): Uint8Array | null {
    return this.read(filePath).data;
  }

  read(filePath: string): CacheReadResult {
    try {
      const buffer = readFileSync(filePath);
      return { status: 'ok', data: new Uint8Array(buffer) };
    } catch (error) {
      return { status: this.classifyError(error), data: null };
    }
  }

  private classifyError(error: unknown): CacheReadStatus {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') return 'not-found';
    if (code === 'EACCES' || code === 'EPERM') return 'permission-denied';
    if (code === 'EBUSY' || code === 'EMFILE' || code === 'ENFILE') return 'in-use';
    return 'unknown-error';
  }
}
