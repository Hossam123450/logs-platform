// backend/instrumentation/backendLogger.js
import pino from 'pino';
import { getRequestContext } from './requestContext.js';
import config from '../config/index.js';
import { maskSensitiveData } from '../utils/maskSensitiveData.js';

// Création du logger Pino
const logger = pino({
  level: config.database.logging ? 'debug' : 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Log centralisé pour toutes les actions backend
 * @param {'debug'|'info'|'warn'|'error'|'fatal'} level
 * @param {string} message
 * @param {Object} meta
 */
export function log(level, message, meta = {}) {
  const context = getRequestContext();

  // Ajouter la traçabilité et masquer données sensibles
  const logData = {
    ...maskSensitiveData(meta),
    ...context,
  };

  logger[level]({ ...logData, message });
}

/**
 * Helpers rapides pour chaque niveau
 */
export const debug = (msg, meta) => log('debug', msg, meta);
export const info = (msg, meta) => log('info', msg, meta);
export const warn = (msg, meta) => log('warn', msg, meta);
export const error = (msg, meta) => log('error', msg, meta);
export const fatal = (msg, meta) => log('fatal', msg, meta);

export default logger;
