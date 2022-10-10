import { Injectable } from '@nestjs/common';
import { DreamType } from '../../enums/dream-type.enum';
import { DreamTypeResponse } from './interfaces/dream-type-response.interface';

@Injectable()
export class DreamService {
  public getAllDreamTypes(): DreamTypeResponse {
    return {
      dream: {
        type: Object.keys(DreamType).map((key) => DreamType[key]),
      },
    };
  }
}
