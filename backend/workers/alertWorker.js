import crypto from 'crypto';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';

import Log from '../models/Log.js';
import Alert from '../models/Alert.js';
import Logger from '../utils/logger.js';
import sequelize from '../config/db.js';

// --------------------------------------------------
// Email transporter
// --------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
});

// --------------------------------------------------
// Utils
// --------------------------------------------------
const generateFingerprint = (log) => {
  const base = [
    log.level,
    log.message,
    log.route || '',
    log.service || '',
  ].join('|');

  return crypto.createHash('sha256').update(base).digest('hex');
};

// --------------------------------------------------
// Worker state (persistant)
// --------------------------------------------------
async function getLastProcessedId() {
  const [result] = await sequelize.query(
    'SELECT value FROM worker_state WHERE name = "alert_worker_last_id"'
  );
  return result?.[0]?.value ? Number(result[0].value) : 0;
}

async function setLastProcessedId(id) {
  await sequelize.query(
    `INSERT INTO worker_state (name, value)
     VALUES ("alert_worker_last_id", ?)
     ON DUPLICATE KEY UPDATE value = ?`,
    { replacements: [id, id] }
  );
}

// --------------------------------------------------
// Analyse principale
// --------------------------------------------------
export async function runAlertWorker() {
  Logger.info('ALERT_WORKER_STARTED', { service: 'worker' });

  const lastId = await getLastProcessedId();

  const logs = await Log.findAll({
    where: {
      id: { [Op.gt]: lastId },
      level: { [Op.in]: ['error', 'fatal'] },
    },
    order: [['id', 'ASC']],
    limit: 500,
  });

  for (const log of logs) {
    const fingerprint = log.fingerprint || generateFingerprint(log);

    // Sauvegarde du fingerprint si absent
    if (!log.fingerprint) {
      log.fingerprint = fingerprint;
      await log.save();
    }

    let alert = await Alert.findOne({ where: { fingerprint } });

    if (!alert) {
      alert = await Alert.create({
        fingerprint,
        message: log.message,
        level: log.level,
        occurrences: 1,
        firstOccurrence: log.timestamp,
        lastOccurrence: log.timestamp,
        notified: false,
      });
    } else {
      alert.occurrences += 1;
      alert.lastOccurrence = log.timestamp;
      await alert.save();
    }

    // Exemple règle simple (sera configurable)
    if (!alert.notified && alert.occurrences >= 5) {
      await sendAlert(alert);
      alert.notified = true;
      await alert.save();
    }

    await setLastProcessedId(log.id);
  }

  Logger.info('ALERT_WORKER_FINISHED', {
    service: 'worker',
    meta: { processed: logs.length },
  });
}

// --------------------------------------------------
// Email
// --------------------------------------------------
async function sendAlert(alert) {
  try {
    await transporter.sendMail({
      from: process.env.ALERT_FROM,
      to: process.env.ALERT_RECIPIENTS,
      subject: `[ALERTE] ${alert.level.toUpperCase()}`,
      text: `
Erreur détectée :

Message : ${alert.message}
Occurrences : ${alert.occurrences}
Dernière occurrence : ${alert.lastOccurrence}
Fingerprint : ${alert.fingerprint}
      `,
    });

    Logger.info('ALERT_EMAIL_SENT', {
      service: 'worker',
      event: 'ALERT_SENT',
      meta: { fingerprint: alert.fingerprint },
    });
  } catch (err) {
    Logger.error('ALERT_EMAIL_FAILED', {
      service: 'worker',
      meta: { error: err.message },
    });
  }
}
