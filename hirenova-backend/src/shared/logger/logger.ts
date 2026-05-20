/**
 * Structured application logger (pino).
 *
 * WHY PINO OVER console.log?
 * ─────────────────────────
 * console.log is synchronous: each call blocks the event loop while Node
 * formats and writes the string. In a high-throughput API, that adds up.
 * Pino is async and ~5× faster than Winston because it keeps serialization
 * off the hot path — it writes a raw JSON string and lets a worker process
 * or external pipeline pretty-print it.
 *
 * WHY STRUCTURED JSON IN PRODUCTION?
 * ────────────────────────────────────
 * Log aggregators (Datadog, Loki, CloudWatch Logs Insights) query JSON fields
 * natively. If you log `"Error: user not found"` as a plain string, your
 * aggregator has to parse regex. If you log `{ message: "...", userId: "x" }`,
 * you can write: `fields.userId = "x"` in your query — no regex, indexed.
 *
 * TRANSPORT STRATEGY:
 * ────────────────────
 * • Development  — pino-pretty: colorized, human-readable, timestamp visible.
 *   Never run pino-pretty in production; its synchronous rendering erases the
 *   async performance benefit.
 * • Production   — raw JSON to stdout. Let your infra (Docker, systemd,
 *   Kubernetes) collect stdout and ship to the aggregator.
 *
 * USAGE:
 * ──────
 *   import { logger } from "../shared/logger/logger.js";
 *
 *   logger.info("Server started");
 *   logger.info({ port: 3000, env: "production" }, "Server started");
 *   logger.warn({ userId }, "User not found");
 *   logger.error({ err }, "Unhandled error");   // err serializer: message+stack
 *   logger.fatal({ err }, "DB connection lost");
 *
 * LEVELS (lowest → highest):
 *   trace · debug · info · warn · error · fatal
 *   Development logs from `debug` up; production logs from `info` up.
 *   Set LOG_LEVEL env var to override (e.g. LOG_LEVEL=trace for deep debugging).
 */

import pino from "pino";
import { env } from "../../config/env.js";

const isDev = env.NODE_ENV !== "production";

export const logger = pino({
  /**
   * Level threshold. Any log below this level is silently dropped.
   * Production: info and above only — no debug noise.
   * Development: debug and above — useful for tracing request flows.
   * Override at runtime with LOG_LEVEL env var (checked by pino automatically
   * when using process.env.LOG_LEVEL, but we keep it simple here).
   */
  level: isDev ? "debug" : "info",

  /**
   * Built-in err serializer converts an Error object into a plain JSON object:
   *   { type: "Error", message: "...", stack: "..." }
   * Without this, pino would log `{}` for an Error (non-enumerable properties).
   * Always pass errors as `{ err }`, e.g.: logger.error({ err }, "message")
   */
  serializers: {
    err: pino.stdSerializers.err,
  },

  /**
   * pino-pretty transport for development only.
   * The `transport` option spins up a Worker thread that reads the JSON log
   * stream and renders it with colors — completely off the main event loop.
   *
   * Options:
   *   colorize        — ANSI color codes in terminal
   *   translateTime   — "SYS:HH:MM:ss" formats the epoch timestamp to local time
   *   ignore          — remove pid and hostname; noise in local dev
   *   singleLine      — keep each log on one line (easier to scan)
   */
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:MM:ss",
        ignore: "pid,hostname",
        singleLine: true,
      },
    },
  }),
});
