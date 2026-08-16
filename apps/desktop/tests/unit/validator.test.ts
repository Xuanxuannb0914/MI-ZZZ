import { describe, expect, it } from 'vitest';
import { GACHA_URL_START_MARKER } from '../../src/main/star-rail/constants';
import { GachaLinkValidator } from '../../src/main/star-rail/validator';
import { makeFixtureGachaUrl } from '../helpers/gacha-fixtures';

const validator = new GachaLinkValidator();

describe('GachaLinkValidator', () => {
  it('accepts a well-formed https gacha URL', () => {
    expect(validator.validate(makeFixtureGachaUrl('f1xture-ok'))).toBe(true);
  });

  it('rejects plain http URLs', () => {
    const url = makeFixtureGachaUrl('f1xture-http').replace('https://', 'http://');
    expect(validator.validate(url)).toBe(false);
  });

  it('rejects a different hostname', () => {
    const url = makeFixtureGachaUrl('f1xture-host').replace(
      'public-operation-hkrpg.mihoyo.com',
      'example.com',
    );
    expect(validator.validate(url)).toBe(false);
  });

  it('rejects a different pathname', () => {
    expect(validator.validate(`${GACHA_URL_START_MARKER}/junk?authkey=f1xture`)).toBe(false);
  });

  it('rejects a truncated / malformed URL', () => {
    expect(validator.validate('https://public-operation-hkrpg.mihoyo.com/common')).toBe(false);
    expect(validator.validate('not a url')).toBe(false);
    expect(validator.validate('')).toBe(false);
  });

  it('accepts a bare marker (valid host+path, no query)', () => {
    expect(validator.validate(GACHA_URL_START_MARKER)).toBe(true);
  });
});
