import { clipboard } from 'electron';
import type { ClipboardServiceLike } from './types';

/**
 * Writes text to the system clipboard using Electron's main-process clipboard.
 * Returns true on success. This is the only clipboard entry point used by the
 * gacha extraction flow so it can be swapped or mocked in tests.
 */
export class ElectronClipboardService implements ClipboardServiceLike {
  copy(text: string): boolean {
    try {
      clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
