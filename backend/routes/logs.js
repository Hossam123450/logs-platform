// backend/routes/logs.js
import LogService from '../services/logService.js';
import { logSchema } from '../schemas/logSchema.js';

export default async function logRoutes(fastify) {
  // POST /logs → ingestion d'un log
  fastify.post(
    '/logs',
    { schema: logSchema },
    async (request, reply) => {
      const log = await LogService.createLog(request.body);
      return reply.code(201).send(log);
    }
  );

  // GET /logs → liste des logs avec filtres
  fastify.get('/logs', async (request, reply) => {
    const { level, env, service, fingerprint, userId, startDate, endDate, limit, offset } =
      request.query;

    const filters = { level, env, service, fingerprint, userId, startDate, endDate };
    const options = {
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    };

    const result = await LogService.getLogs(filters, options);
    return {
      total: result.count,
      logs: result.rows,
    };
  });

  // GET /logs/:id → un log spécifique
  fastify.get('/logs/:id', async (request, reply) => {
    const log = await LogService.getLogById(request.params.id);
    if (!log) return reply.code(404).send({ message: 'Log not found' });
    return log;
  });

  // DELETE /logs/:id → supprimer un log
  fastify.delete('/logs/:id', async (request, reply) => {
    const deleted = await LogService.deleteLog(request.params.id);
    if (!deleted) return reply.code(404).send({ message: 'Log not found' });
    return reply.code(204).send();
  });
}
