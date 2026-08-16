import { describe, expect, it } from 'vitest';
import { GACHA_URL_START_MARKER } from '../../src/main/star-rail/constants';
import { GachaUrlExtractor } from '../../src/main/star-rail/url-extractor';
import { binaryNoise, makeFixtureGachaUrl, toBinary } from '../helpers/gacha-fixtures';

const extractor = new GachaUrlExtractor();

describe('GachaUrlExtractor', () => {
  it('returns no URLs for an empty buffer', () => {
    expect(extractor.extractAll(new Uint8Array(0))).toEqual([]);
    expect(extractor.extractUrl(new Uint8Array(0))).toBeNull();
  });

  it('returns no URLs when the marker is absent', () => {
    const buffer = toBinary(binaryNoise(256), 'https://example.com/other?authkey=x');
    expect(extractor.extractAll(buffer)).toEqual([]);
  });

  it('finds a single URL embedded in binary noise', () => {
    const url = makeFixtureGachaUrl('f1xture-single');
    const buffer = toBinary(binaryNoise(128, 11), '\x00', url, '\x00', binaryNoise(128, 22));
    expect(extractor.extractUrl(buffer)).toBe(url);
    const all = extractor.extractAll(buffer);
    expect(all).toHaveLength(1);
    expect(all[0]?.url).toBe(url);
  });

  it('does not truncate URLs on query delimiters', () => {
    const url = makeFixtureGachaUrl('f1xture-%20encoded&sign=abc', '100000042');
    const buffer = toBinary(url, '\x00');
    expect(extractor.extractUrl(buffer)).toBe(url);
  });

  it('stops the URL at a null byte', () => {
    const url = makeFixtureGachaUrl('f1xture-null');
    const buffer = toBinary(url, '\x00', 'trailing-garbage');
    expect(extractor.extractUrl(buffer)).toBe(url);
  });

  it('stops the URL at whitespace', () => {
    const buffer = toBinary(makeFixtureGachaUrl('f1xture-ws'), ' ', 'tail');
    expect(extractor.extractUrl(buffer)).toBe(makeFixtureGachaUrl('f1xture-ws'));
  });

  it('stops the URL at a quote character', () => {
    const buffer = toBinary(makeFixtureGachaUrl('f1xture-quote'), '"', 'tail');
    expect(extractor.extractUrl(buffer)).toBe(makeFixtureGachaUrl('f1xture-quote'));
  });

  it('stops the URL at a high (non-ASCII) binary byte', () => {
    const url = makeFixtureGachaUrl('f1xture-high');
    const highByte = new Uint8Array([0xe4]);
    const buffer = toBinary(url, highByte, 'tail');
    expect(extractor.extractUrl(buffer)).toBe(url);
  });

  it('extracts every occurrence with its byte offset', () => {
    const first = makeFixtureGachaUrl('f1xture-a');
    const second = makeFixtureGachaUrl('f1xture-b');
    const buffer = toBinary('\x00', first, '\x00', binaryNoise(16), second, '\x00');
    const all = extractor.extractAll(buffer);
    expect(all).toHaveLength(2);
    expect(all[0]?.url).toBe(first);
    expect(all[1]?.url).toBe(second);
    expect(all[0]?.offset).toBeLessThan(all[1]?.offset ?? 0);
  });

  it('ignores a bare marker with no query payload', () => {
    // The marker alone (no following chars) is not considered a URL candidate.
    const buffer = toBinary('\x00', GACHA_URL_START_MARKER, '\x00');
    expect(extractor.extractAll(buffer)).toEqual([]);
  });

  it('extractUrl returns the last found URL', () => {
    const first = makeFixtureGachaUrl('f1xture-last-a');
    const second = makeFixtureGachaUrl('f1xture-last-b');
    const buffer = toBinary(first, '\x00', second, '\x00');
    expect(extractor.extractUrl(buffer)).toBe(second);
  });
});
