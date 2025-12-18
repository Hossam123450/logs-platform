// backend/workers/alertWorker.js
import Log from '../models/Log.js';
import Alert from '../models/Alert.js';
import { sendEmail } from '../services/alertService.js';
import { debug, error } from '../instrumentation/backendLogger.js';
import { Op } from 'sequelize';

/**
 * Vérifie les règles d'alerte et envoie des emails
 */
export async function processAlerts() {
  try {
    const alerts = await Alert.findAll({ where: { enabled: true } });

    for (const alert of alerts) {
      // Récupérer les logs récents selon la fenêtre temporelle
      const since = new Date(Date.now() - alert.timeWindowMinutes * 60 * 1000);

      const where = {
        timestamp: { [Op.gte]: since },
        level: alert.level,
      };

      if (alert.fingerprint) where.fingerprint = alert.fingerprint;
      if (alert.env) where.env = alert.env;
      if (alert.service) where.service = alert.service;

      const count = await Log.count({ where });

      if (count >= alert.threshold) {
        // Envoyer l'alerte
        await sendEmail(alert.emails, `Alerte: ${alert.name}`, `Nombre d'erreurs: ${count}`);
        debug('Alerte déclenchée', { alertId: alert.id, count });

        // Mettre à jour la dernière fois déclenchée
        alert.lastTriggeredAt = new Date();
        await alert.save();
      }
    }
  } catch (err) {
    error('Erreur alertWorker', { error: err.message, stack: err.stack });
  }
}
