// backend/server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import config from './config/index.js';
import sequelize from './config/db.js';
import { requestContextMiddleware } from './instrumentation/requestContext.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';
import logger from './instrumentation/backendLogger.js';

// Routes
import ingestionRoutes from './routes/ingestion.js';
import logRoutes from './routes/logs.js';
import alertRoutes from './routes/alerts.js';
import userRoutes from './routes/users.js';

// Workers
import { processLogsWithoutFingerprint } from './workers/fingerprintWorker.js';
import { groupSimilarErrors } from './workers/errorGroupWorker.js';
import { processAlerts } from './workers/alertWorker.js';

// Initialisation Fastify
const app = Fastify({
  logger: false, // On utilise notre logger centralisé
});

// Sécurité & CORS
await app.register(cors, { origin: true });
await app.register(helmet);

// Documentation Swagger/OpenAPI
await app.register(swagger, { 
  swagger: { info: { title: 'Log Platform API', version: config.app.version } } 
});
await app.register(swaggerUi, { routePrefix: '/docs' });

// Middleware global : contexte et erreur
app.addHook('preHandler', requestContextMiddleware);
app.setErrorHandler(errorHandler);

// Routes publiques
app.register(ingestionRoutes, { prefix: '/ingestion' });

// Routes sécurisées
app.register(logRoutes, { prefix: '/logs', preHandler: authenticate(['admin', 'analyst', 'viewer']) });
app.register(alertRoutes, { prefix: '/alerts', preHandler: authenticate(['admin', 'analyst']) });
app.register(userRoutes, { prefix: '/users', preHandler: authenticate(['admin']) });

// Start server
const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    logger.info('Connexion à la base de données réussie');

    // Synchronisation (migration minimale)
    await sequelize.sync(); // ou utiliser migrations Sequelize CLI
    logger.info('Modèles synchronisés');

    // Démarrage Fastify
    await app.listen({ port: config.server.port, host: '0.0.0.0' });
    logger.info(`Serveur démarré sur le port ${config.server.port}`);

    // Lancer les workers en intervalle
    setInterval(processLogsWithoutFingerprint, 5 * 60 * 1000);
    setInterval(groupSimilarErrors, 5 * 60 * 1000);
    setInterval(processAlerts, 1 * 60 * 1000);

  } catch (err) {
    logger.fatal('Erreur au démarrage du serveur', { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

startServer();
