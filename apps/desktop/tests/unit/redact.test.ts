import { describe, expect, it } from 'vitest';
import { hostOnlyUrl, redactSensitiveUrl } from '../../src/main/star-rail/redact';

describe('redactSensitiveUrl', () => {
  it('replaces authkey value with redacted placeholder', () => {
    const result = redactSensitiveUrl(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog?authkey=f1xture-secret',
    );
    expect(result).toContain('authkey=***REDACTED***');
    expect(result).not.toContain('f1xture-secret');
  });

  it('replaces uid value with redacted placeholder', () => {
    const result = redactSensitiveUrl(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog?authkey=x&uid=100000001',
    );
    expect(result).toContain('uid=***REDACTED***');
    expect(result).not.toContain('100000001');
  });

  it('replaces sign value with redacted placeholder', () => {
    const result = redactSensitiveUrl(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog?authkey=x&sign=abc123',
    );
    expect(result).toContain('sign=***REDACTED***');
    expect(result).not.toContain('abc123');
  });

  it('replaces token value with redacted placeholder', () => {
    const result = redactSensitiveUrl(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog?authkey=x&token=my-token',
    );
    expect(result).toContain('token=***REDACTED***');
    expect(result).not.toContain('my-token');
  });

  it('handles URLs that cannot be parsed', () => {
    const result = redactSensitiveUrl('not a url authkey=keep');
    expect(result).toContain('authkey=***REDACTED***');
  });

  it('preserves non-sensitive query parameters', () => {
    const result = redactSensitiveUrl(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog?authkey=x&lang=zh-cn&gacha_id=123',
    );
    expect(result).toContain('lang=zh-cn');
    expect(result).toContain('gacha_id=123');
  });
});

describe('hostOnlyUrl', () => {
  it('returns the scheme + host + path from a full URL', () => {
    const result = hostOnlyUrl(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog?authkey=f1xture',
    );
    expect(result).toBe(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog',
    );
  });

  it('returns a fallback for unparseable input', () => {
    const result = hostOnlyUrl('garbage');
    expect(result).toBe(
      'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog',
    );
  });
});
