import Logger from '../utils/logger.js'
import User from '../models/User.js'

export const getUser = async (req, reply) => {
  const requestId = req.headers['x-request-id'] || null
  try {
    const users = await User.findAll()
    Logger.info('Liste des utilisateurs récupérée', { requestId, route: req.url, method: req.method })
    return reply.send(users)
  } catch (err) {
    Logger.error('Erreur récupération utilisateurs', { requestId, route: req.url, method: req.method, meta: { stack: err.stack } })
    return reply.code(500).send({ error: 'Erreur serveur' })
  }
}
