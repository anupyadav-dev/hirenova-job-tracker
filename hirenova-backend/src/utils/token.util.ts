import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";

/**
 * Roles allowed on the JWT payload. Mirrors the enum on the User model.
 */
export type UserRole = "user" | "recruiter" | "admin";

/**
 * Shape of the payload embedded in every JWT we issue.
 */
export interface JwtUserPayload {
  id: string;
  role: UserRole;
}

/**
 * Minimal shape we need from a User to mint a token.
 * Will tighten to `Pick<User, "_id" | "role">` after the User model migrates.
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
