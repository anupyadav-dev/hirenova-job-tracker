import bcrypt from "bcrypt";

import { ApiError } from "../../utils/apiError.js";
import { generateToken } from "../../utils/token.util.js";
import User, {
  type IUser,
  type UserDocument,
} from "../user/user.model.js";

// Types are derived from Zod schemas — single source of truth.
// Import gives us the names locally; re-export makes them available to callers
// (e.g. auth.controller.ts) so they don't need a second import path.
import type { RegisterInput, LoginInput } from "./auth.schemas.js";
export type { RegisterInput, LoginInput };

// ─── Output type ─────────────────────────────────────────────────────────────
// Everything that leaves the service: never includes the password hash, and
// `_id` is a string (not an ObjectId) so callers don't depend on Mongoose.
export type SafeUser = Omit<IUser, "password"> & { _id: string };

/**
 * Strip the password and stringify _id. Always use this when mapping a
 * UserDocument out of the service layer.
 */
const toSafeUser = (doc: UserDocument): SafeUser => {
  const { password: _omit, _id, ...rest } = doc.toObject();
  // Discard the password from the returned shape; never leak it upward.
  void _omit;
  return { _id: _id.toString(), ...rest };
};

// ─── Services ────────────────────────────────────────────────────────────────

export const registerUserService = async (
  data: RegisterInput,
): Promise<{ user: SafeUser }> => {
  if (!data.password) {
    throw new ApiError(400, "Password is required");
  }

  const email = data.email.toLowerCase();

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email,
    password: hashedPassword,
    role: data.role ?? "user",
  });

  return { user: toSafeUser(user) };
};

export const loginUserService = async (
  data: LoginInput,
): Promise<{ user: SafeUser; token: string }> => {
  const email = data.email.toLowerCase();

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!data.password || !user.password) {
    throw new ApiError(500, "Password missing");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  return { user: toSafeUser(user), token };
};
