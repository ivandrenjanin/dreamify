import { Module } from '@nestjs/common';
import { DreamService } from './dream.service';
import { DreamController } from './dream.controller';

@Module({
  providers: [DreamService],
  controllers: [DreamController],
})
export class DreamModule {}
