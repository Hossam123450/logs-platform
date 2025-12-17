import Logger from '../utils/logger.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export default async function userRoutes(fastify) {
  fastify.get('/', async (request, reply) => {
    const requestId = request.headers['x-request-id'] || null;
    const { role, search, limit = 50, offset = 0 } = request.query;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    try {
      const users = await User.findAll({
        where,
        attributes: { exclude: ['passwordHash'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['username', 'ASC']],
      });

      Logger.info('LIST_USERS', {
        requestId,
        route: request.url,
        method: request.method,
        count: users.length,
      });

      return reply.send(users);
    } catch (err) {
      Logger.error('ERROR_FETCH_USERS', {
        requestId,
        route: request.url,
        method: request.method,
        meta: { stack: err.stack },
      });

      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });
}
