import { FindOperator, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

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
            delete: jest.fn().mockResolvedValue({
              raw: 'string',
              affected: 1,
            }),
            findAndCount: jest.fn().mockResolvedValue([[testDream], 1]),
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

    describe('DELETE', () => {
      it('should throw an error if the dream with provided id does not exist', () => {
        const spy = jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        expect(service.deleteDream(1)).rejects.toThrowError('Not Found');

        expect(spy).toBeCalledTimes(1);
      });

      it('should propagate data from the repository method succesfully', () => {
        const spy = jest.spyOn(repository, 'findOne');

        expect(service.deleteDream(1)).resolves.toEqual({
          message: 'Dream Deleted',
        });

        expect(spy).toBeCalledTimes(1);
      });
    });

    describe('GET', () => {
      it('should propagate data from the repository method succesfully', () => {
        const spy = jest.spyOn(repository, 'findAndCount');

        expect(
          service.getDreams({
            page: 1,
            take: 10,
          }),
        ).resolves.toEqual({
          data: [testDream],
          count: 1,
          currentPage: 1,
          nextPage: null,
          prevPage: null,
          lastPage: 1,
        });

        expect(spy).toBeCalledTimes(1);
      });

      describe('searchQueryBuilder', () => {
        const query = {
          title: 'test',
          take: 10,
          page: 1,
        };
        it('should return an object with a where clause if a search query is provided', () => {
          expect(service.searchQueryBuilder(query)).toEqual({
            skip: 0,
            take: 10,
            order: {
              date: 'ASC',
            },
            where: {
              title: expect.any(FindOperator),
            },
          });
        });

        it('should return an object with a where clause if a search query is provided with from and to dates', () => {
          expect(
            service.searchQueryBuilder({
              ...query,
              from: new Date('2022-01-01T00:00:00.000Z'),
              to: new Date('2022-02-01T00:00:00.000Z'),
            }),
          ).toEqual({
            skip: 0,
            take: 10,
            order: {
              date: 'ASC',
            },
            where: {
              title: expect.any(FindOperator),
              date: expect.any(FindOperator),
            },
          });
        });
      });
    });
  });
});
