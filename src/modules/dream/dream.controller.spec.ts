import { Test, TestingModule } from '@nestjs/testing';
import { DreamType } from '../../enums/dream-type.enum';

import { DreamController } from './dream.controller';
import { DreamService } from './dream.service';

describe('DreamController', () => {
  let controller: DreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DreamController],
      providers: [
        {
          provide: DreamService,
          useValue: {
            getAllDreamTypes: jest.fn().mockReturnValue({
              dream: {
                type: ['happy', 'sad', 'scary', 'exciting'],
              },
            }),
            createDream: jest.fn().mockResolvedValue({
              id: 1,
              title: 'test',
              description: 'test',
              type: DreamType.HAPPY,
              date: '2022-01-01T00:00:00.000Z',
            }),
          },
        },
      ],
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

  describe('Dream', () => {
    describe('CREATE', () => {
      it('should propagate the service success result', async () => {
        await expect(
          controller.createDream({
            title: 'test',
            description: 'test',
            type: 'happy' as DreamType,
          }),
        ).resolves.toEqual({
          id: 1,
          title: 'test',
          description: 'test',
          type: 'happy',
          date: '2022-01-01T00:00:00.000Z',
        });
      });
    });
  });
});
