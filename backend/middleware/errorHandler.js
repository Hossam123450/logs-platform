// backend/middleware/errorHandler.js
/**
 * Middleware global de gestion des erreurs Fastify
 * @param {Error} error
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 */
export function errorHandler(error, request, reply) {
  // Log détaillé côté serveur
  request.log.error({
    message: error.message,
    stack: error.stack,
    body: request.body,
    query: request.query,
    params: request.params,
  });

  // Réponse client standardisée
  const statusCode = error.statusCode || 500;
  const response = {
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  };

  reply.code(statusCode).send(response);
}
