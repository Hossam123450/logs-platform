import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  logFingerprint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('warn','error','fatal'),
    allowNull: false
  },
  occurrences: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lastOccurrence: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
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

export default Alert
