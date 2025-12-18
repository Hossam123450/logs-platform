// backend/models/Ingestion.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Log from './Log.js';

const Ingestion = sequelize.define(
  'Ingestion',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    logId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Log,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('received', 'processed', 'error'),
      allowNull: false,
      defaultValue: 'received',
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'ingestions',
    timestamps: true,
    indexes: [
      { fields: ['logId'] },
      { fields: ['status'] },
    ],
  }
);

export default Ingestion;
