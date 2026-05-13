/**
 * Global Express type augmentation.
 *
 * Adds `req.user` to Express's Request interface so that `protect` middleware
 * can attach the authenticated user and downstream controllers can read it
 * type-safely.
 *
 * Marked OPTIONAL on purpose: the field is only set after `protect` runs.
 * Public routes still see `req.user` as undefined — that's the truth.
 * Protected controllers must narrow with:
 *   if (!req.user) throw new ApiError(401, "Not authenticated");
 *
 * Trade-offs of this module-augmentation approach are documented in
 * docs/migration/PHASE_1.md (or the PR description). The short version:
 *   - Pro: zero boilerplate at every controller.
 *   - Con: every Request type globally gains the field, including in routes
 *     where `protect` never ran. Optional + narrowing keeps us honest.
 */

import type { UserRole } from "../utils/token.util.js";

/**
 * Minimal user shape attached to `req.user`. Mirrors what `protect` actually
 * sets — not the full Mongoose document. Will widen to `Pick<User, ...>` once
 * the User model is migrated.
 */
export interface AuthedUser {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "blocked";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

// This file must be a module for `declare global` to work. The empty export
// is the canonical way to mark a .d.ts as a module.
export {};
