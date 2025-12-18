// backend/utils/maskSensitiveData.js

/**
 * Liste des champs sensibles à masquer automatiquement
 * Toutes en minuscules pour éviter les problèmes de casse
 */
const SENSITIVE_KEYS = [
  'password',
  'passwordhash',
  'token',
  'apikey',
  'secret',
  'authorization',
];

/**
 * Masque les valeurs sensibles dans un objet ou tableau
 * @param {Object|Array} data
 * @returns {Object|Array} une copie avec les champs sensibles masqués
 */
export function maskSensitiveData(data) {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item));
  } else if (typeof data === 'object') {
    const masked = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        masked[key] = '[MASKED]';
      } else if (typeof value === 'object') {
        masked[key] = maskSensitiveData(value);
      } else {
        masked[key] = value;
      }
    }
    return masked;
  }

  return data; // types primitifs
}
