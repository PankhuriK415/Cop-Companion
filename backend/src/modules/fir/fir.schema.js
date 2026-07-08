const { z } = require('zod');

const STATUS_OPTIONS = ["Open", "Closed", "Pending Review", "Under Investigation", "Dismissed"];

const newCaseSchema = z.object({
  Case_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime()), {
    message: "Invalid case date",
  }),
  Case_Status: z.enum(STATUS_OPTIONS).default("Open"),
  Description: z.string().min(5, "Case name/description must be at least 5 characters"),
  Station_ID: z.number().int().positive().nullable().optional(),
  Officer_ID: z.number().int().positive().nullable().optional(),
});

const firSchema = z
  .object({
    FIR_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime()), {
      message: "Invalid FIR date",
    }),
    Victim_ID: z.number().int().positive().nullable().optional(),
    Case_ID: z.number().int().positive().nullable().optional(),
    /** Create a new linked case in the same request (instead of Case_ID) */
    newCase: newCaseSchema.optional(),
  })
  .refine((data) => data.Case_ID || data.newCase, {
    message: "Either Case_ID or newCase is required",
    path: ["Case_ID"],
  })
  .refine((data) => !(data.Case_ID && data.newCase), {
    message: "Provide either Case_ID or newCase, not both",
    path: ["newCase"],
  });

module.exports = { firSchema, newCaseSchema };
