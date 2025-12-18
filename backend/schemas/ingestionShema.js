// backend/schemas/ingestionSchema.js
export const ingestionSchema = {
  body: {
    type: 'object',
    required: ['logId'],
    properties: {
      logId: { type: 'integer', minimum: 1 },
      status: { type: 'string', enum: ['received', 'processed', 'error'], default: 'received' },
      receivedAt: { type: 'string', format: 'date-time', default: new Date().toISOString() },
      processedAt: { type: 'string', format: 'date-time', nullable: true },
      errorMessage: { type: 'string', nullable: true },
    },
  },
};
