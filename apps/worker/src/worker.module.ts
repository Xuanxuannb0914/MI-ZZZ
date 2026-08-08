import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, envFilePath: ['../../.env', '.env'], isGlobal: true }),
  ],
})
export class WorkerModule {}
