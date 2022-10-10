import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigOption } from '../../../enums/config-option.enum';
import { ConfigService } from './config.service';

@Injectable()
export class PostgreSQLService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.TYPEORM_URL,
      entities: [
        `${path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'entities',
        )}/*.entity{.ts,.js}`,
      ],
      logging: true,
      synchronize: true,
    };
  }

  public get TYPEORM_URL(): string {
    return this.config.getOrThrow(ConfigOption.TYPEORM_URL);
  }
}
