import LogService from '../../../services/logService.js';
import Log from '../../../models/Log.js';
import sequelize from '../../../config/db.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('LogService', () => {
  it('doit créer un log', async () => {
    const payload = { timestamp: new Date(), level: 'info', message: 'Test log', env: 'test' };
    const log = await LogService.create(payload);
    expect(log.id).toBeDefined();
    expect(log.message).toBe('Test log');
  });

  it('doit récupérer les logs filtrés', async () => {
    const logs = await LogService.findAll({ level: 'info' });
    expect(logs.length).toBeGreaterThan(0);
  });
});
