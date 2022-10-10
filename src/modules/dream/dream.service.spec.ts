import { Test, TestingModule } from '@nestjs/testing';

import { DreamService } from './dream.service';

describe('DreamService', () => {
  let service: DreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DreamService],
    }).compile();

    service = module.get<DreamService>(DreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of dream types', () => {
    expect(service.getAllDreamTypes()).toEqual({
      dream: {
        type: ['happy', 'sad', 'scary', 'exciting'],
      },
    });
  });
});
