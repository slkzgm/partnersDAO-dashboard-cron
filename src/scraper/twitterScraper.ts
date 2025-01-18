// /src/scraper/twitterScraper.ts
import { Profile, Scraper, SearchMode } from "agent-twitter-client";
import { logger } from "../utils/logger";

/**
 * Scrapes tweets by a given query.
 */
export const scrapeTwitter = async (query: string, maxTweets: number, searchMode: SearchMode) => {
  if (!process.env.TWITTER_USERNAME || !process.env.TWITTER_PASSWORD) {
    logger.error("Twitter username or password missing.");
    return;
  }

  const scraper = new Scraper();
  await scraper.login(process.env.TWITTER_USERNAME, process.env.TWITTER_PASSWORD);

  return scraper.searchTweets(query, maxTweets, searchMode);
};

/**
 * Retrieves a user's profile by username.
 */
export const scrapeUserProfile = async (username: string): Promise<Profile | null> => {
  if (!process.env.TWITTER_USERNAME || !process.env.TWITTER_PASSWORD) {
    logger.error("Twitter username or password missing.");
    return null;
  }

  const scraper = new Scraper();
  await scraper.login(process.env.TWITTER_USERNAME, process.env.TWITTER_PASSWORD);

  try {
    return await scraper.getProfile(username);
  } catch (err) {
    logger.error(`Failed to scrape profile for username=${username}`, err);
    return null;
  }
};
