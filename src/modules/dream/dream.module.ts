import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dream } from '../../entities/dream.entity';
import { DreamController } from './dream.controller';
import { DreamService } from './dream.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dream])],
  providers: [DreamService],
  controllers: [DreamController],
})
export class DreamModule {}
