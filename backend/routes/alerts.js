import Alert from '../models/Alert.js';
import Logger from '../utils/logger.js';
import { Op } from 'sequelize';

export default async function alertRoutes(fastify) {
  fastify.get('/', async (request, reply) => {
    try {
      const {
        level,
        env,
        service,
        type,
        search,
        limit = 50,
        offset = 0,
      } = request.query;

      const where = {};
      if (level) where.level = level;
      if (env) where.env = env;
      if (service) where.service = service;
      if (type) where.type = type;
      if (search) where.message = { [Op.like]: `%${search}%` };

      const alerts = await Alert.findAll({
        where,
        order: [['lastOccurrence', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return reply.send(alerts);
    } catch (err) {
      Logger.error('ERROR_FETCH_ALERTS', {
        requestId: request.requestId,
        meta: { stack: err.stack },
      });
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });
}
