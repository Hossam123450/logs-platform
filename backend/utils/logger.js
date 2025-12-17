import axios from 'axios';

const LOG_API_URL =
  process.env.LOG_API_URL || 'http://localhost:3000/ingest/logs';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const SENSITIVE_KEYS = [
  'password',
  'token',
  'authorization',
  'secret',
  'cookie',
  'accessToken',
  'refreshToken',
];

// --------------------------------------------------
// Utils
// --------------------------------------------------
const maskSensitiveData = (obj = {}) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  const masked = Array.isArray(obj) ? [] : {};

  for (const key of Object.keys(obj)) {
    if (SENSITIVE_KEYS.includes(key)) {
      masked[key] = '***MASKED***';
    } else if (typeof obj[key] === 'object') {
      masked[key] = maskSensitiveData(obj[key]);
    } else {
      masked[key] = obj[key];
    }
  }
  return masked;
};

const normalizeLevel = (level) =>
  LOG_LEVELS.includes(level) ? level : 'info';

// --------------------------------------------------
// Logger class
// --------------------------------------------------
class Logger {
  constructor(options = {}) {
    this.env = options.env || process.env.NODE_ENV || 'development';
    this.service = options.service || 'unknown';
    this.timeout = options.timeout || 1000;
  }

  send(log) {
    axios
      .post(LOG_API_URL, log, { timeout: this.timeout })
      .catch(() => {
        // SILENT FAIL (important)
      });
  }

  buildLog(level, message, context = {}) {
    return {
      timestamp: new Date().toISOString(),
      level: normalizeLevel(level),
      message,
      env: this.env,
      service: context.service || this.service,

      // Traçabilité
      requestId: context.requestId || null,
      sessionId: context.sessionId || null,
      userId: context.userId || null,

      // Contexte HTTP
      route: context.route || null,
      method: context.method || null,
      statusCode: context.statusCode || null,
      durationMs: context.durationMs || null,

      // Métier
      event: context.event || null,

      // Meta libre (masquée)
      meta: maskSensitiveData(context.meta || {}),
    };
  }

  log(level, message, context) {
    const logEntry = this.buildLog(level, message, context);

    // Console minimale (dev uniquement)
    if (this.env !== 'production') {
      // eslint-disable-next-line no-console
      console[level === 'error' || level === 'fatal' ? 'error' : 'log'](
        `[${logEntry.level.toUpperCase()}] ${message}`
      );
    }

    this.send(logEntry);
  }

  debug(msg, ctx) { this.log('debug', msg, ctx); }
  info(msg, ctx)  { this.log('info', msg, ctx); }
  warn(msg, ctx)  { this.log('warn', msg, ctx); }
  error(msg, ctx) { this.log('error', msg, ctx); }
  fatal(msg, ctx) { this.log('fatal', msg, ctx); }
}

// --------------------------------------------------
// Singleton export
// --------------------------------------------------
export default new Logger({
  env: process.env.NODE_ENV,
  service: 'api',
});
