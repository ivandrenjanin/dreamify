import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { GlobalModule } from '../src/modules/global/global.module';
import { DreamModule } from '../src/modules/dream/dream.module';

describe('DreamController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GlobalModule, DreamModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

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
  });
});
