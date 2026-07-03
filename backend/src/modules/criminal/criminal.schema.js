const { z } = require('zod');
const GENDER_OPTIONS = ["Male", "Female", "Other"];

const criminalSchema = z.object({
  Criminal_Name: z.string().min(3),
  Gender: z.enum(GENDER_OPTIONS).optional(),
  DOB: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime())).optional(),
  Address: z.string().optional()
});

module.exports = { criminalSchema };
