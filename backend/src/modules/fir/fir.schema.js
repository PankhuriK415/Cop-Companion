const { z } = require('zod');
const firSchema = z.object({
  FIR_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime())),
  Victim_ID: z.number().int().positive().nullable().optional(),
  Case_ID: z.number().int().positive().nullable().optional()
});
module.exports = { firSchema };
