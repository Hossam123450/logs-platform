// backend/services/ingestionService.js
import Ingestion from '../models/Ingestion.js';
import Log from '../models/Log.js';

class IngestionService {
  /**
   * Créer un log et enregistrer l'ingestion
   * @param {Object} logData
   * @returns {Promise<Ingestion>}
   */
  static async ingestLog(logData) {
    // Créer le log
    const log = await Log.create(logData);

    // Créer l'ingestion associée
    const ingestion = await Ingestion.create({
      logId: log.id,
      status: 'received',
      receivedAt: new Date(),
    });

    return ingestion;
  }

  /**
   * Mettre à jour le status d'une ingestion
   * @param {number} ingestionId
   * @param {string} status
   * @param {string} errorMessage
   * @returns {Promise<Ingestion|null>}
   */
  static async updateIngestionStatus(ingestionId, status, errorMessage = null) {
    const ingestion = await Ingestion.findByPk(ingestionId);
    if (!ingestion) return null;

    const updates = { status };
    if (status === 'processed') updates.processedAt = new Date();
    if (errorMessage) updates.errorMessage = errorMessage;

    return ingestion.update(updates);
  }
}

export default IngestionService;
