import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dream } from '../../entities/dream.entity';

import { DreamType } from '../../enums/dream-type.enum';
import { CreateDreamDto } from './dtos/create-dream.dto';
import { UpdateDreamDto } from './dtos/update-dream.dto';
import { DreamTypeResponse } from './interfaces/dream-type-response.interface';

@Injectable()
export class DreamService {
  constructor(
    @InjectRepository(Dream)
    private readonly repository: Repository<Dream>,
  ) {}

  public getAllDreamTypes(): DreamTypeResponse {
    return {
      dream: {
        type: Object.keys(DreamType).map((key) => DreamType[key]),
      },
    };
  }

  public createDream(dto: CreateDreamDto): Promise<Dream> {
    return this.repository.save(dto);
  }

  public async updateDream(id: number, dto: UpdateDreamDto): Promise<Dream> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No Fields Provided');
    }

    const dream = await this.repository.findOne({
      where: { id },
    });

    if (!dream) {
      throw new NotFoundException();
    }

    return this.repository.save({ ...dream, ...dto });
  }
}
