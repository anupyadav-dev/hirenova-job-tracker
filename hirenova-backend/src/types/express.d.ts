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
 */

import type { IUser } from "../modules/user/user.model.js";

/**
 * Minimal user shape attached to `req.user`. Derived from IUser via `Pick<>`
 * so it can never drift from the User model. `_id` is the string form
 * (Mongoose ObjectId stringified by `protect`) for ergonomic downstream use.
 */
export type AuthedUser = Pick<IUser, "name" | "email" | "role" | "status"> & {
  _id: string;
  id?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

// Required for `declare global` to take effect in a module file.
export {};
