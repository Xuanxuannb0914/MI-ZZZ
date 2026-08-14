import { parsePort, parseRuntimeEnvironment } from '@game-guide-hub/config';
import type { RuntimeEnvironment } from '@game-guide-hub/types';

export interface ApiEnvironment {
  readonly NODE_ENV: RuntimeEnvironment;
  readonly DATABASE_URL: string;
  readonly REDIS_URL: string;
  readonly API_PORT: number;
  readonly DESKTOP_ENV: RuntimeEnvironment;
}

const defaults = {
  databaseUrl: 'postgresql://postgres:postgres@localhost:5432/game_guide_hub',
  redisUrl: 'redis://localhost:6379',
  apiPort: 3001,
} as const;

function parseUrl(
  name: string,
  value: unknown,
  fallback: string,
  protocols: readonly string[],
): string {
  const candidate = typeof value === 'string' && value.length > 0 ? value : fallback;
  const parsedUrl = new URL(candidate);

  if (!protocols.includes(parsedUrl.protocol)) {
    throw new TypeError(`${name} must use one of these protocols: ${protocols.join(', ')}`);
  }

  return parsedUrl.toString();
}

export function validateEnvironment(values: Record<string, unknown>): ApiEnvironment {
  return {
    NODE_ENV: parseRuntimeEnvironment(
      typeof values.NODE_ENV === 'string' ? values.NODE_ENV : undefined,
    ),
    DATABASE_URL: parseUrl('DATABASE_URL', values.DATABASE_URL, defaults.databaseUrl, [
      'postgresql:',
      'postgres:',
    ]),
    REDIS_URL: parseUrl('REDIS_URL', values.REDIS_URL, defaults.redisUrl, ['redis:', 'rediss:']),
    API_PORT: parsePort(
      typeof values.API_PORT === 'string' ? values.API_PORT : undefined,
      defaults.apiPort,
    ),
    DESKTOP_ENV: parseRuntimeEnvironment(
      typeof values.DESKTOP_ENV === 'string' ? values.DESKTOP_ENV : undefined,
    ),
  };
}
