import * as dotenv from 'dotenv';
import * as fs from 'fs';

import { Injectable } from '@nestjs/common';

import { ConfigOption } from '../../../enums/config-option.enum';
import { MissingConfigurationException } from './exceptions/missing-configuration.exception';

@Injectable()
export class ConfigService {
  private readonly configFile: dotenv.DotenvParseOutput = {};

  // If configuration file is not found, fall back to process.env;
  constructor(
    private readonly configPath: string | null,
    overrides: Partial<Record<ConfigOption, string>>,
  ) {
    Object.assign(process.env, overrides);

    if (configPath == null || !fs.existsSync(configPath)) {
      return;
    }

    const contents = fs.readFileSync(configPath, { encoding: 'utf-8' });

    this.configFile = dotenv.parse(contents);
  }

  public getOrThrow(option: ConfigOption): string {
    if (typeof process.env[option] === 'string') {
      return process.env[option] as string;
    }

    if (typeof this.configFile[option] === 'string') {
      return this.configFile[option];
    }

    throw new MissingConfigurationException(option);
  }

  public getOrDefault(option: ConfigOption, defaultValue: string): string {
    if (typeof process.env[option] === 'string') {
      return process.env[option] as string;
    }

    if (typeof this.configFile[option] === 'string') {
      return this.configFile[option];
    }

    return defaultValue;
  }
}
