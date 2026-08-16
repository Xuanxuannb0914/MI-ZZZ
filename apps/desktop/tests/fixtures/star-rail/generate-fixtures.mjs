#!/usr/bin/env node
/**
 * Generates Star Rail cache fixtures under tests/fixtures/star-rail/.
 *
 * The fixtures simulate the Chromium disk cache layout that the game writes:
 *   webCaches/<version>/Cache/Cache_Data/data_2
 *
 * data_2 is NOT plain UTF-8 text — it is a mix of binary bytes and ASCII
 * strings. The generator embeds the gacha URL (with a clearly FAKE authkey)
 * inside binary noise so the extractor has to dig it out byte-by-byte.
 *
 * Run with: node tests/fixtures/star-rail/generate-fixtures.mjs
 *
 * The output is committed so tests are deterministic. All authkeys here are
 * obviously fake ("f1xture-...") and must never appear in production code.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FIXTURES_ROOT = join(dirname(fileURLToPath(import.meta.url)));
const CACHE_FILE_REL = ['Cache', 'Cache_Data', 'data_2'];

const GACHA_URL_START_MARKER =
  'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog';

/** Deterministic PRNG so regenerated fixtures are byte-identical. */
function createNoiseGen(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state & 0xff;
  };
}

/** Produces n bytes of pseudo-random binary noise (never 0x00-heavy). */
function noise(size, seed) {
  const next = createNoiseGen(seed);
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i += 1) {
    bytes[i] = next() === 0 ? 0x01 : next();
  }
  return bytes;
}

function encode(part) {
  if (typeof part === 'string') return Buffer.from(part, 'latin1');
  return Buffer.from(part);
}

/** Concatenates strings and/or Uint8Array chunks into a binary buffer. */
function mix(parts) {
  const chunks = parts.map(encode);
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = Buffer.alloc(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function makeGachaUrl({ uid, authkey, suffix = '' }) {
  return (
    `${GACHA_URL_START_MARKER}?authkey_ver=1&sign_type=2&auth_appid=webview_gacha` +
    `&init_type=301&gacha_id=f1xture&timestamp=1700000000&lang=zh-cn&device_type=pc` +
    `&game_version=1.0.0&plat_type=pc&region=prod_gf_cn&authkey=${authkey}` +
    `&game_biz=hkrpg_cn&uid=${uid}${suffix}`
  );
}

function writeDataFile(versionDir, content) {
  const filePath = join(versionDir, ...CACHE_FILE_REL);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

// 1. valid-cache — a single version with one clean, embedded URL.
{
  const versionDir = join(FIXTURES_ROOT, 'valid-cache', '1.0.0');
  const url = makeGachaUrl({ uid: '100000001', authkey: 'f1xture-valid-authkey' });
  writeDataFile(versionDir, mix([noise(512, 11), '\x00', url, '\x00', noise(512, 22)]));
}

// 2. multiple-cache — two versions, each with its own valid URL.
{
  const urlA = makeGachaUrl({ uid: '100000002', authkey: 'f1xture-multi-a' });
  writeDataFile(join(FIXTURES_ROOT, 'multiple-cache', '1.0.0'), mix([noise(256, 33), urlA, '\x00']));
  const urlB = makeGachaUrl({ uid: '100000003', authkey: 'f1xture-multi-b' });
  writeDataFile(join(FIXTURES_ROOT, 'multiple-cache', '1.0.1'), mix([noise(256, 44), urlB, '\x00']));
}

// 3. no-version-cache — the webCaches root exists but has no version dirs.
ensureDir(join(FIXTURES_ROOT, 'no-version-cache'));

// 4. no-data-cache — a version dir exists but no Cache/Cache_Data/data_2.
ensureDir(join(FIXTURES_ROOT, 'no-data-cache', '1.0.0', 'Cache'));

// 5. invalid-cache — a marker URL is found but fails local validation:
//    extra path junk glued to the marker changes the pathname, and a plain
//    http URL never matches the https marker at all.
{
  const versionDir = join(FIXTURES_ROOT, 'invalid-cache', '1.0.0');
  const extraPath = `${GACHA_URL_START_MARKER}/junk?authkey=f1xture-invalid`;
  const httpUrl = `http://public-operation-hkrpg.mihoyo.com${GACHA_URL_START_MARKER.slice(
    'https://'.length,
  )}?authkey=f1xture-http`;
  writeDataFile(versionDir, mix([noise(128, 55), httpUrl, '\x00', extraPath, '\x00', noise(64, 66)]));
}

// 6. empty-cache — an empty data_2 file.
{
  const versionDir = join(FIXTURES_ROOT, 'empty-cache', '1.0.0');
  writeDataFile(versionDir, Buffer.alloc(0));
}

// 7. corrupted-cache — pure binary noise, no URL at all.
{
  const versionDir = join(FIXTURES_ROOT, 'corrupted-cache', '1.0.0');
  writeDataFile(versionDir, noise(4096, 77));
}

// eslint-disable-next-line no-console
console.log(`Star Rail fixtures generated under ${FIXTURES_ROOT}`);
