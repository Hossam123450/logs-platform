// backend/config/index.js
import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return process.env[name];
}

const config = {
  env: (process.env.NODE_ENV || 'development').toLowerCase(),

  app: {
    name: process.env.APP_NAME || 'log-platform',
    version: process.env.APP_VERSION || '1.0.0',
  },

  server: {
    port: Number(process.env.PORT) || 3000,
  },

  database: {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  name: process.env.NODE_ENV === 'test' ? ':memory:' : process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: process.env.DB_LOGGING === 'true',
},


  security: {
    ingestionToken: requireEnv('INGESTION_TOKEN'),
  },

  alerting: {
    emailFrom: requireEnv('ALERT_EMAIL_FROM'),
    smtpHost: requireEnv('SMTP_HOST'),
    smtpPort: Number(requireEnv('SMTP_PORT')),
    smtpUser: requireEnv('SMTP_USER'),
    smtpPassword: requireEnv('SMTP_PASSWORD'),
  },
};

export default config;
