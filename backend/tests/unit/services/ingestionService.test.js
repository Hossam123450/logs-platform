import IngestionService from '../../../services/ingestionService.js';
import Log from '../../../models/Log.js';
import sequelize from '../../../config/db.js';

beforeAll(async () => await sequelize.sync({ force: true }));
afterAll(async () => await sequelize.close());

describe('IngestionService', () => {
  it('doit enregistrer un log via ingestion', async () => {
    const payload = { timestamp: new Date(), level: 'info', message: 'Ingestion test', env: 'test' };
    const log = await IngestionService.ingest(payload);
    expect(log.id).toBeDefined();
    expect(log.message).toBe('Ingestion test');
  });
});
