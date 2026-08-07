const { z } = require('zod');
const victimSchema = z.object({
  Victim_Name: z.string().min(3),
  Gender: z.enum(["Male", "Female", "Other"]).optional(),
  Phone: z.string().optional(),
  Address: z.string().optional()
});
module.exports = { victimSchema };
