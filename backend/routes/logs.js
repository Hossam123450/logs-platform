import Log from '../models/Log.js';
import Logger from '../utils/logger.js';

export default async function logRoutes(fastify) {
  // POST existant
  fastify.post('/logs', {
    schema: {
      body: {
        type: 'object',
        required: ['timestamp', 'level', 'message', 'env'],
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          level: { type: 'string', enum: ['debug','info','warn','error','fatal'] },
          message: { type: 'string', minLength: 1 },
          env: { type: 'string' },
          requestId: { type: ['string','null'] },
          sessionId: { type: ['string','null'] },
          userId: { type: ['string','number','null'] },
          route: { type: ['string','null'] },
          method: { type: ['string','null'] },
          statusCode: { type: ['number','null'] },
          durationMs: { type: ['number','null'] },
          event: { type: ['string','null'] },
          service: { type: ['string','null'] },
          meta: { type: ['object','null'], additionalProperties: true },
        },
        additionalProperties: true
      }
    },
    handler: async (request, reply) => {
      const logPayload = request.body;
      Log.create(logPayload).catch(err => {
        Logger.error('LOG_INSERT_FAILED', {
          requestId: request.requestId,
          meta: { error: err.message }
        });
      });
      return reply.code(202).send();
    }
  });

  // --- GET temporaire pour tester ---
  fastify.get('/logs', async (request, reply) => {
    const logs = await Log.findAll({ order: [['timestamp', 'DESC']], limit: 50 });
    return reply.send(logs);
  });
}
