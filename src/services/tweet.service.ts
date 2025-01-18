// /src/services/tweet.service.ts
import { TweetModel } from "../models/tweet.model";
import { TweetDoc } from "../models/tweet.model";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

/**
 * Bulk insert or upsert a list of tweets in one operation.
 * This avoids multiple round-trips to MongoDB.
 */
export const bulkUpsertTweets = async (tweets: TweetDoc[]) => {
  if (!tweets.length) {
    logger.info("No tweets to bulk upsert");
    return;
  }

  const ops = tweets.map((t) => {
    let idNumeric: mongoose.Types.Decimal128 | undefined = undefined;
    if (t.id) {
      idNumeric = new mongoose.Types.Decimal128(t.id);
    }

    return {
      updateOne: {
        filter: { id: t.id },
        update: {
          $set: {
            ...t,
            idNumeric,
          },
        },
        upsert: true,
      },
    };
  });

  await TweetModel.bulkWrite(ops);
  logger.info(`Bulk upserted ${tweets.length} tweets`);
};

/**
 * Get the latest tweet by "idNumeric" descending.
 */
export const getLatestTweet = async () => {
  return TweetModel.findOne().sort({ idNumeric: -1 });
};

/**
 * Delete old tweets if the total doc count exceeds a certain threshold.
 */
export const deleteExcessTweets = async (maxDocs: number) => {
  const count = await TweetModel.countDocuments();
  if (count <= maxDocs) {
    logger.info(`Tweet count ${count} under limit of ${maxDocs}, no deletion needed`);
    return;
  }

  const cutoffDoc = await TweetModel.findOne().sort({ createdAt: -1 }).skip(maxDocs);
  if (!cutoffDoc) {
    logger.warn("Could not find cutoff doc for tweet deletion");
    return;
  }

  const result = await TweetModel.deleteMany({ createdAt: { $lt: cutoffDoc.createdAt } });
  logger.info(`Deleted ${result.deletedCount} old tweets to keep the newest ${maxDocs}`);
};
