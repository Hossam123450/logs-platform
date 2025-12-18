// backend/tests/integration/routes/ingestion.test.js
import Fastify from 'fastify';
import supertest from 'supertest';
import ingestionRoutes from '../../../routes/ingestion.js';
import sequelize from '../../../config/db.js';

let app;

beforeAll(async () => {
  app = Fastify();
  app.register(ingestionRoutes, { prefix: '/ingestion' });

  // DB en mémoire pour tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /ingestion', () => {
  it('doit accepter un log valide', async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Test log',
      env: 'test'
    };

    const res = await supertest(app.server)
      .post('/ingestion')
      .send(payload)
      .expect(202);

    expect(res.text).toBe('');
  });

  it('doit rejeter un log invalide', async () => {
    const payload = {
      timestamp: 'not-a-date',
      level: 'info',
    };

    await supertest(app.server)
      .post('/ingestion')
      .send(payload)
      .expect(400);
  });
});
