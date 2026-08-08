export interface WorkerQueueConfiguration {
  readonly connectionUrl: string;
  readonly prefix: string;
  readonly defaultJobAttempts: number;
}

export function createWorkerQueueConfiguration(): WorkerQueueConfiguration {
  const environment = process.env.NODE_ENV ?? 'development';

  return {
    connectionUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
    prefix: `ggh:${environment}:queue:v1`,
    defaultJobAttempts: 3,
  };
}
