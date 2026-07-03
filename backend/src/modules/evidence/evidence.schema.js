const { z } = require('zod');
const evidenceSchema = z.object({
  Evidence_Type: z.string().min(3),
  Description: z.string().min(3),
  Case_ID: z.number().int().positive().nullable().optional()
});
module.exports = { evidenceSchema };
