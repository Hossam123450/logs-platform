// backend/models/associations.js
import User from './User.js';
import Log from './Log.js';
import Alert from './Alert.js';
import Ingestion from './Ingestion.js';

export default function setupAssociations() {
  // -------------------------------
  // User ↔ Log
  // -------------------------------
  User.hasMany(Log, {
    foreignKey: 'userId',
    as: 'logs',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });

  Log.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  // -------------------------------
  // Log ↔ Ingestion
  // -------------------------------
  Log.hasMany(Ingestion, {
    foreignKey: 'logId',
    as: 'ingestions',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Ingestion.belongsTo(Log, {
    foreignKey: 'logId',
    as: 'log',
  });

  // -------------------------------
  // Alerts
  // -------------------------------
  // Les Alerts sont liés aux logs via 'fingerprint'
  // Pas de FK directe, la relation se fera via service/level/fingerprint
  // pour l'analyse et le déclenchement automatique
}
