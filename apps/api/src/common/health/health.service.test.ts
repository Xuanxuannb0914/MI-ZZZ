import { describe, expect, it } from 'vitest';
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns a stable API liveness contract', () => {
    const healthService = new HealthService();

    expect(healthService.getLiveness()).toEqual({ status: 'ok', service: 'api' });
  });
});
