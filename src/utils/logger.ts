// /src/utils/logger.ts
import pino from "pino";

/**
 * Creates a pino-based logger with optional colorized pretty-print output.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});
