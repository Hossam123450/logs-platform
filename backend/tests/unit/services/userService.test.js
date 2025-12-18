// tests/unit/services/userService.test.js
import UserService from '../../../services/userService.js';
import User from '../../../models/User.js';
import bcrypt from 'bcryptjs';

jest.mock('../../../models/User.js');
jest.mock('bcryptjs');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('doit créer un utilisateur', async () => {
    const payload = { username: 'john', email: 'john@test.com', password: 'pass123' };
    const fakeUser = { id: 1, username: 'john', email: 'john@test.com' };

    bcrypt.hash.mockResolvedValue('hashed_pass');
    User.create.mockResolvedValue(fakeUser);

    const user = await UserService.createUser(payload);

    expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, 10);
    expect(User.create).toHaveBeenCalledWith({
      username: payload.username,
      email: payload.email,
      passwordHash: 'hashed_pass',
      role: 'viewer',
      isActive: true,
    });
    expect(user).toEqual(fakeUser);
  });
});
