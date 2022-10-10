import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Dream } from '../../entities/dream.entity';

import { DreamService } from './dream.service';
import { CreateDreamDto } from './dtos/create-dream.dto';
import { UpdateDreamDto } from './dtos/update-dream.dto';
import { DreamTypeResponse } from './interfaces/dream-type-response.interface';

@Controller('dreams')
export class DreamController {
  constructor(private readonly service: DreamService) {}

  @Get('types')
  public getAllDreamTypes(): DreamTypeResponse {
    return this.service.getAllDreamTypes();
  }

  @Post()
  public createDream(@Body() dto: CreateDreamDto): Promise<Dream> {
    return this.service.createDream(dto);
  }

  @Patch(':id')
  public updateDream(
    @Param('id') id: number,
    @Body() dto: UpdateDreamDto,
  ): Promise<Dream> {
    return this.service.updateDream(id, dto);
  }
}
