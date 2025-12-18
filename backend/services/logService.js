// backend/services/logService.js
import Log from '../models/Log.js';

class LogService {
  /**
   * Créer un log
   * @param {Object} data
   * @returns {Promise<Log>}
   */
  static async createLog(data) {
    const log = await Log.create(data);
    return log;
  }

  /**
   * Récupérer un log par ID
   * @param {number} id
   * @returns {Promise<Log|null>}
   */
  static async getLogById(id) {
    return Log.findByPk(id);
  }

  /**
   * Récupérer des logs avec filtres
   * @param {Object} filters
   * @param {Object} options pagination/sorting
   * @returns {Promise<{rows: Log[], count: number}>}
   */
  static async getLogs(filters = {}, options = {}) {
    const { limit = 50, offset = 0, order = [['timestamp', 'DESC']] } = options;

    const where = {};
    if (filters.level) where.level = filters.level;
    if (filters.env) where.env = filters.env;
    if (filters.service) where.service = filters.service;
    if (filters.fingerprint) where.fingerprint = filters.fingerprint;
    if (filters.userId) where.userId = filters.userId;
    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp.$gte = new Date(filters.startDate);
      if (filters.endDate) where.timestamp.$lte = new Date(filters.endDate);
    }

    const result = await Log.findAndCountAll({
      where,
      limit,
      offset,
      order,
    });

    return result;
  }

  /**
   * Supprimer un log par ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  static async deleteLog(id) {
    const deletedCount = await Log.destroy({ where: { id } });
    return deletedCount > 0;
  }
}

export default LogService;
