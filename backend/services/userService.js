// backend/services/userService.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

class UserService {
  /**
   * Créer un utilisateur
   * @param {Object} data
   * @returns {Promise<User>}
   */
  static async createUser(data) {
    // Hacher le mot de passe
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      username: data.username,
      email: data.email,
      passwordHash,
      role: data.role || 'viewer',
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    return user;
  }

  /**
   * Récupérer tous les utilisateurs
   * @returns {Promise<User[]>}
   */
  static async getUsers() {
    return User.findAll({ order: [['createdAt', 'DESC']] });
  }

  /**
   * Récupérer un utilisateur par ID
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  static async getUserById(id) {
    return User.findByPk(id);
  }

  /**
   * Mettre à jour un utilisateur
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise<User|null>}
   */
  static async updateUser(id, updates) {
    const user = await User.findByPk(id);
    if (!user) return null;

    // Hacher le mot de passe si nécessaire
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    return user.update(updates);
  }

  /**
   * Supprimer un utilisateur
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  static async deleteUser(id) {
    const deletedCount = await User.destroy({ where: { id } });
    return deletedCount > 0;
  }

  /**
   * Vérifier mot de passe
   * @param {User} user
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.passwordHash);
  }
}

export default UserService;
