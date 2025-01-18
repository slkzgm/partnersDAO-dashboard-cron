# tweet-batch-scraper

A Node.js/TypeScript project that fetches tweets, stores them in MongoDB, updates user profiles, and periodically cleans old tweets. It can be customized to search any keywords via CLI arguments, environment variables, or configuration.

## Features
- Scrapes tweets via [agent-twitter-client](https://www.npmjs.com/package/agent-twitter-client).
- Stores tweets in MongoDB, upserting by Twitter `id`.
- Automatically updates user profiles and increments an `eligibleTweetsCount`.
- Cleans old tweets if total documents exceed a specified maximum.
- Designed to run as a scheduled job (e.g. on GitHub Actions or cron).

## Requirements
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Twitter credentials** (username/password) for scraping

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tweet-batch-scraper.git
   ```
2. Install dependencies:
   ```bash
   cd tweet-batch-scraper
   npm install
   ```
   or
   ```bash
   yarn
   ```
3. Create a `.env` file at the project root with the following variables:
   ```dotenv
   MONGODB_URI="your_mongo_connection_string"
   TWITTER_USERNAME="your_twitter_username"
   TWITTER_PASSWORD="your_twitter_password"
   LOG_LEVEL="info"
   ```

## Usage
1. **Local Run (with CLI keywords)**:
   ```bash
   npm run start -- "keyword1" "keyword2" "#WeArePartners"
   ```
   - Each keyword is a separate argument.
   - The script connects to MongoDB, logs in to Twitter, fetches new tweets matching the combined query, updates the DB, and then closes connections.

2. **Production / CI**:
   - You can schedule this script to run periodically (for example, every 20 minutes) on a CI/CD platform like GitHub Actions or via a traditional cron job.
   - Each run opens a DB connection, fetches data for the given keywords, updates records, then exits cleanly.
   - Pass keywords the same way in your CI/CD configuration, for instance:
     ```yaml
     # example GitHub Actions step
     - name: Run tweet scraper
       run: npm run start -- "crypto" "blockchain"
     ```

## Project Structure

```
├─ .env
├─ package.json
├─ tsconfig.json
├─ /src
│   ├─ /config
│   │   └─ db.ts            # Database connection logic
│   ├─ /jobs
│   │   └─ fetchTweetsJob.ts
│   ├─ /models
│   │   ├─ tweet.model.ts   # Mongoose schema for tweets
│   │   └─ user.model.ts    # Mongoose schema for users
│   ├─ /scraper
│   │   └─ twitterScraper.ts
│   ├─ /services
│   │   ├─ tweet.service.ts
│   │   └─ user.service.ts
│   ├─ /utils
│   │   └─ logger.ts        # Pino-based logger
│   └─ index.ts             # Main entry point
```

## Key Scripts
- **`npm run start`**: Runs the main script via `ts-node`.
   - Pass search keywords as CLI arguments, e.g. `npm run start -- "keyword1" "keyword2"`.

## Customization
- **Tweet Deletion**: The maximum tweet count for cleanup is set to `10,000` in `fetchTweetsJob.ts`. Adjust as needed.
- **Logging**: Controlled by the `LOG_LEVEL` variable in `.env`. Default is `"info"`. Use `"debug"` or `"trace"` for more verbose output.
- **Scraping**: By default, keywords are taken from CLI arguments. You can modify `fetchTweetsJob.ts` to parse `.env` or a config file if you prefer.

## Contributing
1. Fork this repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit and push your changes
4. Create a Pull Request

## License
[MIT](./LICENSE) (or whichever license you prefer)