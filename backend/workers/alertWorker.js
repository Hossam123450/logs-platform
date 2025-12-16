import Log from '../models/Log.js'
import Alert from '../models/Alert.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Configuration email (exemple SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Fonction pour générer une signature unique pour chaque erreur
function getFingerprint(log) {
  const str = `${log.level}|${log.message}|${log.route}|${log.service}`
  return crypto.createHash('md5').update(str).digest('hex')
}

// Fonction d’analyse
export async function analyzeLogs() {
  try {
    const logs = await Log.findAll({
      where: { level: ['error', 'fatal'] },
      order: [['timestamp', 'DESC']],
      limit: 1000 // dernière batch
    })

    for (const log of logs) {
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

// Lancer l’analyse toutes les 5 minutes
setInterval(analyzeLogs, 5 * 60 * 1000)
