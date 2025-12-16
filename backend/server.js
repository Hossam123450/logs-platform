import Fastify from 'fastify';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import Log from './models/Logs.js';
import Logger from './utils/logger.js';
import formbody from '@fastify/formbody';

dotenv.config();

const fastify = Fastify({ logger: true });

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

// Parse JSON et form body
fastify.register(formbody);

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
