// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.js';

/**
 * Middleware pour vérifier le JWT et les rôles
 * @param {Array<string>} allowedRoles
 */
export function authenticate(allowedRoles = []) {
  return async function (request, reply) {
    try {
      const authHeader = request.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({ message: 'Authorization header missing' });
      }

      const token = authHeader.split(' ')[1];

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return reply.code(401).send({ message: 'Invalid or expired token' });
      }

      const user = await User.findByPk(payload.id);
      if (!user || !user.isActive) {
        return reply.code(403).send({ message: 'User not authorized' });
      }

      // Vérification des rôles
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return reply.code(403).send({ message: 'Insufficient role' });
      }

      // Attacher l'utilisateur à la requête pour utilisation downstream
      request.user = user;
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  };
}
