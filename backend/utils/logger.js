import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const API_LOG_URL = process.env.LOG_API_URL || 'http://localhost:3000/logs'

class Logger {
  constructor(env) {
    this.env = env || process.env.NODE_ENV || 'development'
  }

  async log({ level, message, requestId, sessionId, userId, route, method, statusCode, event, service, durationMs, meta }) {
    try {
      const payload = {
        timestamp: new Date(),
        level,
        message,
        env: this.env,
        requestId: requestId || uuidv4(),
        sessionId: sessionId || uuidv4(),
        userId: userId || null,
        route,
        method,
        statusCode,
        event,
        service,
        durationMs,
        meta
      }

      // Envoi asynchrone
      axios.post(API_LOG_URL, payload)
        .then(() => console.log(`[LOG ${level}] envoyé`))
        .catch(err => console.error('Erreur envoi log:', err.message))

    } catch (err) {
      console.error('Erreur logger:', err)
    }
  }

  debug(msg, context) { this.log({ ...context, level: 'debug', message: msg }) }
  info(msg, context) { this.log({ ...context, level: 'info', message: msg }) }
  warn(msg, context) { this.log({ ...context, level: 'warn', message: msg }) }
  error(msg, context) { this.log({ ...context, level: 'error', message: msg }) }
  fatal(msg, context) { this.log({ ...context, level: 'fatal', message: msg }) }
}

export default new Logger()
