// backend/models/Alert.js
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
     * Nom lisible de la règle
     */
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },

    /**
     * Niveau concerné par l’alerte
     */
    level: {
      type: DataTypes.ENUM('warn', 'error', 'fatal'),
      allowNull: false,
    },

    /**
     * Fingerprint ciblé (null = toutes erreurs)
     */
    fingerprint: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },

    /**
     * Nombre d’occurrences pour déclencher l’alerte
     */
    threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    /**
     * Fenêtre temporelle (en minutes)
     */
    timeWindowMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },

    /**
     * Environnement ciblé
     */
    env: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },

    /**
     * Service ciblé
     */
    service: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },

    /**
     * Destinataires email
     */
    emails: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    /**
     * Activation / désactivation
     */
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    /**
     * Dernière fois où l’alerte a été déclenchée
     */
    lastTriggeredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'alerts',
    timestamps: true,
    indexes: [
      { fields: ['level'] },
      { fields: ['fingerprint'] },
      { fields: ['env'] },
      { fields: ['service'] },
      { fields: ['enabled'] },
    ],
  }
);

export default Alert;
