// /src/index.ts
import dotenv from "dotenv";
dotenv.config();

import { connectDB, closeDB } from "./config/db";
import { fetchTweetsJob } from "./jobs/fetchTweetsJob";
import { logger } from "./utils/logger";

/**
 * Main entry point.
 * Connects to DB, runs the job, then closes connections for a clean exit.
 */
(async () => {
  try {
    await connectDB();
    await fetchTweetsJob();
  } catch (err) {
    logger.error("Error running fetchTweetsJob", err);
  } finally {
    await closeDB();
    // Exiting the process if needed (usually not necessary if everything closes properly).
    process.exit(0);
  }
})();
