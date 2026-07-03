const { z } = require('zod');

// Shared definitions
const STATUS_OPTIONS = ["Open", "Closed", "Pending Review", "Under Investigation", "Dismissed"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];

// Cases
const caseSchema = z.object({
  Case_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime()), { message: "Invalid date string" }),
  Case_Status: z.enum(STATUS_OPTIONS, { errorMap: () => ({ message: "Invalid case status" }) }),
  Description: z.string().min(5, "Description must be at least 5 characters"),
  Station_ID: z.number().int().positive().nullable().optional(),
  Officer_ID: z.number().int().positive().nullable().optional(),
});

// Stations
const stationSchema = z.object({
  Station_Name: z.string().min(3),
  Location: z.string().min(3),
  Contact_No: z.string().min(5)
});

// Evidence
const evidenceSchema = z.object({
  Evidence_Type: z.string().min(3),
  Description: z.string().min(3),
  Case_ID: z.number().int().positive().nullable().optional()
});

// Arrests
const arrestSchema = z.object({
  Arrest_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime())),
  Charges: z.string().min(3),
  Criminal_ID: z.number().int().positive().nullable().optional(),
  Case_ID: z.number().int().positive().nullable().optional()
});

// FIRs
const firSchema = z.object({
  FIR_Date: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime())),
  Victim_ID: z.number().int().positive().nullable().optional(),
  Case_ID: z.number().int().positive().nullable().optional()
});

// Criminals
const criminalSchema = z.object({
  Criminal_Name: z.string().min(3),
  Gender: z.enum(GENDER_OPTIONS).optional(),
  DOB: z.string().or(z.date()).refine(val => !isNaN(new Date(val).getTime())).optional(),
  Address: z.string().optional()
});

// Victims
const victimSchema = z.object({
  Victim_Name: z.string().min(3),
  Gender: z.enum(GENDER_OPTIONS).optional(),
  Phone: z.string().optional(),
  Address: z.string().optional()
});

// Auth
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const signupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  adminKey: z.string().min(1),
  name: z.string().min(3),
  phone: z.string().optional(),
  stationId: z.string().or(z.number()).optional()
});

module.exports = {
  caseSchema,
  stationSchema,
  evidenceSchema,
  arrestSchema,
  firSchema,
  criminalSchema,
  victimSchema,
  loginSchema,
  signupSchema
};
