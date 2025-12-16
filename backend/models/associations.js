import User from './User.js'
import Log from './Log.js'
import Alert from './Alert.js'

// User <-> Log
User.hasMany(Log, { foreignKey: 'userId' })
Log.belongsTo(User, { foreignKey: 'userId' })

// Log <-> Alert
Log.hasMany(Alert, { foreignKey: 'logFingerprint', sourceKey: 'id' })
Alert.belongsTo(Log, { foreignKey: 'logFingerprint', targetKey: 'id' })


export { User, Log, Alert }
