import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import errorHandler from "./middlewares/error.middleware.js";
import { globalLimiter } from "./middlewares/rateLimiter/globalLimiter.js";
import routes from "./routes/index.js";

// ─── Express application factory ─────────────────────────────────────────────
//
// This module ONLY creates and configures the app; it never binds a port.
// Separation from server.ts lets you import `app` in integration tests without
// opening a real socket. server.ts is the only place that calls app.listen().
//
// Middleware order is load-order-sensitive in Express:
//   1. Security (helmet)            — set headers before anything else runs
//   2. CORS                         — must come before body parsing so
//                                     preflight OPTIONS requests get headers
//   3. Body / cookie parsers        — parse before route handlers need them
//   4. Request logger (morgan)      — log after CORS so OPTIONS noise is visible
//   5. Global rate limiter          — applied after body parsing so req.ip is reliable
//   6. Routes                       — application logic
//   7. Error handler (MUST be last) — Express identifies error middleware by its
//                                     4-argument signature (err, req, res, next);
//                                     any middleware registered after it is unreachable

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    // Use validated env value instead of raw process.env — env.ts guarantees
    // CLIENT_URL is present at startup, process.env could silently be undefined.
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(globalLimiter);

app.use("/api/v1", routes);

// Error handler registered last — see ordering note above.
app.use(errorHandler);

export default app;
