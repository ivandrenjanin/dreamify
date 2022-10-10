import { Module } from '@nestjs/common';

import { DreamController } from './dream.controller';
import { DreamService } from './dream.service';

@Module({
  providers: [DreamService],
  controllers: [DreamController],
})
export class DreamModule {}
