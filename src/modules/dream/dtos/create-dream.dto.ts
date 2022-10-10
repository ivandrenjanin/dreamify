import { IsIn, IsString } from 'class-validator';
import { DreamType } from '../../../enums/dream-type.enum';

export class CreateDreamDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  @IsIn(Object.keys(DreamType).map((key) => DreamType[key]))
  public type: DreamType;
}
