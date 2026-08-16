import { GACHA_API_HOST, GACHA_API_PATH, REDACTED_PLACEHOLDER } from './constants';

const SENSITIVE_PARAMS = ['authkey', 'cookie', 'sign', 'token', 'uid'] as const;

/**
 * Masks sensitive query parameters (authkey, cookie, sign, token, uid) in a
 * URL so it is safe to include in debug logs or user-facing messages.
 * Non-sensitive query values are kept but truncated to limit exposure.
 */
export function redactSensitiveUrl(url: string): string {
  try {
    const parsed = new URL(url);
    for (const key of SENSITIVE_PARAMS) {
      if (parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, REDACTED_PLACEHOLDER);
      }
    }
    return `${parsed.origin}${parsed.pathname}?${parsed.searchParams.toString()}`;
  } catch {
    return url.replace(/authkey=[^&]*/i, `authkey=${REDACTED_PLACEHOLDER}`);
  }
}

/** Keeps a gacha host URL stable for display without exposing the query. */
export function hostOnlyUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}${GACHA_API_PATH}`;
  } catch {
    return `https://${GACHA_API_HOST}${GACHA_API_PATH}`;
  }
}
