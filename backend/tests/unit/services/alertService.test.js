// tests/unit/services/alertService.test.js
import AlertService from '../../../services/alertService.js';
import Alert from '../../../models/Alert.js';

jest.mock('../../../models/Alert.js');

describe('AlertService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('doit créer une alerte', async () => {
    const payload = { message: 'alerte test' };
    const fakeAlert = { id: 1, ...payload };

    Alert.create.mockResolvedValue(fakeAlert);

    const alert = await AlertService.createAlert(payload);

    expect(Alert.create).toHaveBeenCalledWith(payload);
    expect(alert).toEqual(fakeAlert);
  });

  it('doit lister les alertes', async () => {
    const fakeAlerts = [{ id: 1, message: 'alerte test' }];

    Alert.findAll.mockResolvedValue(fakeAlerts);

    const alerts = await AlertService.getAlerts({ enabled: true });

    expect(Alert.findAll).toHaveBeenCalledWith({
      where: { enabled: true },
      order: [['createdAt', 'DESC']],
    });
    expect(alerts).toEqual(fakeAlerts);
  });
});
