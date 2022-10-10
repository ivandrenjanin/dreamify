import { Module } from '@nestjs/common';

import { DreamModule } from './modules/dream/dream.module';

@Module({
  imports: [DreamModule],
})
export class AppModule {}
