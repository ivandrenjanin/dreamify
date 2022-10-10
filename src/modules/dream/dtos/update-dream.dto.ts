import { CreateDreamDto } from './create-dream.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDreamDto extends PartialType(CreateDreamDto) {}
