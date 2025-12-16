// backend/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Créer l'instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nom de la base
  process.env.DB_USER,     // Utilisateur MySQL
  process.env.DB_PASSWORD, // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,        // false pour ne pas afficher toutes les requêtes SQL
  }
);

// Fonction pour tester la connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

// Lancer le test de connexion
testConnection();

export default sequelize;
