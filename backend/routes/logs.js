// routes/logs.js
import Log from '../models/Log.js';
import Logger from '../utils/logger.js';

export const getLogs = async (req, reply) => {
  const { level, limit = 100 } = req.query;
  try {
    const logs = await Log.findAll({
      where: level ? { level } : {},
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });
    return reply.send(logs);
  } catch (err) {
    Logger.error('Erreur récupération logs', { meta: { stack: err.stack } });
    return reply.code(500).send({ error: 'Erreur serveur' });
  }
};
