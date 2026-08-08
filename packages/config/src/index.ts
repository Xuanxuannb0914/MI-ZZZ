import type { RuntimeEnvironment } from '@game-guide-hub/types';

export const runtimeEnvironments = ['development', 'test', 'staging', 'production'] as const;

function isRuntimeEnvironment(value: string): value is RuntimeEnvironment {
  return runtimeEnvironments.some((environment) => environment === value);
}

export function parseRuntimeEnvironment(value: string | undefined): RuntimeEnvironment {
  if (value && isRuntimeEnvironment(value)) {
    return value;
  }

  return 'development';
}

export function parsePort(value: string | undefined, fallback: number): number {
  const parsedValue = Number(value ?? fallback);
  return Number.isInteger(parsedValue) && parsedValue > 0 && parsedValue < 65536
    ? parsedValue
    : fallback;
}
