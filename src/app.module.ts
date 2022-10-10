import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { DreamModule } from './modules/dream/dream.module';
import { GlobalModule } from './modules/global/global.module';

@Module({
  imports: [GlobalModule, DreamModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
