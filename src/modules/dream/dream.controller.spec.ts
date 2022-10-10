import { Test, TestingModule } from '@nestjs/testing';
import { DreamController } from './dream.controller';
import { DreamService } from './dream.service';

describe('DreamController', () => {
  let controller: DreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DreamController],
      providers: [DreamService],
    }).compile();

    controller = module.get<DreamController>(DreamController);
  });

  describe('types', () => {
    it('should return an array of dream types', () => {
      expect(controller.getAllDreamTypes()).toEqual({
        dream: {
          type: ['happy', 'sad', 'scary', 'exciting'],
        },
      });
    });
  });
});
