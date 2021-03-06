import cors from "cors";
import morgan from "morgan";
import authMiddleware from "./auth";
import mongoDbMiddleware from "./mongodb";

/**
 * Common middlewares for all controllers.
 */
export const commonMiddlewares = [
  morgan("dev"),
  cors(),
  authMiddleware(),
  mongoDbMiddleware(),
];
