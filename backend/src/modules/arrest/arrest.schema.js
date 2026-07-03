const { z } = require('zod');
const arrestSchema = z.object({
  Arrest_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime())),
  Charges: z.string().min(3),
  Criminal_ID: z.number().int().positive().nullable().optional(),
  Case_ID: z.number().int().positive().nullable().optional()
});
module.exports = { arrestSchema };
