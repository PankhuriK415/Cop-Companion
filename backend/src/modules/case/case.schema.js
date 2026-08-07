const { z } = require('zod');

const STATUS_OPTIONS = ["Open", "Closed", "Pending Review", "Under Investigation", "Dismissed"];

const caseSchema = z.object({
  Case_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime()), { message: "Invalid date string" }),
  Case_Status: z.enum(STATUS_OPTIONS, { errorMap: () => ({ message: "Invalid case status" }) }),
  Description: z.string().min(5, "Description must be at least 5 characters"),
  Station_ID: z.number().int().positive().nullable().optional(),
  Officer_ID: z.number().int().positive().nullable().optional(),
});

module.exports = { caseSchema };
