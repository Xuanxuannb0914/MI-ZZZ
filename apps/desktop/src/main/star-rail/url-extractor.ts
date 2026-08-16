import { GACHA_URL_START_MARKER } from './constants';
import type { UrlExtractorLike } from './types';

/**
 * Characters that terminate a URL in a binary stream.
 * A valid gacha URL only contains percent-encoded query values, so any raw
 * whitespace, control byte, quote, or high byte marks the boundary.
 */
function isTerminator(character: string): boolean {
  const code = character.charCodeAt(0);
  if (code <= 0x20 || code === 0x7f) return true; // whitespace + control
  if (code >= 0x80) return true; // non-ASCII binary data boundary
  if ('"\'<>\\^`{|}'.includes(character)) return true;
  return false;
}

/**
 * Extracts gacha URLs from a raw binary cache buffer.
 *
 * The buffer is decoded byte-for-byte (latin1) so every byte maps to exactly
 * one character, then each known URL prefix is located and read forward until
 * a terminating character. This reliably handles URLs embedded in binary
 * (Chromium disk cache) content without truncation.
 */
export class GachaUrlExtractor implements UrlExtractorLike {
  /** Returns the last URL found in the buffer (used as the freshest). */
  extractUrl(buffer: Uint8Array): string | null {
    const urls = this.extractAll(buffer);
    return urls.length ? (urls[urls.length - 1]?.url ?? null) : null;
  }

  /** Extracts every URL occurrence with its byte offset. */
  extractAll(buffer: Uint8Array): readonly { readonly url: string; readonly offset: number }[] {
    if (buffer.length === 0) return [];

    const text = latin1Text(buffer);
    const results: { url: string; offset: number }[] = [];
    let searchFrom = 0;

    for (;;) {
      const markerIndex = text.indexOf(GACHA_URL_START_MARKER, searchFrom);
      if (markerIndex === -1) break;

      let end = markerIndex + GACHA_URL_START_MARKER.length;
      while (end < text.length) {
        const char = text[end];
        if (char === undefined || isTerminator(char)) break;
        end += 1;
      }

      const candidate = text.slice(markerIndex, end);
      if (candidate.length > GACHA_URL_START_MARKER.length) {
        results.push({ url: candidate, offset: markerIndex });
      }

      searchFrom = end;
    }

    return results;
  }
}

function latin1Text(buffer: Uint8Array): string {
  let text = '';
  // Chunked concatenation avoids quadratic worst-case for large buffers.
  const chunkSize = 0x8000;
  for (let offset = 0; offset < buffer.length; offset += chunkSize) {
    text += String.fromCharCode(...buffer.subarray(offset, offset + chunkSize));
  }
  return text;
}

export function isUrlTerminator(character: string): boolean {
  return isTerminator(character);
}
