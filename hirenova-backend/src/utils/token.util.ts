import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";
import type { UserRole } from "../modules/user/user.model.js";

// Re-export for existing consumers (auth.middleware, express.d.ts).
// Domain enum lives in user.model.ts; this is just a convenience re-export.
export type { UserRole };

/**
 * Shape of the payload embedded in every JWT we issue.
 */
export interface JwtUserPayload {
  id: string;
  role: UserRole;
}

/**
 * Minimal shape we need from a User to mint a token. Kept as a structural
 * type rather than `Pick<IUser, "_id" | "role">` because the User model
 * stores `_id` as ObjectId, which would force consumers of this util
 * (e.g., callers in tests) to construct ObjectIds. Structural is friendlier.
 */
interface TokenSubject {
  _id: { toString(): string } | string;
  role: UserRole;
}

export const generateToken = (user: TokenSubject): string => {
  const payload: JwtUserPayload = {
    id: typeof user._id === "string" ? user._id : user._id.toString(),
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET satisfies Secret, options);
};
