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
            findOne: jest.fn().mockResolvedValue(testDream),
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

    describe('UPDATE', () => {
      it('should throw an error if the dream with provided id does not exist', () => {
        const spy = jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        expect(
          service.updateDream(1, {
            title: 'test',
            description: 'test',
            type: 'happy' as DreamType,
          }),
        ).rejects.toThrowError('Not Found');

        expect(spy).toBeCalledTimes(1);
      });

      it('should throw an error if the dto is an empty object', () => {
        expect(service.updateDream(1, {})).rejects.toThrowError(
          'No Fields Provided',
        );
      });

      it('should propagate data from the repository method succesfully', () => {
        const spy = jest.spyOn(repository, 'findOne');

        expect(
          service.updateDream(1, {
            title: 'test',
            description: 'test',
            type: 'happy' as DreamType,
          }),
        ).resolves.toEqual(testDream);

        expect(spy).toBeCalledTimes(1);
      });
    });
  });
});
