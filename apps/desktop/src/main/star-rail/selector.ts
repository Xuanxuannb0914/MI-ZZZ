import type { FileSystemAdapter, LatestLinkSelectorLike, LinkCandidate } from './types';

/**
 * Picks the newest valid link from a set of candidates.
 *
 * Ordering priority:
 * 1. The data_2 file's last-modified time (newest file wins).
 * 2. Within the same file, the offset (last occurrence in the buffer)
 *    is used as a tiebreaker — URLs found later in the file are preferred.
 */
export class LatestLinkSelector implements LatestLinkSelectorLike {
  constructor(private readonly fs: FileSystemAdapter) {}

  select(candidates: readonly LinkCandidate[]): LinkCandidate | null {
    if (candidates.length === 0) return null;

    const modifiedOf = (candidate: LinkCandidate): number =>
      this.fs.statModifiedTime(candidate.sourceFile.path) ?? candidate.sourceFile.modifiedAt;

    const ranked = [...candidates].sort((left, right) => {
      const leftTime = modifiedOf(left);
      const rightTime = modifiedOf(right);
      if (leftTime !== rightTime) return rightTime - leftTime;
      // Newer file wins; if equal, prefer the later offset in the file.
      return right.offset - left.offset;
    });

    return ranked[0] ?? null;
  }
}
