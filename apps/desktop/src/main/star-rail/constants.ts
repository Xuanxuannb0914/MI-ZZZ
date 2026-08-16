// Star Rail gacha extraction constants
// All paths, hostnames, and domain patterns are centralized here.

export const STAR_RAIL_CACHE_RELATIVE_PATH =
  'AppData/LocalLow/miHoYo/Star Rail/StarRail_Data/webCaches' as const;

export const CACHE_DATA_FILE_RELATIVE = 'Cache/Cache_Data/data_2' as const;

export const GACHA_API_HOST = 'public-operation-hkrpg.mihoyo.com' as const;

export const GACHA_API_PATH = '/common/hkrpg_gacha_record/api/getGachaLog' as const;

export const GACHA_URL_PREFIX = `https://${GACHA_API_HOST}${GACHA_API_PATH}` as const;

export const REDACTED_PLACEHOLDER = '***REDACTED***' as const;

export const GACHA_URL_START_MARKER =
  'https://public-operation-hkrpg.mihoyo.com/common/hkrpg_gacha_record/api/getGachaLog' as const;
