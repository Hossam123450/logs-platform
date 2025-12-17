import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Log = sequelize.define(
  'Log',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    /**
     * Timestamp de l'événement (source)
     */
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    /**
     * Niveau de log
     */
    level: {
      type: DataTypes.ENUM('debug', 'info', 'warn', 'error', 'fatal'),
      allowNull: false,
    },

    /**
     * Message principal
     */
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    /**
     * Environnement (dev, staging, prod)
     */
    env: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },

    /**
     * Catégorie du log
     */
    type: {
      type: DataTypes.ENUM('system', 'auth', 'business', 'api', 'frontend'),
      defaultValue: 'system',
    },

    /**
     * Origine
     */
    source: {
      type: DataTypes.ENUM('backend', 'frontend', 'worker'),
      allowNull: false,
      defaultValue: 'backend',
    },

    /**
     * Application émettrice
     */
    app: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },

    /**
     * Regroupement d'erreurs
     */
    fingerprint: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },

    // -------- Traçabilité --------
    requestId: DataTypes.STRING(64),
    sessionId: DataTypes.STRING(64),
    userId: DataTypes.STRING(64),

    // -------- Contexte HTTP --------
    route: DataTypes.STRING(255),
    method: DataTypes.STRING(10),
    statusCode: DataTypes.INTEGER,
    durationMs: DataTypes.INTEGER,

    // -------- Métier --------
    event: DataTypes.STRING(128),
    service: DataTypes.STRING(64),

    /**
     * Données complémentaires
     */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: 'logs',
    timestamps: true,
    indexes: [
      { fields: ['timestamp'] },
      { fields: ['level'] },
      { fields: ['env'] },
      { fields: ['service'] },
      { fields: ['fingerprint'] },
      { fields: ['type'] },
      { fields: ['source'] },
    ],
  }
);

export default Log;
