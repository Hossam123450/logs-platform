// backend/services/alertService.js
import Alert from '../models/Alert.js';

class AlertService {
  /**
   * Créer une alerte
   * @param {Object} data
   * @returns {Promise<Alert>}
   */
  static async createAlert(data) {
    const alert = await Alert.create(data);
    return alert;
  }

  /**
   * Récupérer toutes les alertes, avec filtres optionnels
   * @param {Object} filters
   * @returns {Promise<Alert[]>}
   */
  static async getAlerts(filters = {}) {
    return Alert.findAll({ where: filters, order: [['createdAt', 'DESC']] });
  }

  /**
   * Récupérer une alerte par ID
   * @param {number} id
   * @returns {Promise<Alert|null>}
   */
  static async getAlertById(id) {
    return Alert.findByPk(id);
  }

  /**
   * Mettre à jour une alerte
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise<Alert|null>}
   */
  static async updateAlert(id, updates) {
    const alert = await Alert.findByPk(id);
    if (!alert) return null;
    return alert.update(updates);
  }

  /**
   * Supprimer une alerte
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  static async deleteAlert(id) {
    const deletedCount = await Alert.destroy({ where: { id } });
    return deletedCount > 0;
  }
}

export default AlertService;
