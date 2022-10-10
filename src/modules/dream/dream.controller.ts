import { Controller, Get } from '@nestjs/common';

import { DreamService } from './dream.service';
import { DreamTypeResponse } from './interfaces/dream-type-response.interface';

@Controller('dreams')
export class DreamController {
  constructor(private readonly service: DreamService) {}

  @Get('types')
  public getAllDreamTypes(): DreamTypeResponse {
    return this.service.getAllDreamTypes();
  }
}
