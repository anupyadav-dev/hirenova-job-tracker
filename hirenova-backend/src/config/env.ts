/**
 * Centralized, validated environment configuration.
 *
 * This is the ONLY module in the app that reads `process.env` directly.
 * Every other file imports `env` from here and gets fully-typed,
 * already-validated values.
 *
 * Validation runs once at module load. If a required variable is missing
 * or malformed, the process exits before any HTTP server is started.
 */

import dotenv from "dotenv";

// Load `.env` into `process.env` *before* we read any variable below.
// Side effect on import — kept here so the rest of the app gets it for free.
dotenv.config();

// ─── Helpers ────────────────────────────────────────────────────────────────

const requireString = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const optionalString = (name: string, fallback: string): string => {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
};

const requirePort = (name: string, fallback: number): number => {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`Invalid ${name}: "${raw}" must be an integer in 1..65535`);
  }
  return parsed;
};

const NODE_ENVS = ["development", "production", "test"] as const;
type NodeEnv = (typeof NODE_ENVS)[number];

const requireNodeEnv = (): NodeEnv => {
  const raw = optionalString("NODE_ENV", "development");
  if (!(NODE_ENVS as readonly string[]).includes(raw)) {
    throw new Error(
      `Invalid NODE_ENV: "${raw}" — must be one of ${NODE_ENVS.join(", ")}`,
    );
  }
  return raw as NodeEnv;
};

// ─── The frozen, typed config ───────────────────────────────────────────────

export const env = {
  NODE_ENV: requireNodeEnv(),
  PORT: requirePort("PORT", 5000),

  // Database
  MONGO_URI: requireString("MONGO_URI"),

  // Auth
  JWT_SECRET: requireString("JWT_SECRET"),
  JWT_EXPIRES: optionalString("JWT_EXPIRES", "1d"),

  // CORS
  CLIENT_URL: requireString("CLIENT_URL"),

  // Cloudinary
  CLOUD_NAME: requireString("CLOUD_NAME"),
  CLOUD_KEY: requireString("CLOUD_KEY"),
  CLOUD_SECRET: requireString("CLOUD_SECRET"),
} as const;

export type Env = typeof env;
