import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Alert = sequelize.define(
  'Alert',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    /**
     * Fingerprint unique pour regrouper les erreurs similaires
     */
    fingerprint: {
      type: DataTypes.STRING(128),
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
     * Niveau de gravité
     */
    level: {
      type: DataTypes.ENUM('debug', 'info', 'warn', 'error', 'fatal'),
      allowNull: false,
    },

    /**
     * Nombre d’occurrences
     */
    occurrences: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    /**
     * Date de la première occurrence
     */
    firstOccurrence: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    /**
     * Date de la dernière occurrence
     */
    lastOccurrence: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    /**
     * Indique si une alerte a été envoyée
     */
    notified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    /**
     * Contexte utile pour filtrage
     */
    env: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('system', 'auth', 'business', 'api', 'frontend'),
      allowNull: true,
    },
  },
  {
    tableName: 'alerts',
    timestamps: true,
    indexes: [
      { fields: ['fingerprint'] },
      { fields: ['level'] },
      { fields: ['env'] },
      { fields: ['service'] },
    ],
  }
);

export default Alert;
