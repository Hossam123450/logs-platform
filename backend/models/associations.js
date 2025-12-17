import User from './User.js';
import Log from './Log.js';
import Alert from './Alert.js';

/**
 * Relations :
 * User -> Log : 1:N
 * Log -> Alert : 1:N via fingerprint
 */

// User <-> Log
User.hasMany(Log, { foreignKey: 'userId', as: 'logs' });
Log.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Log <-> Alert
// On relie via fingerprint
Log.hasMany(Alert, { foreignKey: 'fingerprint', sourceKey: 'fingerprint', as: 'alerts' });
Alert.belongsTo(Log, { foreignKey: 'fingerprint', targetKey: 'fingerprint', as: 'log' });

export { User, Log, Alert };
