// tests/unit/services/ingestionService.test.js
import IngestionService from '../../../services/ingestionService.js';
import Log from '../../../models/Log.js';
import Ingestion from '../../../models/Ingestion.js';

jest.mock('../../../models/Log.js');
jest.mock('../../../models/Ingestion.js');

describe('IngestionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('doit enregistrer un log via ingestion', async () => {
    const payload = { message: 'test log' };
    const fakeLog = { id: 1, ...payload };
    const fakeIngestion = { id: 10, logId: 1, status: 'received' };

    Log.create.mockResolvedValue(fakeLog);
    Ingestion.create.mockResolvedValue(fakeIngestion);

    const ingestion = await IngestionService.ingestLog(payload);

    expect(Log.create).toHaveBeenCalledWith(payload);
    expect(Ingestion.create).toHaveBeenCalledWith({
      logId: fakeLog.id,
      status: 'received',
      receivedAt: expect.any(Date),
    });
    expect(ingestion).toEqual(fakeIngestion);
  });
});
