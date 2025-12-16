// routes/alerts.js
import Alert from '../models/Alert.js';

export const getAlerts = async (req, reply) => {
  try {
    const alerts = await Alert.findAll({ order: [['lastOccurrence', 'DESC']], limit: 100 });
    return reply.send(alerts);
  } catch (err) {
    return reply.code(500).send({ error: 'Erreur serveur' });
  }
};
