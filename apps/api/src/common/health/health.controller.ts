import { Controller, Get, Inject } from '@nestjs/common';
import { HealthService, type HealthStatus } from './health.service';

@Controller('health')
export class HealthController {
  constructor(@Inject(HealthService) private readonly healthService: HealthService) {}

  @Get('live')
  getLiveness(): HealthStatus {
    return this.healthService.getLiveness();
  }
}
