const { z } = require('zod');

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const signupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['officer', 'victim', 'criminal', 'chief']),
  admin_key: z.string().min(1),
  name: z.string().min(3).optional(),
  phone: z.string().optional(),
  stationId: z.string().or(z.number()).optional()
});

module.exports = { loginSchema, signupSchema };
