import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  readonly status: 'ok';
  readonly service: 'api';
}

@Injectable()
export class HealthService {
  getLiveness(): HealthStatus {
    return { status: 'ok', service: 'api' };
  }
}
