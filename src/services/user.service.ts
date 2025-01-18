// /src/services/user.service.ts
import { UserModel, UserDoc } from "../models/user.model";
import { logger } from "../utils/logger";

/**
 * Bulk upsert users with new data and optional increment of eligibleTweetsCount.
 * Keyed by userId.
 */
export const bulkUpsertUsers = async (
  users: Array<{ userId: string; data: Partial<UserDoc>; incrementCount: number }>
) => {
  if (!users.length) {
    logger.info("No users to bulk upsert");
    return;
  }

  const ops = users.map((u) => ({
    updateOne: {
      filter: { userId: u.userId },
      update: {
        $set: u.data,
        $inc: { eligibleTweetsCount: u.incrementCount },
      },
      upsert: true,
    },
  }));

  await UserModel.bulkWrite(ops);
  logger.info(`Bulk upserted ${users.length} users`);
};
