import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Dream } from '../../entities/dream.entity';
import { DreamService } from './dream.service';
import { CreateDreamDto } from './dtos/create-dream.dto';
import { SearchQueryDto } from './dtos/search-query.dto';
import { UpdateDreamDto } from './dtos/update-dream.dto';
import { DreamDeleteResponse } from './interfaces/dream-delete-response.interface';
import { DreamTypeResponse } from './interfaces/dream-type-response.interface';
import { PaginatedDreamResponse } from './interfaces/paginated-dream-response.interface';

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

  @Delete(':id')
  public deleteDream(@Param('id') id: number): Promise<DreamDeleteResponse> {
    return this.service.deleteDream(id);
  }

  @Get()
  public getDreams(
    @Query() query: SearchQueryDto,
  ): Promise<PaginatedDreamResponse> {
    return this.service.getDreams(query);
  }
}
