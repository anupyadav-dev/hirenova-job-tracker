/**
 * Zod-powered validation middleware factory.
 *
 * PROBLEM WITH THE OLD APPROACH:
 *   express-validator validates req.body but doesn't change its type.
 *   The controller still had to do `req.body as CreateJobData` — a blind cast.
 *   If validation missed a field, TypeScript had no idea.
 *
 * HOW ZOD FIXES THIS:
 *   zodValidate(schema) returns a middleware that:
 *     1. Calls schema.safeParse(req[target]) — runtime validation, no throw
 *     2. On failure: responds 400 with structured field-level errors
 *     3. On success: writes result.data back to req[target]
 *
 *   result.data is the PARSED value — coerced (numbers coerced from strings,
 *   emails lowercased, strings trimmed) and guaranteed to match the schema.
 *   The controller can now safely cast to z.infer<typeof schema> because we
 *   PROVED the shape at runtime first.
 *
 * USAGE:
 *   import { zodValidate } from "../../shared/validators/validate.middleware.js";
 *   import { registerSchema } from "./auth.schemas.js";
 *
 *   router.post("/register", zodValidate(registerSchema), registerController);
 *
 * TARGETING req.query or req.params:
 *   zodValidate(paginationSchema, "query")
 *   zodValidate(idParamSchema, "params")
 */

import type { RequestHandler } from "express";
import type { ZodSchema, ZodError } from "zod";

type RequestTarget = "body" | "query" | "params";

/**
 * Format a ZodError into a flat array of { path, message } objects
 * so API consumers get field-level error information.
 */
const formatZodErrors = (
  error: ZodError,
): Array<{ path: string; message: string }> =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

/**
 * Middleware factory. Validates req[target] against the Zod schema.
 * Replaces both express-validator chains AND the validate() middleware.
 *
 * @param schema - Any Zod schema (z.object, z.string, etc.)
 * @param target - Which part of the request to validate (default: "body")
 */
export const zodValidate = (
  schema: ZodSchema,
  target: RequestTarget = "body",
): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodErrors(result.error),
      });
      return;
    }

    // Write the parsed (coerced + stripped) data back so controllers
    // get clean values. For body: trimmed strings, lowercased emails, etc.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[target] = result.data;
    next();
  };
