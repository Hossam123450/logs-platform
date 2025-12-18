// backend/routes/ingestion.js
import IngestionService from '../services/ingestionService.js';
import { ingestionSchema } from '../schemas/ingestionSchema.js';
import config from '../config/index.js';

export default async function ingestionRoutes(fastify) {
  // POST /ingest → réception de log
  fastify.post(
    '/ingest',
    {
      schema: ingestionSchema,
      preHandler: async (request, reply) => {
        // Vérification du token d'ingestion
        const token = request.headers['x-ingestion-token'];
        if (token !== config.security.ingestionToken) {
          return reply.code(401).send({ message: 'Unauthorized' });
        }
      },
    },
    async (request, reply) => {
      try {
        await IngestionService.ingestLog(request.body);

        // Réponse minimale pour ingestion rapide
        return reply.code(202).send();
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ message: 'Internal server error' });
      }
    }
  );
}
