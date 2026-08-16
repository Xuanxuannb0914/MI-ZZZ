import { join } from 'node:path';
import { CACHE_DATA_FILE_RELATIVE } from './constants';
import type { CacheFileInfo, FileSystemAdapter } from './types';

/**
 * Scans the Star Rail webCaches directory for all version sub-directories
 * and locates the Cache/Cache_Data/data_2 file inside each one.
 */
export class CacheScanner {
  constructor(private readonly fs: FileSystemAdapter) {}

  /**
   * Enumerate all version directories under the webCaches root.
   * Returns directory paths that contain a Cache sub-directory, sorted by
   * name (ascending) so later version directories are naturally ordered.
   */
  scanVersionDirectories(cacheRoot: string): readonly string[] {
    if (!this.fs.exists(cacheRoot)) {
      return [];
    }

    return this.fs
      .listSubDirectories(cacheRoot)
      .filter((dir) => this.fs.exists(join(dir, 'Cache')))
      .sort((left, right) => left.localeCompare(right));
  }

  /**
   * Find the data_2 cache file inside a version directory.
   * Returns null if the file does not exist.
   */
  findDataFile(versionDir: string): string | null {
    const dataPath = join(versionDir, ...CACHE_DATA_FILE_RELATIVE.split('/'));
    return this.fs.exists(dataPath) ? dataPath : null;
  }

  /**
   * Collect all data_2 files across all version directories.
   * Returns them sorted by version directory name (ascending).
   */
  collectAllDataFiles(cacheRoot: string): readonly CacheFileInfo[] {
    const versionDirs = this.scanVersionDirectories(cacheRoot);
    const files: CacheFileInfo[] = [];

    for (const versionDir of versionDirs) {
      const dataPath = this.findDataFile(versionDir);
      if (dataPath) {
        const mtime = this.fs.statModifiedTime(dataPath) ?? 0;
        files.push({ path: dataPath, modifiedAt: mtime });
      }
    }

    return files;
  }
}
