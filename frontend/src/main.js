import { createApp } from 'vue'
import App from './App.vue'
import router from './router'           // <-- importer le router
import Logger from './utils/logger.js'

const logger = new Logger({
  apiUrl: 'http://localhost:3000/logs',
  env: process.env.NODE_ENV,
  appToken: 'MON_TOKEN_APP'
})

const app = createApp(App)
app.provide('logger', logger)

// ⚠️ utiliser le router
app.use(router)

app.mount('#app')

// Capturer erreurs globales
window.onerror = function(message, source, lineno, colno, error) {
  logger.error('Erreur JS globale', { message, route: window.location.pathname, meta: { stack: error?.stack } })
}

window.onunhandledrejection = function(event) {
  logger.error('Promesse non gérée', { message: event.reason?.message || 'unknown', route: window.location.pathname, meta: { reason: event.reason } })
}
