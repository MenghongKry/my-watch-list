import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module.js';

describe('Movies (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let movieId: number;

  beforeAll(async () => {
    // Safety check: these tests empty the tables, so never run them on the real database
    if (process.env.DB_NAME !== 'watchlist_test') {
      throw new Error(
        `E2E tests must use watchlist_test, but DB_NAME is "${process.env.DB_NAME}"`,
      );
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // main.ts is not run in tests, so add the same ValidationPipe here
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Start every run with empty tables in the TEST database
    await app
      .get(DataSource)
      .query('TRUNCATE TABLE movies, users RESTART IDENTITY');

    // Create a user and log in, so the protected tests have a real token
    const user = { email: 'e2e@test.com', password: 'secret123' };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200);
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await app?.close();
  });

  it('POST /auth/login with a wrong password returns 401', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'e2e@test.com', password: 'wrong-password' })
      .expect(401);
  });

  it('GET /movies returns 200 and an array (no token needed)', async () => {
    const res = await request(app.getHttpServer()).get('/movies').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /movies without a token returns 401', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .send({ title: 'Inception', genre: 'Sci-Fi' })
      .expect(401);
  });

  it('POST /movies with a valid token returns 201 and the new movie', async () => {
    const res = await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Inception', genre: 'Sci-Fi' })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: 'Inception',
      genre: 'Sci-Fi',
      watched: false,
    });
    movieId = res.body.id;
  });

  it('POST /movies with an empty title or missing genre returns 400', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '', genre: 'Sci-Fi' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Inception' })
      .expect(400);
  });

  it('GET /movies/:id returns the movie', async () => {
    const res = await request(app.getHttpServer())
      .get(`/movies/${movieId}`)
      .expect(200);

    expect(res.body).toMatchObject({ id: movieId, title: 'Inception' });
  });

  it('PATCH /movies/:id marks the movie as watched', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ watched: true })
      .expect(200);

    // title and genre were not sent, so they must stay the same
    expect(res.body).toMatchObject({
      id: movieId,
      title: 'Inception',
      genre: 'Sci-Fi',
      watched: true,
    });
  });

  it('PATCH and DELETE on a missing movie return 404', async () => {
    await request(app.getHttpServer())
      .patch('/movies/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ watched: true })
      .expect(404);

    await request(app.getHttpServer())
      .delete('/movies/999999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('DELETE /movies/:id removes the movie, then GET returns 404', async () => {
    await request(app.getHttpServer())
      .delete(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer()).get(`/movies/${movieId}`).expect(404);
  });
});
