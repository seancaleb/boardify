import dotenv from "dotenv";

// Environment setup
const environment = process.env.NODE_ENV || "development";
dotenv.config({
  path: `.env.${environment}`,
});

import { errorHandler, logger } from "@/middlewares";
import authRoute from "@/routes/auth.route";
import boardsRoute from "@/routes/boards.route";
import tasksRoute from "@/routes/tasks.route";
import usersRoute from "@/routes/users.route";
import { connect, log } from "@/utils";
import compression from "compression";
import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

// Declarations
const app = express();
const PORT = config.get<number>("PORT");
const DEV_URL = config.get<string>("devUrl");
const PROD_TEST_URL = config.get<string>("prodTestUrl");
const MONGO_PATH = config.get<string>("mongoPath");

console.log({ MONGO_PATH, DEV_URL, PROD_TEST_URL });

// Middlewares
app.use(
  cors({
    origin: [DEV_URL, PROD_TEST_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(logger);

// API routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/boards", boardsRoute);
app.use("/api/tasks", tasksRoute);

// Catch-all route for non-existing routes
app.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "404 Not Found" });
});

// Catch-all middleware for errors
app.use(errorHandler);

// Initialize Express application
app.listen(PORT, async () => {
  log.info(`Application running in ${config.util.getEnv("NODE_CONFIG_ENV").toUpperCase()}`);
  await connect();
  log.info(`Application is listening at port:${PORT}`);
});
