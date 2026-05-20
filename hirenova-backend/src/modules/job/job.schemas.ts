/**
 * Job module — Zod schemas.
 * Replaces job.validation.ts (express-validator chains).
 */

import { z } from "zod";
import { JOB_CATEGORIES, JOB_TYPES } from "./job.model.js";
import { paginationSchema } from "../../shared/validators/common.schemas.js";

// ─── Create / Update schemas ───────────────────────────────────────────────────

export const createJobSchema = z.object({
  title: z.string({ error: "Title is required" }).min(1, "Title is required").trim(),
  description: z.string({ error: "Description is required" }).min(1, "Description required").trim(),
  company: z.string({ error: "Company is required" }).min(1, "Company required").trim(),
  location: z.string({ error: "Location is required" }).min(1, "Location required").trim(),
  salary: z.number().positive().optional(),
  jobType: z.enum(JOB_TYPES).optional().default("full-time"),
  skills: z.array(z.string().trim()).optional().default([]),
  category: z.enum(JOB_CATEGORIES, { error: "Category is required" }),
  experience: z
    .object({
      min: z.number().min(0).optional().default(0),
      max: z.number().min(0).optional().default(1),
    })
    .optional(),
});

// For updates every field is optional — Zod's .partial() makes all keys optional.
export const updateJobSchema = createJobSchema.partial();

// ─── Query schemas ─────────────────────────────────────────────────────────────

export const getAllJobsQuerySchema = paginationSchema.extend({
  keyword: z.string().trim().optional(),
  location: z.string().trim().optional(),
  jobType: z.enum(JOB_TYPES).optional(),
  category: z.enum(JOB_CATEGORIES).optional(),
  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),
  experience: z.coerce.number().optional(),
  sort: z.enum(["latest", "salary", "oldest"]).optional().default("latest"),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type GetAllJobsInput = z.infer<typeof getAllJobsQuerySchema>;
