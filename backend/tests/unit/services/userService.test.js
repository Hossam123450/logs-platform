import UserService from '../../../services/userService.js';
import User from '../../../models/User.js';
import sequelize from '../../../config/db.js';

beforeAll(async () => await sequelize.sync({ force: true }));
afterAll(async () => await sequelize.close());

describe('UserService', () => {
  it('doit créer un utilisateur', async () => {
    const payload = { username: 'admin', email: 'admin@test.com', passwordHash: 'hash' };
    const user = await UserService.create(payload);
    expect(user.id).toBeDefined();
    expect(user.username).toBe('admin');
  });

  it('doit lister les utilisateurs actifs', async () => {
    const users = await UserService.findAll({ isActive: true });
    expect(users.length).toBeGreaterThan(0);
  });
});
