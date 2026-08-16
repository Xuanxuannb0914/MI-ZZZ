import { GACHA_URL_START_MARKER } from '../../src/main/star-rail/constants';

/** Builds a structurally-valid fake gacha URL for tests. authkey is fake. */
export function makeFixtureGachaUrl(authkey: string, uid = '100000001'): string {
  return (
    `${GACHA_URL_START_MARKER}?authkey_ver=1&sign_type=2&auth_appid=webview_gacha` +
    `&init_type=301&gacha_id=f1xture&timestamp=1700000000&lang=zh-cn&device_type=pc` +
    `&game_version=1.0.0&plat_type=pc&region=prod_gf_cn&authkey=${authkey}` +
    `&game_biz=hkrpg_cn&uid=${uid}`
  );
}

/** Concatenates strings (latin1-encoded) and/or byte chunks into one buffer. */
export function toBinary(...parts: Array<string | Uint8Array>): Uint8Array {
  const chunks = parts.map((part) =>
    typeof part === 'string' ? new TextEncoder().encode(part) : part,
  );
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/** Deterministic pseudo-random binary noise (never 0x00 so tests are stable). */
export function binaryNoise(size: number, seed = 1): Uint8Array {
  let state = seed >>> 0;
  const out = new Uint8Array(size);
  for (let i = 0; i < size; i += 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const value = state & 0xff;
    out[i] = value === 0 ? 0x01 : value;
  }
  return out;
}
