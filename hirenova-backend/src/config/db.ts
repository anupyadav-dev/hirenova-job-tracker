import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "../shared/logger/logger.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    // Redact credentials from URI before logging — //<user>:<pass>@ → //<redacted>@
    logger.info({ uri: env.MONGO_URI.replace(/\/\/[^@]+@/, "//<redacted>@") }, "MongoDB connected");
  } catch (error) {
    logger.fatal({ err: error }, "MongoDB connection failed");
    process.exit(1);
  }
};

export default connectDB;
