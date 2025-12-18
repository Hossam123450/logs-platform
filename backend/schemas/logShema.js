// backend/schemas/logSchema.js
export const logSchema = {
  body: {
    type: 'object',
    required: ['timestamp', 'level', 'message', 'env'],
    properties: {
      timestamp: { type: 'string', format: 'date-time' },
      level: { type: 'string', enum: ['debug', 'info', 'warn', 'error', 'fatal'] },
      message: { type: 'string', minLength: 1 },
      env: { type: 'string', minLength: 1 },
      type: { type: 'string', enum: ['system', 'auth', 'business', 'api', 'frontend'], default: 'system' },
      source: { type: 'string', enum: ['backend', 'frontend', 'worker'], default: 'backend' },
      app: { type: 'string', maxLength: 64 },
      fingerprint: { type: 'string', maxLength: 128, nullable: true },
      
      // Traçabilité
      requestId: { type: 'string', maxLength: 64, nullable: true },
      sessionId: { type: 'string', maxLength: 64, nullable: true },
      userId: { type: 'string', maxLength: 64, nullable: true },

      // Contexte HTTP
      route: { type: 'string', maxLength: 255, nullable: true },
      method: { type: 'string', maxLength: 10, nullable: true },
      statusCode: { type: 'integer', minimum: 100, maximum: 599, nullable: true },
      durationMs: { type: 'integer', minimum: 0, nullable: true },

      // Métier
      event: { type: 'string', maxLength: 128, nullable: true },
      service: { type: 'string', maxLength: 64, nullable: true },

      // Données complémentaires
      meta: { type: 'object', nullable: true },
    },
  },
};
