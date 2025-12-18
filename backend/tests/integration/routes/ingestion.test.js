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

  describe('ingestLog', () => {
    it('doit enregistrer un log via ingestion', async () => {
      const payload = { timestamp: new Date(), level: 'info', message: 'Ingestion test', env: 'test' };

      const fakeLog = { id: 1, ...payload };
      const fakeIngestion = { id: 1, logId: 1, status: 'received', receivedAt: new Date() };

      Log.create.mockResolvedValue(fakeLog);
      Ingestion.create.mockResolvedValue(fakeIngestion);

      // ⚠️ Utiliser ingestLog, pas ingest
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

  describe('updateIngestionStatus', () => {
    it('doit mettre à jour le status d\'une ingestion', async () => {
      const fakeIngestion = {
        id: 1,
        update: jest.fn().mockResolvedValue({ id: 1, status: 'processed' }),
      };

      Ingestion.findByPk = jest.fn().mockResolvedValue(fakeIngestion);

      const updated = await IngestionService.updateIngestionStatus(1, 'processed');

      expect(Ingestion.findByPk).toHaveBeenCalledWith(1);
      expect(fakeIngestion.update).toHaveBeenCalledWith({
        status: 'processed',
        processedAt: expect.any(Date),
      });
      expect(updated.status).toBe('processed');
    });

    it('doit retourner null si l\'ingestion n\'existe pas', async () => {
      Ingestion.findByPk = jest.fn().mockResolvedValue(null);

      const updated = await IngestionService.updateIngestionStatus(999, 'processed');

      expect(updated).toBeNull();
    });
  });
});
