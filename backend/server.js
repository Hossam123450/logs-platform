import Fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { randomUUID } from 'crypto';

import sequelize from './config/db.js';
import Logger from './utils/logger.js';

// Routes
import logRoutes from './routes/logs.js';
import alertRoutes from './routes/alerts.js';
import userRoutes from './routes/users.js';

dotenv.config();

// --------------------------------------------------
// Fastify instance (logger interne désactivé)
// --------------------------------------------------
const fastify = Fastify({ logger: false });

// --------------------------------------------------
// Plugins
// --------------------------------------------------
fastify.register(cors, { origin: true });
fastify.register(formbody);

// --------------------------------------------------
// Hook global : requestId + timing
// --------------------------------------------------
fastify.addHook('onRequest', async (request) => {
  request.requestId = randomUUID();
  request.startTime = Date.now();
});

// --------------------------------------------------
// Hook post-response : log technique API
// --------------------------------------------------
fastify.addHook('onResponse', async (request, reply) => {
  if (request.routerPath.startsWith('/ingest')) return; // <-- Ignorer les logs eux-mêmes

  const durationMs = Date.now() - request.startTime;

  Logger.info('HTTP_REQUEST', {
    requestId: request.requestId,
    route: request.routerPath,
    method: request.method,
    statusCode: reply.statusCode,
    durationMs,
    service: 'api',
  });
});


// --------------------------------------------------
// Error handler global
// --------------------------------------------------
fastify.setErrorHandler((error, request, reply) => {
  Logger.error(error.message, {
    requestId: request.requestId,
    route: request.routerPath,
    method: request.method,
    meta: {
      stack: error.stack,
    },
  });

  reply.status(500).send({ error: 'Internal Server Error' });
});

// --------------------------------------------------
// Routes
// --------------------------------------------------

// API d’ingestion (responsabilité unique)
fastify.register(logRoutes, { prefix: '/ingest' });

// API dashboard (lecture / stats)
fastify.register(alertRoutes, { prefix: '/api/alerts' });
fastify.register(userRoutes, { prefix: '/api/users' });

// --------------------------------------------------
// Process-level error handling (Node.js)
// --------------------------------------------------
process.on('uncaughtException', (err) => {
  Logger.fatal('UNCAUGHT_EXCEPTION', {
    meta: { stack: err.stack },
  });
});

process.on('unhandledRejection', (reason) => {
  Logger.fatal('UNHANDLED_REJECTION', {
    meta: { reason },
  });
});

// --------------------------------------------------
// DB connection
// --------------------------------------------------
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    Logger.info('DATABASE_CONNECTED', { service: 'mysql' });
  } catch (err) {
    Logger.fatal('DATABASE_CONNECTION_FAILED', {
      meta: { error: err.message },
    });
    process.exit(1);
  }
};

// --------------------------------------------------
// Server start
// --------------------------------------------------
const start = async () => {
  try {
    await initDatabase();

    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0',
    });

    Logger.info('SERVER_STARTED', {
      service: 'api',
      meta: { port: process.env.PORT || 3000 },
    });
  } catch (err) {
    Logger.fatal('SERVER_START_FAILED', {
      meta: { error: err.message },
    });
    process.exit(1);
  }
};

start();
