import type { Result } from '@game-guide-hub/types';

export interface ApiClientOptions {
  readonly baseUrl: string;
  readonly clientVersion: string;
}

export interface ApiRequestContext {
  readonly requestId: string;
  readonly signal?: AbortSignal;
}

export type ApiClientResult<TValue> = Result<TValue, 'network' | 'timeout' | 'server'>;

export interface ApiClient {
  readonly options: ApiClientOptions;
  health(context: ApiRequestContext): Promise<ApiClientResult<{ status: 'ok' }>>;
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  return {
    options,
    async health(context: ApiRequestContext): Promise<ApiClientResult<{ status: 'ok' }>> {
      try {
        const requestInit: RequestInit = {
          headers: {
            'X-Client-Version': options.clientVersion,
            'X-Request-Id': context.requestId,
          },
        };

        if (context.signal) {
          requestInit.signal = context.signal;
        }

        const response = await fetch(`${options.baseUrl}/health/live`, requestInit);

        if (!response.ok) {
          return { ok: false, error: 'server' };
        }

        return { ok: true, value: { status: 'ok' } };
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return { ok: false, error: 'timeout' };
        }

        return { ok: false, error: 'network' };
      }
    },
  };
}
