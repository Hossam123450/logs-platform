// backend/instrumentation/requestContext.js
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * Middleware Fastify pour initialiser le contexte de requête
 */
export function requestContextMiddleware(request, reply, done) {
  const context = {
    requestId: request.headers['x-request-id'] || generateUniqueId(),
    sessionId: request.headers['x-session-id'] || null,
    userId: request.user?.id || null,
  };

  asyncLocalStorage.run(context, () => {
    done();
  });
}

/**
 * Obtenir le contexte courant
 * @returns {{ requestId: string, sessionId: string|null, userId: string|null }}
 */
export function getRequestContext() {
  return asyncLocalStorage.getStore() || {};
}

/**
 * Génération simple d'un ID unique
 * (tu peux remplacer par uuidv4 si besoin)
 */
function generateUniqueId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}
