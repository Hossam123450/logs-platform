// backend/schemas/alertSchema.js
export const alertSchema = {
  body: {
    type: 'object',
    required: ['name', 'level', 'threshold', 'timeWindowMinutes', 'emails'],
    properties: {
      name: { type: 'string', minLength: 3 },
      level: {
        type: 'string',
        enum: ['warn', 'error', 'fatal'],
      },
      fingerprint: { type: ['string', 'null'] },
      threshold: { type: 'integer', minimum: 1 },
      timeWindowMinutes: { type: 'integer', minimum: 1 },
      env: { type: ['string', 'null'] },
      service: { type: ['string', 'null'] },
      emails: {
        type: 'array',
        items: { type: 'string', format: 'email' },
        minItems: 1,
      },
      enabled: { type: 'boolean' },
    },
  },
};
