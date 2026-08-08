import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap(): Promise<void> {
  const application = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
  });

  application.useLogger(['error', 'warn', 'log']);
  application.enableShutdownHooks();
  Logger.log('Worker application context initialized', 'Bootstrap');
}

void bootstrap();
