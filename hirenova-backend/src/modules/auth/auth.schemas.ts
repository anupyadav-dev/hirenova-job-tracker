/**
 * Auth module — Zod schemas.
 *
 * BEFORE (express-validator):
 *   body("email").isEmail().withMessage("Valid email required")
 *   → validates at runtime, but req.body type stays `any`
 *   → controller must cast: `req.body as LoginInput`  ← blind cast
 *
 * AFTER (Zod):
 *   z.infer<typeof loginSchema> IS the LoginInput type.
 *   zodValidate(loginSchema) validates at runtime AND writes parsed data back.
 *   Controller reads req.body as z.infer<typeof loginSchema> — a PROVEN cast.
 *
 * Notice: RegisterInput and LoginInput types are now DERIVED from the schemas
 * with z.infer<>. Schema = single source of truth for both runtime validation
 * and compile-time typing. They can never drift apart.
 */

import { z } from "zod";
import { USER_ROLES } from "../user/user.model.js";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from "../../shared/validators/common.schemas.js";

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  // Admin role cannot be set via signup — enforce here, not just in service.
  role: z
    .enum(USER_ROLES)
    .exclude(["admin"])
    .optional()
    .default("user"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

// ─── Inferred types ───────────────────────────────────────────────────────────
// These replace the hand-written interfaces in auth.service.ts.
// z.infer derives the TypeScript type FROM the schema — not the other way around.
// Change the schema once; both runtime validation and compile-time type update.

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
