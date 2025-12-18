// backend/workers/fingerprintWorker.js
import crypto from 'crypto';
import Log from '../models/Log.js';
import { updateLogFingerprint } from '../services/logService.js';
import { debug, error } from '../instrumentation/backendLogger.js';

/**
 * Génération d'une fingerprint pour une erreur
 * @param {Log} log
 * @returns {string}
 */
export function generateFingerprint(log) {
  const str = `${log.message}|${log.level}|${log.route}|${log.method}|${log.service}`;
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Worker qui traite les logs sans fingerprint
 */
export async function processLogsWithoutFingerprint() {
  try {
    const logs = await Log.findAll({ where: { fingerprint: null } });

    for (const logEntry of logs) {
      const fingerprint = generateFingerprint(logEntry);
      await updateLogFingerprint(logEntry.id, fingerprint);
      debug('Fingerprint généré', { logId: logEntry.id, fingerprint });
    }
  } catch (err) {
    error('Erreur fingerprintWorker', { error: err.message, stack: err.stack });
  }
}
