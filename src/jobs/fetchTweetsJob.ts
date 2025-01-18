// /src/jobs/fetchTweetsJob.ts
import { scrapeTwitter, scrapeUserProfile } from "../scraper/twitterScraper";
import { getLatestTweet, bulkUpsertTweets, deleteExcessTweets } from "../services/tweet.service";
import { bulkUpsertUsers } from "../services/user.service";
import { SearchMode, Tweet } from "agent-twitter-client";
import { logger } from "../utils/logger";

export const fetchTweetsJob = async () => {
  const keywords = ["#WeArePartners"];

  const latestDoc = await getLatestTweet();
  let sinceQuery = latestDoc?.id ? `since_id:${latestDoc.id}` : "";
  const query = `${keywords.join(" ")} ${sinceQuery}`.trim();

  logger.info(`Starting fetchTweetsJob with query: "${query}"`);

  const freshTweetsIterator = await scrapeTwitter(query, 200, SearchMode.Latest);
  if (!freshTweetsIterator) {
    logger.warn("No tweets iterator returned by scraper");
    return;
  }

  const freshTweets: Tweet[] = [];
  for await (const tweet of freshTweetsIterator) {
    freshTweets.push(tweet);
  }

  if (!freshTweets.length) {
    logger.info("No new tweets to process");
    return;
  }

  logger.info(`Fetched ${freshTweets.length} fresh tweets`);

  // Build a map: userId => list of tweets
  const userTweetMap: Record<string, Tweet[]> = {};
  for (const tw of freshTweets) {
    if (!tw.userId) continue;
    if (!userTweetMap[tw.userId]) {
      userTweetMap[tw.userId] = [];
    }
    userTweetMap[tw.userId].push(tw);
  }

  // For each user, scrape profile and prepare upsert data
  const userUpsertPayload = [];
  for (const userId of Object.keys(userTweetMap)) {
    const username = userTweetMap[userId][0].username;
    if (!username) {
      logger.error(`Username not found for userId=${userId}, skipping`);
      continue;
    }

    const profile = await scrapeUserProfile(username);
    const tweetsForUser = userTweetMap[userId];
    const incrementCount = tweetsForUser.length;

    const userData: any = { userId };
    if (profile) {
      userData.avatar = profile.avatar;
      userData.banner = profile.banner;
      userData.biography = profile.biography;
      userData.birthday = profile.birthday;
      userData.followersCount = profile.followersCount;
      userData.followingCount = profile.followingCount;
      userData.friendsCount = profile.friendsCount;
      userData.mediaCount = profile.mediaCount;
      userData.statusesCount = profile.statusesCount;
      userData.isPrivate = profile.isPrivate;
      userData.isVerified = profile.isVerified;
      userData.isBlueVerified = profile.isBlueVerified;
      userData.joined = profile.joined;
      userData.likesCount = profile.likesCount;
      userData.listedCount = profile.listedCount;
      userData.location = profile.location;
      userData.name = profile.name;
      userData.pinnedTweetIds = profile.pinnedTweetIds || [];
      userData.tweetsCount = profile.tweetsCount;
      userData.url = profile.url;
      userData.username = profile.username;
      userData.website = profile.website;
      userData.canDm = profile.canDm;
    }

    userUpsertPayload.push({
      userId,
      data: userData,
      incrementCount,
    });
  }

  // Bulk upsert users
  await bulkUpsertUsers(userUpsertPayload);

  // Bulk upsert tweets
  await bulkUpsertTweets(freshTweets as any[]);

  // Delete excess if needed
  await deleteExcessTweets(10000);

  logger.info(
    `fetchTweetsJob complete. Processed ${freshTweets.length} tweets, updated ${Object.keys(userTweetMap).length} users.`
  );
};
