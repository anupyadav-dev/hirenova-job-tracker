import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import { globalLimiter } from "./middlewares/rateLimiter/globalLimiter.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(globalLimiter);

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
