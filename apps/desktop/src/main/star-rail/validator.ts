import { GACHA_API_HOST, GACHA_API_PATH } from './constants';
import type { GachaLinkValidatorLike } from './types';

/**
 * Validates that an extracted URL has the expected host and path.
 * This is a local format check only — it never makes a network request.
 */
export class GachaLinkValidator implements GachaLinkValidatorLike {
  validate(url: string): boolean {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') return false;
      if (parsed.hostname !== GACHA_API_HOST) return false;
      return parsed.pathname === GACHA_API_PATH;
    } catch {
      return false;
    }
  }
}
