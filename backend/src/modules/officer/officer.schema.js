const { z } = require('zod');
const officerSchema = z.object({
  Officer_Name: z.string().min(3),
  Officer_Rank: z.string().optional(),
  Phone: z.string().optional(),
  Station_ID: z.number().int().positive().nullable().optional()
});
module.exports = { officerSchema };
