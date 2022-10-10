import {
  ClassSerializerInterceptor,
  Global,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from './config/config.service';
import { PostgreSQLService } from './config/postgresql.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgreSQLService,
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService('.env', {}),
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        skipNullProperties: false,
        skipUndefinedProperties: false,
        validationError: {
          target: true,
          value: true,
        },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [ConfigService],
})
export class GlobalModule {}
