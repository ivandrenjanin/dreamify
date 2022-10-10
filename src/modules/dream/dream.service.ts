import {
  Between,
  FindManyOptions,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Dream } from '../../entities/dream.entity';
import { DreamType } from '../../enums/dream-type.enum';
import { CreateDreamDto } from './dtos/create-dream.dto';
import { SearchQueryDto } from './dtos/search-query.dto';
import { UpdateDreamDto } from './dtos/update-dream.dto';
import { DreamDeleteResponse } from './interfaces/dream-delete-response.interface';
import { DreamTypeResponse } from './interfaces/dream-type-response.interface';
import { PaginatedDreamResponse } from './interfaces/paginated-dream-response.interface';

@Injectable()
export class DreamService {
  constructor(
    @InjectRepository(Dream)
    private readonly repository: Repository<Dream>,
  ) {}

  public getAllDreamTypes(): DreamTypeResponse {
    return {
      dream: {
        type: Object.keys(DreamType).map((key) => DreamType[key]),
      },
    };
  }

  public createDream(dto: CreateDreamDto): Promise<Dream> {
    return this.repository.save(dto);
  }

  public async updateDream(id: number, dto: UpdateDreamDto): Promise<Dream> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No Fields Provided');
    }

    const dream = await this.findDreamById(id);

    return this.repository.save({ ...dream, ...dto });
  }

  public async deleteDream(id: number): Promise<DreamDeleteResponse> {
    await this.findDreamById(id);

    await this.repository.delete({ id });

    return {
      message: 'Dream Deleted',
    };
  }

  public async findDreamById(id: number): Promise<Dream> {
    const dream = await this.repository.findOne({
      where: { id },
    });

    if (!dream) {
      throw new NotFoundException();
    }

    return dream;
  }

  public async getDreams(
    query: SearchQueryDto,
  ): Promise<PaginatedDreamResponse> {
    query.take = query.take || 10;
    query.page = query.page || 1;

    const options = this.searchQueryBuilder(query);
    const data = await this.repository.findAndCount(options);

    return this.paginateResponse(data, query.page, query.take);
  }

  public searchQueryBuilder(query: SearchQueryDto): FindManyOptions<Dream> {
    const skip = (query.page - 1) * query.take;
    const where: FindManyOptions<Dream>['where'] = {};

    if (query.title) {
      where.title = ILike(`%${query.title}%`);
    }

    if (query.type) {
      where.type = query.type as DreamType;
    }

    if (query.from && query.to) {
      where.date = Between(query.from, query.to);
    }

    if (query.from && !query.to) {
      where.date = MoreThanOrEqual(query.from);
    }

    if (!query.from && query.to) {
      where.date = LessThanOrEqual(query.to);
    }

    const options: FindManyOptions<Dream> = {
      order: { date: 'ASC' },
      take: query.take,
      skip,
    };

    if (Object.keys(where).length !== 0) {
      options.where = where;
    }

    return options;
  }

  public paginateResponse(
    data: [Dream[], number],
    page: number,
    limit: number,
  ): PaginatedDreamResponse {
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: [...result],
      count: total,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    };
  }

  public destroyAllDreams(): Promise<void> {
    return this.repository.clear();
  }
}
