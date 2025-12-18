// tests/unit/services/logService.test.js
import LogService from '../../../services/logService.js';
import Log from '../../../models/Log.js';

// Mock des méthodes Sequelize
jest.mock('../../../models/Log.js', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  findAndCountAll: jest.fn(),
  destroy: jest.fn(),
}));

describe('LogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('doit créer un log', async () => {
    const payload = { timestamp: new Date(), level: 'info', message: 'Test log', env: 'test' };
    const fakeLog = { id: 1, ...payload };
    Log.create.mockResolvedValue(fakeLog);

    const log = await LogService.createLog(payload);

    expect(Log.create).toHaveBeenCalledWith(payload);
    expect(log.id).toBe(1);
    expect(log.message).toBe('Test log');
  });

  it('doit récupérer les logs filtrés', async () => {
    const fakeLogs = { rows: [{ id: 1, message: 'Test log' }], count: 1 };
    Log.findAndCountAll.mockResolvedValue(fakeLogs);

    const result = await LogService.getLogs({ level: 'info' });

    expect(Log.findAndCountAll).toHaveBeenCalled();
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].message).toBe('Test log');
  });

  it('doit supprimer un log', async () => {
    Log.destroy.mockResolvedValue(1); // simulate deletion

    const deleted = await LogService.deleteLog(1);

    expect(Log.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(deleted).toBe(true);
  });
});
