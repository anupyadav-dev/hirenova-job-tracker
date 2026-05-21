// ─── Entry point ─────────────────────────────────────────────────────────────
//
// Node executes this file: `node dist/server.js`
// Two responsibilities only: connect DB, bind port.
// All middleware / route wiring lives in app.ts.
//
// env.ts runs its validation here (imported transitively through app.ts → env),
// so any missing env var throws before the DB connection or listen() is called.

import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./shared/logger/logger.js";

connectDB();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
});
