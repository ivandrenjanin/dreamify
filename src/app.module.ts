import { Module } from '@nestjs/common';

import { DreamModule } from './modules/dream/dream.module';
import { GlobalModule } from './modules/global/global.module';

@Module({
  imports: [GlobalModule, DreamModule],
})
export class AppModule {}
