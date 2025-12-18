// backend/workers/errorGroupWorker.js
import Log from '../models/Log.js';
import { debug, error } from '../instrumentation/backendLogger.js';

/**
 * Regroupe les erreurs similaires pour analyse
 */
export async function groupSimilarErrors() {
  try {
    // Exemple simplifié : compter les erreurs par fingerprint et niveau
    const grouped = await Log.findAll({
      attributes: ['fingerprint', 'level', 'service'],
      where: { level: ['warn', 'error', 'fatal'] },
      group: ['fingerprint', 'level', 'service'],
      raw: true,
    });

    debug('Erreurs regroupées', { count: grouped.length });
    // Ici tu peux enregistrer dans une table d'analytics ou mémoire
  } catch (err) {
    error('Erreur errorGroupWorker', { error: err.message, stack: err.stack });
  }
}
