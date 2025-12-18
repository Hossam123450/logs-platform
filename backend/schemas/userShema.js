// backend/schemas/userSchema.js
export const userSchema = {
  body: {
    type: 'object',
    required: ['username', 'email', 'passwordHash'],
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 150 },
      email: { type: 'string', format: 'email', maxLength: 255 },
      passwordHash: { type: 'string', minLength: 60 }, // exemple pour bcrypt
      role: { type: 'string', enum: ['admin', 'analyst', 'viewer'], default: 'viewer' },
      lastLogin: { type: 'string', format: 'date-time', nullable: true },
      isActive: { type: 'boolean', default: true },
    },
  },
};
