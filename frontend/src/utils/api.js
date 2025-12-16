import Logger from './logger.js'

const logger = new Logger({
  apiUrl: 'http://localhost:3000/logs',
  env: process.env.NODE_ENV,
  appToken: 'MON_TOKEN_APP'
})

export async function apiFetch(url, options = {}) {
  const start = Date.now()
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      logger.error('Erreur API', {
        route: url,
        method: options.method || 'GET',
        statusCode: response.status,
        durationMs: Date.now() - start
      })
    }
    return response
  } catch (err) {
    logger.error('Erreur réseau', {
      route: url,
      method: options.method || 'GET',
      meta: { stack: err.stack }
    })
    throw err
  }
}
