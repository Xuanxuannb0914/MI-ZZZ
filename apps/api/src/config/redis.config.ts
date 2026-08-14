import { registerAs } from '@nestjs/config';

export interface RedisConfiguration {
  readonly url: string;
  readonly keyPrefix: string;
  readonly maxRetriesPerRequest: number;
}

export const redisConfiguration = registerAs(
  'redis',
  (): RedisConfiguration => ({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    keyPrefix: `ggh:${process.env.NODE_ENV ?? 'development'}:`,
    maxRetriesPerRequest: 2,
  }),
);
