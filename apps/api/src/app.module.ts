import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthModule } from './common/health/health.module';
import { validateEnvironment } from './config/environment';
import { redisConfiguration } from './config/redis.config';
import { ProblemDetailsFilter } from './filters/problem-details.filter';
import { RequestIdInterceptor } from './interceptors/request-id.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['../../.env', '.env'],
      isGlobal: true,
      load: [redisConfiguration],
      validate: validateEnvironment,
    }),
    HealthModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
  ],
})
export class AppModule {}
