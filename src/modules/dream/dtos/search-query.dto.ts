import { Transform } from 'class-transformer';
import { IsDate, IsIn, IsNumber, IsOptional } from 'class-validator';

import { DreamType } from '../../../enums/dream-type.enum';
import { toDate } from '../helpers/to-date.helper';
import { toNumber } from '../helpers/to-number.helper';

export class SearchQueryDto {
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  @IsOptional()
  @IsNumber()
  public take?: number;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsOptional()
  @IsNumber()
  public page?: number;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  public readonly title?: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsIn(Object.keys(DreamType).map((key) => DreamType[key]))
  public readonly type?: DreamType;

  @Transform(({ value }) => toDate(value))
  @IsOptional()
  @IsDate()
  public readonly from?: Date;

  @Transform(({ value }) => toDate(value))
  @IsOptional()
  @IsDate()
  public readonly to?: Date;
}
