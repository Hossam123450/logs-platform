// backend/config/db.js
import { Sequelize } from 'sequelize';
import config from './index.js';

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: process.env.NODE_ENV === 'test' ? 'sqlite' : 'mysql',
    storage: process.env.NODE_ENV === 'test' ? ':memory:' : undefined,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    logging: config.database.logging,

    timezone: '+00:00',

    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
    },

    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true,
    },
  }
);

// Test de connexion explicite (fail fast)
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }
}

export default sequelize;
