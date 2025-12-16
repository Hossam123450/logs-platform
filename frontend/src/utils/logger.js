import { v4 as uuidv4 } from 'uuid'

class Logger {
  constructor({ apiUrl, env, appToken }) {
    this.apiUrl = apiUrl || 'http://localhost:3000/logs'
    this.env = env || 'development'
    this.appToken = appToken || null
    this.sessionId = uuidv4()  // Génère un ID de session unique par page
  }

  async log({ level, message, requestId, userId, route, method, statusCode, event, service, durationMs, meta }) {
    try {
      const payload = {
        timestamp: new Date(),
        level,
        message,
        env: this.env,
        requestId: requestId || uuidv4(),
        sessionId: this.sessionId,
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
      fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.appToken ? `Bearer ${this.appToken}` : ''
        },
        body: JSON.stringify(payload)
      }).catch(err => console.error('Erreur envoi log:', err))
    } catch (err) {
      console.error('Erreur logger frontend:', err)
    }
  }

  debug(msg, context) { this.log({ ...context, level: 'debug', message: msg }) }
  info(msg, context) { this.log({ ...context, level: 'info', message: msg }) }
  warn(msg, context) { this.log({ ...context, level: 'warn', message: msg }) }
  error(msg, context) { this.log({ ...context, level: 'error', message: msg }) }
  fatal(msg, context) { this.log({ ...context, level: 'fatal', message: msg }) }
}

export default Logger
