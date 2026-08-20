import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { configureApp } from '../src/configureApp';
import { User } from '../src/user/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;

  const email = 'race-condition@example.com';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    const dataSource = app.get(DataSource);
    userRepository = dataSource.getRepository(User);
  });

  afterEach(async () => {
    await userRepository.delete({ email });
  });

  afterAll(async () => {
    await app.close();
  });

  it('uses test database', async () => {
    const dataSource = app.get(DataSource);

    const [result] = await dataSource.query(
      'SELECT current_database() AS name',
    );

    expect(result.name).toBe(process.env.POSTGRES_TEST_DATABASE);
  });

  it('creates only one user for parallel registrations', async () => {
    const payload = {
      name: 'Race User',
      email,
      password: 'password123',
    };

    const requests = Array.from({ length: 5 }, () =>
      request(app.getHttpServer()).post('/api/v1/auth/register').send(payload),
    );

    const responses = await Promise.all(requests);

    const statuses = responses.map((response) => response.status);

    expect(statuses.filter((status) => status === 201)).toHaveLength(1);

    expect(statuses.filter((status) => status === 409)).toHaveLength(4);

    const usersCount = await userRepository.count({
      where: { email },
    });

    expect(usersCount).toBe(1);
  }, 15_000);
});
