import Fastify from 'fastify';
import supertest from 'supertest';
import usersRoutes from '../../../routes/users.js';
import UserService from '../../../services/userService.js';

jest.mock('../../../services/userService.js');

let app;

beforeAll(async () => {
  app = Fastify();
  app.register(usersRoutes, { prefix: '/users' });

  // Mock des méthodes pour que le test passe sans DB
  UserService.getUsers.mockResolvedValue([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);
});

afterAll(async () => await app.close());

describe('GET /users', () => {
  it('renvoie la liste des utilisateurs', async () => {
    const res = await supertest(app.server).get('/users').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });
});
