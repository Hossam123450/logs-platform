import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('debug','info','warn','error','fatal'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  env: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requestId: DataTypes.STRING,
  sessionId: DataTypes.STRING,
  userId: DataTypes.BIGINT,
  route: DataTypes.STRING,
  method: DataTypes.STRING,
  statusCode: DataTypes.INTEGER,
  event: DataTypes.STRING,
  service: DataTypes.STRING,
  durationMs: DataTypes.INTEGER,
  meta: DataTypes.JSON,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
})

export default Log
