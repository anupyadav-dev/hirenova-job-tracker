import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

/**
 * Single source of truth for valid user roles.
 * `as const` makes the array readonly and narrows the literal type so we can
 * derive both the runtime enum (used in the schema) and the compile-time
 * union (used in interfaces) from the same expression. No duplication.
 */
export const USER_ROLES = ["user", "recruiter", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["active", "blocked"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

/**
 * Plain shape of a User as stored in MongoDB. Does NOT include Mongoose-
 * specific properties (_id, save(), etc.) — that's what UserDocument is for.
 *
 * NOTE on `password`: required in the schema, but `select: false` means it
 * is not loaded into the JS object by default. Callers must opt in with
 * `.select("+password")`. The type still says `string` because the field
 * always exists in the database — Mongoose just hides it on the JS side.
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * What a Mongoose query returns: a hydrated document with `_id`, `.save()`,
 * `.toObject()`, etc. layered onto IUser. Use this type when handling
 * results of `User.findById(...)`, `User.findOne(...)`, etc.
 */
export type UserDocument = HydratedDocument<IUser>;

/**
 * The Model type — the static side of `User`. If we later add static
 * methods (e.g., `User.findByEmail(...)`), they go on this type.
 */
export type UserModelType = Model<IUser>;

const userSchema = new Schema<IUser, UserModelType>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: "user" },
    status: { type: String, enum: USER_STATUSES, default: "active" },
  },
  { timestamps: true },
);

const User: UserModelType = mongoose.model<IUser, UserModelType>(
  "User",
  userSchema,
);

export default User;
