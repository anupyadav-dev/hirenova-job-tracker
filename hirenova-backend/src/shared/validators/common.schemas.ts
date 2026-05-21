/**
 * Shared Zod schema primitives.
 *
 * WHY? Several fields appear in multiple modules:
 *   - email  → auth register, auth login
 *   - objectId strings → any route with :id
 *   - pagination → jobs, applications, profile
 *
 * Define once here so the constraints (min-length, format, max, etc.) are
 * consistent everywhere and changed in a single place.
 *
 * RULE: Only add a schema here when it is used by 2+ modules.
 * Module-specific schemas (e.g., job title format) stay in that module's
 * schema file.
 */

import { z } from "zod";

// ─── String primitives ────────────────────────────────────────────────────────

export const emailSchema = z
  .string({ error: "Email is required" })
  .email("Must be a valid email address")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string({ error: "Password is required" })
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[0-9]/, "Password must include at least one number");

export const nameSchema = z
  .string({ error: "Name is required" })
  .min(3, "Name must be at least 3 characters")
  .trim();

// MongoDB ObjectId — 24-character hex string.
export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID format");

// ─── Pagination ────────────────────────────────────────────────────────────────

/**
 * Shared pagination query schema.
 * Coerces query-string numbers (strings from req.query) to actual numbers.
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
