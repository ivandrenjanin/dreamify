import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GlobalModule } from '../src/modules/global/global.module';
import { DreamModule } from '../src/modules/dream/dream.module';
import { DreamService } from '../src/modules/dream/dream.service';

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
    const body = {
      title: 'test',
      description: 'test',
      type: 'happy',
      ...overrides,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/dreams')
      .send(body)
      .expect(201);

    return createResponse.body;
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
  });
});
