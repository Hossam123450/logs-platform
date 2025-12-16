// ./utils/logger.js
import axios from 'axios'

const API_LOG_URL = process.env.LOG_API_URL || 'http://localhost:3000/logs'

class Logger {
  constructor(env) {
    this.env = env || process.env.NODE_ENV || 'development'
  }

  async log(payload) {
    // Ajout de timestamp et env si absent
    const logEntry = {
      timestamp: new Date().toISOString(),
      env: this.env,
      ...payload
    }

    // Log dans la console
    console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.timestamp}: ${logEntry.message}`)

    // Envoi vers l'API /logs
    try {
      await axios.post(API_LOG_URL, logEntry)
    } catch (err) {
      console.error('Erreur envoi log API:', err.message)
    }
  }

  debug(message, context = {}) { this.log({ ...context, level: 'debug', message }) }
  info(message, context = {})  { this.log({ ...context, level: 'info', message }) }
  warn(message, context = {})  { this.log({ ...context, level: 'warn', message }) }
  error(message, context = {}) { this.log({ ...context, level: 'error', message }) }
  fatal(message, context = {}) { this.log({ ...context, level: 'fatal', message }) }
}

// Export d’une instance unique
export default new Logger()
