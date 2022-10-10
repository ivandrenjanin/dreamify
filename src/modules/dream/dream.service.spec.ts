import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dream } from '../../entities/dream.entity';
import { DreamType } from '../../enums/dream-type.enum';

import { DreamService } from './dream.service';

const testDream = {
  id: 1,
  title: 'test',
  description: 'test',
  type: 'happy',
  date: '2022-01-01T00:00:00.000Z',
};

describe('DreamService', () => {
  let service: DreamService;
  let repository: Repository<Dream>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DreamService,
        {
          provide: getRepositoryToken(Dream),
          useValue: {
            save: jest.fn().mockResolvedValue(testDream),
          },
        },
      ],
    }).compile();

    service = module.get<DreamService>(DreamService);
    repository = module.get<Repository<Dream>>(getRepositoryToken(Dream));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('types', () => {
    it('should return an array of dream types', () => {
      expect(service.getAllDreamTypes()).toEqual({
        dream: {
          type: ['happy', 'sad', 'scary', 'exciting'],
        },
      });
    });
  });

  describe('Dream', () => {
    describe('CREATE', () => {
      it('should propagate data from the repository method succesfully', () => {
        expect(
          service.createDream({
            title: 'test',
            description: 'test',
            type: 'happy' as DreamType,
          }),
        ).resolves.toEqual(testDream);
      });
    });
  });
});
