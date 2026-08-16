import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { FileSystemAdapter } from '../../src/main/star-rail/types';

/**
 * A real FileSystemAdapter backed by node:fs. Used to drive the scanner /
 * selector / service against real fixture files without touching the user's
 * actual game cache. Operates on absolute paths passed in by callers.
 */
export function createNodeFileSystem(): FileSystemAdapter {
  return {
    exists(path) {
      return existsSync(path);
    },
    readFileBinary(path) {
      try {
        return readFileSync(path);
      } catch {
        return null;
      }
    },
    listSubDirectories(path) {
      try {
        return readdirSync(path, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => join(path, entry.name));
      } catch {
        return [];
      }
    },
    statModifiedTime(path) {
      try {
        return statSync(path).mtimeMs;
      } catch {
        return null;
      }
    },
  };
}

/** Absolute path of a fixture root under tests/fixtures/star-rail. */
export function starRailFixture(fixtureName: string): string {
  return join(__dirname, '..', 'fixtures', 'star-rail', fixtureName);
}
