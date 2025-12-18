import AlertService from '../../../services/alertService.js';
import Alert from '../../../models/Alert.js';
import sequelize from '../../../config/db.js';

beforeAll(async () => await sequelize.sync({ force: true }));
afterAll(async () => await sequelize.close());

describe('AlertService', () => {
  it('doit créer une alerte', async () => {
    const payload = { name: 'Test', level: 'warn', threshold: 1, timeWindowMinutes: 5, emails: ['test@test.com'] };
    const alert = await AlertService.create(payload);
    expect(alert.id).toBeDefined();
    expect(alert.name).toBe('Test');
  });

  it('doit lister les alertes actives', async () => {
    const alerts = await AlertService.findAll({ enabled: true });
    expect(alerts.length).toBeGreaterThan(0);
  });
});
