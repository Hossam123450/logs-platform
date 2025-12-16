import Log from '../models/Log.js'
import Alert from '../models/Alert.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { Op } from 'sequelize'

// Configuration email (exemple SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: process.env.SMTP_PORT || 1025,
  secure: false, // MailHog ne nécessite pas TLS
  auth: null     // Pas d'auth pour MailHog
});


// Fonction pour générer une signature unique pour chaque erreur
function getFingerprint(log) {
  const route = log.route || 'unknown_route';
  const service = log.service || 'unknown_service';
  const str = `${log.level}|${log.message}|${route}|${service}`;
  return crypto.createHash('md5').update(str).digest('hex');
}


// On garde en mémoire le dernier ID analysé
let lastAnalyzedId = 0

// Fonction d’analyse
export async function analyzeLogs() {
  try {
    const logs = await Log.findAll({
      where: {
        id: { [Op.gt]: lastAnalyzedId },
        level: ['error', 'fatal']
      },
      order: [['id', 'ASC']],
      limit: 1000
    })

    for (const log of logs) {
      lastAnalyzedId = log.id // Mettre à jour le dernier ID analysé

      const fingerprint = getFingerprint(log)
      let alert = await Alert.findOne({ where: { logFingerprint: fingerprint } })

      if (alert) {
        // Mise à jour de l’alerte existante
        alert.occurrences += 1
        alert.lastOccurrence = log.timestamp
        await alert.save()
      } else {
        // Création d’une nouvelle alerte
        alert = await Alert.create({
          logFingerprint: fingerprint,
          message: log.message,
          level: log.level,
          occurrences: 1,
          lastOccurrence: log.timestamp,
          notified: false
        })
      }

      // Déclenchement alerte email si seuil dépassé et pas encore notifié
      if (!alert.notified && alert.occurrences >= 5) {
        await sendAlertEmail(alert)
        alert.notified = true
        await alert.save()
      }
    }

  } catch (err) {
    console.error('Erreur analyse logs:', err)
  }
}

// Fonction d’envoi d’email
async function sendAlertEmail(alert) {
  try {
    await transporter.sendMail({
      from: '"Alert System" <alerts@example.com>',
      to: 'admin@example.com',
      subject: `[ALERTE] ${alert.level} détectée`,
      text: `Une erreur récurrente a été détectée:\n\nMessage: ${alert.message}\nOccurrences: ${alert.occurrences}\nDernière occurrence: ${alert.lastOccurrence}`
    })
    console.log('Email d’alerte envoyé')
  } catch (err) {
    console.error('Erreur envoi email:', err)
  }
}
analyzeLogs();
// Lancer l’analyse toutes les 5 minutes
setInterval(analyzeLogs, 5 * 60 * 1000)
