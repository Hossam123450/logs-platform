import Fastify from 'fastify';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import Log from './models/Log.js';
import Logger from './utils/logger.js';
import formbody from '@fastify/formbody';
import { getLogs } from './routes/logs.js';
import { getAlerts } from './routes/alerts.js';
import cors from '@fastify/cors';

// Charger les variables d'environnement
dotenv.config();

// Créer l'instance Fastify
const fastify = Fastify({ logger: true });

// Enregistrer les plugins après l'initialisation
fastify.register(cors, { origin: '*' });
fastify.register(formbody);

// Routes
fastify.get('/alerts', getAlerts);
fastify.get('/logs', getLogs);
// Backend : Route pour récupérer les erreurs groupées
fastify.get('/logs/grouped-errors', async (request, reply) => {
  try {
    const groupedErrors = await Log.findAll({
      attributes: [
        'message',
        [Sequelize.fn('COUNT', Sequelize.col('message')), 'count'],
        [Sequelize.fn('MAX', Sequelize.col('timestamp')), 'lastOccurrence']
      ],
      group: ['message'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('message')), 'DESC']],
      raw: true
    });

    reply.send(groupedErrors);
  } catch (err) {
    reply.status(500).send({ error: 'Erreur lors de la récupération des erreurs groupées' });
  }
});
fastify.get('/logs/stats', async (request, reply) => {
  try {
    const topErrors = await Log.findAll({
      attributes: [
        'message',
        [Sequelize.fn('COUNT', Sequelize.col('message')), 'count']
      ],
      group: ['message'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('message')), 'DESC']],
      limit: 5,
      raw: true
    });

    // Exemple de données d'évolution sur 24h
    const errorEvolution = await Log.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('timestamp')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: {
        timestamp: {
          [Sequelize.Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000)  // Dernières 24 heures
        }
      },
      group: ['date'],
      raw: true
    });

    reply.send({ topErrors, errorEvolution });
  } catch (err) {
    reply.status(500).send({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Endpoint pour recevoir les logs
fastify.post('/logs', async (request, reply) => {
  try {
    const logData = request.body;

    // Validation minimale
    const requiredFields = ['timestamp', 'level', 'message', 'env'];
    for (const field of requiredFields) {
      if (!logData[field]) {
        return reply.code(400).send({ error: `${field} est obligatoire` });
      }
    }

    // Insertion asynchrone
    try {
      await Log.create(logData);
      fastify.log.info('Log inséré');
    } catch (err) {
      fastify.log.error('Erreur insertion log:', err);
    }

    // Réponse rapide
    return reply.code(202).send({ status: 'Accepted' });

  } catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ error: 'Erreur serveur' });
  }
});

// Synchroniser la base de données
sequelize.sync({ alter: true }) // alter:true met à jour les tables sans les supprimer
  .then(() => console.log('✅ Tables synchronisées'))
  .catch(err => console.error('❌ Erreur synchronisation tables', err));

// Catch exceptions non gérées
process.on('uncaughtException', (err) => {
  Logger.fatal('Exception non gérée', { meta: { stack: err.stack } });
});

// Catch promesses rejetées non gérées
process.on('unhandledRejection', (reason) => {
  Logger.fatal('Promesse rejetée non gérée', { meta: { reason } });
});

// Test connexion DB
sequelize.authenticate()
  .then(() => console.log('Connexion MySQL OK'))
  .catch(err => console.error('Erreur MySQL :', err));

// Lancement du serveur
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
