import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GlobalModule } from '../src/modules/global/global.module';
import { DreamModule } from '../src/modules/dream/dream.module';
import { DreamService } from '../src/modules/dream/dream.service';
import { CreateDreamDto } from '../src/modules/dream/dtos/create-dream.dto';
import { DreamType } from '../src/enums/dream-type.enum';

describe('DreamController (e2e)', () => {
  let app: INestApplication;
  let dreamService: DreamService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GlobalModule, DreamModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dreamService = moduleFixture.get<DreamService>(DreamService);
    await app.init();
  });

  beforeEach(async () => {
    await dreamService.destroyAllDreams();
  });

  afterAll(async () => {
    await dreamService.destroyAllDreams();
    await app.close();
  });

  const createDream = async (overrides = {}) => {
    const body: CreateDreamDto = {
      title: 'test',
      description: 'test',
      type: 'happy' as DreamType,
      ...overrides,
    };

    const createResponse = await dreamService.createDream(body);
    return createResponse;
  };

  describe('Dream', () => {
    describe('CREATE', () => {
      it('should throw an error if body is invalid', async () => {
        const body = {
          title: 'test',
          description: 'test',
          type: 'UNKNOWN_TYPE',
        };

        const response = await request(app.getHttpServer())
          .post('/dreams')
          .send(body)
          .expect(400);

        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('error', 'Bad Request');
      });

      it('should create a new dream', async () => {
        const body = {
          title: 'test',
          description: 'test',
          type: 'happy',
        };

        const response = await request(app.getHttpServer())
          .post('/dreams')
          .send(body)
          .expect(201);

        expect(response.body).toEqual({
          ...body,
          id: expect.any(Number),
          date: expect.any(String),
        });
      });
    });

    describe('UPDATE', () => {
      it('should throw an error if body is invalid', async () => {
        const body = {
          title: 'test',
          description: 'test',
          type: 'UNKNOWN_TYPE',
        };

        const response = await request(app.getHttpServer())
          .patch('/dreams/1')
          .send(body)
          .expect(400);

        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('error', 'Bad Request');
      });

      it('should throw an error if body is empty', async () => {
        const body = {};

        const response = await request(app.getHttpServer())
          .patch('/dreams/1')
          .send(body)
          .expect(400);

        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('error', 'Bad Request');
      });

      it('should throw an error if dream is not found', async () => {
        const body = {
          title: 'test',
          description: 'test',
          type: 'happy',
        };

        await request(app.getHttpServer())
          .patch('/dreams/9999')
          .send(body)
          .expect(404);
      });

      it('should update a dream', async () => {
        const dream = await createDream();

        const body = {
          title: 'test',
          description: 'test',
          type: 'happy',
        };

        const response = await request(app.getHttpServer())
          .patch(`/dreams/${dream.id}`)
          .send(body)
          .expect(200);

        expect(response.body).toEqual({
          ...body,
          id: expect.any(Number),
          date: expect.any(String),
        });
      });
    });

    describe('DELETE', () => {
      it('should throw an error if dream is not found', async () => {
        await request(app.getHttpServer()).delete('/dreams/9999').expect(404);
      });

      it('should delete a dream', async () => {
        const dream = await createDream();

        const response = await request(app.getHttpServer())
          .delete(`/dreams/${dream.id}`)
          .expect(200);

        expect(response.body).toEqual({ message: 'Dream Deleted' });
      });
    });

    describe('GET', () => {
      it('should return an empty array if no dreams are found', async () => {
        const response = await request(app.getHttpServer()).get('/dreams');

        expect(response.body).toEqual({
          data: [],
          count: 0,
          currentPage: 1,
          lastPage: 0,
          nextPage: null,
          prevPage: null,
        });
      });

      it('should return all dreams without query parameters set', async () => {
        await Promise.all([createDream(), createDream()]);

        const response = await request(app.getHttpServer()).get('/dreams');

        expect(response.body).toHaveProperty('count', 2);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(2);
      });

      it('should properly query dreams based on passed in query parameters', async () => {
        const overrides = [
          { type: 'happy', date: new Date('2022-01-02') },
          { type: 'happy', date: new Date('2022-01-03') },
          { type: 'happy', date: new Date('2022-01-04') },
          { type: 'sad', date: new Date('2022-02-02') },
          { type: 'sad', date: new Date('2022-02-03') },
          { type: 'scary', date: new Date('2022-03-02') },
          { type: 'scary', date: new Date('2022-03-03') },
          { type: 'scary', date: new Date('2022-03-04') },
          { type: 'scary', date: new Date('2022-03-05') },
        ];

        await Promise.all(overrides.map((override) => createDream(override)));

        const happyResponse = await request(app.getHttpServer())
          .get('/dreams')
          .query('type=happy')
          .expect(200);

        expect(happyResponse.body).toHaveProperty('count', 3);
        expect(happyResponse.body).toHaveProperty('data');
        expect(happyResponse.body.data).toHaveLength(3);

        const rangeResponseWithoutType = await request(app.getHttpServer())
          .get('/dreams')
          .query('from=2022-01-02&to=2022-03-01')
          .expect(200);

        expect(rangeResponseWithoutType.body).toHaveProperty('count', 5);
        expect(rangeResponseWithoutType.body).toHaveProperty('data');
        expect(rangeResponseWithoutType.body.data).toHaveLength(5);

        const rangeResponseWithType = await request(app.getHttpServer())
          .get('/dreams')
          .query('from=2022-01-02&to=2022-03-06&type=scary')
          .expect(200);

        expect(rangeResponseWithType.body).toHaveProperty('count', 4);
        expect(rangeResponseWithType.body).toHaveProperty('data');
        expect(rangeResponseWithType.body.data).toHaveLength(4);
      });
    });
  });
});
